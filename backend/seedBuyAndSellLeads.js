require('dotenv').config();
const mongoose = require('mongoose');
const BuyLead = require('./models/BuyLead');
const SellLead = require('./models/SellLead');

const MONGODB_URI = process.env.MONGO_URL;

// Dummy data arrays
const cities = [
  'Naya Raipur', 'Raipur', 'Bilaspur', 'Durg', 'Bhilai',
  'Rajnandgaon', 'Korba', 'Raigarh', 'Jagdalpur', 'Ambikapur'
];

const names = [
  'Rahul Agrawal', 'Amit Mittal', 'Priya Bansal', 'Suresh Singhal',
  'Deepak Jindal', 'Anjali Goyal', 'Rajesh Agrawal', 'Pooja Mittal',
  'Vikram Bansal', 'Neha Singhal'
];

const vendorNames = [
  'Shree Traders', 'Krishna Enterprises', 'Balaji Hardware', 'Ganesh Suppliers',
  'Sai Trading Co.', 'Mahalaxmi Stores', 'Durga Steel', 'Hanuman Tools',
  'Radhe Electricals', 'Om Plumbing Works'
];

const categories = ['Hardware', 'Electrical', 'Plumbing', 'Construction', 'Tools'];

const subCategories = {
  'Hardware': ['Nails & Screws', 'Locks', 'Hinges', 'Door Fittings'],
  'Electrical': ['Wires & Cables', 'Switches', 'LED Lights', 'Circuit Breakers'],
  'Plumbing': ['Pipes', 'Taps & Faucets', 'Valves', 'Fittings'],
  'Construction': ['Cement', 'Steel Rods', 'Bricks', 'Sand'],
  'Tools': ['Power Tools', 'Hand Tools', 'Measuring Tools', 'Cutting Tools']
};

const products = [
  'High Quality Steel Pipes', 'LED Bulbs', 'Cement Bags', 'Door Locks',
  'Copper Wire', 'Water Taps', 'Power Drill', 'Circuit Breaker',
  'PVC Pipes', 'Steel Rods'
];

const brands = [
  'Tata', 'JSW', 'Philips', 'Havells', 'Anchor',
  'Bosch', 'Crompton', 'Finolex', 'Jindal', 'Supreme'
];

const models = [
  'Pro Series', 'Premium', 'Standard', 'Deluxe', 'Classic',
  'Heavy Duty', 'Commercial', 'Industrial', 'Economy', 'Professional'
];

const requirements = [
  'Need quality steel pipes for construction',
  'Looking for LED bulbs in bulk',
  'Required cement bags for building project',
  'Need door locks for residential project',
  'Copper wire needed urgently',
  'Water taps for plumbing work',
  'Power drill for construction site',
  'Circuit breakers for electrical panel',
  'PVC pipes for drainage system',
  'Steel rods for foundation work'
];

const mobileNumbers = [
  '9876543210', '9876543211', '9876543212', '9876543213', '9876543214',
  '9876543215', '9876543216', '9876543217', '9876543218', '9876543219'
];

// Generate random number between min and max
const randomNumber = (min, max) => Math.floor(Math.random() * (max - min + 1) + min);

// Get random item from array
const randomItem = (arr) => arr[Math.floor(Math.random() * arr.length)];

// Generate buy leads
const generateBuyLeads = () => {
  const buyLeads = [];

  for (let i = 0; i < 10; i++) {
    const category = randomItem(categories);
    const subCategory = randomItem(subCategories[category]);

    buyLeads.push({
      userId: null, // Guest user
      name: names[i],
      townCity: cities[i],
      mobileNo: mobileNumbers[i],
      itemRequired: requirements[i],
      majorCategory: category,
      minorCategory: subCategory,
      qualityQuantityDesc: `High quality ${subCategory.toLowerCase()}, quantity: ${randomNumber(10, 100)} units`,
      priceRange: `₹${randomNumber(10000, 100000)} - ₹${randomNumber(100000, 500000)}`,
      deliveryAddress: `${randomItem(['Plot 12', 'Site 45', 'Building A', 'Ward 8'])}, ${cities[i]}, Chhattisgarh`,
      status: 'approved',
      approvedBy: null,
      approvedAt: new Date()
    });
  }

  return buyLeads;
};

// Generate sell leads
const generateSellLeads = () => {
  const sellLeads = [];

  for (let i = 0; i < 10; i++) {
    const mrp = randomNumber(500, 5000);
    const offerPrice = Math.floor(mrp * 0.85); // 15% discount

    sellLeads.push({
      userId: null, // Guest vendor
      vendorName: vendorNames[i],
      vendorLocation: cities[i],
      productServiceOffered: products[i],
      brand: brands[i],
      modelDetail: models[i],
      mrpListPrice: mrp.toString(),
      specialOfferPrice: offerPrice.toString(),
      stockQtyAvailable: randomNumber(50, 500).toString(),
      validity: randomNumber(15, 90) + ' days',
      mobileNo: mobileNumbers[i],
      status: 'approved',
      approvedBy: null,
      approvedAt: new Date()
    });
  }

  return sellLeads;
};

// Main function to seed data
const seedData = async () => {
  try {
    // Connect to MongoDB
    console.log('Connecting to MongoDB...');
    await mongoose.connect(MONGODB_URI);
    console.log('Connected to MongoDB successfully!');

    // Generate dummy data
    const buyLeads = generateBuyLeads();
    const sellLeads = generateSellLeads();

    // Clear existing approved dummy data (optional - comment out if you want to keep existing data)
    // await BuyLead.deleteMany({ status: 'approved', userId: null });
    // await SellLead.deleteMany({ status: 'approved', userId: null });

    // Insert buy leads
    console.log('Inserting 10 buy leads...');
    const insertedBuyLeads = await BuyLead.insertMany(buyLeads);
    console.log(`✅ Successfully inserted ${insertedBuyLeads.length} buy leads`);

    // Insert sell leads
    console.log('Inserting 10 sell leads...');
    const insertedSellLeads = await SellLead.insertMany(sellLeads);
    console.log(`✅ Successfully inserted ${insertedSellLeads.length} sell leads`);

    console.log('\n🎉 Seeding completed successfully!');
    console.log(`Total Buy Leads: ${insertedBuyLeads.length}`);
    console.log(`Total Sell Leads: ${insertedSellLeads.length}`);

    // Close connection
    await mongoose.connection.close();
    console.log('\n✅ Database connection closed');
    process.exit(0);

  } catch (error) {
    console.error('❌ Error seeding data:', error);
    await mongoose.connection.close();
    process.exit(1);
  }
};

// Run the seed function
seedData();
