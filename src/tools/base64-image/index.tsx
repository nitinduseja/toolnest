import React, { useState, useMemo, useRef } from 'react';
import {
  Upload,
  Copy,
  Check,
  Download,
  Trash2,
  Image as ImageIcon,
  Sparkles,
} from 'lucide-react';
import {
  fileToBase64,
  parseBase64Image,
  generateImageSnippet,
  base64ToBlob,
  SnippetFormat,
} from './base64ImageLogic';
import { copyToClipboard } from '@/lib/clipboard';

type Mode = 'encode' | 'decode';

const SAMPLE_BASE64 =
  'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNk+M9QDwADhgGAWjR9awAAAABJRU5ErkJggg==';

export const Base64ImageTool: React.FC = () => {
  const [mode, setMode] = useState<Mode>('encode');

  // Encode state
  const [dataUrl, setDataUrl] = useState<string>('');
  const [fileName, setFileName] = useState<string>('');
  const [fileSize, setFileSize] = useState<number>(0);
  const [snippetFormat, setSnippetFormat] = useState<SnippetFormat>('data-url');
  const [altText, setAltText] = useState<string>('Logo');

  // Decode state
  const [base64Input, setBase64Input] = useState<string>(SAMPLE_BASE64);

  const [copied, setCopied] = useState<boolean>(false);
  const [isDragging, setIsDragging] = useState<boolean>(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Parse decoded image
  const decodedResult = useMemo(() => {
    return parseBase64Image(base64Input);
  }, [base64Input]);

  // Snippet output for encode mode
  const outputSnippet = useMemo(() => {
    return generateImageSnippet(dataUrl, snippetFormat, altText);
  }, [dataUrl, snippetFormat, altText]);

  const handleFileUpload = async (file: File) => {
    try {
      const b64 = await fileToBase64(file);
      setDataUrl(b64);
      setFileName(file.name);
      setFileSize(file.size);
    } catch {
      // Ignored
    }
  };

  const handleCopy = async (text: string) => {
    if (!text) return;
    const ok = await copyToClipboard(text);
    if (ok) {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

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
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        onChange={(e) => {
          if (e.target.files && e.target.files[0]) {
            handleFileUpload(e.target.files[0]);
          }
        }}
        className="hidden"
      />

      {/* Mode Switcher */}
      <div className="flex flex-wrap items-center justify-between gap-3 p-3 rounded-xl bg-surface-container-low border border-outline-variant">
        <div className="flex items-center gap-1 p-1 rounded-xl bg-surface-container-high border border-outline-variant/60">
          <button
            type="button"
            onClick={() => setMode('encode')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors ${
              mode === 'encode'
                ? 'bg-primary-container text-on-primary-container shadow-xs'
                : 'text-on-surface-variant hover:text-on-surface'
            }`}
          >
            Image to Base64
          </button>
          <button
            type="button"
            onClick={() => setMode('decode')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors ${
              mode === 'decode'
                ? 'bg-primary-container text-on-primary-container shadow-xs'
                : 'text-on-surface-variant hover:text-on-surface'
            }`}
          >
            Base64 to Image
          </button>
        </div>

        {mode === 'encode' && dataUrl && (
          <div className="flex items-center gap-2">
            <span className="text-xs text-outline font-mono">
              Raw: {(fileSize / 1024).toFixed(1)} KB → Base64: {(outputSnippet.length / 1024).toFixed(1)} KB
            </span>
            <button
              type="button"
              onClick={() => handleCopy(outputSnippet)}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-surface hover:bg-surface-container text-xs font-medium text-on-surface border border-outline-variant transition-colors"
            >
              {copied ? <Check className="w-3.5 h-3.5 text-emerald-500" /> : <Copy className="w-3.5 h-3.5" />}
              <span>{copied ? 'Copied' : 'Copy'}</span>
            </button>
            <button
              type="button"
              onClick={() => {
                setDataUrl('');
                setFileName('');
              }}
              className="p-1.5 rounded-lg text-outline hover:text-red-500 hover:bg-surface-container transition-colors"
              title="Clear"
            >
              <Trash2 className="w-4 h-4" />
            </button>
          </div>
        )}

        {mode === 'decode' && (
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => setBase64Input(SAMPLE_BASE64)}
              className="px-2.5 py-1.5 rounded-lg text-xs text-on-surface-variant hover:bg-surface-container transition-colors"
            >
              Load Sample
            </button>
            <button
              type="button"
              onClick={handleDownloadDecodedImage}
              disabled={!decodedResult.valid}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-primary-container text-on-primary-container text-xs font-semibold hover:opacity-95 shadow-sm transition-opacity disabled:opacity-40"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Download Image</span>
            </button>
          </div>
        )}
      </div>

      {/* MODE 1: Image to Base64 */}
      {mode === 'encode' && (
        <div className="space-y-4">
          {!dataUrl ? (
            <div
              onDragOver={(e) => {
                e.preventDefault();
                setIsDragging(true);
              }}
              onDragLeave={() => setIsDragging(false)}
              onDrop={(e) => {
                e.preventDefault();
                setIsDragging(false);
                if (e.dataTransfer.files && e.dataTransfer.files[0]) {
                  handleFileUpload(e.dataTransfer.files[0]);
                }
              }}
              onClick={() => fileInputRef.current?.click()}
              className={`p-12 border-2 border-dashed rounded-2xl text-center cursor-pointer transition-colors space-y-3 ${
                isDragging
                  ? 'border-primary bg-primary-container/10'
                  : 'border-outline-variant hover:border-primary bg-surface-container-low'
              }`}
            >
              <Upload className="w-10 h-10 text-primary mx-auto" />
              <div className="text-sm font-semibold text-on-surface">
                Click or drag &amp; drop an image here to encode to Base64
              </div>
              <p className="text-xs text-outline">
                Supports PNG, JPG, WebP, SVG, and GIF. Processed 100% locally in browser memory.
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
              {/* Image Preview Card */}
              <div className="p-4 rounded-xl bg-surface-container-low border border-outline-variant space-y-3 flex flex-col items-center text-center">
                <span className="text-xs font-semibold uppercase tracking-wider text-outline">
                  Source Image Preview
                </span>
                <div className="w-full h-48 bg-surface-container-lowest rounded-lg border border-outline-variant/60 p-2 flex items-center justify-center overflow-hidden">
                  <img src={dataUrl} alt={fileName} className="max-h-full max-w-full object-contain" />
                </div>
                <div className="text-xs text-on-surface font-medium truncate max-w-full">{fileName}</div>
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  className="px-3 py-1.5 rounded-lg bg-surface hover:bg-surface-container border border-outline-variant text-xs text-on-surface transition-colors"
                >
                  Choose Different Image
                </button>
              </div>

              {/* Code Output Settings & Editor */}
              <div className="lg:col-span-2 space-y-3">
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
                      onClick={() => setSnippetFormat(fmt.id as SnippetFormat)}
                      className={`px-2.5 py-1 rounded-lg text-xs font-medium transition-colors ${
                        snippetFormat === fmt.id
                          ? 'bg-primary-container text-on-primary-container font-semibold'
                          : 'bg-surface border border-outline-variant text-on-surface-variant hover:text-on-surface'
                      }`}
                    >
                      {fmt.label}
                    </button>
                  ))}
                </div>

                {(snippetFormat === 'html-img' || snippetFormat === 'markdown') && (
                  <div className="flex items-center gap-2">
                    <label htmlFor="alt-text" className="text-xs text-outline font-medium">
                      Alt Text:
                    </label>
                    <input
                      id="alt-text"
                      type="text"
                      value={altText}
                      onChange={(e) => setAltText(e.target.value)}
                      className="w-48 h-8 px-2.5 rounded-lg bg-surface border border-outline-variant text-xs text-on-surface focus:outline-none"
                    />
                  </div>
                )}

                <textarea
                  readOnly
                  value={outputSnippet}
                  className="w-full h-64 p-3.5 rounded-xl bg-surface-container-lowest border border-outline-variant font-mono text-xs text-on-surface focus:outline-none resize-y"
                />
              </div>
            </div>
          )}
        </div>
      )}

      {/* MODE 2: Base64 to Image */}
      {mode === 'decode' && (
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
                  <span>{decodedResult.error || 'Enter a valid Base64 string to render image preview'}</span>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Privacy note */}
      <div className="flex items-center gap-2 text-[11px] text-outline px-1">
        <Sparkles className="w-3.5 h-3.5 text-primary shrink-0" />
        <span>
          Images and Data URIs are converted completely in browser memory via native FileReader &amp; Blob APIs.
        </span>
      </div>
    </div>
  );
};

export default Base64ImageTool;

