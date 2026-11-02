/**
 * Optical Character Recognition (OCR) engine running entirely in-browser.
 */
import type { Block } from 'tesseract.js';

export interface OcrWordBox {
  text: string;
  x0: number;
  y0: number;
  x1: number;
  y1: number;
}

export interface OcrResult {
  text: string;
  words: OcrWordBox[];
}

export const SUPPORTED_OCR_LANGUAGES = [
  { id: 'eng', label: 'English' },
  { id: 'spa', label: 'Spanish' },
  { id: 'fra', label: 'French' },
  { id: 'deu', label: 'German' },
  { id: 'chi_sim', label: 'Chinese (Simplified)' },
  { id: 'jpn', label: 'Japanese' },
  { id: 'hin', label: 'Hindi' },
  { id: 'ara', label: 'Arabic' },
] as const;

function extractWordsFromBlocks(blocks: Block[] | null): OcrWordBox[] {
  if (!blocks) return [];
  const words: OcrWordBox[] = [];
  for (const block of blocks) {
    for (const para of block.paragraphs || []) {
      for (const line of para.lines || []) {
        for (const w of line.words || []) {
          if (w.text && w.bbox) {
            words.push({
              text: w.text,
              x0: w.bbox.x0,
              y0: w.bbox.y0,
              x1: w.bbox.x1,
              y1: w.bbox.y1,
            });
          }
        }
      }
    }
  }
  return words;
}

export async function performOcr(
  imageSource: string | HTMLCanvasElement,
  lang: string = 'eng',
  onProgress?: (progress: number) => void
): Promise<OcrResult> {
  try {
    const { createWorker } = await import('tesseract.js');
    const worker = await createWorker(lang, 1, {
      logger: (m) => {
        if (m.status === 'recognizing text' && onProgress && typeof m.progress === 'number') {
          onProgress(Math.round(m.progress * 100));
        }
      },
    });

    const ret = await worker.recognize(imageSource);
    await worker.terminate();

    const words = extractWordsFromBlocks(ret.data.blocks);
    return { text: ret.data.text.trim(), words };
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Unknown OCR error';
    throw new Error(`OCR processing failed: ${message}`);
  }
}
