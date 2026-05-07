const Vendor = require('../models/Vendor');

/**
 * Creates a URL-friendly slug from a string.
 */
const generateSlug = (text) => {
  if (!text) return '';
  return text.toString().toLowerCase()
    .replace(/\s+/g, '-')           // Replace spaces with -
    .replace(/[^\w\-]+/g, '')       // Remove all non-word chars
    .replace(/\-\-+/g, '-')         // Replace multiple - with single -
    .replace(/^-+/, '')             // Trim - from start of text
    .replace(/-+$/, '');            // Trim - from end of text
};

/**
 * Generates a unique slug for a vendor by checking the database.
 * If the slug exists, it appends a number (e.g., my-business-1).
 */
const generateUniqueVendorSlug = async (businessName, excludeVendorId = null) => {
  const baseSlug = generateSlug(businessName);
  let slug = baseSlug;
  let counter = 1;
  let isUnique = false;

  while (!isUnique) {
    const query = { slug };
    if (excludeVendorId) {
      query._id = { $ne: excludeVendorId };
    }
    
    const existingVendor = await Vendor.findOne(query).select('_id');
    
    if (!existingVendor) {
      isUnique = true;
    } else {
      slug = `${baseSlug}-${counter}`;
      counter++;
    }
  }

  return slug;
};

module.exports = {
  generateSlug,
  generateUniqueVendorSlug
};
