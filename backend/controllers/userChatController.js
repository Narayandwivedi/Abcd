const Chat = require("../models/Chat");
const User = require("../models/User");

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

// Get or create user's chat
const getUserChat = async (req, res) => {
  try {
    const userId = req.user.userId;

    // Find existing chat or create new one
    let chat = await Chat.findOne({ userId })
      .populate('userId', 'fullName mobile email');

    if (!chat) {
      // Create new chat for user
      chat = await Chat.create({
        userId,
        messages: [],
        status: 'pending' // Pending until admin replies
      });

      chat = await Chat.findById(chat._id)
        .populate('userId', 'fullName mobile email');
    }

    // Mark admin/subadmin messages as read by user
    let hasChanges = false;
    chat.messages.forEach(msg => {
      if ((msg.senderType === 'admin' || msg.senderType === 'subadmin') && !msg.isRead) {
        msg.isRead = true;
        msg.readAt = new Date();
        hasChanges = true;
      }
    });

    if (hasChanges) {
      await chat.save();
      // Reload to get updated data
      chat = await Chat.findById(chat._id)
        .populate('userId', 'fullName mobile email');
    }

    // Add computed fields
    const chatObj = chat.toObject();
    const responseChat = {
      ...chatObj,
      unreadByUser: getUnreadByUser(chat.messages),
      lastMessage: getLastMessage(chat.messages),
      handledBy: getHandledBy(chat.messages)
    };

    res.status(200).json({
      success: true,
      chat: responseChat
    });
  } catch (error) {
    console.error("Error fetching user chat:", error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch chat",
      error: error.message
    });
  }
};

// Send message (User) - No delete/edit option
const sendMessage = async (req, res) => {
  try {
    const userId = req.user.userId;
    const { message } = req.body;

    if (!message || !message.trim()) {
      return res.status(400).json({
        success: false,
        message: "Message is required"
      });
    }

    // Get user info
    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found"
      });
    }

    // Find or create chat
    let chat = await Chat.findOne({ userId });

    if (!chat) {
      chat = await Chat.create({
        userId,
        messages: [],
        status: 'pending' // Pending until admin replies
      });
    }

    // Add message
    chat.messages.push({
      senderType: 'user',
      senderName: user.fullName,
      senderId: userId,
      message: message.trim(),
      timestamp: new Date(),
      isRead: false
    });

    // Keep status as is (pending if no admin replied, active if admin already replied)
    await chat.save();

    const updatedChat = await Chat.findById(chat._id)
      .populate('userId', 'fullName mobile email');

    // Add computed fields
    const chatObj = updatedChat.toObject();
    const responseChat = {
      ...chatObj,
      unreadByUser: getUnreadByUser(updatedChat.messages),
      lastMessage: getLastMessage(updatedChat.messages),
      handledBy: getHandledBy(updatedChat.messages)
    };

    console.log(`[CHAT] Message sent by user: ${user.fullName} (ID: ${userId})`);

    res.status(200).json({
      success: true,
      message: "Message sent successfully",
      chat: responseChat
    });
  } catch (error) {
    console.error("Error sending message:", error);
    res.status(500).json({
      success: false,
      message: "Failed to send message",
      error: error.message
    });
  }
};

// Get unread count for user
const getUnreadCount = async (req, res) => {
  try {
    const userId = req.user.userId;

    const chat = await Chat.findOne({ userId });

    if (!chat) {
      return res.status(200).json({
        success: true,
        unreadCount: 0
      });
    }

    const unreadCount = getUnreadByUser(chat.messages);

    res.status(200).json({
      success: true,
      unreadCount
    });
  } catch (error) {
    console.error("Error fetching unread count:", error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch unread count",
      error: error.message
    });
  }
};

module.exports = {
  getUserChat,
  sendMessage,
  getUnreadCount
};
