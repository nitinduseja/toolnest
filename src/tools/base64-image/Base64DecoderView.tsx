import React from 'react';
import { Image as ImageIcon } from 'lucide-react';
import type { ParsedBase64Image } from './base64ImageLogic';

interface Base64DecoderViewProps {
  base64Input: string;
  setBase64Input: (val: string) => void;
  decodedResult: ParsedBase64Image;
}

export const Base64DecoderView: React.FC<Base64DecoderViewProps> = ({
  base64Input,
  setBase64Input,
  decodedResult,
}) => {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
      <div className="space-y-2">
        <div className="flex items-center justify-between text-xs text-outline px-1">
          <span className="font-medium text-on-surface">Base64 String or Data URL Input</span>
          <span className="font-mono text-[11px]">{base64Input.length} chars</span>
        </div>
        <textarea
          value={base64Input}
          onChange={(e) => setBase64Input(e.target.value)}
          placeholder="Paste data:image/...;base64,... or raw base64 string here..."
          className="w-full h-80 sm:h-96 p-4 rounded-xl bg-surface-container-low border border-outline-variant font-mono text-xs text-on-surface placeholder:text-outline focus:outline-none focus:ring-2 focus:ring-primary-container resize-y"
        />
      </div>

      <div className="space-y-2">
        <div className="flex items-center justify-between text-xs text-outline px-1">
          <span className="font-medium text-on-surface">Decoded Image Preview</span>
          {decodedResult.valid && (
            <span className="font-mono text-[11px] px-2 py-0.5 rounded bg-surface-container-high text-primary font-semibold">
              {decodedResult.mimeType}
            </span>
          )}
        </div>

        <div className="w-full h-80 sm:h-96 p-4 rounded-xl bg-surface-container-lowest border border-outline-variant flex flex-col items-center justify-center overflow-hidden">
          {decodedResult.valid ? (
            <img
              src={decodedResult.dataUrl}
              alt="Decoded Preview"
              className="max-h-full max-w-full object-contain rounded shadow-xs"
            />
          ) : (
            <div className="text-center space-y-2 text-outline text-xs">
              <ImageIcon className="w-8 h-8 mx-auto opacity-40" />
              <span>
                {decodedResult.error || 'Enter a valid Base64 string to render image preview'}
              </span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
