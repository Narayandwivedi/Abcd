const mongoose = require('mongoose');
require('dotenv').config();
const Vendor = require('../models/Vendor');
const Category = require('../models/Category');

async function migrate() {
  try {
    console.log('🚀 Starting Category ID Migration...');

    // Connect to database
    await mongoose.connect('mongodb://127.0.0.1:27017/abcd');
    console.log('✅ Connected to MongoDB');

    const vendors = await Vendor.find({});
    console.log(`📦 Found ${vendors.length} vendors to process`);

    const categories = await Category.find({});
    console.log(`📂 Loaded ${categories.length} categories for matching`);

    let updatedCount = 0;

    for (const vendor of vendors) {
      let isChanged = false;

      for (const busCat of vendor.businessCategories) {
        // Find matching category by name (case-insensitive)
        const matchedCategory = categories.find(
          c => c.name.toLowerCase() === busCat.category.toLowerCase()
        );

        if (matchedCategory) {
          busCat.categoryId = matchedCategory._id;

          // Find matching subcategory
          const matchedSub = matchedCategory.subcategories.find(
            s => s.name.toLowerCase() === busCat.subCategory.toLowerCase()
          );

          if (matchedSub) {
            busCat.subcategoryId = matchedSub._id;
          }
          isChanged = true;
        }
      }

      if (isChanged) {
        await vendor.save();
        updatedCount++;
        if (updatedCount % 10 === 0) {
          console.log(`⏳ Processed ${updatedCount} vendors...`);
        }
      }
    }

    console.log(`\n✨ Migration complete!`);
    console.log(`✅ Updated ${updatedCount} vendors with category IDs.`);

    process.exit(0);
  } catch (error) {
    console.error('❌ Migration failed:', error);
    process.exit(1);
  }
}

migrate();
