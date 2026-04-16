const mongoose = require('mongoose');
const fs = require('fs');
const path = require('path');
require('dotenv').config();

const Certificate = require('../models/Certificate');
const User = require('../models/User');

const MONGO_URI = process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/abcd';
const CERTIFICATES_DIR = path.join(__dirname, '..', 'uploads', 'certificates');

async function fixCertificates() {
  try {
    console.log('🚀 Starting Certificate Migration...');
    console.log(`📂 Certificates directory: ${CERTIFICATES_DIR}`);

    // Connect to database
    await mongoose.connect(MONGO_URI);
    console.log('✅ Connected to MongoDB');

    const certificates = await Certificate.find({});
    console.log(`📦 Found ${certificates.length} certificates to process`);

    let updatedCount = 0;
    let skipCount = 0;
    let errorCount = 0;

    for (const cert of certificates) {
      try {
        const oldNumber = cert.certificateNumber;

        // Skip if already in new format (roughly CG + 5-6 digits)
        if (oldNumber.startsWith('CG') && !oldNumber.includes('-')) {
          console.log(`⏭️ Skipping ${oldNumber} - Already in new format`);
          skipCount++;
          continue;
        }

        // Extract sequence number
        // Format was: YM-CG-YYYY-MM-XXXXXX
        const match = oldNumber.match(/(\d+)$/);
        if (!match) {
          console.error(`❌ Could not extract number from ${oldNumber}`);
          errorCount++;
          continue;
        }

        const sequenceNum = parseInt(match[1]);
        let newNumber;
        if (sequenceNum <= 9) {
          newNumber = `CG${String(sequenceNum).padStart(5, '0')}`;
        } else {
          newNumber = `CG${String(sequenceNum).padStart(6, '0')}`;
        }

        console.log(`🔄 Migrating ${oldNumber} -> ${newNumber}`);

        // Handle physical file rename
        const oldFileName = `ABCD_MEMBER_CERTIFICATE_${oldNumber}.pdf`;
        const newFileName = `ABCD_MEMBER_CERTIFICATE_${newNumber}.pdf`;
        const oldPath = path.join(CERTIFICATES_DIR, oldFileName);
        const newPath = path.join(CERTIFICATES_DIR, newFileName);

        if (fs.existsSync(oldPath)) {
          fs.renameSync(oldPath, newPath);
          console.log(`   ✅ Renamed file: ${oldFileName} -> ${newFileName}`);
        } else {
          console.warn(`   ⚠️ File not found: ${oldFileName}`);
        }

        // Update Certificate document
        cert.certificateNumber = newNumber;
        cert.downloadLink = `/uploads/certificates/${newFileName}`;
        await cert.save();

        // Update User document (referralCode and activeCertificate info)
        const user = await User.findById(cert.userId);
        if (user) {
          user.referralCode = newNumber;
          // Note: activeCertificate is an ID, so it stays valid
          await user.save();
          console.log(`   ✅ Updated user ${user.fullName} referral code to ${newNumber}`);
        } else {
          console.warn(`   ⚠️ Associated user not found for certificate ${oldNumber}`);
        }

        updatedCount++;
      } catch (err) {
        console.error(`❌ Error processing certificate ${cert.certificateNumber}:`, err.message);
        errorCount++;
      }
    }

    console.log(`\n✨ Migration Complete!`);
    console.log(`✅ Updated: ${updatedCount}`);
    console.log(`⏭️ Skipped: ${skipCount}`);
    console.log(`❌ Errors: ${errorCount}`);

    process.exit(0);
  } catch (error) {
    console.error('❌ Migration failed:', error);
    process.exit(1);
  }
}

fixCertificates();
