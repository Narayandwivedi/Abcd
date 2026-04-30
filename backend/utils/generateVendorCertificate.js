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

      // Add ABCD logo at the top
      const logoPath = path.join(__dirname, '..', '..', 'frontend', 'public', 'abcd logo3.png');
      if (fs.existsSync(logoPath)) {
        doc.image(logoPath, (doc.page.width - 110) / 2, 40, {
          width: 110,
          height: 110
        });
      }

      // Add organization name with (ABCD) on same line
      doc.fontSize(13)
        .fillColor('#7c3aed')
        .font('Helvetica-Bold')
        .text('Agrawal Business and Community Development (ABCD)', 0, 160, {
          align: 'center',
          width: doc.page.width
        });

      // Add title - VENDOR CERTIFICATE
      doc.fontSize(26)
        .fillColor('#7c3aed')
        .font('Helvetica-Bold')
        .text('VENDOR CERTIFICATE', 0, 185, {
          align: 'center',
          width: doc.page.width
        });

      // Add decorative line
      doc.moveTo(150, 218)
        .lineTo(doc.page.width - 150, 218)
        .strokeColor('#c4b5fd')
        .lineWidth(2)
        .stroke();

      // Add "This is to certify that"
      doc.fontSize(11)
        .fillColor('#374151')
        .font('Helvetica')
        .text('This is to certify that', 0, 232, {
          align: 'center',
          width: doc.page.width
        });

      // Add business name
      doc.fontSize(22)
        .fillColor('#7c3aed')
        .font('Helvetica-Bold')
        .text(vendor.businessName.toUpperCase(), 0, 253, {
          align: 'center',
          width: doc.page.width
        });

      // Add Owner's name - Bold with same color as business name
      doc.fontSize(11)
        .fillColor('#7c3aed')
        .font('Helvetica-Bold')
        .text(`Owner: ${vendor.ownerName}`, 0, 283, {
          align: 'center',
          width: doc.page.width
        });

      // Add categories and subcategories line by line
      let currentY = 303;
      if (vendor.businessCategories && vendor.businessCategories.length > 0) {
        doc.fontSize(10)
          .fillColor('#374151')
          .font('Helvetica');

        vendor.businessCategories.forEach((bc) => {
          const subCats = bc.subCategories?.map(sc => sc.name).join(', ') || 'N/A';
          doc.text(`${bc.category} | Sub-Category: ${subCats}`, 0, currentY, {
            align: 'center',
            width: doc.page.width
          });
          currentY += 15; // Increment Y for next line
        });
      } else {
        doc.fontSize(10)
          .fillColor('#374151')
          .font('Helvetica')
          .text('Category: N/A | Sub-Category: N/A', 0, currentY, {
            align: 'center',
            width: doc.page.width
          });
        currentY += 15;
      }

      // Add city
      currentY += 3; // Small extra gap
      doc.fontSize(11)
        .fillColor('#374151')
        .font('Helvetica')
        .text(`City: ${vendor.city || 'N/A'}`, 0, currentY, {
          align: 'center',
          width: doc.page.width
        });
      currentY += 18;

      // Add membership category
      if (vendor.membershipType) {
        doc.fontSize(12)
          .fillColor('#7c3aed')
          .font('Helvetica-Bold')
          .text(`Membership Category: ${String(vendor.membershipType).toUpperCase()}`, 0, currentY, {
            align: 'center',
            width: doc.page.width
          });
        currentY += 19;
      }

      // Add description - CERTIFIED ABCD VENDOR
      doc.fontSize(11)
        .fillColor('#374151')
        .font('Helvetica-Bold')
        .text('is a Certified ABCD Vendor', 0, currentY, {
          align: 'center',
          width: doc.page.width
        });
      currentY += 20;

      // Add certificate number - HIGHLIGHTED with darker color and background
      doc.fontSize(11)
        .fillColor('#000000')
        .font('Helvetica-Bold')
        .text(`Certificate Number: ${certificateNumber}`, 0, currentY, {
          align: 'center',
          width: doc.page.width
        });
      currentY += 14;

      // Add vendor referral code
      doc.fontSize(10)
        .fillColor('#111827')
        .font('Helvetica-Bold')
        .text(`Referral Code: ${referralCode}`, 0, currentY, {
          align: 'center',
          width: doc.page.width
        });
      currentY += 16;

      // Add issue date
      const issueDate = new Date().toLocaleDateString('en-IN', {
        day: '2-digit',
        month: 'long',
        year: 'numeric'
      });

      doc.fontSize(9)
        .fillColor('#6b7280')
        .font('Helvetica')
        .text(`Issued on: ${issueDate}`, 0, currentY, {
          align: 'center',
          width: doc.page.width
        });
      currentY += 13;

      // Add valid till date
      doc.fontSize(9)
        .fillColor('#6b7280')
        .font('Helvetica-Bold')
        .text('Valid till: 31 March 2027', 0, currentY, {
          align: 'center',
          width: doc.page.width
        });

      // Add some spacing
      doc.moveDown(1);

      // Add some spacing
      currentY += 12;

      // Add full HQ address at bottom center with better spacing
      doc.fontSize(10)
        .fillColor('#7c3aed')
        .font('Helvetica-Bold')
        .text('H.Q. Raipur', 0, currentY, {
          align: 'center',
          width: doc.page.width
        });
      currentY += 15;

      doc.fontSize(9)
        .fillColor('#374151')
        .font('Helvetica')
        .text('Hanuman Market, Ramsagar Para, Raipur (CG) 492001', 0, currentY, {
          align: 'center',
          width: doc.page.width
        });
      currentY += 20;

      // Add Chief Patron signature image on left side
      const chiefSignaturePath = path.join(__dirname, '..', '..', 'frontend', 'public', 'cheif sign (1).png');
      if (fs.existsSync(chiefSignaturePath)) {
        doc.image(chiefSignaturePath, 90, currentY, {
          width: 115,
          height: 38,
          align: 'center'
        });
      }

      // Add Chief Patron signature line
      doc.moveTo(90, currentY + 42)
        .lineTo(205, currentY + 42)
        .strokeColor('#374151')
        .lineWidth(1)
        .stroke();

      // Add Dr Ashok Agrawal text
      doc.fontSize(9)
        .fillColor('#374151')
        .font('Helvetica-Bold')
        .text('Dr Ashok Agrawal', 90, currentY + 46, {
          align: 'center',
          width: 115
        });

      // Add Chief Patron-ABCD text
      doc.fontSize(8)
        .fillColor('#374151')
        .font('Helvetica')
        .text('(Chief Patron - ABCD)', 90, currentY + 59, {
          align: 'center',
          width: 115
        });

      // Add signature image on right side
      const signaturePath = path.join(__dirname, '..', '..', 'frontend', 'public', 'signature.png');
      if (fs.existsSync(signaturePath)) {
        doc.image(signaturePath, doc.page.width - 205, currentY, {
          width: 115,
          height: 38,
          align: 'center'
        });
      }

      // Add signature line
      doc.moveTo(doc.page.width - 205, currentY + 42)
        .lineTo(doc.page.width - 90, currentY + 42)
        .strokeColor('#374151')
        .lineWidth(1)
        .stroke();

      // Add Mr Lalit Agrawal text
      doc.fontSize(9)
        .fillColor('#374151')
        .font('Helvetica-Bold')
        .text('Mr Lalit Agrawal', doc.page.width - 205, currentY + 46, {
          align: 'center',
          width: 115
        });

      // Add Chairman-ABCD text
      doc.fontSize(8)
        .fillColor('#374151')
        .font('Helvetica')
        .text('(Chairman-ABCD)', doc.page.width - 205, currentY + 59, {
          align: 'center',
          width: 115
        });

      // Add terms & conditions text at LEFT BOTTOM CORNER
      doc.fontSize(7)
        .fillColor('#6b7280')
        .font('Helvetica-Oblique')
        .text('Subject to Terms & Conditions', 0, currentY + 68, {
          align: 'center',
          width: doc.page.width
        });

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
