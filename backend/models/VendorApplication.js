const mongoose = require("mongoose");

const vendorApplicationSchema = new mongoose.Schema({
  ownerName: {
    type: String,
    required: true,
    trim: true,
  },
  whatsappNumber: {
    type: String,
    required: true,
    trim: true,
  },
  businessName: {
    type: String,
    required: true,
    trim: true,
  },
  city: {
    type: String,
    required: true,
    trim: true,
  },
  referralCode: {
    type: String,
    trim: true,
  },
  paymentInformation: {
    type: String,
    trim: true,
  },
  status: {
    type: String,
    enum: ['pending', 'contacted', 'approved', 'rejected'],
    default: 'pending',
  }
}, { timestamps: true });

const VendorApplication = mongoose.model("VendorApplication", vendorApplicationSchema);
module.exports = VendorApplication;
