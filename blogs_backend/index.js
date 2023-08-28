import koa from "koa";
import bodyParser from "koa-bodyparser";
import env from "dotenv";
env.config();
// import cors from "cors";
import errorHandler from "koa-json-error";
import { PORT } from "./constants.js";
import setupAPI from "./routes/index.js";
import dbServer from "./config/mongodb.js";
import { sendResponse } from "./utils/sendResponse.js";
import { formateError } from "./utils/formateError.js";

const app = new koa();
// db connection
dbServer.connectServer();

// Error handling
app.use(errorHandler(formateError));
app.on("error", (error, ctx) => {
  console.log(error);
  sendResponse(ctx, error.status, {
    message: error.message,
    success: error.success,
  });
});

// middlewares
app.use(bodyParser());

// Routes
setupAPI(app);

// server listener
app.listen(process.env.PORT || PORT, () => {
  console.log(`Server Running at ${process.env.PORT || PORT}`);
});
