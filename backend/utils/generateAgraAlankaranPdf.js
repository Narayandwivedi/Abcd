const fs = require('fs');
const path = require('path');
const puppeteer = require('puppeteer');
const sharp = require('sharp');
const { PDFDocument } = require('pdf-lib');

// Helper to resolve file paths relative to backend root
const resolveFilePath = (relativePath) => {
  if (!relativePath) return null;
  const normalized = relativePath.replace(/\\/g, '/').replace(/^\.?\//, '');
  const fullPath = path.resolve(__dirname, '..', normalized);
  return fs.existsSync(fullPath) ? fullPath : null;
};

// Helper to convert an image file to Base64 Data URI
const getImageDataUri = async (filePath) => {
  if (!filePath || !fs.existsSync(filePath)) return null;
  try {
    const pngBuffer = await sharp(filePath)
      .rotate()
      .resize(300, 360, { fit: 'cover' })
      .png()
      .toBuffer();
    return `data:image/png;base64,${pngBuffer.toString('base64')}`;
  } catch (err) {
    console.error('Error converting image to data URI:', err.message);
    return null;
  }
};

// HTML Template Builder for Page 1
const generatePage1Html = ({
  applicationNo,
  applicantName,
  fatherHusbandName,
  dob,
  age,
  mobileNo,
  email,
  fullAddress,
  date,
  place,
  awardCategory,
  achievementDesc,
  photoDataUri,
  createdAt,
}) => {
  const escapeHtml = (str) => {
    if (!str) return '—';
    return String(str)
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#039;');
  };

  const formattedSubmitted = createdAt
    ? new Date(createdAt).toLocaleString('en-IN')
    : new Date().toLocaleString('en-IN');
  const formattedDownloaded = new Date().toLocaleString('en-IN');

  return `<!DOCTYPE html>
<html lang="hi">
<head>
  <meta charset="UTF-8">
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=Mukta:wght@400;500;600;700;800&display=swap" rel="stylesheet">
  <style>
    @page {
      size: A4 portrait;
      margin: 0;
    }
    * {
      box-sizing: border-box;
      margin: 0;
      padding: 0;
    }
    body {
      font-family: 'Mukta', 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
      background: #ffffff;
      color: #0f172a;
      -webkit-print-color-adjust: exact;
      print-color-adjust: exact;
    }
    .page-container {
      width: 210mm;
      height: 297mm;
      max-height: 297mm;
      padding: 8mm;
      background: #f8fafc;
      position: relative;
    }
    .card {
      width: 100%;
      height: 281mm;
      border: 2px solid #b91c1c;
      border-radius: 8px;
      background: #ffffff;
      display: flex;
      flex-direction: column;
      overflow: hidden;
      box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.05);
    }
    .header {
      background: #b91c1c;
      color: #ffffff;
      padding: 14px 18px;
      border-bottom: 3.5px solid #eab308;
    }
    .header-title {
      font-size: 21px;
      font-weight: 800;
      color: #fde047;
      letter-spacing: 0.5px;
      line-height: 1.2;
    }
    .header-subtitle {
      font-size: 12.5px;
      color: #ffffff;
      opacity: 0.95;
      margin-top: 2px;
    }
    .header-appno {
      font-size: 14px;
      font-weight: 700;
      color: #fef08a;
      margin-top: 5px;
    }
    .content {
      padding: 14px 16px;
      flex: 1;
      display: flex;
      flex-direction: column;
      gap: 12px;
    }
    .top-profile-row {
      display: flex;
      gap: 14px;
      align-items: stretch;
    }
    .profile-table {
      flex: 1;
      border-collapse: collapse;
      font-size: 13px;
    }
    .profile-table td {
      padding: 7px 11px;
      border: 1px solid #e2e8f0;
      vertical-align: middle;
      line-height: 1.35;
    }
    .profile-table .label {
      width: 165px;
      font-weight: 700;
      color: #334155;
      background: #f8fafc;
      font-size: 12px;
    }
    .profile-table .value {
      color: #0f172a;
    }
    .photo-box {
      width: 115px;
      min-width: 115px;
      height: 145px;
      border: 1.5px solid #cbd5e1;
      border-radius: 6px;
      background: #f8fafc;
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      overflow: hidden;
      padding: 2px;
    }
    .photo-img {
      width: 100%;
      height: 100%;
      object-fit: cover;
      border-radius: 4px;
    }
    .photo-placeholder {
      font-size: 11px;
      color: #94a3b8;
      text-align: center;
      line-height: 1.4;
    }
    .section-banner {
      background: #f1f5f9;
      border-left: 4.5px solid #b91c1c;
      padding: 6px 12px;
      font-weight: 800;
      font-size: 13.5px;
      color: #1e293b;
      border-radius: 0 4px 4px 0;
    }
    .detail-table {
      width: 100%;
      border-collapse: collapse;
      font-size: 13px;
    }
    .detail-table td {
      padding: 8px 12px;
      border: 1px solid #e2e8f0;
      vertical-align: top;
      line-height: 1.4;
    }
    .detail-table .label {
      width: 180px;
      font-weight: 700;
      color: #334155;
      background: #f8fafc;
      font-size: 12.5px;
    }
    .detail-table .value {
      color: #0f172a;
    }
    .footer {
      padding: 7px 16px;
      background: #f8fafc;
      border-top: 1px solid #e2e8f0;
      font-size: 11px;
      color: #64748b;
      display: flex;
      justify-content: space-between;
      align-items: center;
    }
  </style>
</head>
<body>
  <div class="page-container">
    <div class="card">
      <div class="header">
        <div class="header-title">आगरा अलंकरण 2026 / AGRA ALANKARAN 2026</div>
        <div class="header-subtitle">अग्रवाल समाज रायपुर (छ.ग.) — आधिकारिक आवेदन पत्र / OFFICIAL APPLICATION DOSSIER</div>
        <div class="header-appno">आवेदन क्रमांक (Application No): ${escapeHtml(applicationNo)}</div>
      </div>

      <div class="content">
        <!-- Top Profile Row -->
        <div class="top-profile-row">
          <table class="profile-table">
            <tr>
              <td class="label">आवेदक का नाम<br><span style="font-size:10px; color:#64748b;">(Applicant Name)</span></td>
              <td class="value" style="font-weight: 700; color: #b91c1c; font-size: 14.5px;">${escapeHtml(applicantName)}</td>
            </tr>
            <tr>
              <td class="label">पिता / पति का नाम<br><span style="font-size:10px; color:#64748b;">(Father / Husband)</span></td>
              <td class="value">${escapeHtml(fatherHusbandName)}</td>
            </tr>
            <tr>
              <td class="label">जन्म तिथि एवं आयु<br><span style="font-size:10px; color:#64748b;">(DOB &amp; Age)</span></td>
              <td class="value">${escapeHtml(dob)} &nbsp;|&nbsp; <strong>आयु:</strong> ${escapeHtml(age ? `${age} वर्ष` : '—')}</td>
            </tr>
            <tr>
              <td class="label">मोबाइल नंबर<br><span style="font-size:10px; color:#64748b;">(Mobile Number)</span></td>
              <td class="value" style="font-weight: 600;">${escapeHtml(mobileNo)}</td>
            </tr>
            <tr>
              <td class="label">ईमेल आईडी<br><span style="font-size:10px; color:#64748b;">(Email Address)</span></td>
              <td class="value">${escapeHtml(email)}</td>
            </tr>
          </table>

          <div class="photo-box">
            ${photoDataUri ? `<img src="${photoDataUri}" class="photo-img" alt="Applicant Photo" />` : `<div class="photo-placeholder">पासपोर्ट फ़ोटो<br>(Passport Photo)</div>`}
          </div>
        </div>

        <!-- Section 1: Residential & Contact Info -->
        <div class="section-banner">1. निवास एवं संपर्क विवरण / Residential &amp; Contact Details</div>
        <table class="detail-table">
          <tr>
            <td class="label">पूरा पता (Full Address)</td>
            <td class="value">${escapeHtml(fullAddress)}</td>
          </tr>
          <tr>
            <td class="label">आवेदन दिनांक एवं स्थान<br><span style="font-size:10px; color:#64748b;">(Date &amp; Place)</span></td>
            <td class="value">${escapeHtml(date)} &nbsp;|&nbsp; <strong>स्थान (Place):</strong> ${escapeHtml(place)}</td>
          </tr>
        </table>

        <!-- Section 2: Award Category & Achievements -->
        <div class="section-banner">2. अलंकरण श्रेणी एवं उपलब्धि विवरण / Award &amp; Achievements</div>
        <table class="detail-table">
          <tr>
            <td class="label">अलंकरण श्रेणी (Category)</td>
            <td class="value" style="font-weight: 700; color: #b91c1c; font-size: 13.5px;">${escapeHtml(awardCategory)}</td>
          </tr>
          <tr>
            <td class="label">उपलब्धि का विवरण<br><span style="font-size:10px; color:#64748b;">(Achievement Details)</span></td>
            <td class="value" style="line-height: 1.5;">${escapeHtml(achievementDesc)}</td>
          </tr>
        </table>
      </div>

      <div class="footer">
        <span>Agra Alankaran 2026 &bull; ABCD Vyapar Admin Portal</span>
        <span>Downloaded: ${formattedDownloaded} &bull; Submitted: ${formattedSubmitted}</span>
      </div>
    </div>
  </div>
</body>
</html>`;
};

// Main generator function
const generateAgraAlankaranApplicationPdf = async (application) => {
  // Step 1: Render Page 1 via Puppeteer (100% native HarfBuzz Devanagari text shaping)
  let photoDataUri = null;
  if (application.photo) {
    const photoPath = resolveFilePath(application.photo);
    if (photoPath) {
      photoDataUri = await getImageDataUri(photoPath);
    }
  }

  const page1Html = generatePage1Html({
    applicationNo: application.applicationNo,
    applicantName: application.applicantName,
    fatherHusbandName: application.fatherHusbandName,
    dob: application.dob,
    age: application.age,
    mobileNo: application.mobileNo,
    email: application.email,
    fullAddress: application.fullAddress,
    date: application.date,
    place: application.place,
    awardCategory: application.awardCategory,
    achievementDesc: application.achievementDesc,
    photoDataUri,
    createdAt: application.createdAt,
  });

  const browser = await puppeteer.launch({
    headless: 'new',
    args: ['--no-sandbox', '--disable-setuid-sandbox', '--disable-dev-shm-usage', '--disable-gpu'],
  });

  let page1PdfBuffer;
  try {
    const page = await browser.newPage();
    await page.setContent(page1Html, { waitUntil: 'networkidle0' });
    page1PdfBuffer = await page.pdf({
      format: 'A4',
      printBackground: true,
      margin: { top: 0, right: 0, bottom: 0, left: 0 },
    });
  } finally {
    await browser.close();
  }

  // Step 2: Use pdf-lib to merge Page 1 with all attached documents
  const finalDoc = await PDFDocument.load(page1PdfBuffer);

  const rawDocs = Array.isArray(application.documents) && application.documents.length > 0
    ? application.documents
    : (application.document ? [application.document] : []);

  const pageWidth = 595.28;
  const pageHeight = 841.89;
  const margin = 28;
  const contentWidth = pageWidth - margin * 2;

  // Process and append each attached document
  for (let docIdx = 0; docIdx < rawDocs.length; docIdx++) {
    const docPathStr = rawDocs[docIdx];
    const absPath = resolveFilePath(docPathStr);

    if (!absPath) {
      console.warn(`Attached document not found on disk: ${docPathStr}`);
      continue;
    }

    const ext = path.extname(absPath).toLowerCase();

    if (ext === '.pdf') {
      try {
        const existingPdfBytes = fs.readFileSync(absPath);
        const existingPdf = await PDFDocument.load(existingPdfBytes);
        const pageIndices = existingPdf.getPageIndices();
        const copiedPages = await finalDoc.copyPages(existingPdf, pageIndices);

        copiedPages.forEach((cpPage) => {
          finalDoc.addPage(cpPage);
        });
      } catch (pdfErr) {
        console.error(`Error merging attached PDF ${absPath}:`, pdfErr.message);
      }
    } else if (['.jpg', '.jpeg', '.png', '.webp', '.gif'].includes(ext)) {
      try {
        const imgPage = finalDoc.addPage([pageWidth, pageHeight]);

        const imgBuffer = await sharp(absPath)
          .rotate()
          .png({ quality: 90 })
          .toBuffer();

        const embeddedImg = await finalDoc.embedPng(imgBuffer);
        const { width: origW, height: origH } = embeddedImg.scale(1);

        const maxImgWidth = contentWidth;
        const maxImgHeight = pageHeight - margin * 2;

        const scale = Math.min(maxImgWidth / origW, maxImgHeight / origH, 1.0);
        const displayW = origW * scale;
        const displayH = origH * scale;

        const imgX = margin + (contentWidth - displayW) / 2;
        const imgY = (pageHeight - displayH) / 2;

        imgPage.drawImage(embeddedImg, {
          x: imgX,
          y: imgY,
          width: displayW,
          height: displayH,
        });
      } catch (imgErr) {
        console.error(`Error embedding image attachment ${absPath}:`, imgErr.message);
      }
    }
  }

  const finalPdfBytes = await finalDoc.save();
  return Buffer.from(finalPdfBytes);
};

module.exports = {
  generateAgraAlankaranApplicationPdf,
};
