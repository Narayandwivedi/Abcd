const express = require("express");
const {
  getAllChats,
  getChatById,
  replyToChat,
  updateChatStatus,
  assignChat,
  getChatStats
} = require("../controllers/chatController");
const adminAuth = require("../middleware/adminAuth");
const { subAdminAuth, checkPermission } = require("../middleware/subAdminAuth");

const router = express.Router();

// Middleware to allow both admin and subadmin access
const adminOrSubAdminAuth = async (req, res, next) => {
  // Try admin auth first
  const adminToken = req.cookies.adminToken;
  const subAdminToken = req.cookies.subAdminToken;

  if (adminToken) {
    return adminAuth(req, res, next);
  } else if (subAdminToken) {
    return subAdminAuth(req, res, next);
  } else {
    return res.status(401).json({
      success: false,
      message: "Unauthorized - No token provided"
    });
  }
};

// Middleware to check chat view permission for subadmin
const canViewChats = (req, res, next) => {
  // Admin can always view
  if (req.adminId) {
    return next();
  }

  // SubAdmin needs permission
  if (req.subAdminId) {
    if (!req.subAdmin.permissions.canViewChats) {
      return res.status(403).json({
        success: false,
        message: "Forbidden - You don't have permission to view chats"
      });
    }
    return next();
  }

  return res.status(401).json({
    success: false,
    message: "Unauthorized"
  });
};

// Middleware to check chat reply permission for subadmin
const canReplyChats = (req, res, next) => {
  // Admin can always reply
  if (req.adminId) {
    return next();
  }

  // SubAdmin needs permission
  if (req.subAdminId) {
    if (!req.subAdmin.permissions.canReplyChats) {
      return res.status(403).json({
        success: false,
        message: "Forbidden - You don't have permission to reply to chats"
      });
    }
    return next();
  }

  return res.status(401).json({
    success: false,
    message: "Unauthorized"
  });
};

// Routes for admin and subadmin with permissions
router.get("/", adminOrSubAdminAuth, canViewChats, getAllChats);
router.get("/stats", adminOrSubAdminAuth, canViewChats, getChatStats);
router.get("/:chatId", adminOrSubAdminAuth, canViewChats, getChatById);
router.post("/:chatId/reply", adminOrSubAdminAuth, canReplyChats, replyToChat);
router.put("/:chatId/status", adminOrSubAdminAuth, canReplyChats, updateChatStatus);

module.exports = router;
