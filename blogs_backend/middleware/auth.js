import jwt from "jsonwebtoken";
import { JWT_SECRET } from "../constants.js";
import { getUserByIdQuery } from "../modal/user.js";

export const authMiddleware = async (ctx, next) => {
  console.log("authMiddleware");
  // get the jwt token from the header
  const { authorization } = ctx.request.headers;
  const token = authorization?.split(" ")[1];
  if (!token || !authorization) {
    return ctx.throw(401, { message: "Unauthorized user !", success: false });
  }

  // token verification
  let isTokenValid;
  try {
    isTokenValid = jwt.verify(token, process.env.JWT_SECRET || JWT_SECRET);
  } catch (error) {
    ctx.throw(401, { message: "Unauthorized user !", success: false });
  }

  // TODO : verify user in auth middleware by getUserQuery
  const isUserExist = await getUserByIdQuery({ _id: isTokenValid.id });
  if (!isUserExist) {
    return ctx.throw(404, {
      message: "User not found",
      success: false,
    });
  }

  ctx.state.user = {
    id: isTokenValid.id,
    role: isTokenValid.role,
    ownerId: isTokenValid.ownerId || isTokenValid.id,
  };
  return next();
};

export const getOwnerIdForAuthUser = (ctx, next) => {
  const { authorization } = ctx.request.headers;
  const token = authorization?.split(" ")[1];
  let isTokenValid;
  if (token) {
    try {
      isTokenValid = jwt.verify(token, process.env.JWT_SECRET || JWT_SECRET);
      ctx.state.user = {
        id: isTokenValid.id,
        role: isTokenValid.role,
        ownerId: isTokenValid.ownerId || isTokenValid.id,
      };
    } catch (error) {
      return ctx.throw(401, { message: "Unauthorized user !", success: false });
    }
  }

  return next();
};
