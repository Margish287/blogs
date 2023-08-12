import koa from "koa";
import bodyParser from "koa-bodyparser";
import cors from "cors";
import { PORT } from "./constants.js";
import blogsRouter from "./routes/blogs.js";
import userRoute from "./routes/users.js";
import dbServer from "./config/mongodb.js";
// import { authMiddleware } from "./middleware/auth.js";

const app = new koa();
// db connection
dbServer.connectServer();

// middlewares
app.use(bodyParser());
// app.use(authMiddleware);
app.use(blogsRouter.routes()).use(blogsRouter.allowedMethods());
app.use(userRoute.routes()).use(userRoute.allowedMethods());

// server listener
app.listen(process.env.PORT || PORT, () => {
  console.log(`Server Running at ${PORT}`);
});
