const Chat = require("../models/Chat");
const User = require("../models/User");

// Get or create user's chat
const getUserChat = async (req, res) => {
  try {
    const userId = req.user.userId;

    // Find existing chat or create new one
    let chat = await Chat.findOne({ userId })
      .populate('userId', 'fullName mobile email')
      .populate('handledBy');

    if (!chat) {
      // Create new chat for user
      chat = await Chat.create({
        userId,
        messages: [],
        status: 'active'
      });

      chat = await Chat.findById(chat._id)
        .populate('userId', 'fullName mobile email');
    }

    // Mark as read by user
    if (chat.unreadByUser > 0) {
      chat.unreadByUser = 0;
      await chat.save();
    }

    res.status(200).json({
      success: true,
      chat
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
        status: 'active'
      });
    }

    // Add message
    chat.messages.push({
      senderType: 'user',
      senderName: user.fullName,
      senderId: userId,
      message: message.trim(),
      timestamp: new Date()
    });

    chat.lastMessage = message.trim();
    chat.lastMessageAt = new Date();
    chat.unreadByAdmin += 1;
    chat.status = 'active';

    await chat.save();

    const updatedChat = await Chat.findById(chat._id)
      .populate('userId', 'fullName mobile email')
      .populate('handledBy');

    console.log(`[CHAT] Message sent by user: ${user.fullName} (ID: ${userId})`);

    res.status(200).json({
      success: true,
      message: "Message sent successfully",
      chat: updatedChat
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

    const unreadCount = chat ? chat.unreadByUser : 0;

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
