require('dotenv').config({ path: require('path').join(__dirname, '../.env') });

const mongoose = require('mongoose');

const Vendor = require('../models/Vendor');
const VendorApplication = require('../models/VendorApplication');

const MONGO_URL = process.env.MONGO_URL || 'mongodb://127.0.0.1:27017/abcd';

const syncApplicationStatuses = async () => {
  try {
    await mongoose.connect(MONGO_URL);
    console.log(`Connected to MongoDB: ${MONGO_URL}`);

    // Get all pending applications
    const pendingApplications = await VendorApplication.find({ 
      status: { $in: ['pending', null, undefined] }
    });

    console.log(`Found ${pendingApplications.length} non-approved applications to check...`);

    let approvedCount = 0;
    let noMatchCount = 0;

    for (const app of pendingApplications) {
      const mobile = Number(app.whatsappNumber);
      if (!mobile) {
        console.log(`  Skipping ${app.applicationNumber} - no mobile number`);
        noMatchCount++;
        continue;
      }

      // Find a vendor with the same mobile number
      const vendor = await Vendor.findOne({ mobile });

      if (vendor) {
        // Link applicationNumber to vendor if not already linked
        if (!vendor.applicationNumber && app.applicationNumber) {
          vendor.applicationNumber = app.applicationNumber;
          await vendor.save();
          console.log(`  Linked vendor "${vendor.businessName}" to application ${app.applicationNumber}`);
        }

        // Mark application as approved
        app.status = 'approved';
        await app.save();
        console.log(`  ✔ Approved: ${app.applicationNumber} (${app.businessName}) - matched vendor mobile ${mobile}`);
        approvedCount++;
      } else {
        console.log(`  ✗ No match: ${app.applicationNumber} (${app.businessName}) - mobile ${mobile} has no vendor`);
        noMatchCount++;
      }
    }

    console.log('\n--- Summary ---');
    console.log(`Total checked: ${pendingApplications.length}`);
    console.log(`Approved:      ${approvedCount}`);
    console.log(`No match:      ${noMatchCount}`);

    await mongoose.disconnect();
    console.log('\nDisconnected from MongoDB');
  } catch (error) {
    console.error('Error:', error);
    process.exit(1);
  }
};

syncApplicationStatuses();
