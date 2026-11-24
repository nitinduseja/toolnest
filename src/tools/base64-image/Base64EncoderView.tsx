import React, { useState, useRef } from 'react';
import { Upload, Copy, Check, Trash2 } from 'lucide-react';
import { fileToBase64, generateImageSnippet, SnippetFormat } from './base64ImageLogic';
import { copyToClipboard } from '@/lib/clipboard';
import { Base64EncodedItem } from './types';

interface Base64EncoderViewProps {
  onNotifyCopy?: () => void;
}

export const Base64EncoderView: React.FC<Base64EncoderViewProps> = () => {
  const [items, setItems] = useState<Base64EncodedItem[]>([]);
  const [globalFormat, setGlobalFormat] = useState<SnippetFormat>('data-url');
  const [altText, setAltText] = useState<string>('Image');
  const [isDragging, setIsDragging] = useState<boolean>(false);
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const processFiles = async (files: File[]) => {
    const newItems: Base64EncodedItem[] = [];
    for (const file of files) {
      try {
        const b64 = await fileToBase64(file);
        newItems.push({
          id: `b64_${Date.now()}_${Math.random().toString(36).slice(2, 6)}`,
          fileName: file.name,
          fileSize: file.size,
          dataUrl: b64,
          format: globalFormat,
          altText,
        });
      } catch {
        // Skip unreadable files
      }
    }
    setItems((prev) => [...prev, ...newItems]);
  };

  const handleCopySingle = async (text: string, id: string) => {
    const ok = await copyToClipboard(text);
    if (ok) {
      setCopiedId(id);
      setTimeout(() => setCopiedId(null), 2000);
    }
  };

  const handleCopyAll = async () => {
    const combined = items
      .map((it) => generateImageSnippet(it.dataUrl, globalFormat, altText))
      .join('\n\n');
    const ok = await copyToClipboard(combined);
    if (ok) {
      setCopiedId('all');
      setTimeout(() => setCopiedId(null), 2000);
    }
  };

  return (
    <div className="space-y-4">
      <input
        ref={fileInputRef}
        type="file"
        multiple
        accept="image/*"
        onChange={(e) => {
          if (e.target.files) {
            processFiles(Array.from(e.target.files));
            e.target.value = '';
          }
        }}
        className="hidden"
      />

      {/* Drag & Drop Upload Zone */}
      <div
        onDragOver={(e) => {
          e.preventDefault();
          setIsDragging(true);
        }}
        onDragLeave={() => setIsDragging(false)}
        onDrop={(e) => {
          e.preventDefault();
          setIsDragging(false);
          if (e.dataTransfer.files) {
            processFiles(Array.from(e.dataTransfer.files));
          }
        }}
        onClick={() => fileInputRef.current?.click()}
        className={`p-8 border-2 border-dashed rounded-2xl text-center cursor-pointer transition-colors space-y-2 ${
          isDragging
            ? 'border-primary bg-primary-container/10'
            : 'border-outline-variant hover:border-primary bg-surface-container-low'
        }`}
      >
        <Upload className="w-8 h-8 text-primary mx-auto" />
        <div className="text-sm font-semibold text-on-surface">
          Click or drag &amp; drop image(s) to encode into Base64
        </div>
        <p className="text-xs text-outline">
          Supports PNG, JPG, WebP, SVG, and GIF. Multi-file batch conversion supported.
        </p>
      </div>

      {/* Format and Batch Controls */}
      {items.length > 0 && (
        <div className="p-3.5 rounded-xl bg-surface-container-low border border-outline-variant flex flex-wrap items-center justify-between gap-3">
          <div className="flex flex-wrap items-center gap-2">
            <span className="text-xs text-outline font-medium">Format:</span>
            {[
              { id: 'data-url', label: 'Data URI' },
              { id: 'raw-base64', label: 'Raw Base64' },
              { id: 'html-img', label: 'HTML <img>' },
              { id: 'css-bg', label: 'CSS Background' },
              { id: 'markdown', label: 'Markdown' },
            ].map((fmt) => (
              <button
                key={fmt.id}
                type="button"
                onClick={() => setGlobalFormat(fmt.id as SnippetFormat)}
                className={`px-2.5 py-1 rounded-lg text-xs font-medium transition-colors ${
                  globalFormat === fmt.id
                    ? 'bg-primary-container text-on-primary-container font-semibold'
                    : 'bg-surface border border-outline-variant text-on-surface-variant hover:text-on-surface'
                }`}
              >
                {fmt.label}
              </button>
            ))}
          </div>

          <div className="flex items-center gap-2">
            {(globalFormat === 'html-img' || globalFormat === 'markdown') && (
              <div className="flex items-center gap-1.5 mr-2">
                <span className="text-xs text-outline">Alt:</span>
                <input
                  type="text"
                  value={altText}
                  onChange={(e) => setAltText(e.target.value)}
                  className="w-28 h-7 px-2 rounded-md bg-surface border border-outline-variant text-xs text-on-surface"
                />
              </div>
            )}
            {items.length > 1 && (
              <button
                type="button"
                onClick={handleCopyAll}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold bg-primary text-on-primary hover:opacity-90 shadow-xs cursor-pointer"
              >
                {copiedId === 'all' ? <Check className="w-3 h-3" /> : <Copy className="w-3 h-3" />}
                <span>{copiedId === 'all' ? 'Copied All!' : 'Copy All Snippets'}</span>
              </button>
            )}
            <button
              type="button"
              onClick={() => setItems([])}
              className="p-1.5 rounded-lg text-outline hover:text-red-500 hover:bg-surface-container transition-colors cursor-pointer"
              title="Clear All"
            >
              <Trash2 className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {/* Items List */}
      {items.length > 0 && (
        <div className="space-y-3">
          {items.map((item) => {
            const snippet = generateImageSnippet(item.dataUrl, globalFormat, altText);
            const isCopied = copiedId === item.id;
            return (
              <div
                key={item.id}
                className="p-3.5 rounded-xl bg-surface-container-low border border-outline-variant flex flex-col md:flex-row items-start md:items-center gap-3.5"
              >
                {/* Thumbnail */}
                <div className="w-16 h-16 rounded-lg bg-surface border border-outline-variant p-1 flex items-center justify-center shrink-0 overflow-hidden">
                  <img
                    src={item.dataUrl}
                    alt={item.fileName}
                    className="max-h-full max-w-full object-contain"
                  />
                </div>

                {/* Details */}
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-semibold text-on-surface truncate">
                      {item.fileName}
                    </span>
                    <span className="text-[11px] text-outline font-mono">
                      {(item.fileSize / 1024).toFixed(1)} KB → Base64:{' '}
                      {(snippet.length / 1024).toFixed(1)} KB
                    </span>
                  </div>
                  <input
                    readOnly
                    value={snippet}
                    className="w-full mt-1.5 px-2.5 py-1 rounded-lg bg-surface border border-outline-variant font-mono text-[11px] text-on-surface focus:outline-none"
                  />
                </div>

                {/* Actions */}
                <div className="flex items-center gap-1.5 shrink-0">
                  <button
                    type="button"
                    onClick={() => handleCopySingle(snippet, item.id)}
                    className="flex items-center gap-1 px-3 py-1.5 rounded-lg bg-surface hover:bg-surface-container border border-outline-variant text-xs text-on-surface cursor-pointer"
                  >
                    {isCopied ? (
                      <Check className="w-3.5 h-3.5 text-emerald-500" />
                    ) : (
                      <Copy className="w-3.5 h-3.5" />
                    )}
                    <span>{isCopied ? 'Copied' : 'Copy'}</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => setItems((prev) => prev.filter((it) => it.id !== item.id))}
                    className="p-1.5 rounded-lg text-outline hover:text-red-500 hover:bg-surface-container transition-colors cursor-pointer"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};
