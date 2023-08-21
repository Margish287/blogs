import { validateUserDetails } from "../utils/validate.js";

export const validateUser = (ctx, next) => {
  const { email, password, username } = ctx.request.body;
  if (!email || !password || !username) {
    ctx.throw(400, {
      success: false,
      message: "Please fill all the fields",
    });
    return;
  }

  const validUser = validateUserDetails({ username, password, email });

  if (!validUser.isValidUser) {
    return ctx.throw(400, {
      success: false,
      message: validUser.message,
    });
  }

  ctx.state.user = { email, password, username };
  return next();
};
