const mongoose = require("mongoose");

// Message subdocument schema
const messageSchema = new mongoose.Schema({
  senderType: {
    type: String,
    enum: ['user', 'admin', 'subadmin'],
    required: true,
    index: true
  },
  senderName: {
    type: String,
    required: true,
    trim: true
  },
  senderId: {
    type: mongoose.Schema.Types.ObjectId,
    required: true
  },
  message: {
    type: String,
    required: [true, 'Message content is required'],
    trim: true,
    minlength: [1, 'Message cannot be empty'],
    maxlength: [2000, 'Message cannot exceed 2000 characters']
  },
  isRead: {
    type: Boolean,
    default: false
  },
  readAt: {
    type: Date
  },
  timestamp: {
    type: Date,
    default: Date.now,
    index: true
  }
}, { _id: true });

// Main chat schema
const chatSchema = new mongoose.Schema({
  // Just store userId - populate when needed
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
    index: true
  },

  // Messages array
  messages: [messageSchema],

  // Chat status
  status: {
    type: String,
    enum: ['pending', 'active', 'closed'],
    default: 'pending', // pending until admin/subadmin first replies
  },

  // Optional: Priority for sorting urgent chats
  priority: {
    type: String,
    enum: ['low', 'normal', 'high'],
    default: 'normal'
  }
}, {
  timestamps: true,
});

// Indexes for better query performance
chatSchema.index({ userId: 1, status: 1 });
chatSchema.index({ status: 1, createdAt: -1 });
chatSchema.index({ 'messages.timestamp': -1 });



const Chat = mongoose.model("Chat", chatSchema);
module.exports = Chat;
