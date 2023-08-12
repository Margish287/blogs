const authMiddleware = (ctx, next) => {
  console.log("authMiddleware");
  console.log(ctx);
  return next();
};

export { authMiddleware };
