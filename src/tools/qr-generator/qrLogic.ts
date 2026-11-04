import QRCode from 'qrcode';

export type QrErrorCorrectionLevel = 'L' | 'M' | 'Q' | 'H';

export interface QrOptions {
  width?: number;
  margin?: number;
  darkColor?: string;
  lightColor?: string;
  errorCorrectionLevel?: QrErrorCorrectionLevel;
}

export interface WifiConfig {
  ssid: string;
  password?: string;
  encryption?: 'WPA' | 'WEP' | 'nopass';
  hidden?: boolean;
}

export interface VCardConfig {
  firstName: string;
  lastName: string;
  organization?: string;
  title?: string;
  phone?: string;
  email?: string;
  website?: string;
}

export async function generateQrDataUrl(text: string, options?: QrOptions): Promise<string> {
  const trimmed = text.trim();
  if (!trimmed) return '';

  if (trimmed.length > 2500) {
    throw new Error('Input length exceeds 2500 characters limit for standard QR code rendering.');
  }

  const {
    width = 300,
    margin = 2,
    darkColor = '#000000',
    lightColor = '#ffffff',
    errorCorrectionLevel = 'M',
  } = options || {};

  return QRCode.toDataURL(trimmed, {
    width,
    margin,
    color: {
      dark: darkColor,
      light: lightColor,
    },
    errorCorrectionLevel,
  });
}

export async function generateQrSvg(text: string, options?: QrOptions): Promise<string> {
  const trimmed = text.trim();
  if (!trimmed) return '';

  if (trimmed.length > 2500) {
    throw new Error('Input length exceeds 2500 characters limit for standard QR code rendering.');
  }

  const {
    width = 300,
    margin = 2,
    darkColor = '#000000',
    lightColor = '#ffffff',
    errorCorrectionLevel = 'M',
  } = options || {};

  return QRCode.toString(trimmed, {
    type: 'svg',
    width,
    margin,
    color: {
      dark: darkColor,
      light: lightColor,
    },
    errorCorrectionLevel,
  });
}

/**
 * Builds a standardized Wi-Fi network configuration QR string.
 * Format: WIFI:S:<SSID>;T:<WPA|WEP|nopass>;P:<password>;H:<true|false>;;
 */
export function buildWifiPayload(config: WifiConfig): string {
  const { ssid, password = '', encryption = 'WPA', hidden = false } = config;
  const escapedSsid = ssid.replace(/([\\;,:"])/g, '\\$1');
  const escapedPass = password.replace(/([\\;,:"])/g, '\\$1');
  const encType = encryption === 'nopass' ? 'nopass' : encryption;
  return `WIFI:S:${escapedSsid};T:${encType};P:${escapedPass};H:${hidden ? 'true' : 'false'};;`;
}

/**
 * Builds a standardized vCard 3.0 contact QR string.
 */
export function buildVCardPayload(data: VCardConfig): string {
  const lines = ['BEGIN:VCARD', 'VERSION:3.0'];
  lines.push(`N:${data.lastName};${data.firstName};;;`);
  lines.push(`FN:${data.firstName} ${data.lastName}`.trim());
  if (data.organization) lines.push(`ORG:${data.organization}`);
  if (data.title) lines.push(`TITLE:${data.title}`);
  if (data.phone) lines.push(`TEL;TYPE=CELL:${data.phone}`);
  if (data.email) lines.push(`EMAIL:${data.email}`);
  if (data.website) lines.push(`URL:${data.website}`);
  lines.push('END:VCARD');
  return lines.join('\n');
}

/**
 * Builds a mailto link payload.
 */
export function buildEmailPayload(email: string, subject = '', body = ''): string {
  const params = new URLSearchParams();
  if (subject) params.append('subject', subject);
  if (body) params.append('body', body);
  const query = params.toString();
  return `mailto:${email}${query ? `?${query}` : ''}`;
}
