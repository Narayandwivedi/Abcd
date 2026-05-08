const mongoose = require("mongoose");

const offerSchema = new mongoose.Schema({
  vendorId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Vendor',
    required: true,
  },
  categoryId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Category',
    required: true,
  },
  title: {
    type: String,
    required: true,
    trim: true,
  },
  description: {
    type: String,
    required: true,
    trim: true,
  },
  discountPercentage: {
    type: Number,
    required: true,
    min: 0,
    max: 100,
  },
  offerImage: {
    type: String,
  },
  isActive: {
    type: Boolean,
    default: true,
  },
  displayOrder: {
    type: Number,
    default: 0,
  },
  startDate: {
    type: Date,
    default: Date.now,
  },
  expiryDate: {
    type: Date,
  },
}, { timestamps: true });

// Indexes for performance
offerSchema.index({ vendorId: 1 });
offerSchema.index({ categoryId: 1 });
offerSchema.index({ isActive: 1 });

const Offer = mongoose.model("Offer", offerSchema);

module.exports = Offer;
