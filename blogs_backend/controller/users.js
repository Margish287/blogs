import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { v4 as uuid4, validate } from "uuid";
import {
  addUserQuery,
  countUser,
  deleteAllUserQuery,
  deleteUserQuery,
  getUserQuery,
  updateUserQuery,
} from "../modal/user.js";
import { sendResponse } from "../utils/sendResponse.js";
import { BSON } from "mongodb";
import { API_URL, JWT_SECRET } from "../constants.js";
import {
  checkIfUserIsAlreadyExist,
  validateEmail,
  validateUpdateUserDetails,
  validateUserDetails,
} from "../utils/validate.js";
import {
  deleteInviteUserQuery,
  findInvirtedUserQeury,
  inviteUserQuery,
} from "../modal/inviteUser.js";
import { sendMail } from "../utils/sendMail.js";

const getAllUsers = (_, res) => {
  res.json(data.users);
};

const deleteAllUsers = async (ctx) => {
  try {
    const res = await deleteAllUserQuery();
    console.log("deleted count :", res.deletedCount);
    sendResponse(ctx, 200, {
      status: 200,
      success: true,
      message: "All users deleted",
    });
  } catch (error) {
    sendResponse(ctx, 400, {
      status: 400,
      success: true,
      message: "something went wrong while deleting all users",
    });
  }
};

const registerUser = async (ctx) => {
  let jwtToken;
  let role;

  const { email, password, username } = ctx.state.user;
  const isUserExist = await checkIfUserIsAlreadyExist(email, username);
  if (isUserExist)
    ctx.throw(400, { message: "User is already exist!", success: false });

  role = "O";
  // TODO : check valid role here

  const hashedPassword = await bcrypt.hash(password, 10);
  const userSignUpDetails = {
    _id: uuid4(),
    email: email.toLowerCase(),
    username,
    password: hashedPassword,
    role,
    createdAt: new Date(),
  };

  const userData = await addUserQuery(userSignUpDetails);
  if (userData.acknowledged) {
    jwtToken = jwt.sign(
      { id: userData.insertedId.toString(), role },
      process.env.JWT_SECRET || JWT_SECRET
    );

    sendResponse(ctx, 201, {
      status: "success",
      jwtToken,
      message: "User created successfully",
    });
  } else {
    ctx.throw(400, {
      success: false,
      message: "something went wrong while creating the user",
    });
  }
};

const loginUser = async (ctx) => {
  const { email, password, username } = ctx.state.user;
  // find user in the database
  const user = await getUserQuery({ email, username });
  if (!user) {
    ctx.throw(400, {
      success: false,
      message: "User not found",
    });
  }

  // compare the password
  const isCorrectPassword = await bcrypt.compare(password, user.password);
  if (!isCorrectPassword) {
    ctx.throw(400, {
      success: false,
      message: "Invalid credentials",
    });
  }

  // create new jwt token
  const jwtToken = jwt.sign(
    {
      id: user._id.toString(),
      email: user.userEmail,
      role: user.role,
      ownerId: user.ownerId || user._id,
    },
    process.env.JWT_SECRET || JWT_SECRET
  );
  sendResponse(ctx, 200, {
    success: true,
    jwtToken,
    message: "User logged in successfully",
  });
};

const updateUser = async (ctx) => {
  const { userObj } = ctx.state;
  if (userObj.password) {
    const hashedPassword = await bcrypt.hash(userObj.password, 10);
    userObj.password = hashedPassword;
  }

  const { id } = ctx.state.user;
  const updatedUserRes = await updateUserQuery({ _id: id }, { $set: userObj });

  if (!updatedUserRes.acknowledged) {
    return ctx.throw(400, {
      success: false,
      message: "Unsuccessfull attempt of updating user.",
    });
  }

  return sendResponse(ctx, 200, {
    success: true,
    message: "User updated successfully",
  });
};

const deleteUser = async (ctx) => {
  const { id } = ctx.state.user;
  const deleteRes = await deleteUserQuery({ _id: id });
  if (!deleteRes.acknowledged) {
    return ctx.throw(400, {
      message: "Unable to remove user's infomation !",
    });
  }

  return sendResponse(ctx, 200, {
    message: "User removed successfully",
    success: true,
  });
};

// for invite user
const inviteUser = async (ctx) => {
  const { ownerId } = ctx.state.user;
  const { email, role } = ctx.state.invitedUserObj;

  const inviteToken = jwt.sign({ email, role, ownerId }, JWT_SECRET);

  // checks if in inviteUser collection perticular user is there or not
  const isUserExist = await countUser({ email, role });

  const invitationLink = isUserExist
    ? `${API_URL}/user/accept/${inviteToken}}`
    : `${API_URL}/user/register/${inviteToken}}`;

  const inviteUserRes = await inviteUserQuery({
    ownerId,
    email,
  });

  if (!inviteUserRes.acknowledged) {
    return ctx.throw(400, {
      message: "User invitation failed !",
    });
  }

  await sendMail(email, invitationLink);
  return sendResponse(ctx, 200, {
    inviteLink: invitationLink,
    message: "User invited successfully",
    success: true,
  });
};

const registerTeamMember = async (ctx) => {
  const { password, username } = ctx.request.body;
  const { email, role, ownerId } = ctx.state.user;

  const hashedPassword = await bcrypt.hash(password, 10);
  const userObj = {
    _id: uuid4(),
    email,
    password: hashedPassword,
    role,
    ownerId,
    username,
  };
  const user = await addUserQuery(userObj);
  if (!user.acknowledged) {
    return ctx.throw(400, {
      message: "Something went wrong !",
      success: false,
    });
  }

  const deleteInvUser = await deleteInviteUserQuery({ email });
  if (!deleteInvUser.acknowledged) {
    return ctx.throw(400, {
      message: "Something went wrong !",
      success: false,
    });
  }

  return sendResponse(ctx, 200, {
    message: "invite user registered successfully",
    success: true,
  });
};

const acceptInvitation = async (ctx) => {
  const { role, email, ownerId } = ctx.state.user;

  const deleteInvUser = await deleteInviteUserQuery({ email, role });
  if (!deleteInvUser.acknowledged) {
    ctx.throw(400, {
      message: "Unable to delete invited user !",
      success: false,
    });
  }

  if (!deleteInvUser.deletedCount) {
    ctx.throw(400, {
      message: "Invitation already accepted !",
      success: false,
    });
  }

  const updateUser = await updateUserQuery({ email }, { ownerId, role });
  if (!updateUser.acknowledged) {
    return ctx.throw(400, {
      message: "Unable to update user !",
      success: false,
    });
  }

  return sendResponse(ctx, 200, "user added sucessfully");
};

export {
  getAllUsers,
  deleteAllUsers,
  registerUser,
  loginUser,
  updateUser,
  deleteUser,
  inviteUser,
  registerTeamMember,
  acceptInvitation,
};
