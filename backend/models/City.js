const mongoose = require("mongoose");

const citySchema = new mongoose.Schema({
  state: {
    type: String,
    required: true,
    trim: true,
  },
  district: {
    type: String,
    required: true,
    trim: true,
  },
  city: {
    type: String,
    required: true,
    trim: true,
  },
  isActive: {
    type: Boolean,
    default: true,
  },
}, { timestamps: true });

// Create compound index for better query performance and ensure uniqueness
citySchema.index({ state: 1, district: 1, city: 1 }, { unique: true });

// Create index for alphabetical sorting
citySchema.index({ city: 1 });
citySchema.index({ state: 1 });

const City = mongoose.model("City", citySchema);
module.exports = City;
