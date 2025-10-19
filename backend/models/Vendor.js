const mongoose = require("mongoose");

const vendorSchema = new mongoose.Schema({
  // Authentication Fields
  email: {
    type: String,
    unique: true,
  },
  mobile: {
    type: Number,
    required:true,
    unique: true,
  },
  ownerName: {
    type: String,
    required: true,
  },
  businessName: {
    type: String,
    required: true,
  },
  password: {
    type: String,
  },

  // Google OAuth fields
  googleId: {
    type: String,
    unique: true,
    sparse: true,
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

}, { timestamps: true });

const Vendor = mongoose.model("Vendor", vendorSchema);
module.exports = Vendor;
