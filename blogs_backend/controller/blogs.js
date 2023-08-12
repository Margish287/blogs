import { BSON } from "mongodb";
// import data from "../blogsData.js";
import {
  findBlog,
  insertBlog,
  dltBlog,
  editBlog,
  countBlog,
  findBlogById,
} from "../modal/blog.js";
import { sendResponse } from "../utils/sendResponse.js";

const createBlog = async (ctx) => {
  const blog = ctx.request.body;
  try {
    await insertBlog(blog);
    return sendResponse(ctx, 201, {
      success: true,
      message: "Blog created successfully",
    });
  } catch (error) {
    return sendResponse(ctx, 400, { success: false, message: error.message });
  }
};

const getAllBlogs = async (ctx) => {
  // for pagination
  // const { page, limit } = ctx.query;
  // const skip = (page - 1) * limit;
  // const blogs = await findBlog({}, skip, limit);
  // const total = await countBlog({});
  // return sendResponse(ctx, 200, { blogs, total });
  try {
    const blogs = await findBlog({});

    if (blogs.length) {
      return sendResponse(ctx, 200, { success: true, blogs });
    } else {
      return sendResponse(ctx, 200, {
        success: true,
        message: "No blogs to display",
      });
    }
  } catch (e) {
    return sendResponse(ctx, 400, { success: false, message: e.message });
  }
};

const getBlog = async (ctx) => {
  const { blogId } = ctx.request.params;
  const blog = await findBlogById({ _id: new BSON.ObjectId(blogId) });
  try {
    return sendResponse(ctx, 200, blog);
  } catch (e) {
    return sendResponse(ctx, 400, { success: false, message: e.message });
  }
};

// const replaceBlog = (req, res) => {
//   const { blogId } = req.params;
//   const { title, content, owner, tags } = req.body;
//   const blog = data.blogsData.find((blog) => blog.id === +blogId);
//   if (blog) {
//     blog.title = title;
//     blog.content = content;
//     blog.owner = owner;
//     blog.tags = tags;
//     res.json(blog);
//   } else {
//     res.json({ error: "Blog not found", status: 404 });
//   }
// };

const updateBlog = async (ctx) => {
  const { blogId } = ctx.request.params;
  const { title, content } = ctx.request.body;
  const blog = await editBlog(
    { _id: new BSON.ObjectId(blogId) },
    { title, content }
  );
  try {
    return sendResponse(ctx, 200, {
      blog,
      message: "Blog updated",
      success: true,
    });
  } catch (error) {
    sendResponse(ctx, 400, { success: false, message: error.message });
  }
};

const deleteBlog = async (ctx) => {
  const { blogId } = ctx.request.body;
  await dltBlog({ _id: new BSON.ObjectId(blogId) });
  const blogs = await findBlog({});
  try {
    return sendResponse(ctx, 200, {
      blogs,
      message: "Blog deleted",
      success: true,
    });
  } catch (error) {
    sendResponse(ctx, 400, { success: false, message: error.message });
  }
};

export default {
  createBlog,
  getAllBlogs,
  getBlog,
  // replaceBlog,
  updateBlog,
  deleteBlog,
};
