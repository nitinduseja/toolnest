/**
 * Client-side PDF generation, image embedding, watermark, and searchable OCR text integration.
 */
import { PDFDocument, PDFPage, rgb, StandardFonts, degrees } from 'pdf-lib';
import { ScannedPageItem } from './scannerDb';

const A4_WIDTH = 595.28;
const A4_HEIGHT = 841.89;

export interface PdfExportOptions {
  title?: string;
  pageSize?: 'fit' | 'a4';
  watermarkText?: string;
}

interface ImagePlacement {
  posX: number;
  posY: number;
  drawW: number;
  drawH: number;
  imgW: number;
  imgH: number;
}

function base64ToUint8(dataUrl: string): Uint8Array {
  const base64 = dataUrl.split(',')[1] || dataUrl;
  const binary = atob(base64);
  const bytes = new Uint8Array(binary.length);
  for (let i = 0; i < binary.length; i += 1) {
    bytes[i] = binary.charCodeAt(i);
  }
  return bytes;
}

async function embedWatermark(pdfPage: PDFPage, text: string, doc: PDFDocument): Promise<void> {
  const font = await doc.embedFont(StandardFonts.HelveticaBold);
  const { width, height } = pdfPage.getSize();
  pdfPage.drawText(text.toUpperCase(), {
    x: width * 0.15,
    y: height * 0.45,
    size: Math.min(width, height) * 0.1,
    font,
    color: rgb(0.8, 0.2, 0.2),
    opacity: 0.14,
    rotate: degrees(45),
  });
}

async function embedSignature(
  doc: PDFDocument,
  pdfPage: PDFPage,
  pageItem: ScannedPageItem
): Promise<void> {
  const sigUrl = pageItem.signatureStamp?.dataUrl || pageItem.signatureDataUrl;
  if (!sigUrl) return;

  const sigBytes = base64ToUint8(sigUrl);
  const sigImg = await doc.embedPng(sigBytes);
  const { width, height } = pdfPage.getSize();

  if (pageItem.signatureStamp) {
    const s = pageItem.signatureStamp;
    const w = 120 * (s.scale || 1);
    const h = (w * sigImg.height) / sigImg.width;
    const x = (s.xPercent / 100) * width;
    const y = height - (s.yPercent / 100) * height - h;
    pdfPage.drawImage(sigImg, { x, y, width: w, height: h });
  } else {
    pdfPage.drawImage(sigImg, { x: width - 150, y: 30, width: 120, height: 50 });
  }
}

async function embedOcrWords(
  doc: PDFDocument,
  pdfPage: PDFPage,
  params: { words: ScannedPageItem['ocrWords']; place: ImagePlacement }
): Promise<void> {
  const { words, place } = params;
  if (!words || words.length === 0) return;
  const font = await doc.embedFont(StandardFonts.Helvetica);

  for (const w of words) {
    const wx = place.posX + (w.x0 / place.imgW) * place.drawW;
    const wy = place.posY + (1 - w.y1 / place.imgH) * place.drawH;
    const fSize = Math.max(4, ((w.y1 - w.y0) / place.imgH) * place.drawH * 0.85);

    pdfPage.drawText(w.text, {
      x: wx,
      y: wy,
      size: fSize,
      font,
      color: rgb(0, 0, 0),
      opacity: 0.005,
    });
  }
}

async function embedPageIntoPdf(
  doc: PDFDocument,
  pageItem: ScannedPageItem,
  opts: PdfExportOptions
): Promise<void> {
  const imgBytes = base64ToUint8(pageItem.processedDataUrl || pageItem.originalDataUrl);
  const isPng = (pageItem.processedDataUrl || pageItem.originalDataUrl).startsWith(
    'data:image/png'
  );
  const img = isPng ? await doc.embedPng(imgBytes) : await doc.embedJpg(imgBytes);

  const targetW = opts.pageSize === 'fit' ? img.width : A4_WIDTH;
  const targetH = opts.pageSize === 'fit' ? img.height : A4_HEIGHT;
  const pdfPage = doc.addPage([targetW, targetH]);

  const scale = Math.min(targetW / img.width, targetH / img.height);
  const place: ImagePlacement = {
    posX: (targetW - img.width * scale) / 2,
    posY: (targetH - img.height * scale) / 2,
    drawW: img.width * scale,
    drawH: img.height * scale,
    imgW: img.width,
    imgH: img.height,
  };

  pdfPage.drawImage(img, { x: place.posX, y: place.posY, width: place.drawW, height: place.drawH });
  await embedSignature(doc, pdfPage, pageItem);
  await embedOcrWords(doc, pdfPage, { words: pageItem.ocrWords, place });

  if (opts.watermarkText) {
    await embedWatermark(pdfPage, opts.watermarkText, doc);
  }
}

export async function exportScannedPagesToPdf(
  pages: ScannedPageItem[],
  titleOrOpts: string | PdfExportOptions,
  legacyPageSize?: 'fit' | 'a4'
): Promise<Uint8Array> {
  if (pages.length === 0) {
    throw new Error('No pages available to export to PDF.');
  }

  const opts: PdfExportOptions =
    typeof titleOrOpts === 'string'
      ? { title: titleOrOpts, pageSize: legacyPageSize ?? 'a4' }
      : titleOrOpts;

  const doc = await PDFDocument.create();
  doc.setTitle(opts.title || 'Scanned Document');
  doc.setProducer('Toolnest Document Scanner');

  for (const page of pages) {
    await embedPageIntoPdf(doc, page, opts);
  }

  return doc.save();
}

export function downloadPdfBytes(bytes: Uint8Array, filename: string): void {
  const blob = new Blob([bytes], { type: 'application/pdf' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename.endsWith('.pdf') ? filename : `${filename}.pdf`;
  a.click();
  URL.revokeObjectURL(url);
}
