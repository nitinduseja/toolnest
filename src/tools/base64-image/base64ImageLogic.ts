/**
 * Pure domain logic for Base64 Image encoding, decoding, snippet generation, and Blob conversion.
 */

export type SnippetFormat = 'data-url' | 'raw-base64' | 'html-img' | 'css-bg' | 'markdown';

export interface ParsedBase64Image {
  mimeType: string;
  base64: string;
  dataUrl: string;
  valid: boolean;
  error?: string;
}

/**
 * Converts a File or Blob into a Base64 Data URL.
 */
export function fileToBase64(file: Blob): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => {
      if (typeof reader.result === 'string') {
        resolve(reader.result);
      } else {
        reject(new Error('Failed to convert file to Base64 string'));
      }
    };
    reader.onerror = () => reject(reader.error || new Error('FileReader encountered an error'));
    reader.readAsDataURL(file);
  });
}

/**
 * Parses and sanitizes a Data URL or raw base64 string.
 */
export function parseBase64Image(input: string): ParsedBase64Image {
  const trimmed = input.trim();
  if (!trimmed) {
    return { mimeType: 'image/png', base64: '', dataUrl: '', valid: false };
  }

  // Matches data:image/...;base64,...
  const dataUrlRegex = /^data:(image\/[a-zA-Z0-9+.-]+);base64,([A-Za-z0-9+/=_\-\s]+)$/;
  const match = trimmed.match(dataUrlRegex);

  if (match) {
    const mimeType = match[1];
    const cleanBase64 = match[2].replace(/\s/g, '');
    return {
      mimeType,
      base64: cleanBase64,
      dataUrl: `data:${mimeType};base64,${cleanBase64}`,
      valid: true,
    };
  }

  // If raw base64 without prefix
  const rawBase64Clean = trimmed.replace(/\s/g, '');
  if (/^[A-Za-z0-9+/=]+$/.test(rawBase64Clean) && rawBase64Clean.length % 4 === 0) {
    // Detect basic image signatures from header bytes
    let inferredMime = 'image/png';
    if (rawBase64Clean.startsWith('/9j/')) inferredMime = 'image/jpeg';
    else if (rawBase64Clean.startsWith('R0lGOD')) inferredMime = 'image/gif';
    else if (rawBase64Clean.startsWith('UklGR')) inferredMime = 'image/webp';
    else if (rawBase64Clean.startsWith('PHN2Zy') || rawBase64Clean.startsWith('PD94bW'))
      inferredMime = 'image/svg+xml';

    return {
      mimeType: inferredMime,
      base64: rawBase64Clean,
      dataUrl: `data:${inferredMime};base64,${rawBase64Clean}`,
      valid: true,
    };
  }

  return {
    mimeType: 'image/png',
    base64: '',
    dataUrl: '',
    valid: false,
    error: 'Invalid Base64 image or Data URL format',
  };
}

/**
 * Generates ready-to-use HTML, CSS, or Markdown snippets for Base64 images.
 */
export function generateImageSnippet(
  dataUrl: string,
  format: SnippetFormat,
  alt = 'Image'
): string {
  if (!dataUrl) return '';

  switch (format) {
    case 'raw-base64': {
      const parts = dataUrl.split(',');
      return parts[1] || dataUrl;
    }
    case 'html-img':
      return `<img src="${dataUrl}" alt="${alt}" />`;
    case 'css-bg':
      return `background-image: url("${dataUrl}");`;
    case 'markdown':
      return `![${alt}](${dataUrl})`;
    case 'data-url':
    default:
      return dataUrl;
  }
}

/**
 * Converts a Base64 string into a downloadable Blob.
 */
export function base64ToBlob(base64Data: string, mimeType = 'image/png'): Blob {
  const clean = base64Data.replace(/^data:image\/[a-zA-Z0-9+.-]+;base64,/, '').replace(/\s/g, '');
  const byteCharacters = atob(clean);
  const byteNumbers = new Array(byteCharacters.length);
  for (let i = 0; i < byteCharacters.length; i++) {
    byteNumbers[i] = byteCharacters.charCodeAt(i);
  }
  const byteArray = new Uint8Array(byteNumbers);
  return new Blob([byteArray], { type: mimeType });
}
