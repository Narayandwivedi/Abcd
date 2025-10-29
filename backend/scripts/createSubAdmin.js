/**
 * Script to create a sub-admin account
 * Usage: node scripts/createSubAdmin.js
 */

require('dotenv').config();
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const readline = require('readline');
const SubAdmin = require('../models/SubAdmin');
const Admin = require('../models/Admin');

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

const question = (query) => new Promise((resolve) => rl.question(query, resolve));

async function createSubAdmin() {
  try {
    // Connect to MongoDB
    console.log('Connecting to MongoDB...');
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('Connected to MongoDB\n');

    // Get admin ID (the creator)
    const admin = await Admin.findOne({});
    if (!admin) {
      console.log('❌ No admin found in database. Please create an admin first.');
      process.exit(1);
    }

    console.log('=== Create New Sub-Admin ===\n');

    // Get sub-admin details
    const fullName = await question('Full Name: ');
    const email = await question('Email: ');
    const mobile = await question('Mobile Number: ');
    const password = await question('Password (min 6 chars): ');

    // Validate inputs
    if (!fullName || !email || !mobile || !password) {
      console.log('\n❌ All fields are required!');
      process.exit(1);
    }

    if (password.length < 6) {
      console.log('\n❌ Password must be at least 6 characters!');
      process.exit(1);
    }

    // Check if email or mobile already exists
    const existing = await SubAdmin.findOne({
      $or: [{ email }, { mobile }]
    });

    if (existing) {
      console.log('\n❌ Email or mobile number already registered!');
      process.exit(1);
    }

    console.log('\n=== Select Permissions ===');
    console.log('1. Full Access (all permissions)');
    console.log('2. User Manager (user management only)');
    console.log('3. Vendor Manager (vendor management only)');
    console.log('4. Custom Permissions');

    const permChoice = await question('\nSelect option (1-4): ');

    let permissions = {
      canViewUsers: false,
      canEditUsers: false,
      canDeleteUsers: false,
      canApproveUsers: false,
      canViewVendors: false,
      canEditVendors: false,
      canDeleteVendors: false,
      canApproveVendors: false,
      canManageContent: false,
      canViewSettings: false,
      canEditSettings: false
    };

    switch (permChoice) {
      case '1': // Full Access
        Object.keys(permissions).forEach(key => permissions[key] = true);
        break;
      case '2': // User Manager
        permissions.canViewUsers = true;
        permissions.canEditUsers = true;
        permissions.canDeleteUsers = true;
        permissions.canApproveUsers = true;
        break;
      case '3': // Vendor Manager
        permissions.canViewVendors = true;
        permissions.canEditVendors = true;
        permissions.canDeleteVendors = true;
        permissions.canApproveVendors = true;
        break;
      case '4': // Custom
        console.log('\nSelect permissions (y/n for each):');
        permissions.canViewUsers = (await question('View Users? (y/n): ')).toLowerCase() === 'y';
        permissions.canEditUsers = (await question('Edit Users? (y/n): ')).toLowerCase() === 'y';
        permissions.canDeleteUsers = (await question('Delete Users? (y/n): ')).toLowerCase() === 'y';
        permissions.canApproveUsers = (await question('Approve Users? (y/n): ')).toLowerCase() === 'y';
        permissions.canViewVendors = (await question('View Vendors? (y/n): ')).toLowerCase() === 'y';
        permissions.canEditVendors = (await question('Edit Vendors? (y/n): ')).toLowerCase() === 'y';
        permissions.canDeleteVendors = (await question('Delete Vendors? (y/n): ')).toLowerCase() === 'y';
        permissions.canApproveVendors = (await question('Approve Vendors? (y/n): ')).toLowerCase() === 'y';
        permissions.canManageContent = (await question('Manage Content? (y/n): ')).toLowerCase() === 'y';
        permissions.canViewSettings = (await question('View Settings? (y/n): ')).toLowerCase() === 'y';
        permissions.canEditSettings = (await question('Edit Settings? (y/n): ')).toLowerCase() === 'y';
        break;
      default:
        console.log('\n❌ Invalid option!');
        process.exit(1);
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create sub-admin
    const subAdmin = new SubAdmin({
      fullName,
      email: email.toLowerCase(),
      mobile,
      password: hashedPassword,
      permissions,
      isActive: true,
      createdBy: admin._id
    });

    await subAdmin.save();

    console.log('\n✅ Sub-Admin created successfully!');
    console.log('\n=== Sub-Admin Details ===');
    console.log(`Name: ${fullName}`);
    console.log(`Email: ${email}`);
    console.log(`Mobile: ${mobile}`);
    console.log(`Status: Active`);
    console.log('\n=== Permissions ===');
    Object.entries(permissions).forEach(([key, value]) => {
      if (value) {
        console.log(`✓ ${key}`);
      }
    });

    console.log('\n🎉 Sub-Admin can now login to the SubAdmin Panel!');

  } catch (error) {
    console.error('\n❌ Error creating sub-admin:', error.message);
  } finally {
    rl.close();
    mongoose.connection.close();
    process.exit(0);
  }
}

createSubAdmin();
