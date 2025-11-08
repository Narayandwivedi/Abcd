const mongoose = require("mongoose");

const sellLeadSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: false,
  },
  vendorName: {
    type: String,
    required: true,
  },
  vendorLocation: {
    type: String,
    required: true,
  },
  productServiceOffered: {
    type: String,
    required: true,
  },
  brand: {
    type: String,
    required: true,
  },
  modelDetail: {
    type: String,
    required: false,
  },
  mrpListPrice: {
    type: String,
    required: true,
  },
  specialOfferPrice: {
    type: String,
    required: true,
  },
  stockQtyAvailable: {
    type: String,
    required: true,
  },
  validity: {
    type: String,
    required: true,
  },
  mobileNo: {
    type: String,
    required: true,
  },
  status: {
    type: String,
    enum: ['pending', 'approved', 'rejected'],
    default: 'pending',
  },
  rejectionReason: {
    type: String,
  },
  approvedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Admin',
  },
  approvedAt: {
    type: Date,
  },
}, {
  timestamps: true,
});

// Index for faster queries
sellLeadSchema.index({ status: 1, createdAt: -1 });
sellLeadSchema.index({ userId: 1 });

const SellLead = mongoose.model("SellLead", sellLeadSchema);

module.exports = SellLead;
