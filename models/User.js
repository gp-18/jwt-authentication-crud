import mongoose from "mongoose";

// schema structure 
const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true,
    match: [/^[a-zA-Z\s]+$/, 'Please enter a valid name'],
  },
  email: {
    type: String,
    required: true,
    unique: true,
    trim: true,
    match: [/^\S+@\S+\.\S+$/, 'Please enter a valid email address'],
  },
  password: {
    type: String,
    required: true,
    minlength: 8,
  },
});

// user model 
const UserModel = mongoose.model("User", userSchema);

export default UserModel;
