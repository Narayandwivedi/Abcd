const fs = require('fs');
const path = require('path');
const sharp = require('sharp');
const { createCanvas, loadImage, GlobalFonts } = require('@napi-rs/canvas');
const { PDFDocument } = require('pdf-lib');

// Register Mukta font with Skia engine for 100% native Devanagari HarfBuzz shaping
const muktaRegPath = path.join(__dirname, '..', 'fonts', 'Mukta-Regular.ttf');
const muktaBoldPath = path.join(__dirname, '..', 'fonts', 'Mukta-Bold.ttf');

if (fs.existsSync(muktaRegPath)) {
  GlobalFonts.registerFromPath(muktaRegPath, 'Mukta');
}
if (fs.existsSync(muktaBoldPath)) {
  GlobalFonts.registerFromPath(muktaBoldPath, 'MuktaBold');
}

// Helper to resolve file paths relative to backend root
const resolveFilePath = (relativePath) => {
  if (!relativePath) return null;
  const normalized = relativePath.replace(/\\/g, '/').replace(/^\.?\//, '');
  const fullPath = path.resolve(__dirname, '..', normalized);
  return fs.existsSync(fullPath) ? fullPath : null;
};

// Text wrapping helper for Canvas 2D
const wrapCanvasText = (ctx, text, maxWidth) => {
  if (!text) return [];
  const lines = [];
  const paragraphs = String(text).split(/\r?\n/);

  for (const para of paragraphs) {
    const trimmed = para.trim();
    if (!trimmed) {
      lines.push('');
      continue;
    }
    const words = trimmed.split(/\s+/);
    let currentLine = '';

    for (const word of words) {
      const testLine = currentLine ? `${currentLine} ${word}` : word;
      const metrics = ctx.measureText(testLine);
      if (metrics.width <= maxWidth) {
        currentLine = testLine;
      } else {
        if (currentLine) lines.push(currentLine);
        if (ctx.measureText(word).width > maxWidth) {
          let chunk = '';
          for (const char of word) {
            const testChunk = chunk + char;
            if (ctx.measureText(testChunk).width <= maxWidth) {
              chunk = testChunk;
            } else {
              lines.push(chunk);
              chunk = char;
            }
          }
          currentLine = chunk;
        } else {
          currentLine = word;
        }
      }
    }
    if (currentLine) lines.push(currentLine);
  }
  return lines;
};

const REGISTRATION_TYPE_LABELS = {
  'with-room-1-night': 'With Room – 1 Night (कमरे सहित - 1 रात)',
  'with-room-2-nights': 'With Room – 2 Nights (कमरे सहित - 2 रातें)',
  'without-room': 'Without Room (बिना कमरे के)',
};

const formatRegType = (val) => REGISTRATION_TYPE_LABELS[val] || val || '—';

// Render Page 1 to 300 DPI PNG buffer via Skia Canvas (Including Payment Screenshot)
const renderMahakumbhPage1Canvas = async (registration) => {
  // A4 at 300 DPI: 2480 x 3508 px
  const width = 2480;
  const height = 3508;
  const canvas = createCanvas(width, height);
  const ctx = canvas.getContext('2d');

  // Background
  ctx.fillStyle = '#f8fafc';
  ctx.fillRect(0, 0, width, height);

  const padding = 70;
  const cardX = padding;
  const cardY = padding;
  const cardW = width - padding * 2;
  const cardH = height - padding * 2;

  // Outer Card
  ctx.fillStyle = '#ffffff';
  ctx.fillRect(cardX, cardY, cardW, cardH);
  ctx.strokeStyle = '#4f46e5'; // Indigo theme for Mahakumbh (#4f46e5)
  ctx.lineWidth = 14;
  ctx.strokeRect(cardX, cardY, cardW, cardH);

  // Inner Accent Border
  ctx.strokeStyle = '#e2e8f0';
  ctx.lineWidth = 3;
  ctx.strokeRect(cardX + 16, cardY + 16, cardW - 32, cardH - 32);

  // Header Banner
  const headerH = 300;
  ctx.fillStyle = '#4f46e5';
  ctx.fillRect(cardX, cardY, cardW, headerH);

  // Gold/Yellow accent bar under banner
  ctx.fillStyle = '#f59e0b';
  ctx.fillRect(cardX, cardY + headerH - 14, cardW, 14);

  // Header Text
  ctx.fillStyle = '#fef08a';
  ctx.font = 'bold 78px MuktaBold';
  ctx.fillText('आगरा महाकुंभ 2026 / AGRA MAHAKUMBH 2026', cardX + 60, cardY + 105);

  ctx.fillStyle = '#ffffff';
  ctx.font = '48px Mukta';
  ctx.fillText('अग्रवाल समाज रायपुर (छ.ग.) — आधिकारिक पंजीयन प्रपत्र / REGISTRATION DOSSIER', cardX + 60, cardY + 180);

  ctx.fillStyle = '#ffffff';
  ctx.font = 'bold 52px MuktaBold';
  ctx.fillText(`पंजीयन क्रमांक (Registration No): ${registration.registrationNo || '—'}`, cardX + 60, cardY + 255);

  // Content Area
  let cursorY = cardY + headerH + 40;
  const contentX = cardX + 50;
  const contentW = cardW - 100;

  // Top Section: Profile Table + Applicant Photo Box
  const photoBoxW = 440;
  const photoBoxH = 560;
  const photoBoxX = contentX + contentW - photoBoxW;
  const photoBoxY = cursorY;

  // Draw Photo Box
  ctx.fillStyle = '#f8fafc';
  ctx.fillRect(photoBoxX, photoBoxY, photoBoxW, photoBoxH);
  ctx.strokeStyle = '#cbd5e1';
  ctx.lineWidth = 4;
  ctx.strokeRect(photoBoxX, photoBoxY, photoBoxW, photoBoxH);

  let photoDrawn = false;
  if (registration.photo) {
    const photoPath = resolveFilePath(registration.photo);
    if (photoPath) {
      try {
        const photoPngBuffer = await sharp(photoPath)
          .rotate()
          .resize(430, 550, { fit: 'cover' })
          .png()
          .toBuffer();
        const img = await loadImage(photoPngBuffer);
        ctx.drawImage(img, photoBoxX + 5, photoBoxY + 5, photoBoxW - 10, photoBoxH - 10);
        photoDrawn = true;
      } catch (err) {
        console.error('Error loading photo in canvas:', err.message);
      }
    }
  }

  if (!photoDrawn) {
    ctx.fillStyle = '#94a3b8';
    ctx.font = '44px Mukta';
    ctx.textAlign = 'center';
    ctx.fillText('पंजीयक फ़ोटो', photoBoxX + photoBoxW / 2, photoBoxY + 260);
    ctx.font = '36px Mukta';
    ctx.fillText('(Applicant Photo)', photoBoxX + photoBoxW / 2, photoBoxY + 320);
    ctx.textAlign = 'left';
  }

  // Profile Table (Left of Photo)
  const profileTableW = photoBoxX - contentX - 35;
  const labelColW = 460;
  const valColW = profileTableW - labelColW;

  const topFields = [
    { label: 'पूरा नाम', sub: 'Full Name', val: registration.fullName || '—', isHighlight: true },
    { label: 'पिता का नाम', sub: "Father's Name", val: registration.fatherName || '—' },
    { label: 'लिंग एवं आयु', sub: 'Gender, Age & DOB', val: `${registration.gender || '—'}   |   आयु: ${registration.age ? `${registration.age} वर्ष` : '—'}   |   जन्म: ${registration.dob || '—'}` },
    { label: 'मोबाइल नंबर', sub: 'Mobile Number', val: registration.mobileNo || '—' },
    { label: 'पंजीयन प्रकार', sub: 'Registration Type', val: formatRegType(registration.registrationType) },
    { label: 'पंजीयन शुल्क', sub: 'Registration Fee', val: registration.registrationFee ? `₹${registration.registrationFee}` : '—', isHighlightFee: true },
  ];

  let topRowY = cursorY;
  topFields.forEach((field) => {
    ctx.font = field.isHighlight ? 'bold 44px MuktaBold' : '42px Mukta';
    const valLines = wrapCanvasText(ctx, field.val, valColW - 35);
    const rowH = Math.max(86, valLines.length * 44 + 22);

    // Row Container
    ctx.fillStyle = '#ffffff';
    ctx.fillRect(contentX, topRowY, profileTableW, rowH);
    ctx.strokeStyle = '#e2e8f0';
    ctx.lineWidth = 3;
    ctx.strokeRect(contentX, topRowY, profileTableW, rowH);

    // Label Column Background
    ctx.fillStyle = '#f8fafc';
    ctx.fillRect(contentX, topRowY, labelColW, rowH);
    ctx.strokeRect(contentX, topRowY, labelColW, rowH);

    // Label text
    ctx.fillStyle = '#1e293b';
    ctx.font = 'bold 34px MuktaBold';
    ctx.fillText(field.label, contentX + 20, topRowY + 38);
    ctx.fillStyle = '#64748b';
    ctx.font = '28px Mukta';
    ctx.fillText(`(${field.sub})`, contentX + 20, topRowY + 70);

    // Value text
    ctx.fillStyle = field.isHighlight ? '#4f46e5' : field.isHighlightFee ? '#059669' : '#0f172a';
    ctx.font = field.isHighlight || field.isHighlightFee ? 'bold 42px MuktaBold' : '40px Mukta';
    let lineY = topRowY + 48;
    valLines.forEach((l) => {
      ctx.fillText(l, contentX + labelColW + 20, lineY);
      lineY += 44;
    });

    topRowY += rowH + 6;
  });

  cursorY = Math.max(topRowY + 14, photoBoxY + photoBoxH + 20);

  // Helper for Section Banner
  const drawSectionBanner = (title) => {
    ctx.fillStyle = '#f1f5f9';
    ctx.fillRect(contentX, cursorY, contentW, 68);
    ctx.fillStyle = '#4f46e5';
    ctx.fillRect(contentX, cursorY, 14, 68);

    ctx.fillStyle = '#1e293b';
    ctx.font = 'bold 42px MuktaBold';
    ctx.fillText(title, contentX + 32, cursorY + 48);
    cursorY += 80;
  };

  // Helper for Detail Table Row
  const drawDetailRow = (label, sub, val) => {
    const dLabelW = 520;
    const dValW = contentW - dLabelW;

    ctx.font = '40px Mukta';
    const valLines = wrapCanvasText(ctx, val || '—', dValW - 40);
    const rowH = Math.max(86, valLines.length * 46 + 24);

    // Row Container
    ctx.fillStyle = '#ffffff';
    ctx.fillRect(contentX, cursorY, contentW, rowH);
    ctx.strokeStyle = '#e2e8f0';
    ctx.lineWidth = 3;
    ctx.strokeRect(contentX, cursorY, contentW, rowH);

    // Label Column Background
    ctx.fillStyle = '#f8fafc';
    ctx.fillRect(contentX, cursorY, dLabelW, rowH);
    ctx.strokeRect(contentX, cursorY, dLabelW, rowH);

    // Label text
    ctx.fillStyle = '#1e293b';
    ctx.font = 'bold 34px MuktaBold';
    ctx.fillText(label, contentX + 20, cursorY + 38);
    ctx.fillStyle = '#64748b';
    ctx.font = '28px Mukta';
    ctx.fillText(`(${sub})`, contentX + 20, cursorY + 70);

    // Value text
    ctx.fillStyle = '#0f172a';
    ctx.font = '38px Mukta';
    let lineY = cursorY + 48;
    valLines.forEach((l) => {
      ctx.fillText(l, contentX + dLabelW + 20, lineY);
      lineY += 46;
    });

    cursorY += rowH + 6;
  };

  // Section 1: Residential & Travel Details
  drawSectionBanner('1. निवास एवं यात्रा विवरण / Residential & Travel Details');
  drawDetailRow('पूरा पता', 'Full Address', registration.address);
  drawDetailRow('यात्रा माध्यम एवं विवरण', 'Travel Mode & Details', `${registration.travelMode || '—'}${registration.travelDetail ? ` (${registration.travelDetail})` : ''}`);
  drawDetailRow('आगमन दिनांक एवं समय', 'Arrival Date & Time', `${registration.arrivalDate || '—'}${registration.arrivalTime ? `   |   समय: ${registration.arrivalTime}` : ''}`);

  cursorY += 10;

  // Section 2: Payment Details & Payment Screenshot (Medium Size)
  drawSectionBanner('2. भुगतान विवरण एवं स्क्रीनशॉट / Payment Details & Receipt');

  const paymentSecStartY = cursorY;
  const paymentBoxW = 750; // Medium size screenshot width
  const paymentBoxH = 920; // Medium size screenshot height
  const paymentBoxX = contentX + contentW - paymentBoxW;
  const paymentBoxY = paymentSecStartY;

  // Left Details in Payment Section
  const paymentTableW = paymentBoxX - contentX - 35;
  const pLabelColW = 440;
  const pValColW = paymentTableW - pLabelColW;

  const paymentFields = [
    { label: 'यूटीआर नंबर', sub: 'UTR / Transaction No', val: registration.utrNumber || '—', isHighlight: true },
    { label: 'भुगतान शुल्क', sub: 'Amount Paid', val: registration.registrationFee ? `₹${registration.registrationFee}` : '—', isFee: true },
    { label: 'पंजीयन प्रकार', sub: 'Registration Plan', val: formatRegType(registration.registrationType) },
    { label: 'जमा दिनांक', sub: 'Submitted On', val: registration.createdAt ? new Date(registration.createdAt).toLocaleString('en-IN') : '—' },
  ];

  let pRowY = paymentSecStartY;
  paymentFields.forEach((field) => {
    ctx.font = field.isHighlight || field.isFee ? 'bold 42px MuktaBold' : '40px Mukta';
    const valLines = wrapCanvasText(ctx, field.val, pValColW - 35);
    const rowH = Math.max(90, valLines.length * 46 + 26);

    ctx.fillStyle = '#ffffff';
    ctx.fillRect(contentX, pRowY, paymentTableW, rowH);
    ctx.strokeStyle = '#e2e8f0';
    ctx.lineWidth = 3;
    ctx.strokeRect(contentX, pRowY, paymentTableW, rowH);

    ctx.fillStyle = '#f8fafc';
    ctx.fillRect(contentX, pRowY, pLabelColW, rowH);
    ctx.strokeRect(contentX, pRowY, pLabelColW, rowH);

    ctx.fillStyle = '#1e293b';
    ctx.font = 'bold 34px MuktaBold';
    ctx.fillText(field.label, contentX + 20, pRowY + 40);
    ctx.fillStyle = '#64748b';
    ctx.font = '28px Mukta';
    ctx.fillText(`(${field.sub})`, contentX + 20, pRowY + 72);

    ctx.fillStyle = field.isHighlight ? '#4f46e5' : field.isFee ? '#059669' : '#0f172a';
    ctx.font = field.isHighlight || field.isFee ? 'bold 42px MuktaBold' : '38px Mukta';
    let lineY = pRowY + 50;
    valLines.forEach((l) => {
      ctx.fillText(l, contentX + pLabelColW + 20, lineY);
      lineY += 46;
    });

    pRowY += rowH + 6;
  });

  // Verification note under payment fields
  ctx.fillStyle = '#eff6ff';
  ctx.fillRect(contentX, pRowY, paymentTableW, 140);
  ctx.strokeStyle = '#bfdbfe';
  ctx.lineWidth = 2;
  ctx.strokeRect(contentX, pRowY, paymentTableW, 140);

  ctx.fillStyle = '#1e40af';
  ctx.font = 'bold 34px MuktaBold';
  ctx.fillText('भुगतान सत्यापन / Payment Verification Note', contentX + 20, pRowY + 44);
  ctx.fillStyle = '#3b82f6';
  ctx.font = '30px Mukta';
  ctx.fillText('ऑनलाइन पंजीयन एवं भुगतान रसीद का सत्यापन प्रशासनिक स्तर पर किया गया है।', contentX + 20, pRowY + 86);
  ctx.fillText('Online payment and registration verified by ABCD Admin.', contentX + 20, pRowY + 122);

  // Draw Medium Payment Screenshot Box on the right
  ctx.fillStyle = '#f8fafc';
  ctx.fillRect(paymentBoxX, paymentBoxY, paymentBoxW, paymentBoxH);
  ctx.strokeStyle = '#cbd5e1';
  ctx.lineWidth = 4;
  ctx.strokeRect(paymentBoxX, paymentBoxY, paymentBoxW, paymentBoxH);

  // Top header banner for payment box
  ctx.fillStyle = '#4f46e5';
  ctx.fillRect(paymentBoxX, paymentBoxY, paymentBoxW, 58);
  ctx.fillStyle = '#ffffff';
  ctx.font = 'bold 32px MuktaBold';
  ctx.textAlign = 'center';
  ctx.fillText('भुगतान स्क्रीनशॉट / Payment Screenshot', paymentBoxX + paymentBoxW / 2, paymentBoxY + 40);
  ctx.textAlign = 'left';

  let paymentImgDrawn = false;
  if (registration.paymentScreenshot) {
    const paymentPath = resolveFilePath(registration.paymentScreenshot);
    if (paymentPath) {
      try {
        const ext = path.extname(paymentPath).toLowerCase();
        if (['.jpg', '.jpeg', '.png', '.webp', '.gif'].includes(ext)) {
          const availW = paymentBoxW - 20;
          const availH = paymentBoxH - 78;

          const paymentPngBuffer = await sharp(paymentPath)
            .rotate()
            .resize(availW, availH, { fit: 'inside', withoutEnlargement: true })
            .png()
            .toBuffer();

          const pImg = await loadImage(paymentPngBuffer);
          const pImgW = pImg.width;
          const pImgH = pImg.height;

          // Center the image within available area
          const drawX = paymentBoxX + 10 + (availW - pImgW) / 2;
          const drawY = paymentBoxY + 68 + (availH - pImgH) / 2;

          ctx.drawImage(pImg, drawX, drawY, pImgW, pImgH);
          paymentImgDrawn = true;
        }
      } catch (err) {
        console.error('Error loading payment screenshot in canvas:', err.message);
      }
    }
  }

  if (!paymentImgDrawn) {
    ctx.fillStyle = '#94a3b8';
    ctx.font = '40px Mukta';
    ctx.textAlign = 'center';
    ctx.fillText('भुगतान स्क्रीनशॉट उपलब्ध नहीं है', paymentBoxX + paymentBoxW / 2, paymentBoxY + 460);
    ctx.font = '32px Mukta';
    ctx.fillText('(No Payment Screenshot Uploaded)', paymentBoxX + paymentBoxW / 2, paymentBoxY + 520);
    ctx.textAlign = 'left';
  }

  // Footer bar on Page 1
  const footerH = 70;
  const footerY = cardY + cardH - footerH;
  ctx.fillStyle = '#f8fafc';
  ctx.fillRect(cardX, footerY, cardW, footerH);
  ctx.strokeStyle = '#e2e8f0';
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.moveTo(cardX, footerY);
  ctx.lineTo(cardX + cardW, footerY);
  ctx.stroke();

  ctx.fillStyle = '#64748b';
  ctx.font = '34px Mukta';
  ctx.fillText('Agra Mahakumbh 2026 • ABCD Vyapar Admin Portal • Page 1 of Dossier', cardX + 40, footerY + 46);

  const downloadedTime = new Date().toLocaleString('en-IN');
  ctx.textAlign = 'right';
  ctx.fillText(`Downloaded: ${downloadedTime}`, cardX + cardW - 40, footerY + 46);
  ctx.textAlign = 'left';

  return canvas.toBuffer('image/png');
};

// Main generator function
const generateAgraMahakumbhRegistrationPdf = async (registration) => {
  // Step 1: Render complete Page 1 (including profile, details & medium payment screenshot)
  const page1PngBuffer = await renderMahakumbhPage1Canvas(registration);

  // Step 2: Create PDFDocument and embed Page 1
  const finalDoc = await PDFDocument.create();

  const pageWidth = 595.28;
  const pageHeight = 841.89;

  // Add Page 1
  const page1 = finalDoc.addPage([pageWidth, pageHeight]);
  const page1Img = await finalDoc.embedPng(page1PngBuffer);
  page1.drawImage(page1Img, {
    x: 0,
    y: 0,
    width: pageWidth,
    height: pageHeight,
  });

  // Step 3: If payment screenshot was an external multi-page PDF document, append it too
  if (registration.paymentScreenshot) {
    const paymentPath = resolveFilePath(registration.paymentScreenshot);
    if (paymentPath) {
      const ext = path.extname(paymentPath).toLowerCase();
      if (ext === '.pdf') {
        try {
          const existingPdfBytes = fs.readFileSync(paymentPath);
          const existingPdf = await PDFDocument.load(existingPdfBytes);
          const pageIndices = existingPdf.getPageIndices();
          const copiedPages = await finalDoc.copyPages(existingPdf, pageIndices);

          copiedPages.forEach((cpPage) => {
            finalDoc.addPage(cpPage);
          });
        } catch (pdfErr) {
          console.error(`Error merging payment PDF ${paymentPath}:`, pdfErr.message);
        }
      }
    }
  }

  const finalPdfBytes = await finalDoc.save();
  return Buffer.from(finalPdfBytes);
};

module.exports = {
  generateAgraMahakumbhRegistrationPdf,
};
