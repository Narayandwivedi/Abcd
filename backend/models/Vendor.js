const mongoose = require("mongoose");

const vendorSchema = new mongoose.Schema({
  businessName: {
    type: String,
    required: false,
  },
  ownerName: {
    type: String,
    required: false,
  },
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
  gstNumber: {
    type: String,
    unique: true,
    sparse: true, // Allow null/undefined values for unique index
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
  businessCategory: {
    type: String,
  },
  businessAddress: {
    street: String,
    city: String,
    state: String,
    pincode: String,
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
  verificationStatus: {
    type: String,
    enum: ["pending", "approved", "rejected"],
    default: "pending",
  },
  verificationDocuments: {
    gstCertificate: String,
    businessLicense: String,
    addressProof: String,
  },
  role: {
    type: String,
    default: "vendor",
  },
  isBusinessFormCompleted: {
    type: Boolean,
    default: false,
  },

}, { timestamps: true });

const Vendor = mongoose.model("Vendor", vendorSchema);
module.exports = Vendor;
