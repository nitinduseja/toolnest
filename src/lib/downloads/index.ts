import { zipSync, strToU8 } from 'fflate';

/**
 * Safe client-side file downloader that cleans up object URLs.
 */

interface DownloadOptions {
  filename: string;
  mimeType?: string;
}

export function downloadFile(content: string | Blob, options: DownloadOptions): boolean {
  try {
    const { filename, mimeType = 'text/plain;charset=utf-8' } = options;
    const blob = content instanceof Blob ? content : new Blob([content], { type: mimeType });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');

    link.href = url;
    link.download = filename;
    document.body.appendChild(link);
    link.click();

    document.body.removeChild(link);
    setTimeout(() => URL.revokeObjectURL(url), 1000);
    return true;
  } catch {
    return false;
  }
}

/**
 * Bundles multiple files into a single ZIP archive and triggers a single download.
 */
export function downloadZip(
  files: Record<string, Uint8Array | string>,
  zipFilename = 'bundle.zip'
): boolean {
  try {
    const zipData: Record<string, Uint8Array> = {};
    for (const [filename, content] of Object.entries(files)) {
      zipData[filename] = typeof content === 'string' ? strToU8(content) : content;
    }
    const zipped = zipSync(zipData);
    const blob = new Blob([zipped as Uint8Array], { type: 'application/zip' });
    return downloadFile(blob, { filename: zipFilename, mimeType: 'application/zip' });
  } catch {
    return false;
  }
}
