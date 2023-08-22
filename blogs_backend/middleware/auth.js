import jwt from "jsonwebtoken";
import { JWT_SECRET } from "../constants.js";

export const authMiddleware = (ctx, next) => {
  console.log("authMiddleware");
  // get the jwt token from the header
  const { authorization } = ctx.request.headers;
  const token = authorization?.split(" ")[1];
  if (!token || !authorization) {
    ctx.throw(401, { message: "Unauthorized user !", success: false });
  }

  // token verification
  let isTokenValid;
  try {
    isTokenValid = jwt.verify(token, process.env.JWT_SECRET || JWT_SECRET);
  } catch (error) {
    ctx.throw(401, { message: "Unauthorized user !", success: false });
  }

  ctx.state.user = {
    id: isTokenValid.id,
    role: isTokenValid.role,
    ownerId: isTokenValid.ownerId || isTokenValid.id,
  };
  return next();
};
