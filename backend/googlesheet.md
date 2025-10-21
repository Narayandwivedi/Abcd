# Google Sheets Integration Guide

This guide will help you automatically save signup data to Google Sheets.

## Is it Free? 💰

**YES! It's 100% FREE!** Google Sheets API is completely free for normal usage (up to 60 requests per minute per user, which is more than enough for most applications).

---

## Step-by-Step Setup

### Step 1: Create a Google Cloud Project

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Click on "Select a Project" at the top
3. Click "NEW PROJECT"
4. Enter project name (e.g., "Abcd Backend")
5. Click "CREATE"

### Step 2: Enable Google Sheets API

1. In the Google Cloud Console, make sure your new project is selected
2. Go to "APIs & Services" → "Library" (from the left sidebar)
3. Search for "Google Sheets API"
4. Click on "Google Sheets API"
5. Click "ENABLE"

### Step 3: Create Service Account

1. Go to "APIs & Services" → "Credentials"
2. Click "CREATE CREDENTIALS" → "Service account"
3. Fill in the details:
   - **Service account name**: `abcd-sheet-service`
   - **Service account ID**: (auto-generated)
   - **Description**: `Service account for saving signup data to Google Sheets`
4. Click "CREATE AND CONTINUE"
5. Skip the optional steps by clicking "DONE"

### Step 4: Create and Download Service Account Key (IMPORTANT!)

1. On the "Credentials" page, you'll see your service account listed under "Service Accounts"
2. Click on the service account email (e.g., `abcd-sheet-service@...`)
3. Go to the "KEYS" tab
4. Click "ADD KEY" → "Create new key"
5. Select "JSON" format
6. Click "CREATE"
7. A JSON file will be downloaded to your computer
8. **IMPORTANT**: Rename this file to `google-credentials.json`

### Step 5: Share This File With Me

**What to share with me:**

1. The downloaded `google-credentials.json` file content
   - Open the file in a text editor
   - Copy the entire content
   - Share it with me (I'll add it to your project securely)

2. Your Google Sheet URL or ID
   - If you already have a sheet, share the URL
   - OR I can help you create a new sheet

---

## Step 6: Create Google Sheet (If you don't have one)

### Option A: Create New Sheet

1. Go to [Google Sheets](https://sheets.google.com)
2. Click "Blank" to create a new sheet
3. Name it (e.g., "Abcd Signups")
4. Add column headers in the first row:
   - `Full Name` | `Email` | `Mobile` | `Father Name` | `Address` | `Gotra` | `City` | `UTR Number` | `Registration Date` | `Status`

### Option B: Use Existing Sheet

If you already have a Google Sheet, just share the URL with me.

### Step 7: Share Sheet with Service Account

**CRITICAL STEP!**

1. Open your Google Sheet
2. Click the "Share" button (top right)
3. In the service account JSON file, find the `client_email` field
   - It looks like: `abcd-sheet-service@project-id.iam.gserviceaccount.com`
4. Copy that email address
5. Paste it in the "Add people and groups" field in Google Sheets
6. Give it "Editor" access
7. Click "Send"

**Without this step, the bot won't be able to write to your sheet!**

---

## What I Need From You

To implement this for you, please provide:

### 1. Google Service Account Credentials
```
Share the content of google-credentials.json file
(It's safe to share with me - I'll add it securely to your project)
```

### 2. Google Sheet Information

**Option A:** Share your existing Google Sheet URL
```
Example: https://docs.google.com/spreadsheets/d/1a2b3c4d5e6f7g8h9i0j/edit
```

**Option B:** Tell me you want to create a new sheet and I'll guide you

### 3. What data to save? (Current signup fields I see)

From your signup form, I'll save:
- ✅ Full Name
- ✅ Email (if provided)
- ✅ Mobile
- ✅ Father Name
- ✅ Address
- ✅ Gotra
- ✅ City (if provided)
- ✅ UTR Number (if provided)
- ✅ Registration Date & Time
- ✅ Payment Screenshot URL (if uploaded)
- ✅ Passport Photo URL
- ✅ Verification Status (default: "Pending")

**Do you want to save all of these fields, or only specific ones?**

---

## Security Notes

### Where to put the credentials file?

I will:
1. Save `google-credentials.json` in the `backend/` folder
2. Add it to `.gitignore` so it's never committed to Git
3. Add the Sheet ID to your `.env` file

### .env file will have:
```env
GOOGLE_SHEET_ID=your_sheet_id_here
```

---

## After Implementation

Once implemented, every time someone signs up:
1. User data is saved to MongoDB ✅
2. User data is automatically saved to Google Sheets ✅
3. You get a Telegram notification ✅

You'll have a live spreadsheet tracking all signups in real-time!

---

## FAQ

**Q: Is this secure?**
A: Yes! Service account credentials are secure and meant for backend services. Just don't commit the JSON file to Git (I'll add it to .gitignore).

**Q: Can I edit the sheet manually?**
A: Yes! You can edit, add columns, format cells, etc. The bot will just append new rows.

**Q: What if Google Sheets is down?**
A: Data still saves to MongoDB. Google Sheets is just a backup/convenience.

**Q: Can I use the same service account for multiple sheets?**
A: Yes! Just share each sheet with the service account email.

**Q: Rate limits?**
A: Free tier allows 60 requests/minute per user. More than enough for most apps.

---

## What to do next?

**Please provide:**

1. ✅ Content of `google-credentials.json` file (the downloaded JSON)
2. ✅ Google Sheet URL (or tell me to create one)
3. ✅ Confirm which fields you want to save

Once you share these, I'll implement it in about 2 minutes!
