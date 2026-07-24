const mongoose = require('mongoose');

const leaderSchema = new mongoose.Schema(
  {
    designation: { type: String, trim: true },
    name: { type: String, trim: true },
    mobile: { type: String, trim: true },
  },
  { _id: false }
);

const samajSchema = new mongoose.Schema(
  {
    samajName: { type: String, required: [true, 'Samaj name is required'], trim: true },
    officeAddress: { type: String, trim: true },
    mobile: { type: String, trim: true },
    email: { type: String, trim: true, lowercase: true },
    leaders: { type: [leaderSchema], default: [] },
    city: { type: String, trim: true },
    district: { type: String, trim: true },
    state: { type: String, trim: true },
    pincode: { type: String, trim: true },
    remarks: { type: String, trim: true },
    isActive: { type: Boolean, default: true },
    submittedBy: { type: String, trim: true },
    submittedByMobile: { type: String, trim: true },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Samaj', samajSchema);
