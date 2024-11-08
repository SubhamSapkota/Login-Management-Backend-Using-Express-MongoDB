import express, { json } from "express";
import cors from "cors";
import connectToMongoDb from "./src/connectToDB/connectToMongoDb.js";
import errorMiddleware from "./src/middleware/errorMiddleware.js";
import webUserRouter from "./src/route/webUserRouter.js";

let expressApp = express();

expressApp.use(json());

expressApp.use(cors());

expressApp.use(express.static("./public"));
expressApp.use(express.static("./p1"));

expressApp.listen(8000, ()=>{
  console.log("Server is running on port 8000 ")
  connectToMongoDb();
})

expressApp.use("/web-users", webUserRouter) //use kebab case naming for the route

expressApp.use(errorMiddleware)