const sendResponse = (ctx, statusCode, data) => {
  ctx.status = statusCode;
  ctx.body = data;
};

export { sendResponse };
