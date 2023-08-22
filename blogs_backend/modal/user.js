import db from "../config/mongodb.js";
const User = db.getDb().collection("users");

const getUserByIdQuery = async (id) => await User.findOne(id);
const getUserQuery = async (data) => await User.findOne(data);
const getUsersQuery = async (data) => await User.find(data).toArray();
const getAllUsersQuery = async () => await User.find({}).toArray();
const addUserQuery = async (data) => await User.insertOne(data);
const deleteUserQuery = async (data) => await User.deleteOne(data);
const updateUserQuery = async (id, data) => await User.updateOne(id, data);
const deleteAllUserQuery = async () => await User.deleteMany({});
const countUser = async (data) => await User.countDocuments(data);

export {
  getUserByIdQuery,
  getUserQuery,
  getUsersQuery,
  getAllUsersQuery,
  updateUserQuery,
  deleteUserQuery,
  addUserQuery,
  deleteAllUserQuery,
  countUser,
};
