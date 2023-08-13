import jwt from "jsonwebtoken";
import { JWT_SECRET } from "../constants.js";

const authMiddleware = (ctx, next) => {
  console.log("authMiddleware");
  // get the jwt token from the header
  const { authorization } = ctx.request.headers;
  if (!authorization) {
    ctx.throw(401, { message: "Token not found", status: "failed" });
  }

  // token verification
  const token = authorization.split(" ")[1];
  const isTokenValid = jwt.verify(token, process.env.JWT_SECRET || JWT_SECRET);
  if (!isTokenValid) {
    ctx.throw(401, { message: "Token is not valid", status: "failed" });
  }

  return next();
};

export { authMiddleware };
