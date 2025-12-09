const Chat = require("../models/Chat");
const User = require("../models/User");
const Admin = require("../models/Admin");
const SubAdmin = require("../models/SubAdmin");

// Helper: Calculate unread count by admin (messages from user not read)
const getUnreadByAdmin = (messages) => {
  return messages.filter(msg => msg.senderType === 'user' && !msg.isRead).length;
};

// Helper: Calculate unread count by user (messages from admin/subadmin not read)
const getUnreadByUser = (messages) => {
  return messages.filter(msg =>
    (msg.senderType === 'admin' || msg.senderType === 'subadmin') && !msg.isRead
  ).length;
};

// Helper: Get last message from messages array
const getLastMessage = (messages) => {
  if (messages.length === 0) return null;
  const last = messages[messages.length - 1];
  return {
    message: last.message,
    senderType: last.senderType,
    senderName: last.senderName,
    timestamp: last.timestamp
  };
};

// Helper: Get who's handling (last admin/subadmin who replied)
const getHandledBy = (messages) => {
  for (let i = messages.length - 1; i >= 0; i--) {
    const msg = messages[i];
    if (msg.senderType === 'admin' || msg.senderType === 'subadmin') {
      return {
        id: msg.senderId,
        type: msg.senderType,
        name: msg.senderName
      };
    }
  }
  return null;
};

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
      .sort({ createdAt: -1 }) // Sort by creation time
      .skip(skip)
      .limit(limit);

    const total = await Chat.countDocuments(query);

    // Add computed fields to each chat
    const chatsWithMetadata = chats.map(chat => {
      const chatObj = chat.toObject();
      return {
        ...chatObj,
        unreadByAdmin: getUnreadByAdmin(chat.messages),
        lastMessage: getLastMessage(chat.messages),
        handledBy: getHandledBy(chat.messages)
      };
    });

    res.status(200).json({
      success: true,
      chats: chatsWithMetadata,
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

// Get single chat by ID
const getChatById = async (req, res) => {
  try {
    const { chatId } = req.params;

    const chat = await Chat.findById(chatId)
      .populate('userId', 'fullName mobile email gotra city');

    if (!chat) {
      return res.status(404).json({
        success: false,
        message: "Chat not found"
      });
    }

    // Mark user messages as read by admin/subadmin
    let hasChanges = false;
    chat.messages.forEach(msg => {
      if (msg.senderType === 'user' && !msg.isRead) {
        msg.isRead = true;
        msg.readAt = new Date();
        hasChanges = true;
      }
    });

    if (hasChanges) {
      await chat.save();
    }

    // Add computed fields
    const chatObj = chat.toObject();
    const responseChat = {
      ...chatObj,
      unreadByAdmin: getUnreadByAdmin(chat.messages),
      unreadByUser: getUnreadByUser(chat.messages),
      lastMessage: getLastMessage(chat.messages),
      handledBy: getHandledBy(chat.messages)
    };

    res.status(200).json({
      success: true,
      chat: responseChat
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
      timestamp: new Date(),
      isRead: false
    });

    // Update status to active if it was pending
    if (chat.status === 'pending') {
      chat.status = 'active';
    }

    await chat.save();

    const updatedChat = await Chat.findById(chatId)
      .populate('userId', 'fullName mobile email');

    // Add computed fields
    const chatObj = updatedChat.toObject();
    const responseChat = {
      ...chatObj,
      unreadByAdmin: getUnreadByAdmin(updatedChat.messages),
      unreadByUser: getUnreadByUser(updatedChat.messages),
      lastMessage: getLastMessage(updatedChat.messages),
      handledBy: getHandledBy(updatedChat.messages)
    };

    console.log(`[CHAT] Reply sent by ${senderType}: ${senderName} (ID: ${senderId})`);

    res.status(200).json({
      success: true,
      message: "Reply sent successfully",
      chat: responseChat
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

    if (!['pending', 'active', 'closed'].includes(status)) {
      return res.status(400).json({
        success: false,
        message: "Invalid status. Must be pending, active, or closed"
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
      .populate('userId', 'fullName mobile email');

    // Add computed fields
    const chatObj = updatedChat.toObject();
    const responseChat = {
      ...chatObj,
      unreadByAdmin: getUnreadByAdmin(updatedChat.messages),
      unreadByUser: getUnreadByUser(updatedChat.messages),
      lastMessage: getLastMessage(updatedChat.messages),
      handledBy: getHandledBy(updatedChat.messages)
    };

    console.log(`[CHAT] Status updated to ${status}`);

    res.status(200).json({
      success: true,
      message: "Chat status updated successfully",
      chat: responseChat
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
    const pendingChats = await Chat.countDocuments({ status: 'pending' });
    const activeChats = await Chat.countDocuments({ status: 'active' });
    const closedChats = await Chat.countDocuments({ status: 'closed' });

    // Calculate unread count by checking all chats
    const allChats = await Chat.find({ status: { $in: ['pending', 'active'] } }).select('messages');
    let unreadCount = 0;

    allChats.forEach(chat => {
      unreadCount += getUnreadByAdmin(chat.messages);
    });

    res.status(200).json({
      success: true,
      stats: {
        total: totalChats,
        pending: pendingChats,
        active: activeChats,
        closed: closedChats,
        unread: unreadCount
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
