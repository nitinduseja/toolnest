import React, { useState, useEffect } from 'react';
import { Download, AlertTriangle } from 'lucide-react';
import { generateQrDataUrl } from './qrLogic';

export const QrGeneratorTool: React.FC = () => {
  const [text, setText] = useState('https://toolnest.netlify.app');
  const [dataUrl, setDataUrl] = useState('');
  const [size, setSize] = useState(300);
  const [margin, setMargin] = useState(2);
  const [darkColor, setDarkColor] = useState('#000000');
  const [lightColor, setLightColor] = useState('#ffffff');
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    if (!text.trim()) {
      setDataUrl('');
      setError(null);
      return;
    }

    generateQrDataUrl(text, { width: size, margin, darkColor, lightColor })
      .then((url) => {
        if (!cancelled) {
          setDataUrl(url);
          setError(null);
        }
      })
      .catch((err: unknown) => {
        if (!cancelled) {
          setError(err instanceof Error ? err.message : 'QR generation failed');
          setDataUrl('');
        }
      });

    return () => {
      cancelled = true;
    };
  }, [text, size, margin, darkColor, lightColor]);

  const handleDownload = () => {
    if (!dataUrl) return;
    const link = document.createElement('a');
    link.href = dataUrl;
    link.download = 'qrcode.png';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left 2 Cols: Input & Customization Controls */}
        <div className="lg:col-span-2 space-y-4">
          <div className="space-y-2">
            <div className="flex items-center justify-between text-xs text-outline px-1">
              <label htmlFor="qr-input" className="font-medium">
                QR Payload (URL or Plaintext)
              </label>
              <button
                type="button"
                onClick={() => setText('')}
                className="hover:text-red-500 transition-colors"
              >
                Clear
              </button>
            </div>
            <textarea
              id="qr-input"
              value={text}
              onChange={(e) => setText(e.target.value)}
              placeholder="Enter text or URL to generate QR code..."
              className="w-full h-32 p-4 rounded-xl bg-surface-container-low border border-outline-variant font-mono text-xs text-on-surface placeholder:text-outline focus:outline-none focus:ring-2 focus:ring-primary-container resize-y"
            />
          </div>

          {error && (
            <div className="p-3 rounded-xl bg-red-500/10 border border-red-500/30 flex items-center gap-2.5 text-xs text-red-400">
              <AlertTriangle className="w-4 h-4 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          {/* Customization Options */}
          <div className="p-4 rounded-xl bg-surface-container-low border border-outline-variant space-y-3">
            <h3 className="text-xs font-semibold uppercase tracking-wider text-outline">
              Options &amp; Dimensions
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
              <div>
                <label className="text-on-surface-variant block mb-1">Pixel Size ({size}px)</label>
                <select
                  value={size}
                  onChange={(e) => setSize(Number(e.target.value))}
                  className="w-full h-9 px-3 rounded-lg bg-surface border border-outline-variant text-xs text-on-surface focus:outline-none"
                >
                  <option value={200}>200 x 200 px</option>
                  <option value={300}>300 x 300 px</option>
                  <option value={400}>400 x 400 px</option>
                  <option value={600}>600 x 600 px (HD)</option>
                </select>
              </div>

              <div>
                <label className="text-on-surface-variant block mb-1">
                  Quiet Zone Margin ({margin})
                </label>
                <select
                  value={margin}
                  onChange={(e) => setMargin(Number(e.target.value))}
                  className="w-full h-9 px-3 rounded-lg bg-surface border border-outline-variant text-xs text-on-surface focus:outline-none"
                >
                  <option value={1}>Compact (1 module)</option>
                  <option value={2}>Standard (2 modules)</option>
                  <option value={4}>Generous (4 modules)</option>
                </select>
              </div>

              <div className="flex items-center gap-3">
                <label className="text-on-surface-variant">QR Color:</label>
                <input
                  type="color"
                  value={darkColor}
                  onChange={(e) => setDarkColor(e.target.value)}
                  className="w-8 h-8 rounded border border-outline-variant cursor-pointer"
                />
                <span className="font-mono text-xs">{darkColor}</span>
              </div>

              <div className="flex items-center gap-3">
                <label className="text-on-surface-variant">Background:</label>
                <input
                  type="color"
                  value={lightColor}
                  onChange={(e) => setLightColor(e.target.value)}
                  className="w-8 h-8 rounded border border-outline-variant cursor-pointer"
                />
                <span className="font-mono text-xs">{lightColor}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Right Col: Live Preview & Download */}
        <div className="p-6 rounded-2xl bg-surface-container-low border border-outline-variant flex flex-col items-center justify-between text-center space-y-4">
          <div className="w-full flex items-center justify-between text-xs text-outline">
            <span className="font-semibold uppercase">QR Code Preview</span>
            <span className="font-mono text-[11px]">
              {size}x{size}
            </span>
          </div>

          <div className="p-3 bg-white rounded-xl shadow-md border border-outline-variant/60">
            {dataUrl ? (
              <img
                src={dataUrl}
                alt="Generated QR Code"
                className="w-48 h-48 object-contain rounded"
              />
            ) : (
              <div className="w-48 h-48 flex items-center justify-center text-zinc-400 text-xs italic">
                Enter payload to render
              </div>
            )}
          </div>

          <div className="w-full space-y-2">
            <button
              type="button"
              onClick={handleDownload}
              disabled={!dataUrl}
              className="w-full h-10 inline-flex items-center justify-center gap-2 rounded-xl bg-primary-container text-on-primary-container text-xs font-semibold hover:opacity-95 shadow-sm transition-opacity disabled:opacity-40"
            >
              <Download className="w-4 h-4" />
              <span>Download PNG Image</span>
            </button>
            <p className="text-[11px] text-outline">
              Generated locally via Canvas API. No external QR servers called.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default QrGeneratorTool;
