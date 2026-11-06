import React, { useState, useRef } from 'react';
import { Upload, Image as ImageIcon, Sliders, Check, Copy } from 'lucide-react';
import { ExtractedColor } from './types';
import { quantizePixels } from './paletteLogic';

interface ImagePaletteExtractorProps {
  colors: ExtractedColor[];
  onColorsExtracted: (colors: ExtractedColor[]) => void;
}

const SAMPLE_PRESETS = [
  {
    name: 'Sunset Glow',
    gradient: 'from-amber-500 via-rose-500 to-indigo-900',
    colors: [
      { r: 245, g: 158, b: 11 },
      { r: 244, g: 63, b: 94 },
      { r: 49, g: 46, b: 129 },
      { r: 251, g: 191, b: 36 },
      { r: 159, g: 18, b: 57 },
      { r: 30, g: 27, b: 75 },
    ],
  },
  {
    name: 'Deep Forest',
    gradient: 'from-emerald-700 via-teal-800 to-slate-900',
    colors: [
      { r: 4, g: 120, b: 87 },
      { r: 17, g: 94, b: 89 },
      { r: 15, g: 23, b: 42 },
      { r: 52, g: 211, b: 153 },
      { r: 20, g: 184, b: 166 },
      { r: 2, g: 44, b: 34 },
    ],
  },
  {
    name: 'Cyberpunk Neon',
    gradient: 'from-fuchsia-600 via-purple-600 to-cyan-400',
    colors: [
      { r: 192, g: 38, b: 211 },
      { r: 147, g: 51, b: 234 },
      { r: 34, g: 211, b: 238 },
      { r: 236, g: 72, b: 153 },
      { r: 59, g: 130, b: 246 },
      { r: 15, g: 10, b: 40 },
    ],
  },
];

export const ImagePaletteExtractor: React.FC<ImagePaletteExtractorProps> = ({
  colors,
  onColorsExtracted,
}) => {
  const [paletteSize, setPaletteSize] = useState<number>(6);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [copiedHex, setCopiedHex] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const processImageFile = (file: File) => {
    if (!file.type.startsWith('image/')) return;
    const reader = new FileReader();
    reader.onload = (e) => {
      const dataUrl = e.target?.result as string;
      setPreviewUrl(dataUrl);
      extractColorsFromDataUrl(dataUrl, paletteSize);
    };
    reader.readAsDataURL(file);
  };

  const extractColorsFromDataUrl = (dataUrl: string, count: number) => {
    const img = new Image();
    img.crossOrigin = 'Anonymous';
    img.onload = () => {
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');
      if (!ctx) return;

      const maxDim = 300;
      let width = img.width;
      let height = img.height;
      if (width > maxDim || height > maxDim) {
        if (width > height) {
          height = Math.round((height * maxDim) / width);
          width = maxDim;
        } else {
          width = Math.round((width * maxDim) / height);
          height = maxDim;
        }
      }

      canvas.width = width;
      canvas.height = height;
      ctx.drawImage(img, 0, 0, width, height);
      const imgData = ctx.getImageData(0, 0, width, height);
      const extracted = quantizePixels(imgData.data, count);
      onColorsExtracted(extracted);
    };
    img.src = dataUrl;
  };

  const handleApplySample = (sample: (typeof SAMPLE_PRESETS)[0]) => {
    setPreviewUrl(null);
    const mockPixels: number[] = [];
    sample.colors.forEach((c) => {
      for (let i = 0; i < 200; i++) {
        mockPixels.push(c.r, c.g, c.b, 255);
      }
    });
    const extracted = quantizePixels(new Uint8ClampedArray(mockPixels), paletteSize);
    onColorsExtracted(extracted);
  };

  const handleCopy = (hex: string) => {
    navigator.clipboard.writeText(hex);
    setCopiedHex(hex);
    setTimeout(() => setCopiedHex(null), 1800);
  };

  return (
    <div className="space-y-5">
      {/* Upload Zone & Sample Strips */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="md:col-span-2">
          <input
            type="file"
            ref={fileInputRef}
            onChange={(e) => e.target.files?.[0] && processImageFile(e.target.files[0])}
            accept="image/*"
            className="hidden"
          />
          <div
            onClick={() => fileInputRef.current?.click()}
            onDragOver={(e) => e.preventDefault()}
            onDrop={(e) => {
              e.preventDefault();
              if (e.dataTransfer.files?.[0]) processImageFile(e.dataTransfer.files[0]);
            }}
            className="border-2 border-dashed border-outline-variant/80 hover:border-primary/60 rounded-2xl p-6 text-center cursor-pointer bg-surface-container-low hover:bg-surface-container transition-all flex flex-col items-center justify-center min-h-[170px]"
          >
            {previewUrl ? (
              <div className="flex items-center gap-4">
                <img
                  src={previewUrl}
                  alt="Extracted source"
                  className="w-20 h-20 object-cover rounded-xl border border-outline-variant shadow-xs"
                />
                <div className="text-left">
                  <p className="text-xs font-bold text-on-surface">Image loaded successfully</p>
                  <p className="text-[11px] text-outline mt-0.5">
                    Click or drag another image to replace
                  </p>
                </div>
              </div>
            ) : (
              <>
                <div className="p-3 rounded-full bg-primary/10 text-primary mb-2">
                  <Upload className="w-5 h-5" />
                </div>
                <p className="text-xs font-bold text-on-surface">Upload or drag an image here</p>
                <p className="text-[11px] text-outline mt-1">
                  PNG, JPG, WebP, or SVG (100% processed locally in browser)
                </p>
              </>
            )}
          </div>
        </div>

        {/* Sample Palette Cards */}
        <div className="bg-surface-container-low border border-outline-variant/60 rounded-2xl p-4 flex flex-col justify-between">
          <div>
            <span className="text-xs font-bold text-on-surface flex items-center gap-1.5 mb-2">
              <ImageIcon className="w-3.5 h-3.5 text-primary" /> Or Try a Sample Palette
            </span>
            <div className="space-y-2">
              {SAMPLE_PRESETS.map((sample) => (
                <button
                  key={sample.name}
                  type="button"
                  onClick={() => handleApplySample(sample)}
                  className="w-full flex items-center justify-between p-2 rounded-xl bg-surface border border-outline-variant/40 hover:border-primary/40 text-left transition-all"
                >
                  <span className="text-xs font-semibold text-on-surface">{sample.name}</span>
                  <div
                    className={`w-14 h-4 rounded-full bg-gradient-to-r ${sample.gradient} shadow-2xs`}
                  />
                </button>
              ))}
            </div>
          </div>

          <div className="pt-3 border-t border-outline-variant/40 mt-2 flex items-center justify-between text-xs">
            <span className="text-[11px] text-outline flex items-center gap-1">
              <Sliders className="w-3 h-3" /> Palette Size:
            </span>
            <div className="flex gap-1">
              {[4, 6, 8].map((size) => (
                <button
                  key={size}
                  type="button"
                  onClick={() => {
                    setPaletteSize(size);
                    if (previewUrl) extractColorsFromDataUrl(previewUrl, size);
                  }}
                  className={`px-2 py-0.5 rounded text-[11px] font-mono font-bold transition-all ${
                    paletteSize === size
                      ? 'bg-primary text-white shadow-2xs'
                      : 'bg-surface border border-outline-variant/50 text-on-surface-variant'
                  }`}
                >
                  {size}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Extracted Swatches Grid */}
      {colors.length > 0 && (
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
          {colors.map((c) => (
            <div
              key={c.hex}
              onClick={() => handleCopy(c.hex)}
              className="group bg-surface border border-outline-variant/60 rounded-2xl overflow-hidden shadow-xs hover:shadow-md transition-all cursor-pointer"
            >
              <div
                className="h-24 sm:h-28 relative flex items-end p-2 transition-transform group-hover:scale-[1.02]"
                style={{ backgroundColor: c.hex }}
              >
                <span className="text-[10px] font-mono px-1.5 py-0.5 rounded-md bg-black/40 text-white backdrop-blur-xs font-bold">
                  {c.percentage}%
                </span>
                <button
                  type="button"
                  className="absolute top-2 right-2 p-1 rounded-md bg-black/40 text-white backdrop-blur-xs opacity-0 group-hover:opacity-100 transition-opacity"
                  title="Copy Hex"
                >
                  {copiedHex === c.hex ? (
                    <Check className="w-3 h-3 text-emerald-400" />
                  ) : (
                    <Copy className="w-3 h-3" />
                  )}
                </button>
              </div>

              <div className="p-3 space-y-1.5">
                <div className="flex items-center justify-between">
                  <span className="font-mono font-bold text-xs text-on-surface uppercase">
                    {c.hex}
                  </span>
                  <span
                    className={`text-[9px] font-bold px-1.5 py-0.2 rounded ${
                      c.passAAA
                        ? 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400'
                        : c.passAA
                          ? 'bg-indigo-500/10 text-indigo-600 dark:text-indigo-400'
                          : 'bg-amber-500/10 text-amber-600 dark:text-amber-400'
                    }`}
                  >
                    {c.passAAA ? 'AAA' : c.passAA ? 'AA' : 'Low'}
                  </span>
                </div>
                <div className="text-[10px] font-mono text-outline flex justify-between">
                  <span>
                    RGB({c.rgb.r}, {c.rgb.g}, {c.rgb.b})
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
