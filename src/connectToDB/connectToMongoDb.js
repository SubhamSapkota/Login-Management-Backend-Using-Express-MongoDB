

import mongoose from "mongoose";
import { dbLink } from "../validation/constant.js";

const connectToMongoDb = () => {
  mongoose.connect(dbLink);
  console.log("application is connected to MongoDB successfully");
};

export default connectToMongoDb;