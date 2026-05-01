require('dotenv').config({ path: require('path').join(__dirname, '../.env') });

const mongoose = require('mongoose');
const Vendor = require('../models/Vendor');
const Category = require('../models/Category');

const MONGO_URL = process.env.MONGO_URL || 'mongodb://127.0.0.1:27017/abcd';

const fixVendorCategoryIds = async () => {
  try {
    await mongoose.connect(MONGO_URL);
    console.log(`Connected to MongoDB: ${MONGO_URL}`);

    // Load all categories into a name->id map for fast lookup
    const allCategories = await Category.find({}).select('_id name');
    const categoryMap = {};
    for (const cat of allCategories) {
      categoryMap[cat.name.toLowerCase().trim()] = cat._id;
    }
    console.log(`Loaded ${allCategories.length} categories`);

    // Fetch ALL vendors - we'll filter in JS to avoid ObjectId cast errors
    const vendors = await Vendor.find({});
    // Filter to only those that have at least one category missing a valid categoryId
    const vendorsNeedingFix = vendors.filter(v =>
      v.businessCategories && v.businessCategories.some(item => !item.categoryId)
    );

    console.log(`Found ${vendors.length} vendors with missing categoryIds...`);

    let fixedCount = 0;
    let skippedCount = 0;

    for (const vendor of vendors) {
      let changed = false;

      vendor.businessCategories = vendor.businessCategories.map(item => {
        if (!item.categoryId || item.categoryId === '') {
          const catId = categoryMap[item.category?.toLowerCase().trim()];
          if (catId) {
            changed = true;
            return { ...item.toObject(), categoryId: catId };
          }
        }
        return item;
      });

      if (changed) {
        await vendor.save();
        console.log(`  ✔ Fixed: ${vendor.businessName} - linked category IDs`);
        fixedCount++;
      } else {
        console.log(`  ✗ Skipped: ${vendor.businessName} - no matching category found`);
        skippedCount++;
      }
    }

    console.log('\n--- Summary ---');
    console.log(`Total vendors checked: ${vendors.length}`);
    console.log(`Fixed:                 ${fixedCount}`);
    console.log(`Skipped (no match):    ${skippedCount}`);

    await mongoose.disconnect();
    console.log('\nDisconnected from MongoDB');
  } catch (error) {
    console.error('Error:', error);
    process.exit(1);
  }
};

fixVendorCategoryIds();
