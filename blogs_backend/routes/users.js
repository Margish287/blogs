import koaRouter from "koa-router";
import {
  getAllUsers,
  registerUser,
  loginUser,
  deleteUser,
  updateUser,
  deleteAllUsers,
} from "../controller/users.js";
import { authMiddleware } from "../middleware/auth.js";
const userRoute = new koaRouter({ prefix: "/user" });

userRoute.get("/", getAllUsers);
userRoute.post("/register", registerUser);
userRoute.post("/login", loginUser);
userRoute.delete("/deleteall", deleteAllUsers);
userRoute.put("/", authMiddleware, updateUser);
userRoute.delete("/delete", authMiddleware, deleteUser);

export default userRoute;
