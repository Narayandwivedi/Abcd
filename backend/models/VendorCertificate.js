const mongoose = require("mongoose");

const vendorCertificateSchema = new mongoose.Schema({
  certificateNumber: {
    type: String,
    required: true,
    unique: true,
    index: true, // Index for fast lookups
  },
  vendorId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Vendor',
    required: true,
    index: true, // Index for faster queries
  },
  downloadLink: {
    type: String,
    required: true,
  },
  issueDate: {
    type: Date,
    required: true,
    index: true, // Index for date range queries
  },
  expiryDate: {
    type: Date,
    required: true,
    index: true, // Index for expiry checks
  },
  renewalCount: {
    type: Number,
    default: 0, // 0=original, 1=first renewal, 2=second renewal, etc.
  },
  previousCertificate: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'VendorCertificate',
    default: null, // Reference to the certificate this one replaced
  },
  status: {
    type: String,
    enum: ['active', 'expired', 'revoked', 'replaced'],
    default: 'active',
    index: true,
  },
  pdfDeleted: {
    type: Boolean,
    default: false, // Track if PDF file has been deleted (for old/renewed certificates)
  },
  remarks: {
    type: String,
    default: '',
  },
}, { timestamps: true });

// Compound indexes for efficient queries
vendorCertificateSchema.index({ vendorId: 1, status: 1 });
vendorCertificateSchema.index({ vendorId: 1, createdAt: -1 });

// Virtual to check if certificate is expired
vendorCertificateSchema.virtual('isExpired').get(function() {
  return new Date() > this.expiryDate;
});

// Static method to get all certificates for a vendor (history)
vendorCertificateSchema.statics.getCertificateHistory = async function(vendorId) {
  return this.find({ vendorId })
    .sort({ createdAt: -1 })
    .exec();
};

// Static method to get active certificate for a vendor
vendorCertificateSchema.statics.getActiveCertificate = async function(vendorId) {
  return this.findOne({
    vendorId,
    status: 'active',
    pdfDeleted: false
  })
  .sort({ createdAt: -1 })
  .exec();
};

// Instance method to mark certificate as replaced
vendorCertificateSchema.methods.markAsReplaced = async function() {
  this.status = 'replaced';
  return this.save();
};

// Instance method to mark certificate as expired
vendorCertificateSchema.methods.markAsExpired = async function() {
  this.status = 'expired';
  return this.save();
};

const VendorCertificate = mongoose.model("VendorCertificate", vendorCertificateSchema);
module.exports = VendorCertificate;
