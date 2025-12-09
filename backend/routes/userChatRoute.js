const express = require("express");
const {
  getUserChat,
  sendMessage,
  getUnreadCount
} = require("../controllers/userChatController");
const auth = require("../middleware/auth");

const router = express.Router();

// All routes require user authentication
// Users can only view and send messages - no delete/edit options
router.get("/my-chat", auth, getUserChat);
router.post("/send", auth, sendMessage);
router.get("/unread-count", auth, getUnreadCount);

module.exports = router;
