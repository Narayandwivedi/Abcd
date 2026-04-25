const mongoose = require("mongoose");

const vendorApplicationSchema = new mongoose.Schema({
  applicationNumber: { type: String, unique: true },
  ownerName: { type: String, required: true, trim: true },
  whatsappNumber: { type: String, required: true, trim: true },
  businessName: { type: String, required: true, trim: true },
  city: { type: String, required: true, trim: true },
  referralCode: { type: String, trim: true },
  membershipType: { type: String, enum: ['Gold', 'Diamond', 'Platinum'] },
  membershipAmount: { type: Number },
  utrNumber: { type: String, trim: true },
  paymentScreenshot: { type: String },
  status: {
    type: String,
    enum: ['pending', 'contacted', 'approved', 'rejected'],
    default: 'pending',
  }
}, { timestamps: true });

const VendorApplication = mongoose.model("VendorApplication", vendorApplicationSchema);
module.exports = VendorApplication;
