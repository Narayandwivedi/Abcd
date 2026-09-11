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

// Robust text wrapping helper for Canvas 2D context
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
        // Handle oversized words
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

// Render Page 1 to High-Resolution 300 DPI PNG buffer via Skia Canvas
const renderPage1Canvas = async (application) => {
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
  ctx.strokeStyle = '#b91c1c';
  ctx.lineWidth = 14;
  ctx.strokeRect(cardX, cardY, cardW, cardH);

  // Inner Accent Border
  ctx.strokeStyle = '#e2e8f0';
  ctx.lineWidth = 3;
  ctx.strokeRect(cardX + 16, cardY + 16, cardW - 32, cardH - 32);

  // Header Banner
  const headerH = 340;
  ctx.fillStyle = '#b91c1c';
  ctx.fillRect(cardX, cardY, cardW, headerH);

  // Gold accent bar under banner
  ctx.fillStyle = '#eab308';
  ctx.fillRect(cardX, cardY + headerH - 14, cardW, 14);

  // Header Text
  ctx.fillStyle = '#fde047';
  ctx.font = 'bold 82px MuktaBold';
  ctx.fillText('आगरा अलंकरण 2026 / AGRA ALANKARAN 2026', cardX + 60, cardY + 115);

  ctx.fillStyle = '#ffffff';
  ctx.font = '50px Mukta';
  ctx.fillText('अग्रवाल समाज रायपुर (छ.ग.) — आधिकारिक आवेदन पत्र / OFFICIAL APPLICATION DOSSIER', cardX + 60, cardY + 200);

  ctx.fillStyle = '#fef08a';
  ctx.font = 'bold 56px MuktaBold';
  ctx.fillText(`आवेदन क्रमांक (Application No): ${application.applicationNo || '—'}`, cardX + 60, cardY + 285);

  // Content Area
  let cursorY = cardY + headerH + 50;
  const contentX = cardX + 50;
  const contentW = cardW - 100;

  // Top Section: Profile Table + Photo Box
  const photoBoxW = 460;
  const photoBoxH = 580;
  const photoBoxX = contentX + contentW - photoBoxW;
  const photoBoxY = cursorY;

  // Draw Photo Box
  ctx.fillStyle = '#f8fafc';
  ctx.fillRect(photoBoxX, photoBoxY, photoBoxW, photoBoxH);
  ctx.strokeStyle = '#cbd5e1';
  ctx.lineWidth = 4;
  ctx.strokeRect(photoBoxX, photoBoxY, photoBoxW, photoBoxH);

  let photoDrawn = false;
  if (application.photo) {
    const photoPath = resolveFilePath(application.photo);
    if (photoPath) {
      try {
        const photoPngBuffer = await sharp(photoPath)
          .rotate()
          .resize(450, 570, { fit: 'cover' })
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
    ctx.font = '46px Mukta';
    ctx.textAlign = 'center';
    ctx.fillText('पासपोर्ट फ़ोटो', photoBoxX + photoBoxW / 2, photoBoxY + 270);
    ctx.font = '38px Mukta';
    ctx.fillText('(Passport Photo)', photoBoxX + photoBoxW / 2, photoBoxY + 330);
    ctx.textAlign = 'left';
  }

  // Profile Table (Left of Photo)
  const profileTableW = photoBoxX - contentX - 40;
  const labelColW = 500;
  const valColW = profileTableW - labelColW;

  const topFields = [
    { label: 'आवेदक का नाम', sub: 'Applicant Name', val: application.applicantName || '—', isHighlight: true },
    { label: 'पिता / पति का नाम', sub: 'Father / Husband', val: application.fatherHusbandName || '—' },
    { label: 'जन्म तिथि एवं आयु', sub: 'DOB & Age', val: `${application.dob || '—'}   [आयु: ${application.age ? `${application.age} वर्ष` : '—'}]` },
    { label: 'मोबाइल नंबर', sub: 'Mobile Number', val: application.mobileNo || '—' },
    { label: 'ईमेल आईडी', sub: 'Email Address', val: application.email || '—' },
  ];

  let topRowY = cursorY;
  topFields.forEach((field) => {
    ctx.font = field.isHighlight ? 'bold 46px MuktaBold' : '44px Mukta';
    const valLines = wrapCanvasText(ctx, field.val, valColW - 40);
    const rowH = Math.max(104, valLines.length * 52 + 30);

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
    ctx.font = 'bold 38px MuktaBold';
    ctx.fillText(field.label, contentX + 24, topRowY + 46);
    ctx.fillStyle = '#64748b';
    ctx.font = '32px Mukta';
    ctx.fillText(`(${field.sub})`, contentX + 24, topRowY + 84);

    // Value text
    ctx.fillStyle = field.isHighlight ? '#b91c1c' : '#0f172a';
    ctx.font = field.isHighlight ? 'bold 46px MuktaBold' : '44px Mukta';
    let lineY = topRowY + 58;
    valLines.forEach((l) => {
      ctx.fillText(l, contentX + labelColW + 24, lineY);
      lineY += 52;
    });

    topRowY += rowH + 6;
  });

  cursorY = Math.max(topRowY + 16, photoBoxY + photoBoxH + 30);

  // Helper for Section Banner
  const drawSectionBanner = (title) => {
    ctx.fillStyle = '#f1f5f9';
    ctx.fillRect(contentX, cursorY, contentW, 76);
    ctx.fillStyle = '#b91c1c';
    ctx.fillRect(contentX, cursorY, 16, 76);

    ctx.fillStyle = '#1e293b';
    ctx.font = 'bold 46px MuktaBold';
    ctx.fillText(title, contentX + 36, cursorY + 54);
    cursorY += 92;
  };

  // Helper for Detail Table Row
  const drawDetailRow = (label, sub, val, isHighlight = false) => {
    const dLabelW = 560;
    const dValW = contentW - dLabelW;

    ctx.font = isHighlight ? 'bold 46px MuktaBold' : '44px Mukta';
    const valLines = wrapCanvasText(ctx, val || '—', dValW - 40);
    const rowH = Math.max(104, valLines.length * 54 + 32);

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
    ctx.font = 'bold 38px MuktaBold';
    ctx.fillText(label, contentX + 24, cursorY + 46);
    ctx.fillStyle = '#64748b';
    ctx.font = '32px Mukta';
    ctx.fillText(`(${sub})`, contentX + 24, cursorY + 84);

    // Value text
    ctx.fillStyle = isHighlight ? '#b91c1c' : '#0f172a';
    ctx.font = isHighlight ? 'bold 46px MuktaBold' : '44px Mukta';
    let lineY = cursorY + 58;
    valLines.forEach((l) => {
      ctx.fillText(l, contentX + dLabelW + 24, lineY);
      lineY += 54;
    });

    cursorY += rowH + 8;
  };

  // Section 1: Residential & Contact Details
  drawSectionBanner('1. निवास एवं संपर्क विवरण / Residential & Contact Details');
  drawDetailRow('पूरा पता', 'Full Address', application.fullAddress);
  drawDetailRow('आवेदन दिनांक एवं स्थान', 'Date & Place', `${application.date || '—'}   |   स्थान: ${application.place || '—'}`);

  cursorY += 10;

  // Section 2: Award Category & Achievements
  drawSectionBanner('2. अलंकरण श्रेणी एवं उपलब्धि विवरण / Award & Achievements');
  drawDetailRow('अलंकरण श्रेणी', 'Award Category', application.awardCategory, true);
  drawDetailRow('उपलब्धि का विवरण', 'Achievement Details', application.achievementDesc);

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
  ctx.fillText('Agra Alankaran 2026 • ABCD Vyapar Admin Portal • Page 1 of Dossier', cardX + 40, footerY + 46);

  const downloadedTime = new Date().toLocaleString('en-IN');
  ctx.textAlign = 'right';
  ctx.fillText(`Downloaded: ${downloadedTime}`, cardX + cardW - 40, footerY + 46);
  ctx.textAlign = 'left';

  return canvas.toBuffer('image/png');
};

// Main generator function
const generateAgraAlankaranApplicationPdf = async (application) => {
  // Step 1: Render Page 1 to high-resolution PNG using Skia HarfBuzz engine
  const page1PngBuffer = await renderPage1Canvas(application);

  // Step 2: Create PDFDocument and embed Page 1
  const finalDoc = await PDFDocument.create();

  const pageWidth = 595.28;
  const pageHeight = 841.89;
  const margin = 28;
  const contentWidth = pageWidth - margin * 2;

  // Add Page 1
  const page1 = finalDoc.addPage([pageWidth, pageHeight]);
  const page1Img = await finalDoc.embedPng(page1PngBuffer);
  page1.drawImage(page1Img, {
    x: 0,
    y: 0,
    width: pageWidth,
    height: pageHeight,
  });

  // Step 3: Append all attached documents
  const rawDocs = Array.isArray(application.documents) && application.documents.length > 0
    ? application.documents
    : (application.document ? [application.document] : []);

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
