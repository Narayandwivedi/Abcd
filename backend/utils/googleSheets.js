const { google } = require("googleapis");
const path = require("path");
const fs = require("fs");

// Path to your service account credentials
const CREDENTIALS_PATH = path.join(__dirname, "..", "abcd-backend-sheet-950692a70728.json");

// Read and parse the service account key file
const serviceAccountKey = JSON.parse(fs.readFileSync(CREDENTIALS_PATH, 'utf8'));

// Initialize auth using JWT (recommended way)
const auth = new google.auth.JWT(
  serviceAccountKey.client_email,
  null,
  serviceAccountKey.private_key,
  ["https://www.googleapis.com/auth/spreadsheets"]
);

const sheets = google.sheets({ version: "v4", auth });

/**
 * Save signup data to Google Sheets
 * @param {Object} userData - User data object
 */
const saveSignupToSheet = async (userData) => {
  try {
    const SHEET_ID = process.env.GOOGLE_SHEET_ID;
    const BACKEND_URL = process.env.BACKEND_URL || "https://api.abcdvyapar.com";

    if (!SHEET_ID) {
      console.log("Google Sheet ID not configured in .env");
      return;
    }

    // Create clickable link for passport photo
    const passportPhotoLink = userData.passportPhoto
      ? `=HYPERLINK("${BACKEND_URL}/${userData.passportPhoto}", "View Photo")`
      : "";

    // Prepare data row
    const row = [
      userData.fullName || "",
      userData.email || "",
      userData.mobile || "",
      userData.fatherName || "",
      userData.address || "",
      userData.gotra || "",
      userData.city || "",
      userData.utrNumber || "",
      passportPhotoLink, // Clickable link
      new Date().toLocaleString("en-IN", { timeZone: "Asia/Kolkata" }), // Registration Date & Time
    ];

    // Append row to sheet
    await sheets.spreadsheets.values.append({
      spreadsheetId: SHEET_ID,
      range: "Sheet1!A:J", // Updated range (removed 2 columns)
      valueInputOption: "USER_ENTERED",
      resource: {
        values: [row],
      },
    });

    console.log("✅ Data saved to Google Sheets successfully");
  } catch (error) {
    console.error("Google Sheets Error:", error.message);
    if (error.response?.data) {
      console.error("Full error:", error.response.data);
    }
  }
};

module.exports = {
  saveSignupToSheet,
};
