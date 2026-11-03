import { IconSizeConfig, GeneratedIconItem, FaviconManifestConfig } from './types';
import { buildIcoBinary, IcoImageEntry } from './icoBuilderLogic';

export const ICON_SIZES: IconSizeConfig[] = [
  { name: 'Favicon 16×16', filename: 'favicon-16x16.png', size: 16, purpose: 'favicon' },
  { name: 'Favicon 32×32', filename: 'favicon-32x32.png', size: 32, purpose: 'favicon' },
  {
    name: 'Apple Touch 180×180',
    filename: 'apple-touch-icon.png',
    size: 180,
    purpose: 'apple-touch',
  },
  {
    name: 'Android / PWA 192×192',
    filename: 'android-chrome-192x192.png',
    size: 192,
    purpose: 'android-chrome',
  },
  {
    name: 'Android / PWA 512×512',
    filename: 'android-chrome-512x512.png',
    size: 512,
    purpose: 'android-chrome',
  },
];

export function generateHtmlSnippet(): string {
  return `<link rel="icon" type="image/x-icon" href="/favicon.ico">
<link rel="icon" type="image/png" sizes="32x32" href="/favicon-32x32.png">
<link rel="icon" type="image/png" sizes="16x16" href="/favicon-16x16.png">
<link rel="apple-touch-icon" sizes="180x180" href="/apple-touch-icon.png">
<link rel="manifest" href="/site.webmanifest">`;
}

export function generateManifestJson(config: FaviconManifestConfig): string {
  const manifest = {
    name: config.name || 'My Application',
    short_name: config.shortName || 'App',
    icons: [
      {
        src: '/android-chrome-192x192.png',
        sizes: '192x192',
        type: 'image/png',
      },
      {
        src: '/android-chrome-512x512.png',
        sizes: '512x512',
        type: 'image/png',
      },
    ],
    theme_color: config.themeColor || '#6366f1',
    background_color: config.backgroundColor || '#ffffff',
    display: 'standalone',
  };
  return JSON.stringify(manifest, null, 2);
}

export function renderResizedBlob(
  img: HTMLImageElement,
  size: number
): Promise<{ blob: Blob; dataUrl: string; bytes: Uint8Array }> {
  const canvas = document.createElement('canvas');
  canvas.width = size;
  canvas.height = size;
  const ctx = canvas.getContext('2d');
  if (!ctx) throw new Error('Canvas 2D context not available');

  ctx.imageSmoothingEnabled = true;
  ctx.imageSmoothingQuality = 'high';
  ctx.drawImage(img, 0, 0, size, size);

  const dataUrl = canvas.toDataURL('image/png');
  return new Promise((resolve, reject) => {
    canvas.toBlob(async (blob) => {
      if (!blob) return reject(new Error(`Failed to generate ${size}x${size} icon`));
      const buf = await blob.arrayBuffer();
      resolve({ blob, dataUrl, bytes: new Uint8Array(buf) });
    }, 'image/png');
  });
}

export async function generateIcons(img: HTMLImageElement): Promise<{
  pngIcons: GeneratedIconItem[];
  icoIcon: GeneratedIconItem;
}> {
  const pngIcons: GeneratedIconItem[] = [];
  const icoEntries: IcoImageEntry[] = [];

  for (const cfg of ICON_SIZES) {
    const rendered = await renderResizedBlob(img, cfg.size);
    pngIcons.push({
      id: `icon_${cfg.size}`,
      name: cfg.name,
      filename: cfg.filename,
      size: cfg.size,
      dataUrl: rendered.dataUrl,
      blob: rendered.blob,
    });
    if (cfg.size === 16 || cfg.size === 32) {
      icoEntries.push({ width: cfg.size, height: cfg.size, bytes: rendered.bytes });
    }
  }

  // Also render 48x48 for standard Windows taskbar ICO
  const ico48 = await renderResizedBlob(img, 48);
  icoEntries.push({ width: 48, height: 48, bytes: ico48.bytes });

  const icoBytes = buildIcoBinary(icoEntries);
  const icoBlob = new Blob([icoBytes], { type: 'image/x-icon' });

  const icoIcon: GeneratedIconItem = {
    id: 'icon_ico',
    name: 'Multi-Res Favicon (.ico)',
    filename: 'favicon.ico',
    size: 48,
    dataUrl: URL.createObjectURL(icoBlob),
    blob: icoBlob,
  };

  return { pngIcons, icoIcon };
}

export function createSampleLogoFile(): Promise<File> {
  const canvas = document.createElement('canvas');
  canvas.width = 512;
  canvas.height = 512;
  const ctx = canvas.getContext('2d');
  if (ctx) {
    const grad = ctx.createLinearGradient(0, 0, 512, 512);
    grad.addColorStop(0, '#6366f1');
    grad.addColorStop(1, '#ec4899');
    ctx.fillStyle = grad;
    ctx.beginPath();
    ctx.roundRect(32, 32, 448, 448, 96);
    ctx.fill();

    ctx.fillStyle = '#ffffff';
    ctx.font = 'bold 240px sans-serif';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText('T', 256, 260);
  }
  return new Promise((resolve) => {
    canvas.toBlob((blob) => {
      resolve(new File([blob || new Blob()], 'sample-logo.png', { type: 'image/png' }));
    }, 'image/png');
  });
}
