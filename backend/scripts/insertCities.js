const mongoose = require("mongoose");
require("dotenv").config();
const City = require("../models/City");

// Import city data from all states
const biharCities = require("../data/bihar");
const jharkhandCities = require("../data/jharkhand");
const odishaCities = require("../data/odisha");
const chhattisgarhCities = require("../data/Chhatisgarh");

// Combine all cities
const allCities = [
  ...biharCities,
  ...jharkhandCities,
  ...odishaCities,
  ...chhattisgarhCities,
];

const insertCities = async () => {
  try {
    // Connect to MongoDB
    console.log("Connecting to MongoDB...");
    await mongoose.connect(process.env.MONGO_URL || 'mongodb://127.0.0.1:27017/abcd');
    console.log("Connected to MongoDB successfully!");

    // Delete all existing cities
    console.log("\nDeleting all existing cities from the database...");
    const deleteResult = await City.deleteMany({});
    console.log(`Deleted ${deleteResult.deletedCount} existing cities.`);

    // Insert new cities
    console.log("\nInserting new cities...");
    const insertResult = await City.insertMany(allCities);
    console.log(`Successfully inserted ${insertResult.length} cities!`);

    // Display summary by state
    console.log("\n=== INSERTION SUMMARY ===");
    const summary = {};

    for (const city of allCities) {
      if (!summary[city.state]) {
        summary[city.state] = {
          districts: new Set(),
          cities: 0,
        };
      }
      summary[city.state].districts.add(city.district);
      summary[city.state].cities++;
    }

    // Print summary
    Object.keys(summary).sort().forEach((state) => {
      console.log(`\n${state}:`);
      console.log(`  - Districts: ${summary[state].districts.size}`);
      console.log(`  - Cities: ${summary[state].cities}`);
    });

    console.log("\n=== TOTAL ===");
    console.log(`Total States: ${Object.keys(summary).length}`);
    console.log(`Total Cities: ${allCities.length}`);

    console.log("\n✅ City insertion completed successfully!");
    process.exit(0);
  } catch (error) {
    console.error("\n❌ Error inserting cities:", error);
    process.exit(1);
  }
};

// Run the script
insertCities();
