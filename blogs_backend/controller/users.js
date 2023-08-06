const data = require("../blogsData.js");

// TODO : hash the password, validate the (email, username, password)

const getAllUsers = (_, res) => {
  res.json(data.users);
};
const registerUser = (req, res) => {
  const { email, username, password } = req.body;
  const user = data.users.find((user) => user.email === email);

  if (user) {
    res.json({ error: "User already exists", status: 400 });
    return;
  }

  const newUser = {
    id: data.users.length + 1,
    email,
    username,
    password,
    createdAt: new Date(),
  };
  data.users.push(newUser);
  res.json(data.users);
};

const loginUser = (req, res) => {
  const { username, password, email } = req.body;
  const user = data.users.find(
    (user) =>
      user.email === email &&
      user.password === password &&
      user.username === username
  );
  if (user) {
    res.status(201).json({
      ...{ email: user.email, username: user.username },
      status: 200,
      message: "Login Successful",
    });
  } else {
    res.json({
      error: "Crendential is wrong or no such user",
      navigate: "/login",
      status: 404,
    });
  }
};

const updateUser = (req, res) => {
  const { userId } = req.params;
  const { email, username, password } = req.body;
  const user = data.users.find((user) => user.id === +userId);
  if (user) {
    user.email = email;
    user.username = username;
    user.password = password;
    res.json(user);
  } else {
    res.json({ error: "User not found", status: 404 });
  }
};

const deleteUser = (req, res) => {
  const { userId } = req.params;
  const user = data.users.find((user) => user.id === +userId);
  if (user) {
    const index = data.users.indexOf(user);
    data.users.splice(index, 1);
    res.json(data.users);
  } else {
    res.json({ error: "User not found", status: 404 });
  }
};

module.exports = {
  getAllUsers,
  registerUser,
  loginUser,
  updateUser,
  deleteUser,
};
