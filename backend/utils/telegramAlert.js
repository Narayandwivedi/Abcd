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
  const message = `🎉 NEW SIGNUP REGISTRATION

👤 Full Name: ${userData.fullName || "N/A"}
👨‍👦 Father's Name: ${userData.fatherName || "N/A"}
📱 Mobile: ${userData.mobile || "N/A"}
📧 Email: ${userData.email || "Not provided"}
🏛️ Gotra: ${userData.gotra || "N/A"}
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

module.exports = {
  sendLoginAlert,
  sendSignupAlert,
};
