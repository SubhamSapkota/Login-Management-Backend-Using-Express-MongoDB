import expressAsyncHandler from "express-async-handler";
import { WebUser } from "../schema/model.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { sendEmail } from "../utils/sendMail.js";
import { secretKey } from "../validation/constant.js";

export const createWebUserController = expressAsyncHandler(
  async (req, res, next) => {
    let data = req.body;
    /* 
  data =
  {
    "fullName":"Shubham Sapkota",
    "email":"shuvam760@gmail.com",
    "password":"password",
    "dob":"2002-03-27",
    "gender":"male",
    "role":"superAdmin",
}
  */

    let hashPassword = await bcrypt.hash(data.password, 10);

    data = {
      ...data,
      isVerifiedEmail: false,
      password: hashPassword,
    };
    // console.log(data)
    /* 
  data =
  {
    "fullName":"Shubham Sapkota",
    "email":"shuvam760@gmail.com",
    "password":"password",
    "dob":"2002-03-27",
    "gender":"male",
    "role":"superAdmin",
    "isVerifiedEmail":false,
    "password":hashPassword // in object it overwrites the key above it
}
  data =
  {
    "fullName":"Shubham Sapkota",
    "email":"shuvam760@gmail.com",
    "dob":"2002-03-27",
    "gender":"male",
    "role":"superAdmin",
    "isVerifiedEmail":false,
    "password":hashPassword 
}
  */

    let result = await WebUser.create(data);
    // console.log(result);

    //send mail with link
    //generate token
    let infoObj = {
      _id: result._id,
    };
    let expiryInfo = {
      expiresIn: "5d",
    };

    let token = await jwt.sign(infoObj, secretKey, expiryInfo);

    //link=> frontend link

    //send mail
    await sendEmail({
      from: "'HouseOfJob'<jd004772@gmail.com>",
      to: data.email,
      subject: "account created",
      html: `
        <h1>your account has been created successfully</h1>
        <a href="http://localhost:5173/verify-email?token=${token}">
        http://localhost:5173/verify-email?token=${token}
        </a>
        `,
    });

    res.status(201).json({
      success: true,
      message: "user created successfully",
      result: result,
    });
  }
);

export const verifyEmail = expressAsyncHandler(async(req,res,next)=>{
  let tokenString = req.headers.authorization;
  // console.log(tokenString.split(" "))
  let tokenArray = tokenString.split(" ");
  let token = tokenArray[1];
  console.log(token)

  //verify token
  let infoObj = await jwt.verify(token, secretKey)
  // console.log(infoObj)
  let userId = infoObj._id;
  // console.log(userId)

  let result = await WebUser.findByIdAndUpdate(
    userId,
    {
      isVerifiedEmail:true,
  },
{new:true}
)

res.status(201).json({
  success: true,
  message: "user verified successfully",
  result: result,
});
})


export const loginUser = expressAsyncHandler(async(req,res,next)=>{

  let email = req.body.email;
  let password = req.body.password;
  console.log(email)

  let user = await WebUser.findOne({"email":email})
  // console.log(user)

  if(user){
    if(user.isVerifiedEmail){
      let isValidPassword = await bcrypt.compare(password,user.password)
      if(isValidPassword){
        let infoObj = {
          _id: user._id,
        };
        let expiryInfo = {
          expiresIn: "365d",
        };
    
        let token = await jwt.sign(infoObj, secretKey, expiryInfo);

        res.status(200).json({
          success:true,
          message:"user login successful",
          data:user,
          token:token
        })
      }
      else{
        let error = new Error("credentials doesnot match");
        throw error;
      }
    }
    else{
      let error = new Error("credentials doesnot match")
      throw error;
    }
  }
  else{
    let error = new Error("credentials not found")
    throw error;
  }
})


export const myProfile = expressAsyncHandler(async(req,res,next)=>{
  let _id = req._id;
  let result = await  WebUser.findById(_id);
  res.status(200).json({
    success:true,
    message:"profile read successfully",
    result:result
  })
})

export const updateProfile = expressAsyncHandler(async(req,res,next)=>{
  let _id = req._id;
  let data = req.body;
  /* 
  data = {
    "fullName":"Subham Sapkota",
    "email":"shuvam760@gmail.com",
    "password":"password@123",
    "dob":"2002-03-27",
    "gender":"male",
    "role":"superAdminSuper"
}
   */
  delete data.email;
  delete data.password;
  // console.log(data)
  /* 
  data = {
    "fullName":"Subham Sapkota",
    "dob":"2002-03-27",
    "gender":"male",
    "role":"superAdminSuper"
}
   */

  let result = await WebUser.findByIdAndUpdate(_id,data,{new:true})

  res.status(201).json({
    success:true,
    message:"profile updated successfully",
    result:result
  })
})

export const updatePassword = expressAsyncHandler(async(req,res,next)=>{
  let _id = req._id;
  let oldPassword = req.body.oldPassword;
  let newPassword = req.body.newPassword;

  let data = await WebUser.findById(_id);
  let hashPassword = data.password;
  let isValidPassword = await bcrypt.compare( oldPassword,hashPassword);
  if(isValidPassword){
    let newHashPassword = await bcrypt.hash(newPassword,10)
    let result = await WebUser.findByIdAndUpdate(_id, {password:newHashPassword}, {new:true} )

    res.status(201).json({
      success:true,
      message:"Password updated successfully",
      result:result
    })
  }
  else{
    let error = new Error("Credentials doesnot match.");
    throw error;
  }
  console.log(data)

})

export const readAllUser = expressAsyncHandler(async(req,res,next)=>{
  let result = await WebUser.find({});
  res.status(200).json({
    success:true,
    message:"All user read successfully",
    result:result
  })
})

export const readSpecificUser = expressAsyncHandler(async(req,res,next)=>{
  let result = await WebUser.findById(req.params.id);
  res.status(200).json({
    success:true,
    message:"User read successfully",
    result:result
  })
})

export const updateSpecificUser = expressAsyncHandler(async(req,res,next)=>{
  delete req.body.email
  delete req.body.password
  let result = await WebUser.findByIdAndUpdate(req.params.id, req.body,{new:true});
  res.status(201).json({
    success:true,
    message:"User updated successfully.",
    result:result
  })
})

export const deleteSpecificUser = expressAsyncHandler(async(req,res,next)=>{
  let result = await WebUser.findByIdAndDelete(req.params.id);
  res.status(200).json({
    success:true,
    message:"User deleted successfully.",
    result:result
  })
})

export const forgotPassword = expressAsyncHandler(async(req,res,next)=>{
  let email = req.body.email;
  let result = await WebUser.findOne({"email":email})
  // console.log(user);
  if(result){
    //send mail with link
    //generate token
    let infoObj = {
      _id: result._id,
    };
    let expiryInfo = {
      expiresIn: "5d",
    };

    let token = await jwt.sign(infoObj, secretKey, expiryInfo);

    //link=> frontend link

    //send mail
    await sendEmail({
      from: "'HouseOfJob'<jd004772@gmail.com>",
      to: email,
      subject: "Reset Password",
      html: `
        <h1>Please click given link to reset your password</h1>
        <a href="http://localhost:5173/reset-password?token=${token}">
        http://localhost:5173/reset-password?token=${token}
        </a>
        `,
    });
    res.status(200).json({
      success:true,
      message:"Link has been sent to your email to reset your password."
    })
  }else{
    res.status(404).json({
      success:false,
      message:"Email does not exist",
      })
  }
})

export const resetPassword = expressAsyncHandler(async(req,res,next)=>{
  // let tokenString = req.headers.authorization;
  // let tokenArray = tokenString.split(" ");
  // let token = tokenArray[1];
  let _id = req._id;

  let hashPassword = await bcrypt.hash(req.body.password,10);
  let result = await WebUser.findByIdAndUpdate(_id,{
    password:hashPassword
  },{new:true})
  res.status(201).json({
    success:true,
    message:"Password reset successfully.",
    result:result
  })
})