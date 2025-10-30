const mongoose = require("mongoose");

const vendorSchema = new mongoose.Schema({
  // Authentication Fields
  email: {
    type: String,
    unique: true,
    sparse: true, // Allow null/undefined values while maintaining uniqueness
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
  passportPhoto: {
    type: String,
  },
  city: {
    type: String,
    required: true,
  },
  membershipCategory: {
    type: String,
    enum: ['Bronze', 'Silver', 'Gold', 'Diamond', 'Platinum'],
    required: true,
  },
  category: {
    type: String,
    required: true,
  },
  subCategory: {
    type: String,
    required: true,
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

  // Payment and Approval Fields
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
  isRejected: {
    type: Boolean,
    default: false,
  },

  // Certificate Fields
  certificateNumber: {
    type: String,
    unique: true,
    sparse: true, // Allow null for vendors without certificates
  },
  certificateDownloadLink: {
    type: String,
  },
  certificateIssueDate: {
    type: Date,
  },
  certificateExpiryDate: {
    type: Date,
  },

}, { timestamps: true });

const Vendor = mongoose.model("Vendor", vendorSchema);
module.exports = Vendor;
