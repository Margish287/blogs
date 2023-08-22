import { findInvirtedUserQeury } from "../modal/inviteUser.js";
import {
  validateEmail,
  validateUpdateUserDetails,
  validateUserDetails,
} from "../utils/validate.js";

export const validateUser = (ctx, next) => {
  const { email, password, username } = ctx.request.body;
  if (!email || !password || !username) {
    ctx.throw(400, {
      success: false,
      message: "Please fill all the fields",
    });
    return;
  }

  const userDetails = { username, password, email: email.toLowerCase() };
  const validUser = validateUserDetails(userDetails);

  if (!validUser.isValidUser) {
    return ctx.throw(400, {
      success: false,
      message: validUser.message,
    });
  }

  ctx.state.user = { email, password, username };
  return next();
};

export const validateUpdateUser = (ctx, next) => {
  const { username, password } = ctx.request.body;
  let userObj = {};
  if (username) userObj["username"] = username;
  if (password) userObj["password"] = password;

  const validUser = validateUpdateUserDetails(userObj);
  if (!validUser.isValidUser) {
    return ctx.throw(400, {
      success: false,
      message: "User details is not valid",
    });
  }

  ctx.state.user = {
    ...ctx.state.user,
    username,
  };
  ctx.state.userObj = userObj;

  return next();
};

export const validateInviteUser = async (ctx, next) => {
  const { email, role } = ctx.request.body;
  const { ownerId } = ctx.state.user;
  // validate email
  const isValidEmail = validateEmail(email);
  if (!isValidEmail) {
    return ctx.throw(400, {
      message: "Email is not valid.",
      success: false,
    });
  }

  // check if user is already invited
  const invitedUser = await findInvirtedUserQeury({ email, ownerId });
  if (invitedUser) {
    return ctx.throw(400, {
      message: "User is already invited.",
      success: false,
    });
  }

  ctx.state.invitedUserObj = {
    email,
    role,
  };

  return next();
};
