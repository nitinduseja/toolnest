import React, { useRef } from 'react';
import { Copy, Check, Upload, AlertTriangle } from 'lucide-react';

interface FileChecksumHasherProps {
  selectedFile: File | null;
  handleFileProcess: (file: File) => void;
  fileLoading: boolean;
  fileError: string | null;
  fileHashes: Record<string, string>;
  formatHash: (val: string) => string;
  handleCopyHash: (id: string, val: string) => void;
  copiedId: string | null;
}

export const FileChecksumHasher: React.FC<FileChecksumHasherProps> = ({
  selectedFile,
  handleFileProcess,
  fileLoading,
  fileError,
  fileHashes,
  formatHash,
  handleCopyHash,
  copiedId,
}) => {
  const fileInputRef = useRef<HTMLInputElement>(null);

  return (
    <div className="space-y-4">
      <input
        type="file"
        ref={fileInputRef}
        onChange={(e) => {
          if (e.target.files && e.target.files[0]) {
            handleFileProcess(e.target.files[0]);
          }
        }}
        className="hidden"
      />

      <div
        onDragOver={(e) => e.preventDefault()}
        onDrop={(e) => {
          e.preventDefault();
          if (e.dataTransfer.files && e.dataTransfer.files[0]) {
            handleFileProcess(e.dataTransfer.files[0]);
          }
        }}
        onClick={() => fileInputRef.current?.click()}
        className="p-8 border-2 border-dashed border-outline-variant hover:border-primary rounded-2xl bg-surface-container-low text-center cursor-pointer transition-colors space-y-2"
      >
        <Upload className="w-8 h-8 text-primary mx-auto" />
        <div className="text-sm font-semibold text-on-surface">
          {selectedFile ? selectedFile.name : 'Click or drag a file here to calculate checksums'}
        </div>
        <div className="text-xs text-outline">
          {selectedFile
            ? `${(selectedFile.size / 1024).toFixed(1)} KB — Click to change file`
            : 'Files are read strictly client-side and never uploaded'}
        </div>
      </div>

      {fileError && (
        <div className="p-3 rounded-xl bg-red-500/10 border border-red-500/30 flex items-center gap-2 text-xs text-red-400">
          <AlertTriangle className="w-4 h-4 shrink-0" />
          <span>{fileError}</span>
        </div>
      )}

      {selectedFile && (
        <div className="space-y-2.5">
          <span className="text-xs font-semibold text-on-surface-variant uppercase tracking-wider px-1">
            File Checksums {fileLoading && '(calculating...)'}
          </span>

          {(['SHA-256', 'SHA-512', 'SHA-1'] as const).map((algo) => {
            const val = fileHashes[algo];
            const formatted = formatHash(val);
            const isCopied = copiedId === `file-${algo}`;
            return (
              <div
                key={algo}
                className="p-3 rounded-xl bg-surface-container-low border border-outline-variant space-y-1.5"
              >
                <div className="flex items-center justify-between gap-2">
                  <span className="text-xs font-bold text-on-surface">{algo} Checksum</span>
                  <button
                    type="button"
                    onClick={() => handleCopyHash(`file-${algo}`, val)}
                    disabled={!val}
                    className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-surface-container-high hover:bg-surface-container-highest text-on-surface text-xs font-medium transition-colors disabled:opacity-40"
                  >
                    {isCopied ? (
                      <Check className="w-3.5 h-3.5 text-green-500" />
                    ) : (
                      <Copy className="w-3.5 h-3.5" />
                    )}
                    <span>{isCopied ? 'Copied' : 'Copy'}</span>
                  </button>
                </div>

                <div className="p-2.5 rounded-lg bg-surface-container-lowest font-mono text-xs text-on-surface break-all select-all">
                  {formatted || <span className="text-outline italic">Calculating...</span>}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};
