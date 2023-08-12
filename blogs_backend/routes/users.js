import koaRouter from "koa-router";
import {
  getAllUsers,
  registerUser,
  loginUser,
  deleteUser,
  updateUser,
  deleteAllUsers,
} from "../controller/users.js";
const userRoute = new koaRouter({ prefix: "/user" });

userRoute.get("/", getAllUsers);
userRoute.post("/register", registerUser);
userRoute.post("/login", loginUser);
userRoute.delete("/deleteall", deleteAllUsers);
userRoute.put("/", updateUser);
userRoute.delete("/delete", deleteUser);

export default userRoute;
