const Chat = require("../models/Chat");
const User = require("../models/User");
const Admin = require("../models/Admin");
const SubAdmin = require("../models/SubAdmin");

// Get all chats (Admin/SubAdmin with permission)
const getAllChats = async (req, res) => {
  try {
    const { status, search } = req.query;
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 20;
    const skip = (page - 1) * limit;

    let query = {};

    // Filter by status
    if (status) {
      query.status = status;
    }

    // Search by user name or mobile
    if (search) {
      const users = await User.find({
        $or: [
          { fullName: { $regex: search, $options: 'i' } },
          { mobile: { $regex: search, $options: 'i' } }
        ]
      }).select('_id');

      query.userId = { $in: users.map(u => u._id) };
    }

    const chats = await Chat.find(query)
      .populate('userId', 'fullName mobile email')
      .populate('handledBy')
      .sort({ lastMessageAt: -1 })
      .skip(skip)
      .limit(limit);

    const total = await Chat.countDocuments(query);

    res.status(200).json({
      success: true,
      chats,
      pagination: {
        total,
        page,
        pages: Math.ceil(total / limit)
      }
    });
  } catch (error) {
    console.error("Error fetching chats:", error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch chats",
      error: error.message
    });
  }
};

// Get single chat by ID - Auto-assigns to whoever opens it
const getChatById = async (req, res) => {
  try {
    const { chatId } = req.params;

    const chat = await Chat.findById(chatId)
      .populate('userId', 'fullName mobile email gotra city')
      .populate('handledBy');

    if (!chat) {
      return res.status(404).json({
        success: false,
        message: "Chat not found"
      });
    }

    // Auto-assign to whoever opens the chat
    let handlerId, handlerModel, handlerName;

    if (req.adminId) {
      const admin = await Admin.findById(req.adminId);
      handlerId = req.adminId;
      handlerModel = 'Admin';
      handlerName = admin.fullName;
    } else if (req.subAdminId) {
      const subAdmin = await SubAdmin.findById(req.subAdminId);
      handlerId = req.subAdminId;
      handlerModel = 'SubAdmin';
      handlerName = subAdmin.fullName;
    }

    // Assign chat to this person if not already assigned
    if (!chat.handledBy) {
      chat.handledBy = handlerId;
      chat.handlerModel = handlerModel;
      chat.handlerName = handlerName;
    }

    // Mark as read by admin
    chat.unreadByAdmin = 0;
    await chat.save();

    const updatedChat = await Chat.findById(chatId)
      .populate('userId', 'fullName mobile email gotra city')
      .populate('handledBy');

    res.status(200).json({
      success: true,
      chat: updatedChat
    });
  } catch (error) {
    console.error("Error fetching chat:", error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch chat",
      error: error.message
    });
  }
};

// Reply to chat (Admin/SubAdmin with permission)
const replyToChat = async (req, res) => {
  try {
    const { chatId } = req.params;
    const { message } = req.body;

    if (!message || !message.trim()) {
      return res.status(400).json({
        success: false,
        message: "Message is required"
      });
    }

    const chat = await Chat.findById(chatId);

    if (!chat) {
      return res.status(404).json({
        success: false,
        message: "Chat not found"
      });
    }

    // Determine sender type and get sender info
    let senderType, senderName, senderId;

    if (req.adminId) {
      const admin = await Admin.findById(req.adminId);
      senderType = 'admin';
      senderName = admin.fullName;
      senderId = req.adminId;
    } else if (req.subAdminId) {
      const subAdmin = await SubAdmin.findById(req.subAdminId);
      senderType = 'subadmin';
      senderName = subAdmin.fullName;
      senderId = req.subAdminId;
    } else {
      return res.status(401).json({
        success: false,
        message: "Unauthorized"
      });
    }

    // Add message to chat
    chat.messages.push({
      senderType,
      senderName,
      senderId,
      message: message.trim(),
      timestamp: new Date()
    });

    chat.lastMessage = message.trim();
    chat.lastMessageAt = new Date();
    chat.unreadByUser += 1;
    chat.status = 'active';

    await chat.save();

    const updatedChat = await Chat.findById(chatId)
      .populate('userId', 'fullName mobile email')
      .populate('handledBy');

    console.log(`[CHAT] Reply sent by ${senderType}: ${senderName} (ID: ${senderId})`);

    res.status(200).json({
      success: true,
      message: "Reply sent successfully",
      chat: updatedChat
    });
  } catch (error) {
    console.error("Error replying to chat:", error);
    res.status(500).json({
      success: false,
      message: "Failed to send reply",
      error: error.message
    });
  }
};

// Update chat status
const updateChatStatus = async (req, res) => {
  try {
    const { chatId } = req.params;
    const { status } = req.body;

    if (!['active', 'closed'].includes(status)) {
      return res.status(400).json({
        success: false,
        message: "Invalid status"
      });
    }

    const chat = await Chat.findById(chatId);

    if (!chat) {
      return res.status(404).json({
        success: false,
        message: "Chat not found"
      });
    }

    chat.status = status;
    await chat.save();

    const updatedChat = await Chat.findById(chatId)
      .populate('userId', 'fullName mobile email')
      .populate('handledBy');

    console.log(`[CHAT] Status updated to ${status}`);

    res.status(200).json({
      success: true,
      message: "Chat status updated successfully",
      chat: updatedChat
    });
  } catch (error) {
    console.error("Error updating chat status:", error);
    res.status(500).json({
      success: false,
      message: "Failed to update chat status",
      error: error.message
    });
  }
};

// Get chat statistics
const getChatStats = async (req, res) => {
  try {
    const totalChats = await Chat.countDocuments();
    const activeChats = await Chat.countDocuments({ status: 'active' });
    const closedChats = await Chat.countDocuments({ status: 'closed' });
    const unreadChats = await Chat.countDocuments({ unreadByAdmin: { $gt: 0 } });

    res.status(200).json({
      success: true,
      stats: {
        total: totalChats,
        active: activeChats,
        closed: closedChats,
        unread: unreadChats
      }
    });
  } catch (error) {
    console.error("Error fetching chat stats:", error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch chat statistics",
      error: error.message
    });
  }
};

module.exports = {
  getAllChats,
  getChatById,
  replyToChat,
  updateChatStatus,
  getChatStats
};
