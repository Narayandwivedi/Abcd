const PDFDocument = require('pdfkit');
const fs = require('fs');
const path = require('path');

// Generate unique certificate number in format: YM-CG-{year}-{month}-{6-digit-number}
// Example: YM-CG-2025-10-001001
const generateCertificateNumber = async () => {
  const Certificate = require('../models/Certificate');

  // Count total certificates issued
  const certificateCount = await Certificate.countDocuments();

  // Get current year and month
  const now = new Date();
  const currentYear = now.getFullYear();
  const currentMonth = String(now.getMonth() + 1).padStart(2, '0'); // getMonth() returns 0-11, so add 1

  // Generate certificate number starting from 001001
  // The incrementing number starts at 1 and grows with each new certificate
  const incrementingNumber = certificateCount + 1;

  // Pad the number to 6 digits (001001, 001002, etc.)
  const paddedNumber = String(incrementingNumber).padStart(6, '0');

  // Format: YM-CG-{year}-{month}-{6-digit-number}
  const certificateNumber = `YM-CG-${currentYear}-${currentMonth}-${paddedNumber}`;

  return certificateNumber;
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

    // Generate referral code from last 5 digits of certificate number
    // Example: YM-CG-2025-10-001001 -> CG01001
    const certificateDigits = certificateNumber.split('-').pop(); // Gets "001001"
    const last5Digits = certificateDigits.slice(-5); // Gets "01001"
    const referralCode = `CG${last5Digits}`; // Creates "CG01001"

    const fileName = `ABCD_MEMBER_CERTIFICATE_${certificateNumber}.pdf`;
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
        doc.image(logoPath, (doc.page.width - 110) / 2, 40, {
          width: 110,
          height: 110
        });
      }

      // Add organization name with (ABCD) on same line
      doc.fontSize(13)
        .fillColor('#1e40af')
        .font('Helvetica-Bold')
        .text('Agrawal Business and Community Development (ABCD)', 0, 160, {
          align: 'center',
          width: doc.page.width
        });

      // Add title
      doc.fontSize(26)
        .fillColor('#1e40af')
        .font('Helvetica-Bold')
        .text('CERTIFICATE OF MEMBERSHIP', 0, 185, {
          align: 'center',
          width: doc.page.width
        });

      // Add decorative line
      doc.moveTo(150, 218)
        .lineTo(doc.page.width - 150, 218)
        .strokeColor('#93c5fd')
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

      // Add user's name
      doc.fontSize(22)
        .fillColor('#1e40af')
        .font('Helvetica-Bold')
        .text(user.fullName.toUpperCase(), 0, 253, {
          align: 'center',
          width: doc.page.width
        });

      // Add Relative's name with relationship - Bold with same color as user name
      const relationship = user.relationship || 'S/O'; // Default to S/O if not specified
      doc.fontSize(11)
        .fillColor('#1e40af')
        .font('Helvetica-Bold')
        .text(`${relationship} ${user.relativeName}`, 0, 283, {
          align: 'center',
          width: doc.page.width
        });

      // Add gotra
      doc.fontSize(12)
        .fillColor('#1e40af')
        .font('Helvetica-Bold')
        .text(`Gotra: ${user.gotra}`, 0, 303, {
          align: 'center',
          width: doc.page.width
        });

      // Add location
      const locationString = `${user.state || 'N/A'} - ${user.district || 'N/A'} - ${user.city || 'N/A'}`;
      doc.fontSize(11)
        .fillColor('#374151')
        .font('Helvetica')
        .text(locationString.toUpperCase(), 0, 321, {
          align: 'center',
          width: doc.page.width
        });

      // Add description
      doc.fontSize(11)
        .fillColor('#374151')
        .font('Helvetica')
        .text('is a verified member of our community', 0, 340, {
          align: 'center',
          width: doc.page.width
        });

      // Add certificate number - HIGHLIGHTED with darker color and background
      doc.fontSize(11)
        .fillColor('#000000')
        .font('Helvetica-Bold')
        .text(`Certificate Number: ${certificateNumber}`, 0, 365, {
          align: 'center',
          width: doc.page.width
        });

      // Add referral code - HIGHLIGHTED with darker color
      doc.fontSize(11)
        .fillColor('#1e40af')
        .font('Helvetica-Bold')
        .text(`Referral Code: ${referralCode}`, 0, 380, {
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
        .text(`Issued on: ${issueDate}`, 0, 400, {
          align: 'center',
          width: doc.page.width
        });

      // Add valid till date
      doc.fontSize(9)
        .fillColor('#6b7280')
        .font('Helvetica-Bold')
        .text('Valid till: 31 March 2027', 0, 415, {
          align: 'center',
          width: doc.page.width
        });

      // Add some spacing
      doc.moveDown(1);

      // Add full HQ address at bottom center with better spacing
      doc.fontSize(10)
        .fillColor('#1e40af')
        .font('Helvetica-Bold')
        .text('H.Q. Raipur', 0, 435, {
          align: 'center',
          width: doc.page.width
        });

      doc.fontSize(9)
        .fillColor('#374151')
        .font('Helvetica')
        .text('Hanuman Market, Ramsagar Para, Raipur (CG) 492001', 0, 450, {
          align: 'center',
          width: doc.page.width
        });

      // Add Chief Patron signature image on left side
      const chiefSignaturePath = path.join(__dirname, '..', '..', 'frontend', 'public', 'cheif sign (1).png');
      if (fs.existsSync(chiefSignaturePath)) {
        doc.image(chiefSignaturePath, 90, 455, {
          width: 115,
          height: 38,
          align: 'center'
        });
      }

      // Add Chief Patron signature line
      doc.moveTo(90, 497)
        .lineTo(205, 497)
        .strokeColor('#374151')
        .lineWidth(1)
        .stroke();

      // Add Dr Ashok Agrawal text
      doc.fontSize(9)
        .fillColor('#374151')
        .font('Helvetica-Bold')
        .text('Dr Ashok Agrawal', 90, 501, {
          align: 'center',
          width: 115
        });

      // Add Chief Patron-ABCD text
      doc.fontSize(8)
        .fillColor('#374151')
        .font('Helvetica')
        .text('(Chief Patron - ABCD)', 90, 514, {
          align: 'center',
          width: 115
        });

      // Add signature image on right side
      const signaturePath = path.join(__dirname, '..', '..', 'frontend', 'public', 'signature.png');
      if (fs.existsSync(signaturePath)) {
        doc.image(signaturePath, doc.page.width - 205, 455, {
          width: 115,
          height: 38,
          align: 'center'
        });
      }

      // Add signature line
      doc.moveTo(doc.page.width - 205, 497)
        .lineTo(doc.page.width - 90, 497)
        .strokeColor('#374151')
        .lineWidth(1)
        .stroke();

      // Add Mr Lalit Agrawal text
      doc.fontSize(9)
        .fillColor('#374151')
        .font('Helvetica-Bold')
        .text('Mr Lalit Agrawal', doc.page.width - 205, 501, {
          align: 'center',
          width: 115
        });

      // Add Chairman-ABCD text
      doc.fontSize(8)
        .fillColor('#374151')
        .font('Helvetica')
        .text('(Chairman-ABCD)', doc.page.width - 205, 514, {
          align: 'center',
          width: 115
        });

      // Add terms & conditions text at LEFT BOTTOM CORNER - MOVED LOWER
      doc.fontSize(7)
        .fillColor('#6b7280')
        .font('Helvetica-Oblique')
        .text('Subject to Terms & Conditions', 40, 537, {
          align: 'left'
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
          downloadLink: `/uploads/certificates/${fileName}`,
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

// Regenerate certificate PDF with existing certificate number
const regenerateCertificatePDF = async (user, existingCertificateNumber) => {
  try {
    // Create certificates directory if it doesn't exist
    const certificatesDir = path.join(__dirname, '..', 'uploads', 'certificates');
    if (!fs.existsSync(certificatesDir)) {
      fs.mkdirSync(certificatesDir, { recursive: true });
    }

    // Use the existing certificate number
    const certificateNumber = existingCertificateNumber;

    // Generate referral code from last 5 digits of certificate number
    const certificateDigits = certificateNumber.split('-').pop(); // Gets "001001"
    const last5Digits = certificateDigits.slice(-5); // Gets "01001"
    const referralCode = `CG${last5Digits}`; // Creates "CG01001"

    const fileName = `ABCD_MEMBER_CERTIFICATE_${certificateNumber}.pdf`;
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
        doc.image(logoPath, (doc.page.width - 110) / 2, 40, {
          width: 110,
          height: 110
        });
      }

      // Add organization name with (ABCD) on same line
      doc.fontSize(13)
        .fillColor('#1e40af')
        .font('Helvetica-Bold')
        .text('Agrawal Business and Community Development (ABCD)', 0, 160, {
          align: 'center',
          width: doc.page.width
        });

      // Add title
      doc.fontSize(26)
        .fillColor('#1e40af')
        .font('Helvetica-Bold')
        .text('CERTIFICATE OF MEMBERSHIP', 0, 185, {
          align: 'center',
          width: doc.page.width
        });

      // Add decorative line
      doc.moveTo(150, 218)
        .lineTo(doc.page.width - 150, 218)
        .strokeColor('#93c5fd')
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

      // Add user's name
      doc.fontSize(22)
        .fillColor('#1e40af')
        .font('Helvetica-Bold')
        .text(user.fullName.toUpperCase(), 0, 253, {
          align: 'center',
          width: doc.page.width
        });

      // Add Relative's name with relationship - Bold with same color as user name
      const relationship = user.relationship || 'S/O'; // Default to S/O if not specified
      doc.fontSize(11)
        .fillColor('#1e40af')
        .font('Helvetica-Bold')
        .text(`${relationship} ${user.relativeName}`, 0, 283, {
          align: 'center',
          width: doc.page.width
        });

      // Add gotra
      doc.fontSize(12)
        .fillColor('#1e40af')
        .font('Helvetica-Bold')
        .text(`Gotra: ${user.gotra}`, 0, 303, {
          align: 'center',
          width: doc.page.width
        });

      // Add location
      const locationString = `${user.state || 'N/A'} - ${user.district || 'N/A'} - ${user.city || 'N/A'}`;
      doc.fontSize(11)
        .fillColor('#374151')
        .font('Helvetica')
        .text(locationString.toUpperCase(), 0, 321, {
          align: 'center',
          width: doc.page.width
        });

      // Add description
      doc.fontSize(11)
        .fillColor('#374151')
        .font('Helvetica')
        .text('is a verified member of our community', 0, 340, {
          align: 'center',
          width: doc.page.width
        });

      // Add certificate number - HIGHLIGHTED with darker color and background
      doc.fontSize(11)
        .fillColor('#000000')
        .font('Helvetica-Bold')
        .text(`Certificate Number: ${certificateNumber}`, 0, 365, {
          align: 'center',
          width: doc.page.width
        });

      // Add referral code - HIGHLIGHTED with darker color
      doc.fontSize(11)
        .fillColor('#1e40af')
        .font('Helvetica-Bold')
        .text(`Referral Code: ${referralCode}`, 0, 380, {
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
        .text(`Issued on: ${issueDate}`, 0, 400, {
          align: 'center',
          width: doc.page.width
        });

      // Add valid till date
      doc.fontSize(9)
        .fillColor('#6b7280')
        .font('Helvetica-Bold')
        .text('Valid till: 31 March 2027', 0, 415, {
          align: 'center',
          width: doc.page.width
        });

      // Add some spacing
      doc.moveDown(1);

      // Add full HQ address at bottom center with better spacing
      doc.fontSize(10)
        .fillColor('#1e40af')
        .font('Helvetica-Bold')
        .text('H.Q. Raipur', 0, 435, {
          align: 'center',
          width: doc.page.width
        });

      doc.fontSize(9)
        .fillColor('#374151')
        .font('Helvetica')
        .text('Hanuman Market, Ramsagar Para, Raipur (CG) 492001', 0, 450, {
          align: 'center',
          width: doc.page.width
        });

      // Add Chief Patron signature image on left side
      const chiefSignaturePath = path.join(__dirname, '..', '..', 'frontend', 'public', 'cheif sign (1).png');
      if (fs.existsSync(chiefSignaturePath)) {
        doc.image(chiefSignaturePath, 90, 455, {
          width: 115,
          height: 38,
          align: 'center'
        });
      }

      // Add Chief Patron signature line
      doc.moveTo(90, 497)
        .lineTo(205, 497)
        .strokeColor('#374151')
        .lineWidth(1)
        .stroke();

      // Add Dr Ashok Agrawal text
      doc.fontSize(9)
        .fillColor('#374151')
        .font('Helvetica-Bold')
        .text('Dr Ashok Agrawal', 90, 501, {
          align: 'center',
          width: 115
        });

      // Add Chief Patron-ABCD text
      doc.fontSize(8)
        .fillColor('#374151')
        .font('Helvetica')
        .text('(Chief Patron - ABCD)', 90, 514, {
          align: 'center',
          width: 115
        });

      // Add signature image on right side
      const signaturePath = path.join(__dirname, '..', '..', 'frontend', 'public', 'signature.png');
      if (fs.existsSync(signaturePath)) {
        doc.image(signaturePath, doc.page.width - 205, 455, {
          width: 115,
          height: 38,
          align: 'center'
        });
      }

      // Add signature line
      doc.moveTo(doc.page.width - 205, 497)
        .lineTo(doc.page.width - 90, 497)
        .strokeColor('#374151')
        .lineWidth(1)
        .stroke();

      // Add Mr Lalit Agrawal text
      doc.fontSize(9)
        .fillColor('#374151')
        .font('Helvetica-Bold')
        .text('Mr Lalit Agrawal', doc.page.width - 205, 501, {
          align: 'center',
          width: 115
        });

      // Add Chairman-ABCD text
      doc.fontSize(8)
        .fillColor('#374151')
        .font('Helvetica')
        .text('(Chairman-ABCD)', doc.page.width - 205, 514, {
          align: 'center',
          width: 115
        });

      // Add terms & conditions text at LEFT BOTTOM CORNER - MOVED LOWER
      doc.fontSize(7)
        .fillColor('#6b7280')
        .font('Helvetica-Oblique')
        .text('Subject to Terms & Conditions', 40, 537, {
          align: 'left'
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
          downloadLink: `/uploads/certificates/${fileName}`,
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
  generateCertificateNumber,
  generateCertificatePDF,
  regenerateCertificatePDF
};
