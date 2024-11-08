import expressAsyncHandler from "express-async-handler";
import jwt from "jsonwebtoken";
import { secretKey } from "../validation/constant.js";
const isAuthenticated = expressAsyncHandler(async(req, res, next) => {
  //get token from postman
  let tokenString = req.headers.authorization;
  let tokenArray = tokenString.split(" ");
  let token = tokenArray[1];

  //verify token
  let user = await jwt.verify(token,secretKey)

   req._id = user._id;

   next();

})

export default isAuthenticated;