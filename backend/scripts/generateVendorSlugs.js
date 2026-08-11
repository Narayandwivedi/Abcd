/**
 * One-time script: Generate slugs for all existing vendors that don't have one.
 * Run with: node backend/scripts/generateVendorSlugs.js
 */

const mongoose = require('mongoose');
const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '../.env') });

const Vendor = require('../models/Vendor');
const { generateUniqueVendorSlug } = require('../utils/slugify');

const run = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URL);
    console.log('✅ Connected to MongoDB');

    const vendors = await Vendor.find({ $or: [{ slug: null }, { slug: { $exists: false } }] }).select('_id businessName slug');
    console.log(`Found ${vendors.length} vendors without slugs`);

    let updated = 0;
    for (const vendor of vendors) {
      const slug = await generateUniqueVendorSlug(vendor.businessName, vendor._id);
      await Vendor.findByIdAndUpdate(vendor._id, { slug });
      console.log(`  ✔ ${vendor.businessName} → ${slug}`);
      updated++;
    }

    console.log(`\n✅ Done! Updated ${updated} vendors.`);
    process.exit(0);
  } catch (err) {
    console.error('❌ Error:', err);
    process.exit(1);
  }
};

run();
