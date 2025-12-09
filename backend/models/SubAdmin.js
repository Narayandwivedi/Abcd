const mongoose = require("mongoose");

const subAdminSchema = new mongoose.Schema({
  fullName: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
    trim: true,
  },
  mobile: {
    type: String,
    required: true,
    unique: true,
    trim: true,
  },
  password: {
    type: String,
    required: true,
  },
  isActive: {
    type: Boolean,
    default: true,
  },
  permissions: {
    // User Management
    canViewUsers: {
      type: Boolean,
      default: false,
    },
    canEditUsers: {
      type: Boolean,
      default: false,
    },
    canDeleteUsers: {
      type: Boolean,
      default: false,
    },
    canApproveUsers: {
      type: Boolean,
      default: false,
    },

    // Vendor Management
    canViewVendors: {
      type: Boolean,
      default: false,
    },
    canEditVendors: {
      type: Boolean,
      default: false,
    },
    canDeleteVendors: {
      type: Boolean,
      default: false,
    },
    canApproveVendors: {
      type: Boolean,
      default: false,
    },

    // Content Management
    canManageContent: {
      type: Boolean,
      default: false,
    },

    // Ad Management
    canViewAds: {
      type: Boolean,
      default: false,
    },
    canCreateAds: {
      type: Boolean,
      default: false,
    },
    canEditAds: {
      type: Boolean,
      default: false,
    },
    canDeleteAds: {
      type: Boolean,
      default: false,
    },
    canApproveAds: {
      type: Boolean,
      default: false,
    },

    // Blog Management
    canViewBlogs: {
      type: Boolean,
      default: false,
    },
    canCreateBlogs: {
      type: Boolean,
      default: false,
    },
    canEditBlogs: {
      type: Boolean,
      default: false,
    },
    canDeleteBlogs: {
      type: Boolean,
      default: false,
    },
    canPublishBlogs: {
      type: Boolean,
      default: false,
    },

    // Chat Management
    canViewChats: {
      type: Boolean,
      default: false,
    },
    canReplyChats: {
      type: Boolean,
      default: false,
    },

    // Settings
    canViewSettings: {
      type: Boolean,
      default: false,
    },
    canEditSettings: {
      type: Boolean,
      default: false,
    },
  },
  lastLogin: {
    type: Date,
  },
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Admin",
    required: true,
  },
}, { timestamps: true });

const SubAdmin = mongoose.model("SubAdmin", subAdminSchema);
module.exports = SubAdmin;
