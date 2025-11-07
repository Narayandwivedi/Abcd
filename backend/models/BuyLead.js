const mongoose = require("mongoose");

const buyLeadSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  name: {
    type: String,
    required: true,
  },
  mobileNo: {
    type: String,
    required: true,
  },
  townCity: {
    type: String,
    required: true,
  },
  itemRequired: {
    type: String,
    required: true,
  },
  majorCategory: {
    type: String,
    required: true,
  },
  minorCategory: {
    type: String,
    required: true,
  },
  qualityQuantityDesc: {
    type: String,
    required: true,
  },
  priceRange: {
    type: String,
    required: true,
  },
  deliveryAddress: {
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
buyLeadSchema.index({ status: 1, createdAt: -1 });
buyLeadSchema.index({ userId: 1 });

const BuyLead = mongoose.model("BuyLead", buyLeadSchema);

module.exports = BuyLead;
