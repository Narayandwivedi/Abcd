const mongoose = require('mongoose');
const fs = require('fs');
const path = require('path');
require('dotenv').config();

const Certificate = require('../models/Certificate');
const User = require('../models/User');
const {
  formatCertificateNumber,
  extractCertificateSequence,
  regenerateCertificatePDF
} = require('../utils/generateCertificate');

const MONGO_URI = process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/abcd';
const CERTIFICATES_DIR = path.join(__dirname, '..', 'uploads', 'certificates');

function moveCertificateFile(oldPath, newPath) {
  if (!fs.existsSync(oldPath)) {
    return { status: 'missing' };
  }

  if (oldPath === newPath) {
    return { status: 'unchanged' };
  }

  try {
    if (!fs.existsSync(newPath)) {
      fs.renameSync(oldPath, newPath);
      return { status: 'renamed' };
    }

    return { status: 'already-exists' };
  } catch (error) {
    if (error.code === 'EPERM' || error.code === 'EXDEV') {
      try {
        if (!fs.existsSync(newPath)) {
          fs.copyFileSync(oldPath, newPath);
        }

        try {
          fs.unlinkSync(oldPath);
        } catch (unlinkError) {
          return { status: 'copied', warning: unlinkError.message };
        }

        return { status: 'copied' };
      } catch (copyError) {
        return { status: 'failed', error: copyError.message };
      }
    }

    return { status: 'failed', error: error.message };
  }
}

async function fixCertificates() {
  try {
    console.log('Starting member certificate migration...');
    console.log(`Certificates directory: ${CERTIFICATES_DIR}`);

    await mongoose.connect(MONGO_URI);
    console.log('Connected to MongoDB');

    const certificates = await Certificate.find({}).sort({ createdAt: 1, _id: 1 });
    console.log(`Found ${certificates.length} certificates to process`);

    let updatedCount = 0;
    let skipCount = 0;
    let errorCount = 0;

    for (const cert of certificates) {
      try {
        const oldNumber = cert.certificateNumber;
        const sequenceNumber = extractCertificateSequence(oldNumber);

        if (!sequenceNumber) {
          console.error(`Could not extract sequence from ${oldNumber}`);
          errorCount++;
          continue;
        }

        const newNumber = formatCertificateNumber(sequenceNumber);
        const oldFileName = `ABCD_MEMBER_CERTIFICATE_${oldNumber}.pdf`;
        const newFileName = `ABCD_MEMBER_CERTIFICATE_${newNumber}.pdf`;
        const oldPath = path.join(CERTIFICATES_DIR, oldFileName);
        const newPath = path.join(CERTIFICATES_DIR, newFileName);
        const expectedDownloadLink = `/uploads/certificates/${newFileName}`;
        let changed = false;

        if (oldNumber !== newNumber) {
          console.log(`Migrating ${oldNumber} -> ${newNumber}`);
          const fileMove = moveCertificateFile(oldPath, newPath);

          if (fileMove.status === 'renamed') {
            console.log(`   Renamed file: ${oldFileName} -> ${newFileName}`);
          } else if (fileMove.status === 'copied') {
            console.log(`   Copied file: ${oldFileName} -> ${newFileName}`);
            if (fileMove.warning) {
              console.warn(`   Old file could not be removed: ${fileMove.warning}`);
            }
          } else if (fileMove.status === 'already-exists') {
            console.warn(`   Target file already exists: ${newFileName}`);
          } else if (fileMove.status === 'missing') {
            console.warn(`   File not found: ${oldFileName}`);
          } else if (fileMove.status === 'failed') {
            console.warn(`   File move failed: ${fileMove.error}`);
          }

          cert.certificateNumber = newNumber;
          changed = true;
        } else {
          console.log(`Checking ${oldNumber}`);
        }

        if (cert.downloadLink !== expectedDownloadLink) {
          cert.downloadLink = expectedDownloadLink;
          changed = true;
        }

        const user = await User.findById(cert.userId);
        if (user) {
          if (user.referralCode !== newNumber) {
            await User.updateOne({ _id: user._id }, { $set: { referralCode: newNumber } });
            console.log(`   Updated user ${user.fullName} referral code to ${newNumber}`);
            changed = true;
          }

          const currentPdfPath = path.join(__dirname, '..', cert.downloadLink || '');
          if (cert.downloadLink && fs.existsSync(currentPdfPath)) {
            try {
              fs.unlinkSync(currentPdfPath);
            } catch (error) {
              console.warn(`   Could not remove old PDF for ${newNumber}: ${error.message}`);
            }
          }

          const pdfData = await regenerateCertificatePDF(user.toObject ? user.toObject() : user, newNumber);
          if (cert.downloadLink !== pdfData.downloadLink) {
            cert.downloadLink = pdfData.downloadLink;
            changed = true;
          }

          if (cert.pdfDeleted) {
            cert.pdfDeleted = false;
            changed = true;
          }

          console.log(`   Regenerated PDF for ${newNumber}`);
        } else {
          console.warn(`   Associated user not found for certificate ${oldNumber}`);
        }

        if (changed) {
          await cert.save();
          updatedCount++;
        } else {
          skipCount++;
        }
      } catch (err) {
        console.error(`Error processing certificate ${cert.certificateNumber}:`, err.message);
        errorCount++;
      }
    }

    const activeCertificates = await Certificate.find({ pdfDeleted: { $ne: true } }, 'downloadLink').lean();
    const keepFiles = new Set(
      activeCertificates
        .map((certificate) => path.basename(certificate.downloadLink || ''))
        .filter(Boolean)
    );

    const files = fs.readdirSync(CERTIFICATES_DIR);
    for (const fileName of files) {
      const filePath = path.join(CERTIFICATES_DIR, fileName);
      if (!fs.statSync(filePath).isFile()) continue;

      if (!keepFiles.has(fileName)) {
        try {
          fs.unlinkSync(filePath);
          console.log(`Deleted old file: ${fileName}`);
        } catch (error) {
          console.warn(`Could not delete old file ${fileName}: ${error.message}`);
        }
      }
    }

    console.log('\nMigration complete');
    console.log(`Updated: ${updatedCount}`);
    console.log(`Skipped: ${skipCount}`);
    console.log(`Errors: ${errorCount}`);

    process.exit(0);
  } catch (error) {
    console.error('Migration failed:', error);
    process.exit(1);
  }
}

fixCertificates();
