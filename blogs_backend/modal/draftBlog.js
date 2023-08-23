import db from "../config/mongodb.js";
const Draft = db.getDb().collection("drafts");

export const createDraftQuery = async (data) => await Draft.insertOne(data);
export const deleteDraftQuery = async (id) => await Draft.deleteOne(id);
export const getDraftQuery = async (data) => await Draft.findOne(data);
export const updateDraftQuery = async (id, data) =>
  await Draft.updateOne(id, data);
