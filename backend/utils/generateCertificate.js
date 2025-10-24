const PDFDocument = require('pdfkit');
const fs = require('fs');
const path = require('path');

// Generate unique certificate number
const generateCertificateNumber = () => {
  const prefix = 'CERT';
  const timestamp = Date.now().toString().slice(-8);
  const random = Math.floor(Math.random() * 1000).toString().padStart(3, '0');
  return `${prefix}-${timestamp}-${random}`;
};

// Generate certificate PDF
const generateCertificatePDF = async (user) => {
  return new Promise((resolve, reject) => {
    try {
      // Create certificates directory if it doesn't exist
      const certificatesDir = path.join(__dirname, '..', 'uploads', 'certificates');
      if (!fs.existsSync(certificatesDir)) {
        fs.mkdirSync(certificatesDir, { recursive: true });
      }

      // Generate unique certificate number
      const certificateNumber = generateCertificateNumber();
      const fileName = `certificate_${user._id}_${Date.now()}.pdf`;
      const filePath = path.join(certificatesDir, fileName);

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
        doc.image(logoPath, (doc.page.width - 80) / 2, 50, {
          width: 80,
          height: 80
        });
      }

      // Add organization name
      doc.fontSize(18)
        .fillColor('#1e40af')
        .font('Helvetica-Bold')
        .text('Agrawal Business and Community Development', 0, 145, {
          align: 'center',
          width: doc.page.width
        });

      doc.fontSize(14)
        .fillColor('#6b7280')
        .font('Helvetica')
        .text('(ABCD)', 0, 168, {
          align: 'center',
          width: doc.page.width
        });

      // Add title
      doc.fontSize(36)
        .fillColor('#1e40af')
        .font('Helvetica-Bold')
        .text('CERTIFICATE OF MEMBERSHIP', 0, 210, {
          align: 'center',
          width: doc.page.width
        });

      // Add decorative line
      doc.moveTo(150, 260)
        .lineTo(doc.page.width - 150, 260)
        .strokeColor('#93c5fd')
        .lineWidth(2)
        .stroke();

      // Add "This is to certify that"
      doc.fontSize(16)
        .fillColor('#374151')
        .font('Helvetica')
        .text('This is to certify that', 0, 290, {
          align: 'center',
          width: doc.page.width
        });

      // Add user's name
      doc.fontSize(30)
        .fillColor('#1e40af')
        .font('Helvetica-Bold')
        .text(user.fullName.toUpperCase(), 0, 325, {
          align: 'center',
          width: doc.page.width
        });

      // Add Father's name
      doc.fontSize(15)
        .fillColor('#374151')
        .font('Helvetica')
        .text(`S/O ${user.fatherName}`, 0, 370, {
          align: 'center',
          width: doc.page.width
        });

      // Add gotra
      doc.fontSize(17)
        .fillColor('#1e40af')
        .font('Helvetica-Bold')
        .text(`Gotra: ${user.gotra}`, 0, 400, {
          align: 'center',
          width: doc.page.width
        });

      // Add description
      doc.fontSize(14)
        .fillColor('#374151')
        .font('Helvetica')
        .text('is a verified member of our community', 0, 435, {
          align: 'center',
          width: doc.page.width
        });

      // Add certificate number
      doc.fontSize(12)
        .fillColor('#6b7280')
        .font('Helvetica-Bold')
        .text(`Certificate Number: ${certificateNumber}`, 0, 480, {
          align: 'center',
          width: doc.page.width
        });

      // Add issue date
      const issueDate = new Date().toLocaleDateString('en-IN', {
        day: '2-digit',
        month: 'long',
        year: 'numeric'
      });

      doc.fontSize(12)
        .fillColor('#6b7280')
        .font('Helvetica')
        .text(`Issued on: ${issueDate}`, 0, 505, {
          align: 'center',
          width: doc.page.width
        });

      // Add organization name at bottom
      doc.fontSize(10)
        .fillColor('#1e40af')
        .font('Helvetica-Bold')
        .text('Agrawal Business and Community Development (ABCD)', 0, doc.page.height - 70, {
          align: 'center',
          width: doc.page.width
        });

      // Add signature image
      const signaturePath = path.join(__dirname, '..', '..', 'frontend', 'public', 'signature.png');
      if (fs.existsSync(signaturePath)) {
        doc.image(signaturePath, doc.page.width - 250, doc.page.height - 140, {
          width: 150,
          height: 50,
          align: 'center'
        });
      }

      // Add signature line
      doc.moveTo(doc.page.width - 250, doc.page.height - 85)
        .lineTo(doc.page.width - 100, doc.page.height - 85)
        .strokeColor('#374151')
        .lineWidth(1)
        .stroke();

      // Add signature section text
      doc.fontSize(12)
        .fillColor('#374151')
        .font('Helvetica-Bold')
        .text('Authorized Signature', doc.page.width - 250, doc.page.height - 75, {
          align: 'center',
          width: 150
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

    } catch (error) {
      reject(error);
    }
  });
};

module.exports = {
  generateCertificateNumber,
  generateCertificatePDF
};
