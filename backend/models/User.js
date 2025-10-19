const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  fullName: {
    type: String,
    required: true,
  },
  mobile: {
    type: Number,
    required: true,
    unique: true,
  },
  email: {
    type: String,
    unique: true,
    sparse: true, // Allow null/undefined values for unique index
  },
  gotra: {
    type: String,
    enum: ["Garg", "Mangal", "Goel", "Kansal", "Singhal", "Mittal", "Bansal", "Jindal", "Tayal", "Goyal", "Bindal", "Narangal", "Bhandal", "Airan", "Dharan", "Madhukul", "Kuchhal", "Nangal"],
    required: true,
  },
  city: {
    type: String,
  },
  role: {
    type: String,
    enum: ["user", "admin",'vendor'],
    default: "user",
  },
  password: {
    type: String,
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
  paymentScreenshot: {
    type: String,
  },
  utrNumber: {
    type: String,
  },
  paymentVerified: {
    type: Boolean,
    default: false,
  },

}, { timestamps: true });

const User = mongoose.model("User", userSchema);
module.exports = User;
