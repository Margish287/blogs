import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
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
import { validateUserDetails } from "../utils/validate.js";

const getAllUsers = (_, res) => {
  res.json(data.users);
};

const deleteAllUsers = async (ctx) => {
  try {
    const res = await deleteAllUserQuery();
    console.log("deleted count :", res.deletedCount);
    sendResponse(ctx, 200, {
      status: 200,
      status: "success",
      message: "All users deleted",
    });
  } catch (error) {
    sendResponse(ctx, 400, {
      status: 400,
      status: "success",
      message: "something went wrong while deleting all users",
    });
  }
};

const registerUser = async (ctx) => {
  let jwtToken;
  const { email, password, username } = ctx.request.body;
  if (!email || !password || !username) {
    sendResponse(ctx, 400, {
      status: 400,
      status: "failed",
      message: "Please fill in all the fields",
    });
    return;
  }

  const validUser = validateUserDetails({ username, password, email });
  try {
    if (!validUser.isValidUser) {
      sendResponse(ctx, 400, {
        status: "failed",
        message: validUser.message,
      });
      return;
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const userSignUpDetails = {
      email: email.toLowerCase(),
      username,
      password: hashedPassword,
    };

    const userData = await addUserQuery(userSignUpDetails);
    if (userData.acknowledged) {
      jwtToken = jwt.sign(
        { id: userData.insertedId.toString(), email },
        process.env.JWT_SECRET || JWT_SECRET
      );
      sendResponse(ctx, 201, {
        status: 201,
        status: "success",
        jwtToken,
        message: "User created successfully",
      });
    } else {
      sendResponse(ctx, 400, {
        status: 400,
        status: "failed",
        message: "something went wrong while creating the user",
      });
    }
  } catch (error) {
    sendResponse(ctx, 400, {
      status: 400,
      status: "failed",
      message: "something went wrong while creating the user",
    });
  }
};

const loginUser = async (ctx) => {
  const { username, password, email } = ctx.request.body;
  if (!username || !password || !email) {
    sendResponse(ctx, 400, {
      status: "failed",
      message: "Please fill in all the fields",
    });
    return;
  }

  const validUser = validateUserDetails({ email, password, username });

  // find user in the database
  try {
    if (!validUser.isValidUser) {
      sendResponse(ctx, 400, {
        status: "failed",
        message: validUser.message,
      });
      return;
    }

    const user = await getUserQuery({ email: email.toLowerCase() });
    if (!user) {
      sendResponse(ctx, 400, {
        status: "failed",
        message: "User not found",
      });
      return;
    }

    // compare the password
    const isCorrectPassword = await bcrypt.compare(password, user.password);
    if (!isCorrectPassword) {
      sendResponse(ctx, 400, {
        status: "failed",
        message: "Invalid credentials",
      });
      return;
    }

    // create new jwt token
    const jwtToken = jwt.sign(
      {
        id: user._id.toString(),
        email: user.userEmail,
      },
      process.env.JWT_SECRET || JWT_SECRET
    );
    sendResponse(ctx, 200, {
      status: "success",
      jwtToken,
      message: "User logged in successfully",
    });
  } catch (error) {
    sendResponse(ctx, 400, {
      status: "failed",
      message: error.message,
    });
  }
};

const updateUser = async (ctx) => {
  const updateObj = ctx.request.body;
  try {
    const { id } = ctx.state.user;
    const updatedUserRes = await updateUserQuery(
      { _id: new BSON.ObjectId(id) },
      { $set: updateObj }
    );

    if (updatedUserRes.acknowledged) {
      sendResponse(ctx, 200, {
        status: "success",
        message: "User updated successfully",
      });
    } else {
      throw new Error("Something went wrong");
    }
  } catch (error) {
    sendResponse(ctx, 400, {
      status: "failed",
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
        status: "success",
      });
    } else {
      throw new Error("Something went wornge while deleting user.");
    }
  } catch (error) {
    sendResponse(ctx, 400, { message: error.message, status: "failed" });
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
