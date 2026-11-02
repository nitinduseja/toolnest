import { describe, it, expect } from 'vitest';
import {
  createSamplePdf,
  getPdfPageCount,
  mergePdfDocuments,
  parsePageRanges,
  extractPdfPages,
  rotatePdfPages,
} from './pdfLogic';
import { PDFDocument } from 'pdf-lib';

describe('pdfLogic', () => {
  it('creates sample PDF and retrieves correct page count', async () => {
    const pdfBytes = await createSamplePdf('Document A', 3);
    const count = await getPdfPageCount(pdfBytes);
    expect(count).toBe(3);
  });

  describe('mergePdfDocuments', () => {
    it('merges multiple PDF documents into a single document', async () => {
      const docA = await createSamplePdf('Doc A', 2);
      const docB = await createSamplePdf('Doc B', 3);
      const mergedBytes = await mergePdfDocuments([docA, docB]);

      const totalCount = await getPdfPageCount(mergedBytes);
      expect(totalCount).toBe(5);
    });

    it('throws error when merging empty list', async () => {
      await expect(mergePdfDocuments([])).rejects.toThrow(
        'At least one PDF document is required to merge.'
      );
    });
  });

  describe('parsePageRanges', () => {
    it('parses mixed ranges and single numbers', () => {
      const indices = parsePageRanges('1-3, 5, 7-8', 10);
      expect(indices).toEqual([0, 1, 2, 4, 6, 7]);
    });

    it('clamps values and discards out-of-bounds numbers', () => {
      const indices = parsePageRanges('0, 2-15, 20', 5);
      expect(indices).toEqual([1, 2, 3, 4]);
    });

    it('returns empty array for empty string', () => {
      expect(parsePageRanges('', 5)).toEqual([]);
    });
  });

  describe('extractPdfPages', () => {
    it('extracts specific pages into a new document', async () => {
      const sourcePdf = await createSamplePdf('Source', 5);
      const extractedBytes = await extractPdfPages(sourcePdf, [0, 2, 4]);

      const count = await getPdfPageCount(extractedBytes);
      expect(count).toBe(3);
    });

    it('throws error when no valid indices are provided', async () => {
      const sourcePdf = await createSamplePdf('Source', 3);
      await expect(extractPdfPages(sourcePdf, [])).rejects.toThrow(
        'Please select at least one page to extract.'
      );
    });
  });

  describe('rotatePdfPages', () => {
    it('rotates targeted pages by specified degree', async () => {
      const sourcePdf = await createSamplePdf('Rotate Test', 2);
      const rotatedBytes = await rotatePdfPages(sourcePdf, [0], 90);

      const doc = await PDFDocument.load(rotatedBytes);
      expect(doc.getPage(0).getRotation().angle).toBe(90);
      expect(doc.getPage(1).getRotation().angle).toBe(0);
    });
  });
});
