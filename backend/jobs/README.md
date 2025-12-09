# Database Backup Job System

This folder contains automated jobs for the ABCD backend system.

## 📦 Database Backup

The database backup system automatically creates backups of all database collections and sends them via email.

### Features

- **Automated Scheduling**: Runs twice daily at 12:00 AM and 12:00 PM (IST)
- **Comprehensive Backup**: Backs up all collections (users, vendors, admins, etc.)
- **Individual JSON Files**: Creates separate JSON files for each collection
- **ZIP Compression**: Compresses all files into a single ZIP archive
- **Email Delivery**: Sends backup via email with detailed statistics
- **Auto Cleanup**: Keeps only the last 7 backups to save disk space

### Setup

1. **Install Dependencies** (already done):
   ```bash
   npm install node-cron archiver
   ```

2. **Configure Email** in `.env`:
   ```env
   BACKUP_EMAIL=your-email@example.com
   ```
   Replace `your-email@example.com` with the email address where you want to receive backups.

3. **Start Server**:
   The backup jobs are automatically initialized when the server starts.

### Collections Backed Up

The following collections are included in each backup:

- `users.json` - User accounts
- `vendors.json` - Vendor accounts
- `admins.json` - Admin accounts
- `subadmins.json` - SubAdmin accounts
- `categories.json` - Business categories
- `ads.json` - Advertisements
- `buy-leads.json` - Buy leads
- `sell-leads.json` - Sell leads
- `certificates.json` - User certificates
- `vendor-certificates.json` - Vendor certificates
- `cities.json` - City data

### Schedule

The backup runs automatically at:
- **12:00 AM (midnight)** - Daily
- **12:00 PM (noon)** - Daily

Timezone: **Asia/Kolkata (IST)**

### Manual Backup

You can trigger a manual backup from anywhere in your code:

```javascript
const { performBackup } = require('./jobs/dataBackup');

// Trigger backup manually
performBackup()
  .then(() => console.log('Manual backup completed'))
  .catch(err => console.error('Manual backup failed:', err));
```

### File Structure

```
backend/
├── jobs/
│   ├── dataBackup.js       # Main backup job
│   └── README.md           # This file
├── backups/                # ZIP files stored here (gitignored)
│   ├── backup_2024-01-15_12-00-00.zip
│   ├── backup_2024-01-15_00-00-00.zip
│   └── ...
└── temp-backup/            # Temporary JSON files (gitignored)
```

### Email Content

Each backup email includes:

- 📊 **Backup Statistics**: Number of records exported from each collection
- 📦 **Archive Details**: Filename, size, and timestamp
- ⚠️ **Security Warning**: Reminder to store backups securely
- 📎 **ZIP Attachment**: Complete backup file

### Security Notes

⚠️ **Important Security Considerations**:

1. **Email Security**: Backup files contain sensitive data. Use a secure email service.
2. **Access Control**: Keep the `.env` file secure and never commit it to version control.
3. **Storage**: Delete old backups after verification or store them in a secure location.
4. **Encryption**: Consider encrypting backup files for additional security.

### Troubleshooting

**Backup not running?**
- Check server logs for error messages
- Verify database connection is active
- Ensure `BACKUP_EMAIL` is set in `.env`

**Email not received?**
- Check spam/junk folder
- Verify nodemailer configuration in `utils/nodemailer.js`
- Check email service quotas

**Large file size?**
- Backups are compressed with maximum compression (level 9)
- Email providers may have attachment size limits (usually 25-50 MB)
- Consider alternative delivery methods for very large databases

### Logs

The backup process logs detailed information to the console:

```
========================================
🚀 Starting Database Backup...
⏰ Time: 1/15/2024, 12:00:00 PM
========================================

📝 Exporting collections...

✓ Exported 1523 records to users.json
✓ Exported 842 records to vendors.json
✓ Exported 3 records to admins.json
...

📦 Creating ZIP archive...

✓ ZIP archive created: backup_2024-01-15_12-00-00.zip (2.45 MB)

📧 Sending backup email...

✓ Backup email sent successfully: <message-id>

========================================
✅ Backup Completed Successfully!
⏱️  Duration: 12.34 seconds
========================================
```

### Auto Cleanup

The system automatically:
- Deletes temporary JSON files after creating the ZIP
- Keeps only the last 7 backup ZIP files
- Older backups are automatically removed to save disk space

### Customization

To modify the backup schedule, edit `backend/jobs/dataBackup.js`:

```javascript
// Current schedule
cron.schedule('0 0 * * *', ...) // 12:00 AM
cron.schedule('0 12 * * *', ...) // 12:00 PM

// Example: Run every 6 hours
cron.schedule('0 */6 * * *', ...)

// Example: Run daily at 3 AM
cron.schedule('0 3 * * *', ...)
```

Cron format: `minute hour day month weekday`

### Support

For issues or questions, check:
- Server logs for error messages
- Email delivery logs
- Database connection status
- Disk space availability

---

**Last Updated**: January 2025
