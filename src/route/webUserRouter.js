import { Router } from "express";
import {
  createWebUserController,
  deleteSpecificUser,
  forgotPassword,
  loginUser,
  myProfile,
  readAllUser,
  readSpecificUser,
  resetPassword,
  updatePassword,
  updateProfile,
  updateSpecificUser,
  verifyEmail
} from "../controller/webUserController.js";
import authorized from "../middleware/authorized.js";
import isAuthenticated from "../middleware/isAuthenticated.js";
const webUserRouter = Router();

webUserRouter.route("/")
  .post(createWebUserController)
  .get(isAuthenticated,authorized(["admin","superadmin"]),readAllUser);

webUserRouter.route("/verify-email").patch(verifyEmail);

webUserRouter.route("/login").post(loginUser);

webUserRouter.route("/my-profile").get(isAuthenticated, myProfile);

webUserRouter.route("/update-profile").patch(isAuthenticated, updateProfile);

webUserRouter.route("/update-password").patch(isAuthenticated, updatePassword);

webUserRouter
.route("/forgot-password")
.post(forgotPassword);

webUserRouter
.route("/reset-password")
.patch(isAuthenticated,resetPassword);


//always put /:id route in last
webUserRouter.route("/:id")
.get(isAuthenticated,authorized(["admin","superadmin"]),readSpecificUser) //admin,superAdmin

.patch(isAuthenticated,authorized(["admin","superadmin"]),updateSpecificUser)//admin,superadmin

.delete(isAuthenticated,authorized(["superadmin"]),deleteSpecificUser);//superadmin


export default webUserRouter;
