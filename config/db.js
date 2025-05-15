const mongoose = require("mongoose");
require("dotenv").config();
mongoose.set("strictQuery", false);
const MONGO_URI = process.env.mongodburl;
const logger = require("../middleware/loger");
// console.log(MONGO_URI, "MONGO_URI");

mongoose
  .connect(MONGO_URI)
  .then(() => {
    // console.log("connected!");
    logger.info("db connected");
  })
  .catch((err) => {
    // console.log(err);
    logger.error("db connection error");
  });
