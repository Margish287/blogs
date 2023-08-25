import KoaRouter from "koa-router";
import blogsController from "../controller/blogs.js";
import { authMiddleware, getOwnerIdForAuthUser } from "../middleware/auth.js";
import { roleBasedBlogAccess } from "../middleware/blogsMiddleware.js";
const blogsRouter = new KoaRouter({ prefix: "/blogs" });

blogsRouter.get("/", getOwnerIdForAuthUser, blogsController.getAllBlogs);

blogsRouter.post("/create", authMiddleware, blogsController.createBlog);

blogsRouter.get("/:blogId", blogsController.getBlog);

blogsRouter.patch(
  "/",
  authMiddleware,
  roleBasedBlogAccess(["O", "A"]),
  blogsController.updateBlog
);

blogsRouter.delete(
  "/",
  authMiddleware,
  roleBasedBlogAccess(["O", "A"]),
  blogsController.deleteBlog
);
// .put("/:blogId", blogsController.replaceBlog)

export default blogsRouter;
