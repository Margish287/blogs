import { MongoClient } from "mongodb";
import { MONGO_URI } from "../constants.js";
const dbName = "blogs_db";

const client = new MongoClient(process.env.MONGO_URI || MONGO_URI);
export default {
  connectServer: async () => {
    try {
      await client.connect().then(() => console.log("Connected to db"));
    } catch (error) {
      console.log("Error while connecting to db", error);
    }
  },
  getDb: () => client.db(dbName),
};
