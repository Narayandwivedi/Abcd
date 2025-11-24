const mongoose = require("mongoose");

// Subcategory schema (embedded)
const subcategorySchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true,
  },
  slug: {
    type: String,
    required: true,
    trim: true,
  },
  isActive: {
    type: Boolean,
    default: true,
  },
}, { _id: true });

// Main Category schema
const categorySchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true,
    unique: true,
  },
  slug: {
    type: String,
    required: true,
    trim: true,
    unique: true,
    lowercase: true,
  },
  icon: {
    type: String,
    trim: true,
  },
  description: {
    type: String,
    trim: true,
  },
  subcategories: [subcategorySchema],
  isActive: {
    type: Boolean,
    default: true,
  },
}, { timestamps: true });

// Indexes for better query performance
// Note: slug and name already have indexes from unique: true
categorySchema.index({ isActive: 1 });

// Index for subcategories
categorySchema.index({ 'subcategories.slug': 1 });

// Method to add subcategory
categorySchema.methods.addSubcategory = function(subcategoryData) {
  this.subcategories.push(subcategoryData);
  return this.save();
};

// Method to remove subcategory
categorySchema.methods.removeSubcategory = function(subcategoryId) {
  this.subcategories.id(subcategoryId).remove();
  return this.save();
};

// Method to update subcategory
categorySchema.methods.updateSubcategory = function(subcategoryId, updateData) {
  const subcategory = this.subcategories.id(subcategoryId);
  if (subcategory) {
    Object.assign(subcategory, updateData);
  }
  return this.save();
};

// Static method to get all active categories with active subcategories (alphabetically sorted)
categorySchema.statics.getActiveCategories = function() {
  return this.find({ isActive: true })
    .sort({ name: 1 })
    .lean();
};

// Static method to get category by slug with subcategories
categorySchema.statics.findBySlug = function(slug) {
  return this.findOne({ slug, isActive: true }).lean();
};

const Category = mongoose.model("Category", categorySchema);

module.exports = Category;
