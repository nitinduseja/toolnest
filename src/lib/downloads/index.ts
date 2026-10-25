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
