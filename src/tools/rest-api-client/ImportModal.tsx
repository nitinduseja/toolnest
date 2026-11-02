import React, { useState } from 'react';
import { Upload, X, Terminal, FileCode } from 'lucide-react';
import { autoImportContent } from './collectionImportLogic';
import { ApiRequest } from './types';

export interface ImportModalProps {
  isOpen: boolean;
  onClose: () => void;
  onImportSingle: (reqUpdates: Partial<ApiRequest>) => void;
  onImportCollection: (requests: ApiRequest[]) => void;
}

export const ImportModal: React.FC<ImportModalProps> = ({
  isOpen,
  onClose,
  onImportSingle,
  onImportCollection,
}) => {
  const [rawText, setRawText] = useState<string>('');
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleImport = () => {
    try {
      setErrorMsg(null);
      if (!rawText.trim()) return;
      const res = autoImportContent(rawText);

      if (res.collection && res.collection.length > 0) {
        onImportCollection(res.collection);
        setRawText('');
        onClose();
        return;
      }

      if (res.single && res.single.url) {
        onImportSingle(res.single);
        setRawText('');
        onClose();
        return;
      }

      setErrorMsg('Could not detect a valid URL, Postman Collection, or OpenAPI specification.');
    } catch {
      setErrorMsg('Failed to parse input.');
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
      <div className="w-full max-w-lg rounded-2xl bg-surface-container-low border border-outline-variant overflow-hidden shadow-2xl flex flex-col">
        {/* Header */}
        <div className="p-4 border-b border-outline-variant flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Upload className="w-5 h-5 text-primary" />
            <span className="text-sm font-semibold text-on-surface">
              Import cURL, Postman, or OpenAPI
            </span>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-1.5 rounded-lg hover:bg-surface-container text-on-surface-variant hover:text-on-surface"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Content */}
        <div className="p-4 space-y-3">
          <div className="flex items-center gap-3 text-[11px] text-outline flex-wrap">
            <span className="flex items-center gap-1">
              <Terminal className="w-3.5 h-3.5 text-primary" />
              <span>cURL Command</span>
            </span>
            <span className="flex items-center gap-1">
              <FileCode className="w-3.5 h-3.5 text-blue-500" />
              <span>Postman Collection v2</span>
            </span>
            <span className="flex items-center gap-1">
              <FileCode className="w-3.5 h-3.5 text-emerald-500" />
              <span>OpenAPI / Swagger JSON</span>
            </span>
          </div>

          <textarea
            value={rawText}
            onChange={(e) => setRawText(e.target.value)}
            rows={8}
            placeholder={`Paste cURL command or Postman/OpenAPI JSON:\n\ncurl -X POST "https://api.example.com/v1/users" \\\n  -H "Content-Type: application/json" \\\n  -d '{"name": "Alice"}'`}
            className="w-full p-3 rounded-xl bg-surface-container-lowest border border-outline-variant font-mono text-xs text-on-surface focus:outline-hidden"
          />
          {errorMsg && <p className="text-xs text-red-500 font-semibold">{errorMsg}</p>}
        </div>

        {/* Footer */}
        <div className="p-3 bg-surface-container-lowest border-t border-outline-variant flex items-center justify-end gap-2">
          <button
            type="button"
            onClick={onClose}
            className="px-3 py-1.5 rounded-lg text-xs font-semibold text-on-surface hover:bg-surface-container"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={handleImport}
            disabled={!rawText.trim()}
            className="flex items-center gap-1.5 px-4 py-2 rounded-lg bg-primary text-on-primary hover:bg-primary/90 text-xs font-semibold shadow-xs disabled:opacity-40"
          >
            <Upload className="w-3.5 h-3.5" />
            <span>Parse & Import</span>
          </button>
        </div>
      </div>
    </div>
  );
};
