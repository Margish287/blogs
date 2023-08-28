import { findInvirtedUserQeury } from "../modal/inviteUser.js";
import { getUsersQuery } from "../modal/user.js";
import { getMembershipId } from "../utils/getMembershipId.js";
import {
  validateEmail,
  validateUpdateUserDetails,
  validateUserDetails,
} from "../utils/validate.js";

export const checkUserRole =
  (...roles) =>
  async (ctx, next) => {
    const { role } = ctx.state.user;

    if (!roles.includes(role)) {
      return ctx.throw(401, {
        message: "user role is not valid !",
        success: false,
      });
    }

    return await next();
  };

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
  const { ownerId, membershipData } = ctx.state.user;

  if (!membershipData) {
    return ctx.throw(400, {
      message: "Could not get user data ! please try later",
      success: false,
    });
  }

  const users = await getUsersQuery({ ownerId });
  if (users.length >= membershipData.teamMemberCount) {
    return ctx.throw(400, {
      message: "Buy higher plan to invite more team member.",
      success: false,
    });
  }

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

export const getMembershipData = (ctx, next) => {
  const { planType, planCycle } = ctx.request.body;

  const membershipId = getMembershipId(planType);
  if (!membershipId) {
    console.log("No Membership ID", membershipId);
    return ctx.throw(400, {
      message: "No such plan !",
      success: false,
    });
  }

  const membershipData = {
    membershipId,
    enableDraft: membershipId === 2,
    enableTeamCollab: [1, 2].includes(membershipId),
    teamMemberCount: membershipId === 1 ? 2 : Infinity,
    planData: {
      purchaseDate: new Date(),
      planType,
      planCycle,
    },
  };

  ctx.state.user["membershipData"] = { ...membershipData };
  return next();
};
