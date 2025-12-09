const mongoose = require("mongoose");

const chatSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
    index: true
  },
  messages: [{
    senderType: {
      type: String,
      enum: ['user', 'admin', 'subadmin'],
      required: true
    },
    senderName: {
      type: String,
      required: true
    },
    senderId: {
      type: mongoose.Schema.Types.ObjectId,
      required: true
    },
    message: {
      type: String,
      required: true,
      trim: true
    },
    timestamp: {
      type: Date,
      default: Date.now
    }
  }],
  // Who is handling this chat
  handledBy: {
    type: mongoose.Schema.Types.ObjectId,
    refPath: 'handlerModel'
  },
  handlerModel: {
    type: String,
    enum: ['Admin', 'SubAdmin']
  },
  handlerName: {
    type: String
  },
  lastMessage: {
    type: String
  },
  lastMessageAt: {
    type: Date,
    default: Date.now
  },
  unreadByAdmin: {
    type: Number,
    default: 0
  },
  unreadByUser: {
    type: Number,
    default: 0
  },
  status: {
    type: String,
    enum: ['active', 'closed'],
    default: 'active'
  }
}, { timestamps: true });

// Index for faster queries
chatSchema.index({ userId: 1 });
chatSchema.index({ lastMessageAt: -1 });

const Chat = mongoose.model("Chat", chatSchema);
module.exports = Chat;
