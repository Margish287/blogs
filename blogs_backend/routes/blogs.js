import KoaRouter from "koa-router";
import blogsController from "../controller/blogs.js";
import { authMiddleware } from "../middleware/auth.js";
const blogsRouter = new KoaRouter({ prefix: "/blogs" });

blogsRouter.get("/", blogsController.getAllBlogs);
blogsRouter.post("/create", authMiddleware, blogsController.createBlog);
blogsRouter.get("/:blogId", blogsController.getBlog);
blogsRouter.patch("/", authMiddleware, blogsController.updateBlog);
blogsRouter.delete("/", authMiddleware, blogsController.deleteBlog);
// .put("/:blogId", blogsController.replaceBlog)

export default blogsRouter;
