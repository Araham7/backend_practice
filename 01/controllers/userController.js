import { User } from "../model/userSchema.js";
import emailValidator from "email-validator";
import bcrypt from "bcrypt";


// (1). signup route handalling :---
const signUp = async (req , res , next)=>{
    const { name , email , password , confirmPassword } = req.body ;

    if(!email || !password || !confirmPassword || !name){
        return res.status(400).json({
            success: false,
            message: "Every field is required!"
        })
    }

    // Email validtion :---
    if (!emailValidator.validate(email)) {
        return res.status(400).json({
            success: false,
            message: "Invalid email address!"
        });
    }

    /// send password not match err if password !== confirmPassword:---
    if (password !== confirmPassword) {
        return res.status(400).json({
            success: false,
            message: "Password and confirmPassword dose not matched!"
        })
    }

    try {
        const userInfo = new User(req.body);

        // userSchema "pre" middleware functions for "save" will hash the password using bcrypt
        // before saving the data into the database
        const result = await userInfo.save();
        return res.status(200).json({
          success: true,
          data: result
        });
      } catch (error) {

        // send the message of the dublicate entity if found.
        if (error.code === 11000) {
            // Yeh line us field ko identify karegi jo duplication error cause kar rahi hai
            const field = Object.keys(error.keyValue)[0]; 
          
            // Yahan error response send kiya ja raha hai user ko, message mein duplicate field aur value dikhayi ja rahi hai
            return res.status(400).json({
              success: false,
              message: `An account already exists with the provided ${field}: ${error.keyValue[field]} 😒`
            });
          }
    
        return res.status(400).json({
            success: true,
            message: error.message
        });
      }
};


// (2). signin route handalling :---
const signIn = async (req , res , next)=>{

    let { email , password } = req.body;

    // Validate missing fields, return error if any field is empty:---
    if ( !email || !password ) {
        return res.status(400).json({
            success: false ,
            message: "email and password are required!"
        })
    }

    try {

        // check user exist or not:---
        const user = await User.findOne({ email }).select("+password");
    
        // If user is "null" or the "password is incorrect" return response with error message.
        /*****/
        // if (!user || password !== user.password ) {
        /*****/
        // ye user ka password aur db se aaye huwe password ko chek karega.
          if (!user || !(await bcrypt.compare(password, user.password))) {
          return res.status(400).json({
            success: true,
            message: "invalid credentials"
          });
        }
        
        // Create jwt token using userSchema method( jwtToken() )
        const token = user.jwtToken();
        user.password = undefined; // removing password from user.
    
        const cookieOption = {
          maxAge: 24 * 60 * 60 * 1000, //24hr
          httpOnly: true //  not able to modify  the cookie in client side
        };
    
        res.cookie("token", token, cookieOption); // NOTE : ``cookieOption`` is optional .
        res.status(200).json({
          success: true,
          data: user
        });
      } catch (error) {
        return res.status(400).json({
          success: false,
          message: error.message
        });
      }
};


// (3). getuser route handalling :---
const getUser = async (req , res , next)=>{
    let userId = req.user.id;

    try {
      const user = await User.findById(userId);

      return res.status(200).json({
        success: true,
        data: user
      })
    } catch (error) {
      return res.status(400).json({
        success: false,
        message: error.message
      });
    }
};


// (4). logout route handalling :---
const logOut = (req , res , next)=>{
  try {
    const cookieOption = {
      expires: 0,
      httpOnly: true
    }
    res.cookie("token", null , cookieOption);
    res.status(200).json({
      success: true,
      data: "Logged Out Successfully!"
    })
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message
    })
  }
};


// getAllUsers route handalling :---
const getAllUsers = (req , res , next)=>{

};


// deleteUser route handalling :---
const deleteUser = (req , res , next)=>{

};


export { signUp , signIn , getUser , logOut , getAllUsers , deleteUser };