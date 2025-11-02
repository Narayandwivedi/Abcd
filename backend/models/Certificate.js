const mongoose = require("mongoose");

const certificateSchema = new mongoose.Schema({
  certificateNumber: {
    type: String,
    required: true,
    unique: true,
  },
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    index: true, // Index for faster queries
  },
  downloadLink: {
    type: String,
    required: true,
  },
  issueDate: {
    type: Date,
    required: true,
  },
  expiryDate: {
    type: Date,
    required: true,
  },
  renewalCount: {
    type: Number,
    default: 0, // 0=original, 1=first renewal, 2=second renewal, etc.
  },
  pdfDeleted: {
    type: Boolean,
    default: false, // Track if PDF file has been deleted (for old/renewed certificates)
  },
}, { timestamps: true });



const Certificate = mongoose.model("Certificate", certificateSchema);
module.exports = Certificate;
