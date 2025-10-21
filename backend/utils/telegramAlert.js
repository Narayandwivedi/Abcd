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
const sendSignupAlert = async (userName, email) => {
  const BOT_TOKEN = process.env.TELEGRAM_BOT_TOKEN;
  const CHAT_ID = process.env.TELEGRAM_GROUP_ID;

  if (!BOT_TOKEN || !CHAT_ID) {
    console.log("Telegram credentials not configured");
    return;
  }

  const message = `🎉 NEW SIGNUP: ${userName} (${email}) just registered!`;
  const url = `https://api.telegram.org/bot${BOT_TOKEN}/sendMessage`;

  try {
    await axios.post(url, {
      chat_id: CHAT_ID,
      text: message,
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
