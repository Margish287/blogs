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
