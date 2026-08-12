const mongoose = require("mongoose");

const agraMahakumbh2026Schema = new mongoose.Schema({
  registrationNo: {
    type: String,
    unique: true,
    required: true,
  },
  fullName: {
    type: String,
    required: true,
    trim: true,
  },
  gender: {
    type: String,
    required: true,
    trim: true,
  },
  mobileNo: {
    type: String,
    required: true,
    trim: true,
  },
  fatherName: {
    type: String,
    trim: true,
  },
  address: {
    type: String,
    trim: true,
  },
  registrationType: {
    type: String,
    required: true,
    trim: true,
  },
  registrationFee: {
    type: String,
    required: true,
    trim: true,
  },
  photo: {
    type: String,
    required: false,
  },
  paymentScreenshot: {
    type: String,
    required: false,
  },
  status: {
    type: String,
    enum: ["pending", "approved", "rejected"],
    default: "pending",
  },
  rejectionReason: {
    type: String,
  },
}, {
  timestamps: true,
});

// Indexes for query optimization
agraMahakumbh2026Schema.index({ registrationNo: 1 });
agraMahakumbh2026Schema.index({ status: 1 });
agraMahakumbh2026Schema.index({ mobileNo: 1 });

const AgraMahakumbh2026 = mongoose.model("AgraMahakumbh2026", agraMahakumbh2026Schema);

module.exports = AgraMahakumbh2026;