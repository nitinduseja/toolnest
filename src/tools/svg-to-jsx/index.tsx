import React, { useState, useMemo, useRef } from 'react';
import { Copy, Check, Download, Upload, Trash2, AlertTriangle, FileCode2, Eye } from 'lucide-react';
import { convertSvgToJsx } from './svgLogic';
import { copyToClipboard } from '@/lib/clipboard';
import { downloadFile } from '@/lib/downloads';

const SAMPLE_SVG = `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-shield-check">
  <path d="M20 13c0 5-3.5 7.5-7.66 8.95a1 1 0 0 1-.67-.01C7.5 20.5 4 18 4 13V6a1 1 0 0 1 1-1c2 0 4.5-1.2 6.24-2.72a1.17 1.17 0 0 1 1.52 0C14.51 3.81 17 5 19 5a1 1 0 0 1 1 1z" />
  <path d="m9 12 2 2 4-4" />
</svg>`;

export const SvgToJsxTool: React.FC = () => {
  const [svgInput, setSvgInput] = useState<string>(SAMPLE_SVG);
  const [componentName, setComponentName] = useState<string>('ShieldCheckIcon');
  const [useTypescript, setUseTypescript] = useState<boolean>(true);
  const [forwardRef, setForwardRef] = useState<boolean>(false);
  const [removeDimensions, setRemoveDimensions] = useState<boolean>(false);
  const [iconMode, setIconMode] = useState<boolean>(false);
  const [copied, setCopied] = useState<boolean>(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const result = useMemo(() => {
    return convertSvgToJsx(svgInput, {
      componentName,
      useTypescript,
      forwardRef,
      removeDimensions,
      iconMode,
      spreadProps: true,
    });
  }, [svgInput, componentName, useTypescript, forwardRef, removeDimensions, iconMode]);

  const handleCopy = async () => {
    if (!result.code) return;
    const ok = await copyToClipboard(result.code);
    if (ok) {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const handleDownload = () => {
    if (!result.code) return;
    const ext = useTypescript ? 'tsx' : 'jsx';
    downloadFile(result.code, {
      filename: `${componentName || 'SvgIcon'}.${ext}`,
      mimeType: 'text/plain',
    });
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      file.text().then((text) => setSvgInput(text));
    }
  };

  return (
    <div className="space-y-4">
      <input
        ref={fileInputRef}
        type="file"
        accept=".svg,.txt"
        onChange={handleFileChange}
        className="hidden"
      />

      {/* Toolbar */}
      <div className="flex flex-wrap items-center justify-between gap-3 p-3 rounded-xl bg-surface-container-low border border-outline-variant">
        <div className="flex flex-wrap items-center gap-3">
          <div className="flex items-center gap-2">
            <label htmlFor="comp-name" className="text-xs text-outline font-medium">
              Component Name:
            </label>
            <input
              id="comp-name"
              type="text"
              value={componentName}
              onChange={(e) => setComponentName(e.target.value)}
              placeholder="e.g. ShieldCheckIcon"
              className="w-36 h-8 px-2.5 rounded-lg bg-surface border border-outline-variant text-xs font-mono text-on-surface focus:outline-none focus:ring-1 focus:ring-primary"
            />
          </div>

          <label className="flex items-center gap-1.5 text-xs text-on-surface cursor-pointer select-none">
            <input
              type="checkbox"
              checked={useTypescript}
              onChange={(e) => setUseTypescript(e.target.checked)}
              className="rounded border-outline-variant text-primary focus:ring-primary"
            />
            <span>TypeScript Props</span>
          </label>

          <label className="flex items-center gap-1.5 text-xs text-on-surface cursor-pointer select-none">
            <input
              type="checkbox"
              checked={forwardRef}
              onChange={(e) => setForwardRef(e.target.checked)}
              className="rounded border-outline-variant text-primary focus:ring-primary"
            />
            <span>forwardRef</span>
          </label>

          <label className="flex items-center gap-1.5 text-xs text-on-surface cursor-pointer select-none">
            <input
              type="checkbox"
              checked={removeDimensions}
              onChange={(e) => {
                setRemoveDimensions(e.target.checked);
                if (e.target.checked) setIconMode(false);
              }}
              className="rounded border-outline-variant text-primary focus:ring-primary"
            />
            <span>Remove Width/Height</span>
          </label>

          <label className="flex items-center gap-1.5 text-xs text-on-surface cursor-pointer select-none">
            <input
              type="checkbox"
              checked={iconMode}
              onChange={(e) => {
                setIconMode(e.target.checked);
                if (e.target.checked) setRemoveDimensions(false);
              }}
              className="rounded border-outline-variant text-primary focus:ring-primary"
            />
            <span>Icon Size (1em)</span>
          </label>
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => fileInputRef.current?.click()}
            className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-lg text-xs text-on-surface-variant hover:bg-surface-container transition-colors"
            title="Upload SVG file"
          >
            <Upload className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Upload</span>
          </button>
          <button
            type="button"
            onClick={() => setSvgInput(SAMPLE_SVG)}
            className="px-2.5 py-1.5 rounded-lg text-xs text-on-surface-variant hover:bg-surface-container transition-colors"
          >
            Sample
          </button>
          <button
            type="button"
            onClick={() => setSvgInput('')}
            className="p-1.5 rounded-lg text-outline hover:text-red-500 hover:bg-surface-container transition-colors"
            title="Clear SVG"
          >
            <Trash2 className="w-4 h-4" />
          </button>
          <div className="h-4 w-px bg-outline-variant" />
          <button
            type="button"
            onClick={handleCopy}
            disabled={!result.code}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-surface hover:bg-surface-container text-xs font-medium text-on-surface border border-outline-variant transition-colors disabled:opacity-40"
          >
            {copied ? <Check className="w-3.5 h-3.5 text-emerald-500" /> : <Copy className="w-3.5 h-3.5" />}
            <span>{copied ? 'Copied' : 'Copy JSX'}</span>
          </button>
          <button
            type="button"
            onClick={handleDownload}
            disabled={!result.code}
            className="p-1.5 rounded-lg text-outline hover:text-on-surface hover:bg-surface-container transition-colors disabled:opacity-40"
            title="Download TSX/JSX file"
          >
            <Download className="w-4 h-4" />
          </button>
        </div>
      </div>

      {result.error && (
        <div className="p-3 rounded-xl bg-red-500/10 border border-red-500/30 flex items-center gap-2 text-xs text-red-400">
          <AlertTriangle className="w-4 h-4 shrink-0" />
          <span>{result.error}</span>
        </div>
      )}

      {/* Live Preview Bar if SVG is valid */}
      {!result.error && svgInput.includes('<svg') && (
        <div className="p-3 rounded-xl bg-surface-container-low border border-outline-variant flex items-center gap-4 text-xs text-on-surface">
          <div className="flex items-center gap-1.5 font-semibold text-outline">
            <Eye className="w-3.5 h-3.5" />
            <span>Render Preview:</span>
          </div>
          <div
            className="p-2 bg-surface-container-high rounded-lg text-primary flex items-center justify-center max-w-[64px] max-h-[64px] overflow-hidden [&>svg]:w-8 [&>svg]:h-8"
            dangerouslySetInnerHTML={{ __html: svgInput }}
          />
          <span className="text-[11px] text-outline">
            Preview is sanitized and evaluated inside local browser sandbox.
          </span>
        </div>
      )}

      {/* Split Editors */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <div className="space-y-2">
          <div className="flex items-center justify-between text-xs text-outline px-1">
            <span className="font-medium text-on-surface">Raw SVG Input</span>
            <span className="font-mono text-[11px]">{svgInput.length} chars</span>
          </div>
          <textarea
            value={svgInput}
            onChange={(e) => setSvgInput(e.target.value)}
            placeholder="Paste raw <svg>...</svg> markup here..."
            className="w-full h-80 sm:h-96 p-4 rounded-xl bg-surface-container-low border border-outline-variant font-mono text-xs text-on-surface placeholder:text-outline focus:outline-none focus:ring-2 focus:ring-primary-container resize-y"
          />
        </div>

        <div className="space-y-2">
          <div className="flex items-center justify-between text-xs text-outline px-1">
            <span className="font-medium text-on-surface">React Component Output</span>
            <div className="flex items-center gap-1.5 text-[11px] font-mono text-outline">
              <FileCode2 className="w-3.5 h-3.5 text-primary" />
              <span>{useTypescript ? 'TSX' : 'JSX'}</span>
            </div>
          </div>
          <textarea
            readOnly
            value={result.code}
            placeholder="Converted React component will appear here..."
            className="w-full h-80 sm:h-96 p-4 rounded-xl bg-surface-container-lowest border border-outline-variant font-mono text-xs text-on-surface placeholder:text-outline focus:outline-none resize-y"
          />
        </div>
      </div>
    </div>
  );
};

export default SvgToJsxTool;

