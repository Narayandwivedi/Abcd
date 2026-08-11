const express = require("express");
const {
  getVendorCertificateHistory,
  getActiveCertificate,
  renewVendorCertificate,
  revokeCertificate,
  regenerateCertificatePDF,
  getExpiringCertificates
} = require("../controllers/vendorCertificateController");
const adminAuth = require("../middleware/adminAuth");
const checkPermission = require("../middleware/checkPermission");

const router = express.Router();

// Admin protected routes
// GET /api/admin/vendor-certificates/expiring?days=30 - Get expiring certificates
router.get("/expiring", adminAuth, checkPermission('canViewVendors'), getExpiringCertificates);

// GET /api/admin/vendor-certificates/vendor/:vendorId/history - Get all certificates for a vendor
router.get("/vendor/:vendorId/history", adminAuth, checkPermission('canViewVendors'), getVendorCertificateHistory);

// GET /api/admin/vendor-certificates/vendor/:vendorId/active - Get active certificate
router.get("/vendor/:vendorId/active", adminAuth, checkPermission('canViewVendors'), getActiveCertificate);

// POST /api/admin/vendor-certificates/vendor/:vendorId/renew - Renew certificate
router.post("/vendor/:vendorId/renew", adminAuth, checkPermission('canApproveVendors'), renewVendorCertificate);

// POST /api/admin/vendor-certificates/:certificateId/regenerate - Regenerate PDF
router.post("/:certificateId/regenerate", adminAuth, checkPermission('canApproveVendors'), regenerateCertificatePDF);

// PATCH /api/admin/vendor-certificates/:certificateId/revoke - Revoke certificate
router.patch("/:certificateId/revoke", adminAuth, checkPermission('canApproveVendors'), revokeCertificate);

module.exports = router;
