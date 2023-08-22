import jwt from "jsonwebtoken";
import { JWT_SECRET } from "../constants.js";
import { getUserQuery } from "../modal/user.js";

export const inviteTokenValidator = async (ctx, next) => {
  const invitetoken = ctx.params.invitetoken;
  const verifyInvitetoken = jwt.verify(
    invitetoken,
    process.env.JWT_SECRET || JWT_SECRET
  );
  if (!verifyInvitetoken) {
    return ctx.throw(400, {
      message: "Link is expire or invalid",
      success: false,
    });
  }

  const { email, role, ownerId } = verifyInvitetoken;
  const inviteUser = await getUserQuery({ email });
  if (inviteUser) {
    return ctx.throw(400, {
      message: "User is already register",
      success: false,
    });
  }

  ctx.state.user = { email, role, ownerId };
  return next();
};
