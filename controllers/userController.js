import UserModel from "../models/User.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

const userRegistration = async (req, res) => {
  const { name, email, password, password_confirmation } = req.body;

  // Check for all required fields
  if (!name || !email || !password || !password_confirmation) {
    return res.status(400).json({ msg: "Please enter all fields" });
  }

  // Check if passwords match
  if (password !== password_confirmation) {
    return res.status(400).json({ msg: "Passwords do not match" });
  }

  try {
    // Check if user already exists
    const existingUser = await UserModel.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ msg: "Email already exists" });
    }

    // Create a new user
    const newUser = new UserModel({ name, email, password });

    // Hash the password
    const salt = await bcrypt.genSalt(10);
    newUser.password = await bcrypt.hash(password, salt);

    // Save the user to the database
    const savedUser = await newUser.save();

    // remove password and id
    res.json({ msg: "User registered successfully", user: savedUser });
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ msg: "Server error" });
  }
};

const userLogin = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Check for all required fields
    if (!email || !password) {
      return res.status(400).json({ msg: "Please enter all fields" });
    }

    // Find the user by email
    const user = await UserModel.findOne({ email });
    if (!user) {
      return res.status(400).json({ msg: "User not found" });
    }

    // Check if the password matches
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ msg: "Invalid credentials" });
    }

    // Generate JWT token
    const payload = { user: { id: user._id } };
    const token = jwt.sign(payload, process.env.JWT_SECRET, {
      expiresIn: "10d",
    });
    res.status(200).json({ msg: "Login successful", token: token });
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ msg: "Server error" });
  }
};

const changePassword = async (req, res) => {
  const { password, password_confirmation } = req.body;

  // Check if user is authenticated
  if (!req.user) {
    return res
      .status(401)
      .json({ status: "failed", message: "Unauthorized user" });
  }

  // Check for all required fields
  if (!password || !password_confirmation) {
    return res
      .status(400)
      .json({ status: "failed", message: "All fields are required" });
  }

  // Check if passwords match
  if (password !== password_confirmation) {
    return res
      .status(400)
      .json({
        status: "failed",
        message: "New password and confirm new password do not match",
      });
  }

  try {
    // Hash the new password
    const salt = await bcrypt.genSalt(10);
    const newHashPassword = await bcrypt.hash(password, salt);

    // Update the password in the database
    await UserModel.findByIdAndUpdate(req.user._id, {
      password: newHashPassword,
    });

    res.json({ status: "success", message: "Password changed successfully" });
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ status: "failed", message: "Server error" });
  }
};

const getUserProfile = async (req, res) => {
  try {
    const user = await UserModel.findById(req.user._id);
    if (!user) return res.status(404).json({ msg: "User not found" });
    res.json({ user });
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ msg: "Server error" });
  }
};

const forgotPasswordResetLink = async (req, res) => {
  const { email } = req.body;
  if (email) {
    const user = await UserModel.findOne({ email: email });
    if (user) {
      const secret = user._id + process.env.JWT_SECRET;
      const token = jwt.sign({ userId: user._id }, secret, { expiresIn: "1h" });
      const link = `https://127.0.0.1:3000/api/user/reset/${user._id}/${token}`;
      console.log(link);
           // let info = await transporter.sendMail({
        //   from: process.env.EMAIL_FROM,
        //   to: user.email,
        //   subject: "User - Password Reset Link",
        //   html: `<a href=${link}>Click Here</a> to Reset Your Password`
        // })
      res
        .status(200)
        .json({ msg: "Reset password link sent to your email address" });
    } else {
      return res.status(404).json({ msg: "User not found" });
    }
  } else {
    return res.status(400).json({ msg: "Please enter your email address" });
  }
};

const forgetPasswordReset = async(req , res) =>{
  const {password , password_confirmation} = req.body ; 
  const {id , token} = req.params ; 
  if(password !== password_confirmation){
    return res.status(400).json({ msg: "Passwords do not match" });
  }
  if(password === password_confirmation){
    
    const user = await UserModel.findById(id);
    
    if(!user){
      return res.status(404).json({ msg: "User not found" });
    }

    const secret = user._id + process.env.JWT_SECRET;
    const decoded = jwt.verify(token, secret);
    
    if(!decoded){
      return res.status(401).json({ msg: "Invalid token" });
    }

    const salt = await bcrypt.genSalt(10);
    const hashPassword = await bcrypt.hash(password, salt);
    await UserModel.findByIdAndUpdate(user._id,{ $set:{password:hashPassword}})
    res.status(200).json({ msg: "Password changed successfully" });

  }
}

export { userRegistration, userLogin, changePassword, getUserProfile , forgotPasswordResetLink ,forgetPasswordReset};
