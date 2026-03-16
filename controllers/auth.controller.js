import User from "../models/user.model.js";
import bcrypt from "bcrypt";
export const signUp = async (req, res, next) => {
  try {
    const { fullName, email, password } = req.body;
    if (!fullName || !email || !password) {
      const error = new Error("Full name, email, and password are requried");
      error.statusCode = 400;
      throw error;
    }
    const emailExist = await User.findOne({ email });
    if (emailExist) {
      const error = new Error("User already exist");
      error.statusCode = 409;
      throw error;
    }
    const hashed_password = await bcrypt.hash(password, 10);
    const newUser = await User.create({
      fullName,
      email,
      password: hashed_password,
    });
    req.login(newUser, (err) => {
      if (err) {
        throw err;
      }
      res.status(201).json({ success: true, data: [newUser] });
    });
  } catch (err) {
    next(err);
  }
};

export const signIn = async (req, email, password) => {
  if (!email || !password) {
    const error = new Error("Email, and password are requried");
    error.statusCode = 400;
    throw error;
  }
  const user = await User.findOne({ email });
  if (!user) {
    const error = new Error("User not found");
    error.statusCode = 404;
    throw error;
  }
  
  const isValidPassword = await bcrypt.compare(password, user.password);
  if (!isValidPassword) {
    const error = new Error("Invalid Credential");
    error.statusCode = 401;
    throw error;
  }
  const userObj = user.toObject();
  const {password: oPassword,...newUser} = userObj;
  return newUser;
};

export const logout = async (req, res, next) => {
  try {
    req.logout((err)=>{
      if(err){throw err}
      res.status(200).json({success:true,message: "Logout Successfully"})
    })
  } catch (err) {
    next(err);
  }
};
