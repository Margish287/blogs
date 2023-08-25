import { v4 as uuid4 } from "uuid";
import {
  findBlog,
  insertBlog,
  dltBlog,
  editBlog,
  countBlog,
  findBlogById,
} from "../modal/blog.js";
import { sendResponse } from "../utils/sendResponse.js";
import { getUserByIdQuery, getUserQuery } from "../modal/user.js";
import db from "../config/mongodb.js";
const Blog = db.getDb().collection("blogs");

const createBlog = async (ctx) => {
  const { title, content, tags } = ctx.request.body;
  const { id, ownerId } = ctx.state.user;

  const user = await getUserByIdQuery({ _id: id });
  if (!user) {
    ctx.throw(400, {
      message: "User is not valid.",
    });
  }

  const blogObj = {
    _id: uuid4(),
    title,
    content,
    tags,
    createdBy: id,
    createdAt: new Date(),
    lastEdited: new Date(),
    lastEditedBy: id,
    ownerId,
  };
  const createBlogRes = await insertBlog(blogObj);
  if (!createBlogRes.acknowledged) {
    ctx.throw(400, {
      message: "Something went wrong while creating blog.",
    });
  }

  sendResponse(ctx, 201, {
    success: true,
    message: "Blog created successfully",
  });
};

const getAllBlogs = async (ctx) => {
  const { page = 1, limit = 10, search = "", filterBy = "" } = ctx.query;
  // TODO : filter by ownerId

  // for pagination
  const skip = (+page - 1) * +limit;
  console.log({ page, limit, skip });
  let blogs;
  const total = await countBlog({});

  if (ctx.state.user && filterBy === "team") {
    const { ownerId } = ctx.state.user;
    blogs = await Blog.find({
      $or: [{ ownerId }, { _id: ownerId }],
      title: { $regex: search, $options: "i" },
    })
      .sort({ title: 1 })
      .skip(+skip)
      .limit(+limit)
      .toArray();
  } else {
    blogs = await Blog.find({
      title: { $regex: search, $options: "i" },
    })
      .sort({ title: 1 })
      .skip(+skip)
      .limit(+limit)
      .toArray();
  }

  if (!blogs.length) {
    ctx.throw(200, {
      success: true,
      message: "No blogs to display",
    });
  }
  sendResponse(ctx, 200, { success: true, blogs, total });
};

const getBlog = async (ctx) => {
  const { blogId } = ctx.request.params;
  const blog = await findBlogById({ _id: blogId });
  if (!blog) {
    ctx.throw(400, {
      success: false,
      message: "Blog not found.",
    });
  }
  sendResponse(ctx, 200, blog);
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
  const { blogId, title, content } = ctx.request.body;
  const { id } = ctx.state.user;

  // TODO : remove this
  const user = await getUserQuery({ _id: id });
  if (!user) {
    ctx.throw(400, {
      message: "User is not valid.",
      success: false,
    });
  }

  const blog = await editBlog({ _id: blogId }, { $set: { title, content } });
  if (!blog.acknowledged && !blog.modifiedCount) {
    ctx.throw(400, {
      message: "Something went wrong while updating a blog.",
      success: false,
    });
  }

  const updatedBlog = await findBlogById({ _id: blogId });
  sendResponse(ctx, 200, {
    updatedBlog,
    message: "Blog updated",
    success: true,
  });
};

const deleteBlog = async (ctx) => {
  const { blogId } = ctx.request.body;
  const { id } = ctx.state.user;

  const user = await getUserByIdQuery({ _id: id });
  if (!user) {
    ctx.throw(400, {
      message: "User is not valid.",
      success: false,
    });
  }

  const blogRes = await dltBlog({ _id: blogId });
  if (!blogRes.acknowledged) {
    ctx.throw(400, {
      message: "Something went wrong while removing blog.",
      success: false,
    });
  }

  const blogs = await findBlog({});
  sendResponse(ctx, 200, {
    blogs,
    message: "Blog deleted",
    success: true,
  });
};

export default {
  createBlog,
  getAllBlogs,
  getBlog,
  // replaceBlog,
  updateBlog,
  deleteBlog,
};
