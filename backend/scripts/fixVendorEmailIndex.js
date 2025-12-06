require('dotenv').config();
const mongoose = require('mongoose');

async function fixVendorEmailIndex() {
  try {
    console.log('\n=== Fix Vendor Email Index Script ===\n');
    console.log('This script will fix the duplicate null email error by recreating the email index as sparse.\n');

    console.log('Connecting to database...');

    // Connect to MongoDB
    await mongoose.connect('mongodb://127.0.0.1:27017/abcd');

    console.log('Database connected successfully!\n');

    const db = mongoose.connection.db;
    const vendorsCollection = db.collection('vendors');

    // Get existing indexes
    console.log('Checking existing indexes...');
    const indexes = await vendorsCollection.indexes();
    const emailIndexExists = indexes.some(idx => idx.key.email);

    if (emailIndexExists) {
      console.log('Found email index. Dropping it...');
      try {
        await vendorsCollection.dropIndex('email_1');
        console.log('✅ Old email index dropped successfully!');
      } catch (err) {
        if (err.codeName === 'IndexNotFound') {
          console.log('Index already dropped or does not exist.');
        } else {
          throw err;
        }
      }
    } else {
      console.log('No email index found to drop.');
    }

    // Create new sparse unique index
    console.log('\nCreating new sparse unique index on email field...');
    await vendorsCollection.createIndex(
      { email: 1 },
      {
        unique: true,
        sparse: true,
        name: 'email_1'
      }
    );
    console.log('✅ New sparse unique index created successfully!');

    // Count vendors with null email
    const nullEmailCount = await vendorsCollection.countDocuments({ email: null });
    const emptyEmailCount = await vendorsCollection.countDocuments({ email: { $exists: false } });
    const totalVendors = await vendorsCollection.countDocuments({});

    console.log('\n📊 Vendor Statistics:');
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log(`Total Vendors:           ${totalVendors}`);
    console.log(`Vendors with null email: ${nullEmailCount}`);
    console.log(`Vendors without email:   ${emptyEmailCount}`);
    console.log(`Vendors with email:      ${totalVendors - nullEmailCount - emptyEmailCount}`);
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');

    console.log('✅ Email index fixed successfully!');
    console.log('You can now create vendors without email addresses without any errors.\n');

    await mongoose.disconnect();
    process.exit(0);
  } catch (error) {
    console.error('\n❌ Error fixing email index:', error.message);
    console.error('Full error:', error);
    process.exit(1);
  }
}

// Run the script
fixVendorEmailIndex();
