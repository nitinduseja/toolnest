import QRCode from 'qrcode';

export interface QrOptions {
  width?: number;
  margin?: number;
  darkColor?: string;
  lightColor?: string;
}

export async function generateQrDataUrl(text: string, options?: QrOptions): Promise<string> {
  const trimmed = text.trim();
  if (!trimmed) return '';

  if (trimmed.length > 2000) {
    throw new Error('Input length exceeds 2000 characters limit for standard QR code rendering.');
  }

  const { width = 300, margin = 2, darkColor = '#000000', lightColor = '#ffffff' } = options || {};

  return QRCode.toDataURL(trimmed, {
    width,
    margin,
    color: {
      dark: darkColor,
      light: lightColor,
    },
    errorCorrectionLevel: 'M',
  });
}
