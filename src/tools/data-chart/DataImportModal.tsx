import React, { useState } from 'react';
import { Upload, X } from 'lucide-react';

interface DataImportModalProps {
  isOpen: boolean;
  onClose: () => void;
  onImport: (rawText: string) => void;
}

export const DataImportModal: React.FC<DataImportModalProps> = ({ isOpen, onClose, onImport }) => {
  const [text, setText] = useState('');

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (text.trim()) {
      onImport(text);
      setText('');
      onClose();
    }
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        const content = event.target?.result as string;
        if (content) {
          onImport(content);
          onClose();
        }
      };
      reader.readAsText(file);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
      <div className="w-full max-w-lg bg-surface border border-outline-variant rounded-2xl shadow-2xl p-5 space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Upload className="w-4 h-4 text-sky-500" />
            <h3 className="text-sm font-semibold text-on-surface">Import Custom Dataset</h3>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="text-on-surface-variant hover:text-on-surface p-1"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <p className="text-xs text-on-surface-variant">
          Paste your CSV or JSON data below, or choose a file from your computer. Everything is
          parsed 100% locally in your browser.
        </p>

        <form onSubmit={handleSubmit} className="space-y-3">
          <textarea
            rows={7}
            value={text}
            onChange={(e) => setText(e.target.value)}
            placeholder={`Month,Revenue,Cost\nJan,10000,4500\nFeb,15000,5200`}
            className="w-full p-3 text-xs font-mono bg-surface-container-lowest border border-outline-variant rounded-xl text-on-surface focus:outline-none focus:ring-1 focus:ring-primary"
          />

          <div className="flex items-center justify-between">
            <label className="cursor-pointer text-xs text-primary hover:underline">
              Browse .csv or .json file
              <input
                type="file"
                accept=".csv,.tsv,.json,.txt"
                onChange={handleFileUpload}
                className="hidden"
              />
            </label>

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={onClose}
                className="px-3 py-1.5 text-xs text-on-surface-variant hover:text-on-surface"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={!text.trim()}
                className="px-4 py-1.5 text-xs font-medium text-on-primary bg-primary hover:bg-primary/90 disabled:opacity-50 rounded-lg transition-colors"
              >
                Parse Data
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};
