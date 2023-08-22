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
  acceptInvitation,
} from "../controller/users.js";
import { authMiddleware } from "../middleware/auth.js";
import {
  validateInviteUser,
  validateUpdateUser,
  validateUser,
} from "../middleware/validateUser.js";
import { inviteTokenValidator } from "../middleware/inviteUser.js";
const userRoute = new koaRouter({ prefix: "/user" });

userRoute.get("/", getAllUsers);
userRoute.post("/register", validateUser, registerUser);
userRoute.post("/login", validateUser, loginUser);
userRoute.delete("/deleteall", deleteAllUsers);
userRoute.put("/", authMiddleware, validateUpdateUser, updateUser);
userRoute.delete("/delete", authMiddleware, deleteUser);

// invite user
userRoute.post("/invite", authMiddleware, validateInviteUser, inviteUser);
userRoute.post(
  "/register/:invitetoken",
  inviteTokenValidator,
  registerTeamMember
);
userRoute.get("/accept/:inviteToken", inviteTokenValidator, acceptInvitation);
export default userRoute;
