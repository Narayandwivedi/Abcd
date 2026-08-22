const mongoose = require("mongoose");

const agraAlankaranSchema = new mongoose.Schema({
  applicationNo: {
    type: String,
    unique: true,
    required: true,
  },
  awardCategory: {
    type: String,
    required: true,
    trim: true,
  },
  applicantName: {
    type: String,
    required: true,
    trim: true,
  },
  dob: {
    type: String,
    required: true,
    trim: true,
  },
  age: {
    type: String,
    trim: true,
    default: "",
  },
  fatherHusbandName: {
    type: String,
    required: true,
    trim: true,
  },
  fullAddress: {
    type: String,
    required: true,
    trim: true,
  },
  mobileNo: {
    type: String,
    required: true,
    trim: true,
  },
  email: {
    type: String,
    trim: true,
    default: "",
  },
  achievementDesc: {
    type: String,
    required: true,
    trim: true,
  },
  photo: {
    type: String, // Relative path to passport photo
    required: false,
  },
  document: {
    type: String, // Relative path to supporting document/certificate (backward compatibility)
    required: false,
  },
  documents: {
    type: [String], // Relative paths to supporting documents/certificates (multiple allowed)
    required: false,
  },
  date: {
    type: String,
    trim: true,
  },
  place: {
    type: String,
    trim: true,
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
agraAlankaranSchema.index({ applicationNo: 1 });
agraAlankaranSchema.index({ status: 1 });
agraAlankaranSchema.index({ mobileNo: 1 });

const AgraAlankaran = mongoose.model("AgraAlankaran", agraAlankaranSchema);

module.exports = AgraAlankaran;
