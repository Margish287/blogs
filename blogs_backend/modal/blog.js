import db from "../config/mongodb.js";
const Blog = db.getDb().collection("blogs");

const findBlog = async (data) => await Blog.find(data).toArray();
const findBlogById = async (id) => await Blog.findOne(id);
const insertBlog = async (data) => await Blog.insertOne(data);
const editBlog = async (id, data) => await Blog.updateOne(id, data);
const dltBlog = async (data) => await Blog.deleteOne(data);
const countBlog = async (data) => await Blog.countDocuments(data);

export { findBlog, insertBlog, editBlog, dltBlog, countBlog, findBlogById };
