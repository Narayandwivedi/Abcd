const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  fullName: {
    type: String,
    required: true,
  },
  mobile: {
    type: Number,
    unique: true,
    sparse: true, // Allow null values for Google users
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  gotra: {
    type: String,
    enum: ["Garg", "Mangal", "Goel", "Kansal", "Singhal", "Mittal", "Bansal", "Jindal", "Tayal", "Goyal", "Bindal", "Narangal", "Bhandal", "Airan", "Dharan", "Madhukul", "Kuchhal", "Nangal"],
    required: true,
  },
  role: {
    type: String,
    enum: ["user", "admin",'vendor'],
    default: "user",
  },
  password: {
    type: String,
    required: false, // Not required for Google OAuth users or regular signup
  },
  googleId: {
    type: String,
    unique: true,
    sparse: true, // Allow null for non-Google users
  },
  profilePicture: {
    type: String,
  },
  authProvider: {
    type: String,
    enum: ['local', 'google'],
    default: 'local',
  },
  
  bankAccount: {
    accountHolderName: String,
    accountNumber: String,
    ifscCode: String,
    bankName: String,
  },
  upiId: {
    upi: { type: String },
    accountHolderName: { type: String },
  },
  isVerified: {
    type: Boolean,
    default: false,
  },
  isMobileVerified: {
    type: Boolean,
    default: false,
  },
  isEmailVerified: {
    type: Boolean,
    default: false,
  },
  resetOtp: {
    type: Number,
  },
  otpExpiresAt: {
    type: Date,
  },

}, { timestamps: true });

const User = mongoose.model("User", userSchema);
module.exports = User;
