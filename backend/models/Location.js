const mongoose = require('mongoose');

const locationSchema = new mongoose.Schema(
  {
    village: { type: String, required: [true, 'Village is required'], trim: true },
    tehsil: { type: String, trim: true },
    city: { type: String, required: [true, 'City is required'], trim: true },
    district: { type: String, trim: true },
    state: { type: String, trim: true },
    pincode: { type: String, trim: true },
    isActive: { type: Boolean, default: true },
    submittedBy: { type: String, trim: true },
    submittedByMobile: { type: String, trim: true },
    verificationStatus: { type: String, enum: ['pending', 'approved', 'rejected'], default: 'pending' },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Location', locationSchema);
