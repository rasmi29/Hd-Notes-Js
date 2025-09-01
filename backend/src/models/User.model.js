import mongoose, { Schema } from "mongoose";


const userSchema = new Schema({
  name: {
    type: String,
    required: [true, 'Name is required'],
    trim: true,
    maxlength: [50, 'Name cannot exceed 50 characters']
  },
  email: {
    type: String,
    required: [true, 'Email is required'],
    unique: true,
    lowercase: true,
  },
  dateOfBirth: {
    type: Date,
    required: [true, 'Date of birth is required']
  },
  isVerified: {
    type: Boolean,
    default: false
  },
  otp: {
    code: String,
    expiresAt: Date
  },
  lastLogin: Date
}, {
  timestamps: true
});

const User = mongoose.model("User", userSchema);

export default User