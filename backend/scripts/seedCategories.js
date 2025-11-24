const mongoose = require("mongoose");
const Category = require("../models/Category");
require("dotenv").config();

// Helper function to generate slug from name
const generateSlug = (name) => {
  return name
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .replace(/^-+|-+$/g, '');
};

// Categories from frontend Home.jsx
const categories = [
  { name: 'Advocates', icon: 'Scale' },
  { name: 'Automobiles', icon: 'Car' },
  { name: 'Beauty parlour', icon: 'Scissors' },
  { name: 'Books n stationery', icon: 'BookOpen' },
  { name: 'Catering', icon: 'UtensilsCrossed' },
  { name: 'CCTV', icon: 'Camera' },
  { name: 'Chartered accountants', icon: 'Calculator' },
  { name: 'Clothing', icon: 'Shirt' },
  { name: 'Digital marketing', icon: 'Megaphone' },
  { name: 'Doctors', icon: 'Stethoscope' },
  { name: 'Education n training', icon: 'GraduationCap' },
  { name: 'Electrical', icon: 'Zap' },
  { name: 'Electronics', icon: 'Smartphone' },
  { name: 'Engineers', icon: 'HardHat' },
  { name: 'Fruits n Veg', icon: 'Apple' },
  { name: 'Furniture', icon: 'Sofa' },
  { name: 'Grocery', icon: 'ShoppingCart' },
  { name: 'Hardware', icon: 'Wrench' },
  { name: 'Home appliances', icon: 'Refrigerator' },
  { name: 'Home service', icon: 'HomeIcon' },
  { name: 'Hospital', icon: 'Building2' },
  { name: 'Hotel', icon: 'Hotel' },
  { name: 'Interior decorators', icon: 'Paintbrush' },
  { name: 'Logistics n courier', icon: 'Truck' },
  { name: 'Marble and tiles', icon: 'Grid3X3' },
  { name: 'Medicine', icon: 'Pill' },
  { name: 'Pathology', icon: 'FlaskConical' },
  { name: 'Properties', icon: 'Building' },
  { name: 'Restaurent', icon: 'UtensilsCrossed' },
  { name: 'Sports', icon: 'Trophy' },
  { name: 'Telecommunication', icon: 'Phone' },
  { name: 'Tour n Travels', icon: 'Plane' },
  { name: 'Tuition and coaching', icon: 'School' },
  { name: 'Web solutions', icon: 'Globe' }
];

const seedCategories = async () => {
  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGO_URL ||"mongodb://127.0.0.1:27017/abcd");
    console.log("MongoDB connected for seeding categories");

    // Clear existing categories (optional - comment out if you want to keep existing)
    const existingCount = await Category.countDocuments();
    console.log(`Found ${existingCount} existing categories`);

    const shouldClear = process.argv.includes('--clear');
    if (shouldClear) {
      await Category.deleteMany({});
      console.log("Cleared all existing categories");
    }

    // Insert categories
    let createdCount = 0;
    let skippedCount = 0;

    for (const category of categories) {
      const slug = generateSlug(category.name);

      // Check if category already exists
      const existingCategory = await Category.findOne({
        $or: [{ name: category.name }, { slug }]
      });

      if (existingCategory) {
        console.log(`⏭️  Skipped: ${category.name} (already exists)`);
        skippedCount++;
        continue;
      }

      // Create category
      await Category.create({
        name: category.name,
        slug,
        icon: category.icon,
        description: '',
        subcategories: [],
        isActive: true
      });

      console.log(`✅ Created: ${category.name} (${slug})`);
      createdCount++;
    }

    console.log("\n📊 Summary:");
    console.log(`   Total categories in seed data: ${categories.length}`);
    console.log(`   Created: ${createdCount}`);
    console.log(`   Skipped (already exist): ${skippedCount}`);
    console.log(`   Final count in database: ${await Category.countDocuments()}`);

    console.log("\n✨ Category seeding completed successfully!");
    process.exit(0);
  } catch (error) {
    console.error("Error seeding categories:", error);
    process.exit(1);
  }
};

seedCategories();
