export const sendResponse = (ctx, statusCode, data) => {
  ctx.status = statusCode || 500;
  ctx.body = data || { message: "Internal server error", success: false };
};
