const express = require("express");
const app = express();
const { MongoClient } = require("mongodb");
const cors = require("cors");
const { blogsRouter } = require("./routes/blogs.js");
const { userRoute } = require("./routes/users.js");
const { PORT, MONGO_URI } = require("./constants.js");

const client = new MongoClient(MONGO_URI);
const databaseName = "blogs";

// mongo connection
const connectToDatabase = async () => {
  try {
    await client.connect();
    console.log("Connected to Database");
  } catch (error) {
    console.log(`Error 1 while connecting db : ${error}`);
  }
};

const main = async () => {
  try {
    await connectToDatabase();
  } catch (error) {
    console.log(`Error 2 while connecting db : ${error}`);
  } finally {
    await client.close();
  }
};

// middlewares
app.use(express.json());
app.use(cors());
app.use("/blogs", blogsRouter); // blogs Routes
app.use("/user", userRoute); // user Routes

// main Routes
app.get("/", (_, res) => {
  res.send("Hello World");
});

// mongo connection and server listener
main();
app.listen(process.env.PORT || PORT, () => {
  console.log(`Server Running at ${PORT}`);
});
