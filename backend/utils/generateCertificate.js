const PDFDocument = require('pdfkit');
const fs = require('fs');
const path = require('path');

// Generate unique certificate number in format: ym-cg-YYYY-MM-NNNNN
const generateCertificateNumber = async () => {
  const User = require('../models/User');

  // Get current year and month
  const now = new Date();
  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, '0'); // Months are 0-indexed

  // Count total users with certificates
  const certificateCount = await User.countDocuments({
    certificateNumber: { $exists: true, $ne: null }
  });

  // Generate member number (next member)
  const memberNumber = String(certificateCount + 1).padStart(5, '0');

  // Format: YM-CG-YYYY-MM-NNNNN
  return `YM-CG-${year}-${month}-${memberNumber}`;
};

// Generate certificate PDF
const generateCertificatePDF = async (user) => {
  try {
    // Create certificates directory if it doesn't exist
    const certificatesDir = path.join(__dirname, '..', 'uploads', 'certificates');
    if (!fs.existsSync(certificatesDir)) {
      fs.mkdirSync(certificatesDir, { recursive: true });
    }

    // Generate unique certificate number
    const certificateNumber = await generateCertificateNumber();
    const fileName = `certificate_${user._id}_${Date.now()}.pdf`;
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

      // Add decorative border
      doc.rect(20, 20, doc.page.width - 40, doc.page.height - 40)
        .lineWidth(3)
        .strokeColor('#1e40af')
        .stroke();

      doc.rect(30, 30, doc.page.width - 60, doc.page.height - 60)
        .lineWidth(1)
        .strokeColor('#93c5fd')
        .stroke();

      // Add ABCD logo at the top
      const logoPath = path.join(__dirname, '..', '..', 'frontend', 'public', 'abcd logo3.png');
      if (fs.existsSync(logoPath)) {
        doc.image(logoPath, (doc.page.width - 120) / 2, 45, {
          width: 120,
          height: 120
        });
      }

      // Add organization name with (ABCD) on same line
      doc.fontSize(14)
        .fillColor('#1e40af')
        .font('Helvetica-Bold')
        .text('Agrawal Business and Community Development (ABCD)', 0, 172, {
          align: 'center',
          width: doc.page.width
        });

      // Add title
      doc.fontSize(28)
        .fillColor('#1e40af')
        .font('Helvetica-Bold')
        .text('CERTIFICATE OF MEMBERSHIP', 0, 205, {
          align: 'center',
          width: doc.page.width
        });

      // Add decorative line
      doc.moveTo(150, 242)
        .lineTo(doc.page.width - 150, 242)
        .strokeColor('#93c5fd')
        .lineWidth(2)
        .stroke();

      // Add "This is to certify that"
      doc.fontSize(12)
        .fillColor('#374151')
        .font('Helvetica')
        .text('This is to certify that', 0, 257, {
          align: 'center',
          width: doc.page.width
        });

      // Add user's name
      doc.fontSize(24)
        .fillColor('#1e40af')
        .font('Helvetica-Bold')
        .text(user.fullName.toUpperCase(), 0, 282, {
          align: 'center',
          width: doc.page.width
        });

      // Add Father's name - Bold with same color as user name
      doc.fontSize(12)
        .fillColor('#1e40af')
        .font('Helvetica-Bold')
        .text(`S/O ${user.fatherName}`, 0, 317, {
          align: 'center',
          width: doc.page.width
        });

      // Add gotra
      doc.fontSize(13)
        .fillColor('#1e40af')
        .font('Helvetica-Bold')
        .text(`Gotra: ${user.gotra}`, 0, 339, {
          align: 'center',
          width: doc.page.width
        });

      // Add city
      doc.fontSize(12)
        .fillColor('#374151')
        .font('Helvetica')
        .text(`City: ${user.city || 'N/A'}`, 0, 359, {
          align: 'center',
          width: doc.page.width
        });

      // Add description
      doc.fontSize(12)
        .fillColor('#374151')
        .font('Helvetica')
        .text('is a verified member of our community', 0, 380, {
          align: 'center',
          width: doc.page.width
        });

      // Add certificate number
      doc.fontSize(9)
        .fillColor('#6b7280')
        .font('Helvetica-Bold')
        .text(`Certificate Number: ${certificateNumber}`, 0, 402, {
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
        .text(`Issued on: ${issueDate}`, 0, 417, {
          align: 'center',
          width: doc.page.width
        });

      // Add valid till date
      doc.fontSize(9)
        .fillColor('#6b7280')
        .font('Helvetica-Bold')
        .text('Valid till: 31 March 2027', 0, 432, {
          align: 'center',
          width: doc.page.width
        });

      // Add location at bottom center
      doc.fontSize(9)
        .fillColor('#1e40af')
        .font('Helvetica-Bold')
        .text('AT H.Q. Raipur India', 0, 450, {
          align: 'center',
          width: doc.page.width
        });

      // Add terms & conditions text at left bottom
      doc.fontSize(7)
        .fillColor('#6b7280')
        .font('Helvetica-Oblique')
        .text('Subject to Terms & Conditions', 50, 510, {
          align: 'left'
        });

      // Add Chief Patron signature image on left side
      const chiefSignaturePath = path.join(__dirname, '..', '..', 'frontend', 'public', 'cheif sign (1).png');
      if (fs.existsSync(chiefSignaturePath)) {
        doc.image(chiefSignaturePath, 100, 420, {
          width: 120,
          height: 40,
          align: 'center'
        });
      }

      // Add Chief Patron signature line
      doc.moveTo(100, 465)
        .lineTo(220, 465)
        .strokeColor('#374151')
        .lineWidth(1)
        .stroke();

      // Add Dr Ashok Agrawal text
      doc.fontSize(9)
        .fillColor('#374151')
        .font('Helvetica-Bold')
        .text('Dr Ashok Agrawal', 100, 470, {
          align: 'center',
          width: 120
        });

      // Add Chief Patron-ABCD text
      doc.fontSize(8)
        .fillColor('#374151')
        .font('Helvetica')
        .text('(Chief Patron - ABCD)', 100, 483, {
          align: 'center',
          width: 120
        });

      // Add signature image on right side
      const signaturePath = path.join(__dirname, '..', '..', 'frontend', 'public', 'signature.png');
      if (fs.existsSync(signaturePath)) {
        doc.image(signaturePath, doc.page.width - 220, 420, {
          width: 120,
          height: 40,
          align: 'center'
        });
      }

      // Add signature line
      doc.moveTo(doc.page.width - 220, 465)
        .lineTo(doc.page.width - 100, 465)
        .strokeColor('#374151')
        .lineWidth(1)
        .stroke();

      // Add Mr Lalit Agrawal text
      doc.fontSize(9)
        .fillColor('#374151')
        .font('Helvetica-Bold')
        .text('Mr Lalit Agrawal', doc.page.width - 220, 470, {
          align: 'center',
          width: 120
        });

      // Add Chairman-ABCD text
      doc.fontSize(8)
        .fillColor('#374151')
        .font('Helvetica')
        .text('(Chairman-ABCD)', doc.page.width - 220, 483, {
          align: 'center',
          width: 120
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
  generateCertificateNumber,
  generateCertificatePDF
};
