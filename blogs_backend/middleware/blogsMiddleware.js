export const roleBasedBlogAccess = (roles) => async (ctx, next) => {
  const { role, id, ownerId } = ctx.state.user;

  // check if is (admin / owner) OR post is created by user it self
  if (roles.includes(role) || id === ownerId) {
    return await next();
  }

  return ctx.throw(401, {
    message: "UnAuthorized action !",
    success: false,
  });
};
