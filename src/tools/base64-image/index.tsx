import React, { useState } from 'react';
import { Download, Sparkles } from 'lucide-react';
import { parseBase64Image, base64ToBlob } from './base64ImageLogic';
import { Base64DecoderView } from './Base64DecoderView';
import { Base64EncoderView } from './Base64EncoderView';

type Mode = 'encode' | 'decode';

const SAMPLE_BASE64 =
  'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNk+M9QDwADhgGAWjR9awAAAABJRU5ErkJggg==';

export const Base64ImageTool: React.FC = () => {
  const [mode, setMode] = useState<Mode>('encode');
  const [base64Input, setBase64Input] = useState<string>(SAMPLE_BASE64);

  const decodedResult = parseBase64Image(base64Input);

  const handleDownloadDecodedImage = () => {
    if (!decodedResult.valid) return;
    const blob = base64ToBlob(decodedResult.dataUrl, decodedResult.mimeType);
    const ext = decodedResult.mimeType.split('/')[1] || 'png';
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `decoded-image.${ext}`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-4">
      {/* Mode Switcher */}
      <div className="flex flex-wrap items-center justify-between gap-3 p-3 rounded-xl bg-surface-container-low border border-outline-variant">
        <div className="flex items-center gap-1 p-1 rounded-xl bg-surface-container-high border border-outline-variant/60">
          <button
            type="button"
            onClick={() => setMode('encode')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors cursor-pointer ${
              mode === 'encode'
                ? 'bg-primary-container text-on-primary-container shadow-xs'
                : 'text-on-surface-variant hover:text-on-surface'
            }`}
          >
            Image to Base64 (Multi-File)
          </button>
          <button
            type="button"
            onClick={() => setMode('decode')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors cursor-pointer ${
              mode === 'decode'
                ? 'bg-primary-container text-on-primary-container shadow-xs'
                : 'text-on-surface-variant hover:text-on-surface'
            }`}
          >
            Base64 to Image
          </button>
        </div>

        {mode === 'decode' && (
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => setBase64Input(SAMPLE_BASE64)}
              className="px-2.5 py-1.5 rounded-lg text-xs text-on-surface-variant hover:bg-surface-container transition-colors cursor-pointer"
            >
              Load Sample
            </button>
            <button
              type="button"
              onClick={handleDownloadDecodedImage}
              disabled={!decodedResult.valid}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-primary-container text-on-primary-container text-xs font-semibold hover:opacity-95 shadow-sm transition-opacity disabled:opacity-40 cursor-pointer"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Download Image</span>
            </button>
          </div>
        )}
      </div>

      {/* MODE 1: Image to Base64 (Supports multi-drop & single) */}
      {mode === 'encode' && <Base64EncoderView />}

      {/* MODE 2: Base64 to Image */}
      {mode === 'decode' && (
        <Base64DecoderView
          base64Input={base64Input}
          setBase64Input={setBase64Input}
          decodedResult={decodedResult}
        />
      )}

      {/* Privacy note */}
      <div className="flex items-center gap-2 text-[11px] text-outline px-1">
        <Sparkles className="w-3.5 h-3.5 text-primary shrink-0" />
        <span>
          Images and Data URIs are converted completely in browser memory via native FileReader
          &amp; Blob APIs.
        </span>
      </div>
    </div>
  );
};

export default Base64ImageTool;
