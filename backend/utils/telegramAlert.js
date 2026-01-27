const axios = require("axios");

// Send login alert
const sendLoginAlert = async (userName) => {
  const BOT_TOKEN = process.env.TELEGRAM_BOT_TOKEN;
  const CHAT_ID = process.env.TELEGRAM_GROUP_ID;

  if (!BOT_TOKEN || !CHAT_ID) {
    console.log("Telegram credentials not configured");
    return;
  }

  const message = `🔐 NEW LOGIN: ${userName} just logged in!`;
  const url = `https://api.telegram.org/bot${BOT_TOKEN}/sendMessage`;

  try {
    await axios.post(url, {
      chat_id: CHAT_ID,
      text: message,
    });
    console.log("✅ Telegram login alert sent successfully");
  } catch (err) {
    console.error("Telegram error:", err.message);
    console.error("Full error:", err.response?.data);
    console.error("Bot Token:", BOT_TOKEN);
    console.error("Chat ID:", CHAT_ID);
    console.error("Chat ID type:", typeof CHAT_ID);
  }
};

// Send signup alert
const sendSignupAlert = async (userData) => {
  const BOT_TOKEN = process.env.TELEGRAM_BOT_TOKEN;
  const CHAT_ID = process.env.TELEGRAM_GROUP_ID;
  const BACKEND_URL = process.env.BACKEND_URL || "https://api.abcdvyapar.com";

  if (!BOT_TOKEN || !CHAT_ID) {
    console.log("Telegram credentials not configured");
    return;
  }

  // Create passport photo link
  const passportPhotoLink = userData.passportPhoto
    ? `${BACKEND_URL}/${userData.passportPhoto}`
    : "Not provided";

  // Format message with all user details
  const relationshipLabel = userData.relationship === 'W/O' ? "Husband's Name" : userData.relationship === 'D/O' ? "Father's Name" : "Father's Name";
  const message = `🎉 NEW SIGNUP REGISTRATION

👤 Full Name: ${userData.fullName || "N/A"}
👨‍👦 Relationship: ${userData.relationship || "N/A"}
👨‍👦 ${relationshipLabel}: ${userData.relativeName || "N/A"}
📱 Mobile: ${userData.mobile || "N/A"}
📧 Email: ${userData.email || "Not provided"}
🏛️ Gotra: ${userData.gotra || "N/A"}
🏙️ State: ${userData.state || "Not provided"}
🏙️ District: ${userData.district || "Not provided"}
🏙️ City: ${userData.city || "Not provided"}
📍 Address: ${userData.address || "N/A"}
💳 UTR Number: ${userData.utrNumber || "Not provided"}

📸 Passport Photo: ${passportPhotoLink}

⏰ Registration Time: ${new Date().toLocaleString("en-IN", { timeZone: "Asia/Kolkata" })}`;

  const url = `https://api.telegram.org/bot${BOT_TOKEN}/sendMessage`;

  try {
    await axios.post(url, {
      chat_id: CHAT_ID,
      text: message,
      parse_mode: "HTML",
      disable_web_page_preview: false, // Enable link preview for passport photo
    });
    console.log("✅ Telegram signup alert sent successfully");
  } catch (err) {
    console.error("Telegram error:", err.message);
    console.error("Full error:", err.response?.data);
    console.error("Bot Token:", BOT_TOKEN);
    console.error("Chat ID:", CHAT_ID);
    console.error("Chat ID type:", typeof CHAT_ID);
  }
};

// Send vendor signup alert
const sendVendorSignupAlert = async (vendorData) => {
  const BOT_TOKEN = process.env.TELEGRAM_BOT_TOKEN;
  const CHAT_ID = process.env.TELEGRAM_VENDOR_GROUP_ID;
  const BACKEND_URL = process.env.BACKEND_URL || "https://api.abcdvyapar.com";

  if (!BOT_TOKEN || !CHAT_ID) {
    console.log("Telegram credentials not configured for vendor alerts");
    return;
  }

  // Create passport photo link if available
  const vendorPhotoLink = vendorData.passportPhoto
    ? `${BACKEND_URL}/${vendorData.passportPhoto}`
    : "Not provided";

  // Format business categories
  const categoriesText = vendorData.businessCategories && vendorData.businessCategories.length > 0
    ? vendorData.businessCategories.map((bc, i) => `  ${i + 1}. ${bc.category || bc.categoryName || "N/A"} → ${bc.subCategory || bc.subcategoryName || "N/A"}`).join("\n")
    : "Not provided";

  // Format message with all vendor details
  const message = `🏪 NEW VENDOR SIGNUP REGISTRATION

👤 Owner Name: ${vendorData.ownerName || "N/A"}
🏢 Business Name: ${vendorData.businessName || "N/A"}
📱 Mobile: ${vendorData.mobile || "Not provided"}
📧 Email: ${vendorData.email || "Not provided"}
🌐 Website: ${vendorData.websiteUrl || "Not provided"}
📲 Social Media: ${vendorData.socialUrl || "Not provided"}
🏙️ State: ${vendorData.state || "Not provided"}
🏙️ City: ${vendorData.city || "Not provided"}
💰 Membership Fees: ₹${vendorData.membershipFees || "Not provided"}

📂 Business Categories:
${categoriesText}

📸 Vendor Photo: ${vendorPhotoLink}

⏰ Registration Time: ${new Date().toLocaleString("en-IN", { timeZone: "Asia/Kolkata" })}`;

  const url = `https://api.telegram.org/bot${BOT_TOKEN}/sendMessage`;

  try {
    await axios.post(url, {
      chat_id: CHAT_ID,
      text: message,
      parse_mode: "HTML",
      disable_web_page_preview: false, // Enable link preview for vendor photo
    });
    console.log("✅ Telegram vendor signup alert sent successfully");
  } catch (err) {
    console.error("Telegram vendor alert error:", err.message);
    console.error("Full error:", err.response?.data);
    console.error("Bot Token:", BOT_TOKEN);
    console.error("Chat ID:", CHAT_ID);
    console.error("Chat ID type:", typeof CHAT_ID);
  }
};

module.exports = {
  sendLoginAlert,
  sendSignupAlert,
  sendVendorSignupAlert,
};
