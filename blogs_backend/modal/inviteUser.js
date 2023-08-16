import db from "../config/mongodb";
const InviteUser = db.getDb().collection("invited_user");

export const inviteUserQuery = async (data) => await InviteUser.insertOne(data);
export const deleteInviteUserQuery = async (data) =>
  await InviteUser.deleteOne(data);
