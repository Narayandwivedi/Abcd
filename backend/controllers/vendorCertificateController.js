const VendorCertificate = require("../models/VendorCertificate");
const Vendor = require("../models/Vendor");
const { generateVendorCertificatePDF } = require("../utils/generateVendorCertificate");
const fs = require("fs");
const path = require("path");

// Get all certificates for a vendor (history)
const getVendorCertificateHistory = async (req, res) => {
  try {
    const { vendorId } = req.params;

    const certificates = await VendorCertificate.find({ vendorId })
      .sort({ createdAt: -1 })
      .select('certificateNumber downloadLink issueDate expiryDate renewalCount status pdfDeleted createdAt');

    return res.status(200).json({
      success: true,
      count: certificates.length,
      certificates
    });
  } catch (error) {
    console.error('Get vendor certificate history error:', error);
    return res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// Get active certificate for a vendor
const getActiveCertificate = async (req, res) => {
  try {
    const { vendorId } = req.params;

    const certificate = await VendorCertificate.getActiveCertificate(vendorId);

    if (!certificate) {
      return res.status(404).json({
        success: false,
        message: "No active certificate found for this vendor"
      });
    }

    return res.status(200).json({
      success: true,
      certificate
    });
  } catch (error) {
    console.error('Get active certificate error:', error);
    return res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// Renew vendor certificate
const renewVendorCertificate = async (req, res) => {
  try {
    const { vendorId } = req.params;

    // Find vendor
    const vendor = await Vendor.findById(vendorId)
      .populate('activeCertificate');

    if (!vendor) {
      return res.status(404).json({
        success: false,
        message: "Vendor not found"
      });
    }

    // Get old certificate
    const oldCertificate = await VendorCertificate.findById(vendor.activeCertificate);

    if (!oldCertificate) {
      return res.status(404).json({
        success: false,
        message: "No active certificate found to renew"
      });
    }

    // Mark old certificate as replaced
    await oldCertificate.markAsReplaced();

    // Delete old PDF if exists
    if (oldCertificate.downloadLink && !oldCertificate.pdfDeleted) {
      const oldPdfPath = path.join(__dirname, '..', oldCertificate.downloadLink);
      if (fs.existsSync(oldPdfPath)) {
        fs.unlinkSync(oldPdfPath);
        oldCertificate.pdfDeleted = true;
        await oldCertificate.save();
        console.log(`[VENDOR CERT] Old PDF deleted: ${oldPdfPath}`);
      }
    }

    // Generate new certificate PDF
    const certificateData = await generateVendorCertificatePDF(vendor);

    // Create new certificate document with incremented renewal count
    const newCertificate = new VendorCertificate({
      certificateNumber: certificateData.certificateNumber,
      vendorId: vendor._id,
      downloadLink: certificateData.downloadLink,
      issueDate: certificateData.issueDate,
      expiryDate: certificateData.expiryDate,
      renewalCount: oldCertificate.renewalCount + 1,
      previousCertificate: oldCertificate._id,
      status: 'active',
      pdfDeleted: false
    });

    await newCertificate.save();

    // Update vendor's active certificate reference
    vendor.activeCertificate = newCertificate._id;
    await vendor.save();

    console.log(`[VENDOR CERT] Certificate renewed for vendor ${vendor.businessName} - New: ${newCertificate.certificateNumber}, Old: ${oldCertificate.certificateNumber}`);

    return res.status(200).json({
      success: true,
      message: "Certificate renewed successfully",
      certificate: {
        certificateNumber: newCertificate.certificateNumber,
        downloadLink: newCertificate.downloadLink,
        renewalCount: newCertificate.renewalCount,
        issueDate: newCertificate.issueDate,
        expiryDate: newCertificate.expiryDate
      },
      previousCertificate: {
        certificateNumber: oldCertificate.certificateNumber,
        renewalCount: oldCertificate.renewalCount
      }
    });
  } catch (error) {
    console.error('Renew vendor certificate error:', error);
    return res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// Revoke vendor certificate
const revokeCertificate = async (req, res) => {
  try {
    const { certificateId } = req.params;
    const { remarks } = req.body;

    const certificate = await VendorCertificate.findById(certificateId);

    if (!certificate) {
      return res.status(404).json({
        success: false,
        message: "Certificate not found"
      });
    }

    certificate.status = 'revoked';
    certificate.remarks = remarks || 'Certificate revoked by admin';
    await certificate.save();

    // Update vendor's active certificate if this was the active one
    const vendor = await Vendor.findOne({ activeCertificate: certificateId });
    if (vendor) {
      vendor.activeCertificate = null;
      await vendor.save();
    }

    return res.status(200).json({
      success: true,
      message: "Certificate revoked successfully",
      certificate
    });
  } catch (error) {
    console.error('Revoke certificate error:', error);
    return res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// Regenerate certificate PDF (if deleted or corrupted)
const regenerateCertificatePDF = async (req, res) => {
  try {
    const { certificateId } = req.params;

    const certificate = await VendorCertificate.findById(certificateId)
      .populate('vendorId');

    if (!certificate) {
      return res.status(404).json({
        success: false,
        message: "Certificate not found"
      });
    }

    const vendor = certificate.vendorId;

    // Delete old PDF if exists
    if (certificate.downloadLink) {
      const oldPdfPath = path.join(__dirname, '..', certificate.downloadLink);
      if (fs.existsSync(oldPdfPath)) {
        fs.unlinkSync(oldPdfPath);
        console.log(`[VENDOR CERT] Old PDF deleted for regeneration: ${oldPdfPath}`);
      }
    }

    // Generate new PDF with same certificate number
    const certificateData = await generateVendorCertificatePDF(vendor, certificate.certificateNumber);

    // Update certificate with new download link
    certificate.downloadLink = certificateData.downloadLink;
    certificate.pdfDeleted = false;
    await certificate.save();

    console.log(`[VENDOR CERT] Certificate PDF regenerated for ${vendor.businessName} - ${certificate.certificateNumber}`);

    return res.status(200).json({
      success: true,
      message: "Certificate PDF regenerated successfully",
      certificate: {
        certificateNumber: certificate.certificateNumber,
        downloadLink: certificate.downloadLink
      }
    });
  } catch (error) {
    console.error('Regenerate certificate PDF error:', error);
    return res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// Get all expiring certificates (within next 30 days)
const getExpiringCertificates = async (req, res) => {
  try {
    const { days = 30 } = req.query;

    const today = new Date();
    const futureDate = new Date();
    futureDate.setDate(today.getDate() + parseInt(days));

    const expiringCertificates = await VendorCertificate.find({
      status: 'active',
      expiryDate: {
        $gte: today,
        $lte: futureDate
      }
    })
    .populate('vendorId', 'businessName ownerName mobile email')
    .sort({ expiryDate: 1 });

    return res.status(200).json({
      success: true,
      count: expiringCertificates.length,
      certificates: expiringCertificates
    });
  } catch (error) {
    console.error('Get expiring certificates error:', error);
    return res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

module.exports = {
  getVendorCertificateHistory,
  getActiveCertificate,
  renewVendorCertificate,
  revokeCertificate,
  regenerateCertificatePDF,
  getExpiringCertificates
};
