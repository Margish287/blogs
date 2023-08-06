const express = require("express");
const blogsRouter = express.Router();
const blogsController = require("../controller/blogs.js");

blogsRouter
  .post("/create", blogsController.createBlog)
  .get("/", blogsController.getAllBlogs)
  .get("/:blogId", blogsController.getBlog)
  .put("/:blogId", blogsController.replaceBlog)
  .patch("/:blogId", blogsController.updateBlog)
  .delete("/:blogId", blogsController.deleteBlog);

exports.blogsRouter = blogsRouter;
