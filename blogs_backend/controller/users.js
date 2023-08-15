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
      message: "Please fill in all the fields",
    });
    return;
  }

  const validUser = validateUserDetails({ username, password, email });
  try {
    const isUserExist = await checkIfUserIsAlreadyExist(email, username);
    if (isUserExist)
      ctx.throw(400, { message: "User is already exist!", success: false });

    if (!validUser.isValidUser) {
      sendResponse(ctx, 400, {
        success: false,
        message: validUser.message,
      });
      return;
    }

    role = "O";
    // TODO : check valid role here

    const hashedPassword = await bcrypt.hash(password, 10);
    const userSignUpDetails = {
      _id: uuid4(),
      email: email.toLowerCase(),
      username,
      password: hashedPassword,
      role,
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
      sendResponse(ctx, 400, {
        success: false,
        message: "something went wrong while creating the user",
      });
    }
  } catch (error) {
    sendResponse(ctx, 400, {
      success: false,
      message: error.message,
    });
  }
};

const loginUser = async (ctx) => {
  const { username, password, email } = ctx.request.body;
  if (!username || !password || !email) {
    sendResponse(ctx, 400, {
      success: false,
      message: "Please fill in all the fields",
    });
    return;
  }

  const validUser = validateUserDetails({ email, password, username });

  // find user in the database
  try {
    if (!validUser.isValidUser) {
      sendResponse(ctx, 400, {
        success: false,
        message: validUser.message,
      });
      return;
    }

    const user = await getUserQuery({ email: email.toLowerCase() });
    if (!user) {
      sendResponse(ctx, 400, {
        success: false,
        message: "User not found",
      });
      return;
    }

    // compare the password
    const isCorrectPassword = await bcrypt.compare(password, user.password);
    if (!isCorrectPassword) {
      sendResponse(ctx, 400, {
        success: false,
        message: "Invalid credentials",
      });
      return;
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
  } catch (error) {
    sendResponse(ctx, 400, {
      success: false,
      message: error.message,
    });
  }
};

const updateUser = async (ctx) => {
  const { username, password } = ctx.request.body;
  try {
    const { id } = ctx.state.user;
    const updatedUserRes = await updateUserQuery(
      { _id: id },
      { $set: { username, password } }
    );

    if (updatedUserRes.acknowledged) {
      sendResponse(ctx, 200, {
        success: true,
        message: "User updated successfully",
      });
    } else {
      throw new Error("Something went wrong");
    }
  } catch (error) {
    sendResponse(ctx, 400, {
      success: false,
      message: error.message,
    });
  }
};

const deleteUser = async (ctx) => {
  const { id } = ctx.state.user;
  try {
    const deleteRes = await deleteUserQuery({ _id: new BSON.ObjectId(id) });
    if (deleteRes.acknowledged) {
      sendResponse(ctx, 200, {
        message: "User removed successfully",
        success: true,
      });
    } else {
      throw new Error("Something went wornge while deleting user.");
    }
  } catch (error) {
    sendResponse(ctx, 400, { message: error.message, success: false });
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
