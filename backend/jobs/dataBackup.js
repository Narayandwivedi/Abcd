const cron = require('node-cron');
const fs = require('fs');
const path = require('path');
const archiver = require('archiver');
const { transporter } = require('../utils/nodemailer');

// Import all models
const User = require('../models/User');
const Vendor = require('../models/Vendor');
const Admin = require('../models/Admin');
const SubAdmin = require('../models/SubAdmin');
const Category = require('../models/Category');
const Ad = require('../models/Ad');
const BuyLead = require('../models/BuyLead');
const SellLead = require('../models/SellLead');
const Certificate = require('../models/Certificate');
const VendorCertificate = require('../models/VendorCertificate');
const City = require('../models/City');

// Backup configuration
const BACKUP_EMAIL = process.env.BACKUP_EMAIL || 'your-email@example.com'; // Add this to your .env file
const BACKUP_DIR = path.join(__dirname, '../backups');
const TEMP_DIR = path.join(__dirname, '../temp-backup');

// Ensure backup directories exist
const ensureDirectories = () => {
  if (!fs.existsSync(BACKUP_DIR)) {
    fs.mkdirSync(BACKUP_DIR, { recursive: true });
  }
  if (!fs.existsSync(TEMP_DIR)) {
    fs.mkdirSync(TEMP_DIR, { recursive: true });
  }
};

// Clean up temporary directory
const cleanupTempDir = () => {
  if (fs.existsSync(TEMP_DIR)) {
    fs.readdirSync(TEMP_DIR).forEach(file => {
      fs.unlinkSync(path.join(TEMP_DIR, file));
    });
  }
};

// Export data from a model to JSON file
const exportModelData = async (Model, filename) => {
  try {
    const data = await Model.find({}).lean();
    const filePath = path.join(TEMP_DIR, filename);
    fs.writeFileSync(filePath, JSON.stringify(data, null, 2));
    console.log(`✓ Exported ${data.length} records to ${filename}`);
    return { success: true, count: data.length, filename };
  } catch (error) {
    console.error(`✗ Error exporting ${filename}:`, error.message);
    return { success: false, error: error.message, filename };
  }
};

// Create ZIP file from JSON files
const createZipArchive = (zipFilename) => {
  return new Promise((resolve, reject) => {
    const zipPath = path.join(BACKUP_DIR, zipFilename);
    const output = fs.createWriteStream(zipPath);
    const archive = archiver('zip', {
      zlib: { level: 9 } // Maximum compression
    });

    output.on('close', () => {
      console.log(`✓ ZIP archive created: ${zipFilename} (${(archive.pointer() / 1024 / 1024).toFixed(2)} MB)`);
      resolve(zipPath);
    });

    archive.on('error', (err) => {
      reject(err);
    });

    archive.pipe(output);

    // Add all JSON files from temp directory
    const files = fs.readdirSync(TEMP_DIR);
    files.forEach(file => {
      const filePath = path.join(TEMP_DIR, file);
      archive.file(filePath, { name: file });
    });

    archive.finalize();
  });
};

// Send email with backup attachment
const sendBackupEmail = async (zipPath, stats) => {
  try {
    const zipFilename = path.basename(zipPath);
    const zipStats = fs.statSync(zipPath);
    const zipSizeMB = (zipStats.size / 1024 / 1024).toFixed(2);

    // Create email content with backup statistics
    const statsHtml = stats.map(stat => {
      if (stat.success) {
        return `<tr><td style="padding: 8px; border-bottom: 1px solid #ddd;">${stat.filename}</td><td style="padding: 8px; border-bottom: 1px solid #ddd; color: green;">✓ ${stat.count} records</td></tr>`;
      } else {
        return `<tr><td style="padding: 8px; border-bottom: 1px solid #ddd;">${stat.filename}</td><td style="padding: 8px; border-bottom: 1px solid #ddd; color: red;">✗ Error: ${stat.error}</td></tr>`;
      }
    }).join('');

    const mailOptions = {
      from: '"ABCD Database Backup" <98e6a2001@smtp-brevo.com>',
      to: BACKUP_EMAIL,
      subject: `Database Backup - ${new Date().toLocaleString('en-IN', { timeZone: 'Asia/Kolkata' })}`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 20px; border-radius: 10px 10px 0 0;">
            <h2 style="margin: 0;">🗄️ ABCD Database Backup</h2>
          </div>
          <div style="background: #f7f7f7; padding: 20px; border-radius: 0 0 10px 10px;">
            <p style="font-size: 16px; color: #333;">
              Your automated database backup has been completed successfully.
            </p>

            <div style="background: white; padding: 15px; border-radius: 8px; margin: 20px 0;">
              <h3 style="margin-top: 0; color: #667eea;">📊 Backup Statistics</h3>
              <table style="width: 100%; border-collapse: collapse;">
                <thead>
                  <tr style="background: #667eea; color: white;">
                    <th style="padding: 10px; text-align: left;">Collection</th>
                    <th style="padding: 10px; text-align: left;">Status</th>
                  </tr>
                </thead>
                <tbody>
                  ${statsHtml}
                </tbody>
              </table>
            </div>

            <div style="background: white; padding: 15px; border-radius: 8px; margin: 20px 0;">
              <h3 style="margin-top: 0; color: #667eea;">📦 Archive Details</h3>
              <p style="margin: 5px 0;"><strong>Filename:</strong> ${zipFilename}</p>
              <p style="margin: 5px 0;"><strong>Size:</strong> ${zipSizeMB} MB</p>
              <p style="margin: 5px 0;"><strong>Timestamp:</strong> ${new Date().toLocaleString('en-IN', { timeZone: 'Asia/Kolkata' })}</p>
            </div>

            <div style="background: #fff3cd; border-left: 4px solid #ffc107; padding: 15px; margin: 20px 0; border-radius: 4px;">
              <p style="margin: 0; color: #856404;">
                <strong>⚠️ Important:</strong> This backup contains sensitive data. Please store it securely and delete it after verification.
              </p>
            </div>

            <p style="color: #666; font-size: 14px; margin-top: 20px;">
              This is an automated backup generated by the ABCD system.
            </p>
          </div>
        </div>
      `,
      attachments: [
        {
          filename: zipFilename,
          path: zipPath
        }
      ]
    };

    const info = await transporter.sendMail(mailOptions);
    console.log('✓ Backup email sent successfully:', info.messageId);
    return true;
  } catch (error) {
    console.error('✗ Error sending backup email:', error.message);
    throw error;
  }
};

// Main backup function
const performBackup = async () => {
  const startTime = Date.now();
  console.log('\n========================================');
  console.log('🚀 Starting Database Backup...');
  console.log(`⏰ Time: ${new Date().toLocaleString('en-IN', { timeZone: 'Asia/Kolkata' })}`);
  console.log('========================================\n');

  try {
    // Ensure directories exist
    ensureDirectories();

    // Clean up old temp files
    cleanupTempDir();

    // Export all collections to JSON files
    console.log('📝 Exporting collections...\n');
    const stats = await Promise.all([
      exportModelData(User, 'users.json'),
      exportModelData(Vendor, 'vendors.json'),
      exportModelData(Admin, 'admins.json'),
      exportModelData(SubAdmin, 'subadmins.json'),
      exportModelData(Category, 'categories.json'),
      exportModelData(Ad, 'ads.json'),
      exportModelData(BuyLead, 'buy-leads.json'),
      exportModelData(SellLead, 'sell-leads.json'),
      exportModelData(Certificate, 'certificates.json'),
      exportModelData(VendorCertificate, 'vendor-certificates.json'),
      exportModelData(City, 'cities.json'),
    ]);

    // Create ZIP archive
    console.log('\n📦 Creating ZIP archive...\n');
    const timestamp = new Date().toISOString().replace(/[:.]/g, '-').split('T')[0] + '_' +
                      new Date().toLocaleTimeString('en-IN', { hour12: false, timeZone: 'Asia/Kolkata' }).replace(/:/g, '-');
    const zipFilename = `backup_${timestamp}.zip`;
    const zipPath = await createZipArchive(zipFilename);

    // Send email with backup
    console.log('\n📧 Sending backup email...\n');
    await sendBackupEmail(zipPath, stats);

    // Clean up temp files
    cleanupTempDir();

    const duration = ((Date.now() - startTime) / 1000).toFixed(2);
    console.log('\n========================================');
    console.log('✅ Backup Completed Successfully!');
    console.log(`⏱️  Duration: ${duration} seconds`);
    console.log('========================================\n');

    // Optional: Delete old backups (keep only last 7 backups)
    cleanupOldBackups();

  } catch (error) {
    console.error('\n========================================');
    console.error('❌ Backup Failed!');
    console.error('Error:', error.message);
    console.error('========================================\n');
    throw error;
  }
};

// Clean up old backup files (keep only last 7 backups)
const cleanupOldBackups = () => {
  try {
    const files = fs.readdirSync(BACKUP_DIR)
      .filter(file => file.startsWith('backup_') && file.endsWith('.zip'))
      .map(file => ({
        name: file,
        path: path.join(BACKUP_DIR, file),
        time: fs.statSync(path.join(BACKUP_DIR, file)).mtime.getTime()
      }))
      .sort((a, b) => b.time - a.time);

    // Keep only the 7 most recent backups
    if (files.length > 7) {
      files.slice(7).forEach(file => {
        fs.unlinkSync(file.path);
        console.log(`🗑️  Deleted old backup: ${file.name}`);
      });
    }
  } catch (error) {
    console.error('Error cleaning up old backups:', error.message);
  }
};

// Schedule backup jobs
const scheduleBackupJobs = () => {
  // Schedule for 12:00 AM (midnight)
  cron.schedule('0 0 * * *', () => {
    console.log('⏰ Scheduled backup triggered at 12:00 AM');
    performBackup();
  }, {
    timezone: 'Asia/Kolkata'
  });

  // Schedule for 12:00 PM (noon)
  cron.schedule('0 12 * * *', () => {
    console.log('⏰ Scheduled backup triggered at 12:00 PM');
    performBackup();
  }, {
    timezone: 'Asia/Kolkata'
  });

  console.log('✅ Backup jobs scheduled:');
  console.log('   - 12:00 AM (midnight) - Daily');
  console.log('   - 12:00 PM (noon) - Daily');
  console.log('   - Timezone: Asia/Kolkata (IST)');
};

// Export functions for use in other files
module.exports = {
  scheduleBackupJobs,
  performBackup // Can be used for manual backups
};
