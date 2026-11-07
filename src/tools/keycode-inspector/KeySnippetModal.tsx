import React, { useState } from 'react';
import { X, Copy, Check, Code } from 'lucide-react';
import { KeyEventRecord, KeySnippetFormat } from './types';
import { generateKeySnippet } from './keycodeLogic';
import { copyToClipboard } from '@/lib/clipboard';

interface KeySnippetModalProps {
  event: KeyEventRecord;
  onClose: () => void;
}

export const KeySnippetModal: React.FC<KeySnippetModalProps> = ({ event, onClose }) => {
  const [format, setFormat] = useState<KeySnippetFormat>('react-ts');
  const [copied, setCopied] = useState(false);

  const snippet = generateKeySnippet(event, format);

  const handleCopy = async () => {
    const ok = await copyToClipboard(snippet);
    if (ok) {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const formats: { id: KeySnippetFormat; label: string }[] = [
    { id: 'react-ts', label: 'React (TypeScript)' },
    { id: 'vanilla-js', label: 'Vanilla JS' },
    { id: 'shortcut-guard', label: 'If Statement' },
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in duration-150">
      <div className="bg-surface-container-low border border-outline-variant rounded-2xl w-full max-w-xl shadow-2xl overflow-hidden flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-outline-variant/60">
          <div className="flex items-center gap-2">
            <div className="p-2 rounded-lg bg-primary/10 text-primary">
              <Code className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-on-surface">Event Listener Snippet</h3>
              <p className="text-xs text-outline">
                Key code listener for {event.code} ({event.key})
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-1.5 rounded-lg text-outline hover:text-on-surface hover:bg-surface-container transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Format Selector */}
        <div className="px-5 pt-4 flex gap-2">
          {formats.map((f) => (
            <button
              key={f.id}
              type="button"
              onClick={() => setFormat(f.id)}
              className={`px-3 py-1.5 text-xs font-semibold rounded-xl border transition-all ${
                format === f.id
                  ? 'bg-primary text-white border-primary shadow-xs'
                  : 'bg-surface-container border-outline-variant/60 text-outline hover:text-on-surface'
              }`}
            >
              {f.label}
            </button>
          ))}
        </div>

        {/* Code Content */}
        <div className="p-5 space-y-4">
          <pre className="p-4 rounded-xl bg-surface-container-highest/60 border border-outline-variant/50 font-mono text-xs text-on-surface overflow-x-auto leading-relaxed">
            {snippet}
          </pre>

          <div className="flex items-center justify-end gap-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-xs font-semibold rounded-xl border border-outline-variant hover:bg-surface-container text-on-surface transition-all"
            >
              Close
            </button>
            <button
              type="button"
              onClick={handleCopy}
              className="flex items-center gap-1.5 px-4 py-2 text-xs font-bold rounded-xl bg-primary text-white shadow-xs hover:bg-primary/90 transition-all"
            >
              {copied ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
              <span>{copied ? 'Copied Snippet!' : 'Copy Code'}</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
