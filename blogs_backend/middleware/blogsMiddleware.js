export const roleBasedBlogAccess = (roles) => async (ctx, next) => {
  if (!roles.includes(ctx.state.user.role)) {
    return ctx.throw(401, {
      message: "UnAuthorized action !",
      success: false,
    });
  }

  return await next();
};
