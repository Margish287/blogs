import koaRouter from "koa-router";
import {
  getAllUsers,
  registerUser,
  loginUser,
  deleteUser,
  updateUser,
  deleteAllUsers,
  inviteUser,
  registerTeamMember,
} from "../controller/users.js";
import { authMiddleware } from "../middleware/auth.js";
import { validateUser } from "../middleware/validateUser.js";
import { inviteTokenValidator } from "../middleware/inviteUser.js";
const userRoute = new koaRouter({ prefix: "/user" });

userRoute.get("/", getAllUsers);
userRoute.post("/register", validateUser, registerUser);
userRoute.post("/login", loginUser);
userRoute.delete("/deleteall", deleteAllUsers);
userRoute.put("/", authMiddleware, updateUser);
userRoute.delete("/delete", authMiddleware, deleteUser);

// invite user
userRoute.post("/invite", authMiddleware, inviteUser);
userRoute.post(
  "/register/:invitetoken",
  inviteTokenValidator,
  registerTeamMember
);
export default userRoute;
