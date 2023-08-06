const data = require("../blogsData.js");

const createBlog = (req, res) => {
  const { title, content, owner, tags } = req.body;

  const blog = data.blogsData.find((blog) => blog.title === title);

  if (blog) {
    res.json({ error: "Blog already exists", status: 400 });
    return;
  }

  const newBlog = {
    id: data.blogsData.length + 1,
    title,
    content,
    owner,
    date: new Date(),
    tags,
  };
  data.blogsData.push(newBlog);
  res.json(data.blogsData);
};

const getAllBlogs = (_, res) => {
  res.json(data.blogsData);
};

const getBlog = (req, res) => {
  const { blogId } = req.params;
  console.log("blogID", blogId);
  const blog = data.blogsData.find((blog) => blog.id === +blogId);
  console.log("blog", blog);
  if (blog) {
    res.json(blog);
  } else {
    res.json({ error: "Blog not found", status: 404 });
  }
};

const replaceBlog = (req, res) => {
  const { blogId } = req.params;
  const { title, content, owner, tags } = req.body;
  const blog = data.blogsData.find((blog) => blog.id === +blogId);
  if (blog) {
    blog.title = title;
    blog.content = content;
    blog.owner = owner;
    blog.tags = tags;
    res.json(blog);
  } else {
    res.json({ error: "Blog not found", status: 404 });
  }
};

const updateBlog = (req, res) => {
  const { blogId } = req.params;
  const { title, content } = req.body;
  const blog = data.blogsData.find((blog) => blog.id === +blogId);
  if (blog) {
    blog.title = title;
    blog.content = content;
    res.json(blog);
  } else {
    res.json({ error: "Blog not found", status: 404 });
  }
};

const deleteBlog = (req, res) => {
  const { blogId } = req.params;
  const blog = data.blogsData.find((blog) => blog.id === +blogId);
  if (blog) {
    const index = data.blogsData.indexOf(blog);
    data.blogsData.splice(index, 1);
    res.json(data.blogsData);
  } else {
    res.json({ error: "Blog not found", status: 404 });
  }
};

module.exports = {
  createBlog,
  getAllBlogs,
  getBlog,
  replaceBlog,
  updateBlog,
  deleteBlog,
};
