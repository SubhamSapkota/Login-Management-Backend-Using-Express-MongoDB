import expressAsyncHandler from "express-async-handler";
import { WebUser } from "../schema/model.js";

const authorized = (roles) => {
  //roles=["admin","superadmin"]
  return expressAsyncHandler(async (req, res, next) => {
    let _id = req._id;
    let result = await WebUser.findById(_id);
    // console.log(result)
    let tokenRole = result.role;
    if (roles.includes(tokenRole)) {
      next();
    } else {
      res.status(403).json({
        success: false,
        message: "User not authorized.",
      });
    }
  });
};

export default authorized;
