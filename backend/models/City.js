const mongoose = require("mongoose");

const citySchema = new mongoose.Schema({
  state: {
    type: String,
    required: true,
    trim: true,
    lowercase: true,
  },
  district: {
    type: String,
    required: true,
    trim: true,
    lowercase: true,
  },
  city: {
    type: String,
    required: true,
    trim: true,
    lowercase: true,
  },
  isActive: {
    type: Boolean,
    default: true,
  },
}, { timestamps: true });

// Pre-save middleware to ensure lowercase (extra safety layer)
citySchema.pre('save', function(next) {
  if (this.state) this.state = this.state.toLowerCase();
  if (this.district) this.district = this.district.toLowerCase();
  if (this.city) this.city = this.city.toLowerCase();
  next();
});

// Create compound index for better query performance and ensure uniqueness
citySchema.index({ state: 1, district: 1, city: 1 }, { unique: true });

// Create index for alphabetical sorting
citySchema.index({ city: 1 });
citySchema.index({ state: 1 });

const City = mongoose.model("City", citySchema);
module.exports = City;
