import React, { useState } from 'react';

interface CsvImportModalProps {
  isOpen: boolean;
  onClose: () => void;
  onImport: (csvText: string) => void;
}

export const CsvImportModal: React.FC<CsvImportModalProps> = ({ isOpen, onClose, onImport }) => {
  const [csvText, setCsvText] = useState<string>('');

  if (!isOpen) return null;

  const handleImport = () => {
    if (!csvText.trim()) return;
    onImport(csvText);
    setCsvText('');
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="w-full max-w-lg bg-surface-container-low border border-outline-variant rounded-2xl p-5 space-y-4 shadow-2xl">
        <div className="flex items-center justify-between pb-2 border-b border-outline-variant">
          <span className="font-bold text-sm text-on-surface">Import CSV / Delimited Data</span>
          <button
            type="button"
            onClick={onClose}
            className="text-outline hover:text-on-surface text-xs"
          >
            Cancel
          </button>
        </div>
        <textarea
          value={csvText}
          onChange={(e) => setCsvText(e.target.value)}
          placeholder="Paste comma or tab delimited rows here..."
          className="w-full h-40 p-3 rounded-xl bg-surface-container-lowest border border-outline-variant font-mono text-xs text-on-surface placeholder:text-outline focus:outline-none"
        />
        <div className="flex justify-end gap-2">
          <button
            type="button"
            onClick={onClose}
            className="px-3 py-1.5 rounded-lg text-xs font-medium text-on-surface hover:bg-surface-container transition-colors"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={handleImport}
            className="px-3.5 py-1.5 rounded-lg bg-primary-container text-on-primary-container text-xs font-semibold hover:opacity-95 transition-opacity"
          >
            Import to Grid
          </button>
        </div>
      </div>
    </div>
  );
};
