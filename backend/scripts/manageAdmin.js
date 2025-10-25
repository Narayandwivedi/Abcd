require('dotenv').config();
const readline = require('readline');
const bcrypt = require('bcryptjs');
const Admin = require('../models/Admin');

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

function question(query) {
  return new Promise(resolve => {
    rl.question(query, resolve);
  });
}

async function listAdmins() {
  const admins = await Admin.find().select('-password');

  if (admins.length === 0) {
    console.log('\n📭 No admins found in database.\n');
    return;
  }

  console.log('\n📋 Current Admins:\n');
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
  admins.forEach((admin, index) => {
    console.log(`${index + 1}. ${admin.fullName}`);
    console.log(`   Email: ${admin.email}`);
    console.log(`   Mobile: ${admin.mobile}`);
    console.log(`   Status: ${admin.isActive ? '✅ Active' : '❌ Inactive'}`);
    console.log(`   Last Login: ${admin.lastLogin ? admin.lastLogin.toLocaleString() : 'Never'}`);
    console.log(`   Created: ${admin.createdAt.toLocaleString()}`);
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
  });
  console.log(`\nTotal Admins: ${admins.length}\n`);
}

async function createAdmin() {
  console.log('\n=== Create New Admin ===\n');

  const fullName = await question('Enter admin full name: ');
  const email = await question('Enter admin email: ');
  const password = await question('Enter admin password (min 6 characters): ');
  const mobile = await question('Enter admin mobile number: ');

  // Validate input
  if (!fullName || !email || !password || !mobile) {
    console.error('\n❌ Error: All fields are required!');
    return;
  }

  if (password.length < 6) {
    console.error('\n❌ Error: Password must be at least 6 characters!');
    return;
  }

  // Email validation
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    console.error('\n❌ Error: Invalid email format!');
    return;
  }

  // Check if admin email already exists
  const existingAdmin = await Admin.findOne({ email: email.toLowerCase() });
  if (existingAdmin) {
    console.error(`\n❌ Error: Admin with email ${email} already exists!`);
    return;
  }

  // Check if admin mobile already exists
  const existingMobile = await Admin.findOne({ mobile });
  if (existingMobile) {
    console.error(`\n❌ Error: Admin with mobile ${mobile} already exists!`);
    return;
  }

  // Hash password
  const hashedPassword = await bcrypt.hash(password, 10);

  // Create admin user
  const admin = await Admin.create({
    fullName,
    email: email.toLowerCase(),
    password: hashedPassword,
    mobile,
    isActive: true
  });

  console.log('\n✅ Admin created successfully!');
  console.log(`   Name: ${admin.fullName}`);
  console.log(`   Email: ${admin.email}`);
  console.log(`   Mobile: ${admin.mobile}\n`);
}

async function deactivateAdmin() {
  await listAdmins();

  const email = await question('Enter email of admin to deactivate: ');

  const admin = await Admin.findOne({ email: email.toLowerCase() });

  if (!admin) {
    console.error(`\n❌ Error: Admin with email ${email} not found!`);
    return;
  }

  if (!admin.isActive) {
    console.log(`\n⚠️  Admin ${email} is already inactive.`);
    return;
  }

  const confirm = await question(`Are you sure you want to deactivate ${admin.fullName}? (yes/no): `);

  if (confirm.toLowerCase() !== 'yes') {
    console.log('\n❌ Deactivation cancelled.');
    return;
  }

  admin.isActive = false;
  await admin.save();

  console.log(`\n✅ Admin ${admin.fullName} has been deactivated.`);
}

async function activateAdmin() {
  const admins = await Admin.find({ isActive: false });

  if (admins.length === 0) {
    console.log('\n📭 No inactive admins found.\n');
    return;
  }

  console.log('\n📋 Inactive Admins:\n');
  admins.forEach((admin, index) => {
    console.log(`${index + 1}. ${admin.fullName} (${admin.email})`);
  });

  const email = await question('\nEnter email of admin to activate: ');

  const admin = await Admin.findOne({ email: email.toLowerCase() });

  if (!admin) {
    console.error(`\n❌ Error: Admin with email ${email} not found!`);
    return;
  }

  if (admin.isActive) {
    console.log(`\n⚠️  Admin ${email} is already active.`);
    return;
  }

  admin.isActive = true;
  await admin.save();

  console.log(`\n✅ Admin ${admin.fullName} has been activated.`);
}

async function resetPassword() {
  await listAdmins();

  const email = await question('Enter email of admin to reset password: ');

  const admin = await Admin.findOne({ email: email.toLowerCase() });

  if (!admin) {
    console.error(`\n❌ Error: Admin with email ${email} not found!`);
    return;
  }

  const newPassword = await question('Enter new password (min 6 characters): ');

  if (newPassword.length < 6) {
    console.error('\n❌ Error: Password must be at least 6 characters!');
    return;
  }

  const confirm = await question(`Reset password for ${admin.fullName}? (yes/no): `);

  if (confirm.toLowerCase() !== 'yes') {
    console.log('\n❌ Password reset cancelled.');
    return;
  }

  // Hash new password
  const hashedPassword = await bcrypt.hash(newPassword, 10);
  admin.password = hashedPassword;
  await admin.save();

  console.log(`\n✅ Password reset successfully for ${admin.fullName}.`);
}

async function deleteAdmin() {
  await listAdmins();

  const adminCount = await Admin.countDocuments();

  if (adminCount === 1) {
    console.error('\n❌ Error: Cannot delete the last admin! Create another admin first.\n');
    return;
  }

  const email = await question('Enter email of admin to DELETE: ');

  const admin = await Admin.findOne({ email: email.toLowerCase() });

  if (!admin) {
    console.error(`\n❌ Error: Admin with email ${email} not found!`);
    return;
  }

  console.log('\n⚠️  WARNING: This action cannot be undone!');
  const confirm = await question(`Type the admin's full name "${admin.fullName}" to confirm deletion: `);

  if (confirm !== admin.fullName) {
    console.log('\n❌ Name mismatch. Deletion cancelled.');
    return;
  }

  await Admin.deleteOne({ email: email.toLowerCase() });

  console.log(`\n✅ Admin ${admin.fullName} has been permanently deleted.`);
}

async function showMenu() {
  console.log('\n=== ABCD Admin Management Utility ===\n');
  console.log('1. List all admins');
  console.log('2. Create new admin');
  console.log('3. Deactivate admin');
  console.log('4. Activate admin');
  console.log('5. Reset admin password');
  console.log('6. Delete admin (permanent)');
  console.log('7. Exit\n');

  const choice = await question('Select an option (1-7): ');

  switch (choice.trim()) {
    case '1':
      await listAdmins();
      await question('\nPress Enter to continue...');
      await showMenu();
      break;
    case '2':
      await createAdmin();
      await question('\nPress Enter to continue...');
      await showMenu();
      break;
    case '3':
      await deactivateAdmin();
      await question('\nPress Enter to continue...');
      await showMenu();
      break;
    case '4':
      await activateAdmin();
      await question('\nPress Enter to continue...');
      await showMenu();
      break;
    case '5':
      await resetPassword();
      await question('\nPress Enter to continue...');
      await showMenu();
      break;
    case '6':
      await deleteAdmin();
      await question('\nPress Enter to continue...');
      await showMenu();
      break;
    case '7':
      console.log('\n👋 Goodbye!\n');
      process.exit(0);
      break;
    default:
      console.log('\n❌ Invalid option. Please select 1-7.');
      await showMenu();
  }
}

async function main() {
  try {
    console.log('\nConnecting to database...');
    const { connectToDb } = require('../utils/mongodb');
    await connectToDb();
    console.log('✅ Database connected!\n');

    await showMenu();
  } catch (error) {
    console.error('\n❌ Error:', error.message);
    process.exit(1);
  } finally {
    rl.close();
  }
}

// Run the utility
main();
