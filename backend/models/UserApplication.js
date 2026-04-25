const mongoose = require("mongoose");

const userApplicationSchema = new mongoose.Schema({
  fullName: { type: String, required: true, trim: true },
  whatsappNumber: { type: String, required: true, trim: true },
  city: { type: String, required: true, trim: true },
  referralCode: { type: String, trim: true },
  utrNumber: { type: String, trim: true },
  paymentScreenshot: { type: String },
  status: {
    type: String,
    enum: ['pending', 'contacted', 'approved', 'rejected'],
    default: 'pending',
  }
}, { timestamps: true });

const UserApplication = mongoose.model("UserApplication", userApplicationSchema);
module.exports = UserApplication;
