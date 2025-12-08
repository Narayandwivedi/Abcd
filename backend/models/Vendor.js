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
  state: {
    type: String,
    required: true,
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

  // Business Categories - Flattened structure for easier querying
  businessCategories: [{
    categoryId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Category',
      required: true,
    },
    subcategoryId: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
    },
    categoryName: {
      type: String,
      required: true,
    },
    subcategoryName: {
      type: String,
      required: true,
    },
  }],
  websiteUrl: {
    type: String,
  },
  socialUrl: {
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

  // Active certificate reference (current certificate with PDF)
  activeCertificate: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'VendorCertificate',
    default: null,
  },

}, { timestamps: true });

const Vendor = mongoose.model("Vendor", vendorSchema);
module.exports = Vendor;
