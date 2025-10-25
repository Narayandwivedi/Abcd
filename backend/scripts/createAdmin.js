require('dotenv').config();
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const readline = require('readline');

// Import User model
const userModel = require('../models/User');

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

function question(query) {
  return new Promise(resolve => {
    rl.question(query, resolve);
  });
}

async function createAdmin() {
  try {
    console.log('\n=== ABCD Admin User Creation Script ===\n');

    // Get admin details from user input
    const fullName = await question('Enter admin full name: ');
    const email = await question('Enter admin email: ');
    const password = await question('Enter admin password (min 6 characters): ');
    const mobile = await question('Enter admin mobile number: ');

    // Validate input
    if (!fullName || !email || !password || !mobile) {
      console.error('\nError: All fields are required!');
      process.exit(1);
    }

    if (password.length < 6) {
      console.error('\nError: Password must be at least 6 characters!');
      process.exit(1);
    }

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      console.error('\nError: Invalid email format!');
      process.exit(1);
    }

    console.log('\nConnecting to database...');

    // Connect to MongoDB
    const { connectToDb } = require('../utils/mongodb');
    await connectToDb();

    console.log('Database connected successfully!');

    // Check if admin email already exists
    const existingUser = await userModel.findOne({ email });
    if (existingUser) {
      console.error(`\nError: User with email ${email} already exists!`);
      process.exit(1);
    }

    console.log('\nHashing password...');

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    console.log('Creating admin user...');

    // Create admin user
    const admin = await userModel.create({
      fullName,
      email,
      password: hashedPassword,
      role: 'admin',
      mobile,
      isVerified: true,
      paymentVerified: true
    });

    console.log('\n✅ Admin user created successfully!');
    console.log('\nAdmin Details:');
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log(`Name:     ${admin.fullName}`);
    console.log(`Email:    ${admin.email}`);
    console.log(`Mobile:   ${admin.mobile}`);
    console.log(`Role:     ${admin.role}`);
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');
    console.log('You can now login to the admin panel with these credentials.\n');

    process.exit(0);
  } catch (error) {
    console.error('\n❌ Error creating admin:', error.message);
    process.exit(1);
  } finally {
    rl.close();
  }
}

// Run the script
createAdmin();
