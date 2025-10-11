const mongoose = require("mongoose");

const vendorSchema = new mongoose.Schema({
  // Authentication Fields
  email: {
    type: String,
    required: true,
    unique: true,
  },
  mobile: {
    type: Number,
    unique: true,
    sparse: true, // Allow null/undefined values for unique index
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

  // Application & Verification Status
  isBusinessApplicationSubmitted: {
    type: Boolean,
    default: false,
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

  // Reference to approved application (for quick access)
  approvedApplicationId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "BusinessApplication",
  },


}, { timestamps: true });

const Vendor = mongoose.model("Vendor", vendorSchema);
module.exports = Vendor;
