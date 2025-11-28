const mongoose = require("mongoose");

const adSchema = new mongoose.Schema({
  vendorId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Vendor',
    default: null,
  },
  adImg: {
    type: String,
    required: true,
  },
  isApproved: {
    type: Boolean,
    default: false,
  },
  isVisible: {
    type: Boolean,
    default: true,
  },
  title: {
    type: String,
    trim: true,
  },
  description: {
    type: String,
    trim: true,
  },
  link: {
    type: String,
    trim: true,
  },
  displayOrder: {
    type: Number,
    default: 0,
  },
}, { timestamps: true });

// Index for better query performance
adSchema.index({ isApproved: 1, isVisible: 1 });
adSchema.index({ vendorId: 1 });
adSchema.index({ displayOrder: 1 });

// Static method to get all approved and visible ads
adSchema.statics.getActiveAds = function() {
  return this.find({ isApproved: true, isVisible: true })
    .populate('vendorId', 'businessName ownerName mobile')
    .sort({ displayOrder: 1, createdAt: -1 })
    .lean();
};

const Ad = mongoose.model("Ad", adSchema);

module.exports = Ad;
