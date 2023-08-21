export const inviteTokenValidator = (ctx, next) => {
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
  ctx.state.user = { email, role, ownerId };
  return next();
};
