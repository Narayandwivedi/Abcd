const PDFDocument = require('pdfkit');
const fs = require('fs');
const path = require('path');

const VENDOR_CERTIFICATE_PREFIX = 'VCG';
const VENDOR_CERTIFICATE_DIGITS = 5;

const formatVendorCertificateNumber = (sequenceNumber) =>
  `${VENDOR_CERTIFICATE_PREFIX}${String(sequenceNumber).padStart(VENDOR_CERTIFICATE_DIGITS, '0')}`;

const extractVendorCertificateSequence = (certificateNumber = '') => {
  const match = String(certificateNumber).match(/(\d+)$/);
  return match ? Number.parseInt(match[1], 10) : 0;
};

const buildVendorReferralCode = ({ certificateNumber = "" }) => String(certificateNumber);

// Generate unique certificate number in format: VCG00001, VCG00009, VCG00010
const generateVendorCertificateNumber = async () => {
  const VendorCertificate = require('../models/VendorCertificate');
  const certificates = await VendorCertificate.find({}, 'certificateNumber').lean();
  const highestSequence = certificates.reduce((maxSequence, certificate) => {
    return Math.max(maxSequence, extractVendorCertificateSequence(certificate.certificateNumber));
  }, 0);

  return formatVendorCertificateNumber(highestSequence + 1);
};

// Generate vendor certificate PDF
// If certificateNumber is provided, use it (for regeneration), otherwise generate new one
const generateVendorCertificatePDF = async (vendor, existingCertificateNumber = null) => {
  try {
    // Create vendor certificates directory if it doesn't exist
    const vendorCertificatesDir = path.join(__dirname, '..', 'uploads', 'vendor-certificates');
    if (!fs.existsSync(vendorCertificatesDir)) {
      fs.mkdirSync(vendorCertificatesDir, { recursive: true });
    }

    // Use existing certificate number or generate new one
    const certificateNumber = existingCertificateNumber || await generateVendorCertificateNumber();
    const fileName = `ABCD_VENDOR_CERTIFICATE_${certificateNumber}.pdf`;
    const filePath = path.join(vendorCertificatesDir, fileName);
    const referralCode = certificateNumber;

    return new Promise((resolve, reject) => {

      // Create PDF document
      const doc = new PDFDocument({
        size: 'A4',
        layout: 'landscape',
        margin: 50
      });

      // Pipe to file
      const writeStream = fs.createWriteStream(filePath);
      doc.pipe(writeStream);

      // Add decorative border - Purple theme for vendors
      doc.rect(20, 20, doc.page.width - 40, doc.page.height - 40)
        .lineWidth(3)
        .strokeColor('#7c3aed')
        .stroke();

      doc.rect(30, 30, doc.page.width - 60, doc.page.height - 60)
        .lineWidth(1)
        .strokeColor('#c4b5fd')
        .stroke();

      // Add ABCD logo
      const logoPath = path.join(__dirname, '..', '..', 'frontend', 'public', 'abcd logo3.png');
      if (fs.existsSync(logoPath)) {
        doc.image(logoPath, (doc.page.width - 90) / 2, 35, { width: 90, height: 90 });
      }

      // Organization name
      doc.fontSize(12).fillColor('#7c3aed').font('Helvetica-Bold')
        .text('Agrawal Business and Community Development (ABCD)', 0, 130, { align: 'center', width: doc.page.width });

      // Title
      doc.fontSize(24).fillColor('#7c3aed').font('Helvetica-Bold')
        .text('VENDOR CERTIFICATE', 0, 150, { align: 'center', width: doc.page.width });

      // Decorative line
      doc.moveTo(150, 180).lineTo(doc.page.width - 150, 180).strokeColor('#c4b5fd').lineWidth(2).stroke();

      // "This is to certify that"
      doc.fontSize(11).fillColor('#374151').font('Helvetica')
        .text('This is to certify that', 0, 190, { align: 'center', width: doc.page.width });

      // Business name
      doc.fontSize(22).fillColor('#7c3aed').font('Helvetica-Bold')
        .text(vendor.businessName.toUpperCase(), 0, 208, { align: 'center', width: doc.page.width });

      // Owner name
      doc.fontSize(11).fillColor('#7c3aed').font('Helvetica-Bold')
        .text(`Owner: ${vendor.ownerName}`, 0, 235, { align: 'center', width: doc.page.width });

      // Categories (dynamic)
      let currentY = 255;
      doc.fontSize(10).fillColor('#374151').font('Helvetica');
      if (vendor.businessCategories && vendor.businessCategories.length > 0) {
        vendor.businessCategories.forEach((bc) => {
          const subCats = bc.subCategories?.map(sc => sc.name).join(', ') || 'N/A';
          doc.text(`${bc.category} | Sub-Category: ${subCats}`, 0, currentY, { align: 'center', width: doc.page.width });
          currentY += 15;
        });
      } else {
        doc.text('Category: N/A | Sub-Category: N/A', 0, currentY, { align: 'center', width: doc.page.width });
        currentY += 15;
      }

      // Details block - shifted up to ensure single page
      currentY += 5;
      doc.fontSize(11).fillColor('#374151').font('Helvetica')
        .text(`City: ${vendor.city || 'N/A'}`, 0, currentY, { align: 'center', width: doc.page.width });
      currentY += 19;

      if (vendor.membershipType) {
        doc.fontSize(12).fillColor('#7c3aed').font('Helvetica-Bold')
          .text(`Membership Category: ${String(vendor.membershipType).toUpperCase()}`, 0, currentY, { align: 'center', width: doc.page.width });
        currentY += 20;
      }

      doc.fontSize(11).fillColor('#374151').font('Helvetica-Bold')
        .text('is a Certified ABCD Vendor', 0, currentY, { align: 'center', width: doc.page.width });
      currentY += 20;

      doc.fontSize(11).fillColor('#000000').font('Helvetica-Bold')
        .text(`Certificate Number: ${certificateNumber}`, 0, currentY, { align: 'center', width: doc.page.width });
      currentY += 15;

      doc.fontSize(10).fillColor('#111827').font('Helvetica-Bold')
        .text(`Referral Code: ${referralCode}`, 0, currentY, { align: 'center', width: doc.page.width });
      currentY += 17;

      const issueDate = new Date().toLocaleDateString('en-IN', { day: '2-digit', month: 'long', year: 'numeric' });
      doc.fontSize(9).fillColor('#6b7280').font('Helvetica')
        .text(`Issued on: ${issueDate}  |  Valid till: 31 March 2027`, 0, currentY, { align: 'center', width: doc.page.width });

      // FIXED POSITIONS FOR BOTTOM ELEMENTS - moved higher to stay within bottom margin
      const fixedHqY = 420;
      const fixedSigY = 455;
      const fixedDisclaimerY = 520;

      // HQ Address
      doc.fontSize(10).fillColor('#7c3aed').font('Helvetica-Bold')
        .text('H.Q. Raipur', 0, fixedHqY, { align: 'center', width: doc.page.width });
      doc.fontSize(9).fillColor('#374151').font('Helvetica')
        .text('Hanuman Market, Ramsagar Para, Raipur (CG) 492001', 0, fixedHqY + 14, { align: 'center', width: doc.page.width });

      // Signatures
      const chiefSignaturePath = path.join(__dirname, '..', '..', 'frontend', 'public', 'cheif sign (1).png');
      const signaturePath = path.join(__dirname, '..', '..', 'frontend', 'public', 'signature.png');
      const sigHeight = 35;
      
      if (fs.existsSync(chiefSignaturePath)) {
        doc.image(chiefSignaturePath, 100, fixedSigY, { width: 100, height: sigHeight });
      }
      if (fs.existsSync(signaturePath)) {
        doc.image(signaturePath, doc.page.width - 200, fixedSigY, { width: 100, height: sigHeight });
      }

      const lineY = fixedSigY + sigHeight + 2;
      // Left sign
      doc.moveTo(100, lineY).lineTo(200, lineY).strokeColor('#374151').lineWidth(1).stroke();
      doc.fontSize(9).fillColor('#374151').font('Helvetica-Bold').text('Dr Ashok Agrawal', 100, lineY + 3, { align: 'center', width: 100 });
      doc.fontSize(8).fillColor('#374151').font('Helvetica').text('(Chief Patron - ABCD)', 100, lineY + 14, { align: 'center', width: 100 });

      // Right sign
      doc.moveTo(doc.page.width - 200, lineY).lineTo(doc.page.width - 100, lineY).strokeColor('#374151').lineWidth(1).stroke();
      doc.fontSize(9).fillColor('#374151').font('Helvetica-Bold').text('Mr Lalit Agrawal', doc.page.width - 200, lineY + 3, { align: 'center', width: 100 });
      doc.fontSize(8).fillColor('#374151').font('Helvetica').text('(Chairman-ABCD)', doc.page.width - 200, lineY + 14, { align: 'center', width: 100 });

      // Disclaimer - Absolute bottom center (on the same row area as signatures)
      doc.fontSize(7).fillColor('#6b7280').font('Helvetica-Oblique')
        .text('Subject to Terms & Conditions', 0, fixedDisclaimerY, { align: 'center', width: doc.page.width });

      // Finalize PDF
      doc.end();

      writeStream.on('finish', () => {
        // Return the certificate details
        resolve({
          certificateNumber,
          referralCode,
          fileName,
          filePath,
          downloadLink: `/uploads/vendor-certificates/${fileName}`,
          issueDate: new Date(),
          expiryDate: new Date('2027-03-31')
        });
      });

      writeStream.on('error', (error) => {
        reject(error);
      });
    });
  } catch (error) {
    throw error;
  }
};

module.exports = {
  formatVendorCertificateNumber,
  extractVendorCertificateSequence,
  buildVendorReferralCode,
  generateVendorCertificateNumber,
  generateVendorCertificatePDF
};
