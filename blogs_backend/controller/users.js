import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { v4 as uuid4 } from "uuid";
import {
  addUserQuery,
  deleteAllUserQuery,
  deleteUserQuery,
  getUserQuery,
  updateUserQuery,
} from "../modal/user.js";
import { sendResponse } from "../utils/sendResponse.js";
import { BSON } from "mongodb";
import { JWT_SECRET } from "../constants.js";
import {
  checkIfUserIsAlreadyExist,
  validateUpdateUserDetails,
  validateUserDetails,
} from "../utils/validate.js";

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
  const { email, password, username } = ctx.request.body;
  if (!email || !password || !username) {
    sendResponse(ctx, 400, {
      success: false,
      message: "Please fill all the fields",
    });
    return;
  }

  const validUser = validateUserDetails({ username, password, email });
  const isUserExist = await checkIfUserIsAlreadyExist(email, username);
  if (isUserExist)
    ctx.throw(400, { message: "User is already exist!", success: false });

  if (!validUser.isValidUser)
    ctx.throw(400, {
      success: false,
      message: validUser.message,
    });

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
      { id: userData.insertedId.toString(), email, role },
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
  const { username, password, email } = ctx.request.body;
  if (!username || !password || !email) {
    ctx.throw(400, {
      success: false,
      message: "Please fill all the fields",
    });
  }

  const validUser = validateUserDetails({ email, password, username });

  // find user in the database
  if (!validUser.isValidUser) {
    ctx.throw(400, {
      success: false,
      message: validUser.message,
    });
  }

  const user = await getUserQuery({ email: email.toLowerCase(), username });
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
  const { username, password } = ctx.request.body;
  let userObj = {};
  if (username) userObj["username"] = username;
  if (password) userObj["password"] = password;

  const validUser = validateUpdateUserDetails(userObj);
  if (!validUser.isValidUser) {
    ctx.throw(400, {
      success: false,
      message: "User details is not valid",
    });
  }

  if (userObj.username) {
    const hashedPassword = await bcrypt.hash(password, 10);
    userObj.password = hashedPassword;
  }

  const { id } = ctx.state.user;
  const updatedUserRes = await updateUserQuery({ _id: id }, { $set: userObj });

  if (updatedUserRes.acknowledged) {
    sendResponse(ctx, 200, {
      success: true,
      message: "User updated successfully",
    });
  } else {
    ctx.throw(400, {
      success: false,
      message: "Unsuccessfull attempt of updating user.",
    });
  }
};

const deleteUser = async (ctx) => {
  const { id } = ctx.state.user;
  const deleteRes = await deleteUserQuery({ _id: id });
  if (deleteRes.acknowledged) {
    sendResponse(ctx, 200, {
      message: "User removed successfully",
      success: true,
    });
  } else {
    ctx.throw(400, {
      message: "Unable to remove user's infomation !",
    });
  }
};

export {
  getAllUsers,
  deleteAllUsers,
  registerUser,
  loginUser,
  updateUser,
  deleteUser,
};
