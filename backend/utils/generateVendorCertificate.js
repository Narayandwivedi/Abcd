const PDFDocument = require('pdfkit');
const fs = require('fs');
const path = require('path');

// Generate unique certificate number in format: ym-cg-v-YYYY-MM-NNNNN
const generateVendorCertificateNumber = async () => {
  const Vendor = require('../models/Vendor');

  // Get current year and month
  const now = new Date();
  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, '0'); // Months are 0-indexed

  // Count total vendors with certificates
  const certificateCount = await Vendor.countDocuments({
    certificateNumber: { $exists: true, $ne: null }
  });

  // Generate member number (next member)
  const memberNumber = String(certificateCount + 1).padStart(5, '0');

  // Format: YM-CG-V-YYYY-MM-NNNNN (V for Vendor)
  return `YM-CG-V-${year}-${month}-${memberNumber}`;
};

// Generate vendor certificate PDF
const generateVendorCertificatePDF = async (vendor) => {
  try {
    // Create certificates directory if it doesn't exist
    const certificatesDir = path.join(__dirname, '..', 'uploads', 'certificates');
    if (!fs.existsSync(certificatesDir)) {
      fs.mkdirSync(certificatesDir, { recursive: true });
    }

    // Generate unique certificate number
    const certificateNumber = await generateVendorCertificateNumber();
    const fileName = `vendor_certificate_${vendor._id}_${Date.now()}.pdf`;
    const filePath = path.join(certificatesDir, fileName);

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

      // Add category and subcategory
      doc.fontSize(11)
        .fillColor('#374151')
        .font('Helvetica')
        .text(`Category: ${vendor.category} | Sub-Category: ${vendor.subCategory}`, 0, 303, {
          align: 'center',
          width: doc.page.width
        });

      // Add city
      doc.fontSize(11)
        .fillColor('#374151')
        .font('Helvetica')
        .text(`City: ${vendor.city || 'N/A'}`, 0, 321, {
          align: 'center',
          width: doc.page.width
        });

      // Add membership category
      if (vendor.membershipCategory) {
        doc.fontSize(12)
          .fillColor('#7c3aed')
          .font('Helvetica-Bold')
          .text(`Membership Category: ${vendor.membershipCategory}`, 0, 339, {
            align: 'center',
            width: doc.page.width
          });
      }

      // Add description - CERTIFIED ABCD VENDOR
      doc.fontSize(11)
        .fillColor('#374151')
        .font('Helvetica-Bold')
        .text('is a Certified ABCD Vendor', 0, 358, {
          align: 'center',
          width: doc.page.width
        });

      // Add certificate number - HIGHLIGHTED with darker color and background
      doc.fontSize(11)
        .fillColor('#000000')
        .font('Helvetica-Bold')
        .text(`Certificate Number: ${certificateNumber}`, 0, 378, {
          align: 'center',
          width: doc.page.width
        });

      // Add issue date
      const issueDate = new Date().toLocaleDateString('en-IN', {
        day: '2-digit',
        month: 'long',
        year: 'numeric'
      });

      doc.fontSize(9)
        .fillColor('#6b7280')
        .font('Helvetica')
        .text(`Issued on: ${issueDate}`, 0, 398, {
          align: 'center',
          width: doc.page.width
        });

      // Add valid till date
      doc.fontSize(9)
        .fillColor('#6b7280')
        .font('Helvetica-Bold')
        .text('Valid till: 31 March 2027', 0, 411, {
          align: 'center',
          width: doc.page.width
        });

      // Add some spacing
      doc.moveDown(1);

      // Add full HQ address at bottom center with better spacing
      doc.fontSize(10)
        .fillColor('#7c3aed')
        .font('Helvetica-Bold')
        .text('H.Q. Raipur', 0, 433, {
          align: 'center',
          width: doc.page.width
        });

      doc.fontSize(9)
        .fillColor('#374151')
        .font('Helvetica')
        .text('Hanuman Market, Ramsagar Para, Raipur (CG) 492001', 0, 448, {
          align: 'center',
          width: doc.page.width
        });

      // Add Chief Patron signature image on left side
      const chiefSignaturePath = path.join(__dirname, '..', '..', 'frontend', 'public', 'cheif sign (1).png');
      if (fs.existsSync(chiefSignaturePath)) {
        doc.image(chiefSignaturePath, 90, 468, {
          width: 115,
          height: 38,
          align: 'center'
        });
      }

      // Add Chief Patron signature line
      doc.moveTo(90, 510)
        .lineTo(205, 510)
        .strokeColor('#374151')
        .lineWidth(1)
        .stroke();

      // Add Dr Ashok Agrawal text
      doc.fontSize(9)
        .fillColor('#374151')
        .font('Helvetica-Bold')
        .text('Dr Ashok Agrawal', 90, 514, {
          align: 'center',
          width: 115
        });

      // Add Chief Patron-ABCD text
      doc.fontSize(8)
        .fillColor('#374151')
        .font('Helvetica')
        .text('(Chief Patron - ABCD)', 90, 527, {
          align: 'center',
          width: 115
        });

      // Add signature image on right side
      const signaturePath = path.join(__dirname, '..', '..', 'frontend', 'public', 'signature.png');
      if (fs.existsSync(signaturePath)) {
        doc.image(signaturePath, doc.page.width - 205, 468, {
          width: 115,
          height: 38,
          align: 'center'
        });
      }

      // Add signature line
      doc.moveTo(doc.page.width - 205, 510)
        .lineTo(doc.page.width - 90, 510)
        .strokeColor('#374151')
        .lineWidth(1)
        .stroke();

      // Add Mr Lalit Agrawal text
      doc.fontSize(9)
        .fillColor('#374151')
        .font('Helvetica-Bold')
        .text('Mr Lalit Agrawal', doc.page.width - 205, 514, {
          align: 'center',
          width: 115
        });

      // Add Chairman-ABCD text
      doc.fontSize(8)
        .fillColor('#374151')
        .font('Helvetica')
        .text('(Chairman-ABCD)', doc.page.width - 205, 527, {
          align: 'center',
          width: 115
        });

      // Add terms & conditions text at LEFT BOTTOM CORNER - MOVED LOWER
      doc.fontSize(7)
        .fillColor('#6b7280')
        .font('Helvetica-Oblique')
        .text('Subject to Terms & Conditions', 40, 550, {
          align: 'left'
        });

      // Finalize PDF
      doc.end();

      writeStream.on('finish', () => {
        // Return the certificate details
        resolve({
          certificateNumber,
          fileName,
          filePath,
          downloadLink: `/uploads/certificates/${fileName}`
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
  generateVendorCertificateNumber,
  generateVendorCertificatePDF
};
