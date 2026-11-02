/**
 * Pure domain logic for client-side PDF document manipulation using pdf-lib.
 * Zero network requests: all parsing, merging, splitting, and rendering happens in browser memory.
 */
import { PDFDocument, degrees } from 'pdf-lib';

export interface PdfFileItem {
  id: string;
  name: string;
  size: number;
  pageCount: number;
  data: Uint8Array;
}

export async function getPdfPageCount(data: Uint8Array): Promise<number> {
  const doc = await PDFDocument.load(data, { ignoreEncryption: true });
  return doc.getPageCount();
}

export async function mergePdfDocuments(docsData: Uint8Array[]): Promise<Uint8Array> {
  if (docsData.length === 0) {
    throw new Error('At least one PDF document is required to merge.');
  }
  const mergedDoc = await PDFDocument.create();

  for (const docBytes of docsData) {
    const srcDoc = await PDFDocument.load(docBytes, { ignoreEncryption: true });
    const copiedPages = await mergedDoc.copyPages(srcDoc, srcDoc.getPageIndices());
    for (const page of copiedPages) {
      mergedDoc.addPage(page);
    }
  }

  return mergedDoc.save();
}

function parseSingleRange(part: string, totalPages: number, set: Set<number>): void {
  const trimmed = part.trim();
  if (trimmed.includes('-')) {
    const [startStr, endStr] = trimmed.split('-');
    const start = Math.max(1, parseInt(startStr, 10));
    const end = Math.min(totalPages, parseInt(endStr, 10));
    if (!isNaN(start) && !isNaN(end) && start <= end) {
      for (let i = start; i <= end; i += 1) set.add(i - 1);
    }
  } else {
    const pageNum = parseInt(trimmed, 10);
    if (!isNaN(pageNum) && pageNum >= 1 && pageNum <= totalPages) {
      set.add(pageNum - 1);
    }
  }
}

export function parsePageRanges(rangeStr: string, totalPages: number): number[] {
  const result = new Set<number>();
  if (!rangeStr.trim() || totalPages <= 0) return [];

  const parts = rangeStr.split(',');
  for (const part of parts) {
    parseSingleRange(part, totalPages, result);
  }

  return Array.from(result).sort((a, b) => a - b);
}

export async function extractPdfPages(
  docData: Uint8Array,
  pageIndices: number[]
): Promise<Uint8Array> {
  if (pageIndices.length === 0) {
    throw new Error('Please select at least one page to extract.');
  }

  const srcDoc = await PDFDocument.load(docData, { ignoreEncryption: true });
  const total = srcDoc.getPageCount();
  const validIndices = pageIndices.filter((idx) => idx >= 0 && idx < total);

  if (validIndices.length === 0) {
    throw new Error('No valid page indices specified for extraction.');
  }

  const newDoc = await PDFDocument.create();
  const copiedPages = await newDoc.copyPages(srcDoc, validIndices);
  for (const page of copiedPages) {
    newDoc.addPage(page);
  }

  return newDoc.save();
}

export async function rotatePdfPages(
  docData: Uint8Array,
  pageIndices: number[],
  angle: 90 | 180 | 270
): Promise<Uint8Array> {
  const doc = await PDFDocument.load(docData, { ignoreEncryption: true });
  const total = doc.getPageCount();
  const targetIndices = pageIndices.length > 0 ? pageIndices : doc.getPageIndices();

  for (const idx of targetIndices) {
    if (idx >= 0 && idx < total) {
      const page = doc.getPage(idx);
      const currentRotation = page.getRotation().angle;
      page.setRotation(degrees((currentRotation + angle) % 360));
    }
  }

  return doc.save();
}

export async function createSamplePdf(title: string, pagesCount = 1): Promise<Uint8Array> {
  const doc = await PDFDocument.create();
  for (let i = 1; i <= pagesCount; i += 1) {
    const page = doc.addPage([400, 600]);
    page.drawText(`${title} - Page ${i}`, { x: 50, y: 500, size: 20 });
  }
  return doc.save();
}
