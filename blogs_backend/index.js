import koa from "koa";
import bodyParser from "koa-bodyparser";
import cors from "cors";
import errorHandler from "koa-json-error";
import { PORT } from "./constants.js";
import blogsRouter from "./routes/blogs.js";
import userRoute from "./routes/users.js";
import dbServer from "./config/mongodb.js";
import { sendResponse } from "./utils/sendResponse.js";
import { formateError } from "./utils/formateError.js";

const app = new koa();
// db connection
dbServer.connectServer();

// Error handling
app.use(errorHandler(formateError));
app.on("error", (error, ctx) => {
  sendResponse(ctx, error.status, {
    message: error.message,
    success: error.success,
  });
});

// middlewares
app.use(bodyParser());
app.use(blogsRouter.routes()).use(blogsRouter.allowedMethods());
app.use(userRoute.routes()).use(userRoute.allowedMethods());

// server listener
app.listen(process.env.PORT || PORT, () => {
  console.log(`Server Running at ${PORT}`);
});
