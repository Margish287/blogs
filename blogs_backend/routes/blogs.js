import KoaRouter from "koa-router";
import blogsController from "../controller/blogs.js";
const blogsRouter = new KoaRouter({ prefix: "/blogs" });

blogsRouter.get("/", blogsController.getAllBlogs);
blogsRouter.post("/create", blogsController.createBlog);
blogsRouter.get("/:blogId", blogsController.getBlog);
blogsRouter.patch("/:blogId", blogsController.updateBlog);
blogsRouter.delete("/:blogId", blogsController.deleteBlog);
// .put("/:blogId", blogsController.replaceBlog)

export default blogsRouter;
