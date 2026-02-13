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
  owners: [{
    name: {
      type: String,
      required: true,
      trim: true,
    },
    photo: {
      type: String,
      required: true,
    },
  }],
  businessName: {
    type: String,
    required: true,
  },

  password: {
    type: String,
  },

  state: {
    type: String,
    required: true,
  },
  district: {
    type: String,
  },
  city: {
    type: String,
    required: true,
  },
  membershipFees: {
    type: Number,
    required: true,
  },

  // Business Categories - Plain text (max 5)
  businessCategories: [{
    category: {
      type: String,
      required: true,
    },
    subCategory: {
      type: String,
      required: true,
    },
  }],
  gstPan: {
    type: String,
  },
  address: {
    type: String,
  },
  websiteUrl: {
    type: String,
  },
  socialUrl: {
    type: String,
  },
  referredByName: {
    type: String,
  },
  referralId: {
    type: String,
  },
  referralCode: {
    type: String,
    unique: true,
    sparse: true, // Allow null for vendors without generated referral codes
  },
  membershipType: {
    type: String,
    enum: ['Silver', 'Gold', 'Diamond', 'Platinum'],
  },
  amountPaid: {
    type: Number,
  },
  paymentDetails: {
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
  passportPhoto: {
    type: String,
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
  isRejected: {
    type: Boolean,
    default: false,
  },
  rejectionReason: {
    type: String,
  },
  isActive: {
    type: Boolean,
    default: true,
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
