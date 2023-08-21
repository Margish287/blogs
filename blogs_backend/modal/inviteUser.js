import db from "../config/mongodb.js";
const InviteUser = db.getDb().collection("invited_user");

export const inviteUserQuery = async (data) => await InviteUser.insertOne(data);
export const findInvirtedUserQeury = async (data) =>
  await InviteUser.findOne(data);
export const deleteInviteUserQuery = async (data) =>
  await InviteUser.deleteOne(data);
