const mongoose = require("mongoose");

const businessApplicationSchema = new mongoose.Schema({
  // Reference to Vendor
  vendorId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Vendor",
    required: true,
  },

  // Business Information
  businessName: {
    type: String,
    required: true,
  },
  ownerName: {
    type: String,
    required: true,
  },
  mobile: {
    type: Number,
    required: true,
  },
  gstNumber: {
    type: String,
    required: true,
  },
  businessCategory: {
    type: String,
    required: true,
  },

  // Business Address
  businessAddress: {
    street: { type: String, required: true },
    city: { type: String, required: true },
    state: { type: String, default: "Chhattisgarh" },
    pincode: { type: String, required: true },
  },

  // Payment Information
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

  // Verification Documents
  verificationDocuments: {
    gstCertificate: String,
    businessLicense: String,
    addressProof: String,
  },

  // Application Status
  applicationStatus: {
    type: String,
    enum: ["pending", "under_review", "approved", "rejected"],
    default: "pending",
  },

  // Admin Review Information
  rejectionReason: {
    type: String,
  },
  adminComments: {
    type: String,
  },
  reviewedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User", // Assuming admin is in User model
  },
  reviewedAt: {
    type: Date,
  },

  // Submission timestamp
  submittedAt: {
    type: Date,
    default: Date.now,
  },

}, { timestamps: true });

// Index for faster queries
businessApplicationSchema.index({ vendorId: 1, applicationStatus: 1 });
businessApplicationSchema.index({ applicationStatus: 1, createdAt: -1 });

const BusinessApplication = mongoose.model("BusinessApplication", businessApplicationSchema);
module.exports = BusinessApplication;
