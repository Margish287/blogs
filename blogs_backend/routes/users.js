const express = require("express");
const userRoute = express.Router();
const usersController = require("../controller/users.js");

userRoute
  .get("/", usersController.getAllUsers)
  .post("/register", usersController.registerUser)
  .post("/login", usersController.loginUser)
  .patch("/:blogId", usersController.updateUser)
  .delete("/:blogId", usersController.deleteUser);

exports.userRoute = userRoute;
