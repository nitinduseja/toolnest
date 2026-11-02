import React, { useState } from 'react';
import { Code, X, Copy, Check } from 'lucide-react';
import { ApiRequest } from './types';
import { SnippetLanguage, generateCodeSnippet } from './codeGenLogic';
import { copyToClipboard } from '@/lib/clipboard';

export interface CodeSnippetModalProps {
  isOpen: boolean;
  request: ApiRequest;
  onClose: () => void;
}

const LANGUAGES: { id: SnippetLanguage; label: string }[] = [
  { id: 'javascript-fetch', label: 'JS (fetch)' },
  { id: 'javascript-axios', label: 'JS (axios)' },
  { id: 'python-requests', label: 'Python (requests)' },
  { id: 'go-http', label: 'Go (net/http)' },
  { id: 'curl', label: 'cURL' },
];

export const CodeSnippetModal: React.FC<CodeSnippetModalProps> = ({ isOpen, request, onClose }) => {
  const [lang, setLang] = useState<SnippetLanguage>('javascript-fetch');
  const [copied, setCopied] = useState<boolean>(false);

  if (!isOpen) return null;

  const snippet = generateCodeSnippet(request, lang);

  const handleCopy = async () => {
    const ok = await copyToClipboard(snippet);
    if (ok) {
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
      <div className="w-full max-w-2xl rounded-2xl bg-surface-container-low border border-outline-variant overflow-hidden shadow-2xl flex flex-col max-h-[85vh]">
        {/* Header */}
        <div className="p-4 border-b border-outline-variant flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Code className="w-5 h-5 text-primary" />
            <span className="text-sm font-semibold text-on-surface">
              Generate Client Code Snippet
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

        {/* Language Tabs */}
        <div className="p-3 bg-surface-container-lowest border-b border-outline-variant/60 flex items-center justify-between flex-wrap gap-2">
          <div className="flex items-center gap-1.5 flex-wrap">
            {LANGUAGES.map((l) => (
              <button
                key={l.id}
                type="button"
                onClick={() => setLang(l.id)}
                className={`px-2.5 py-1 rounded-lg text-xs font-semibold border transition-all ${
                  lang === l.id
                    ? 'bg-primary text-on-primary border-primary shadow-xs'
                    : 'bg-surface-container hover:bg-surface-container-high border-outline-variant text-on-surface'
                }`}
              >
                {l.label}
              </button>
            ))}
          </div>

          <button
            type="button"
            onClick={handleCopy}
            className="flex items-center gap-1 px-3 py-1.5 rounded-lg bg-surface-container hover:bg-surface-container-high text-xs font-semibold text-on-surface border border-outline-variant"
          >
            {copied ? (
              <Check className="w-3.5 h-3.5 text-emerald-500" />
            ) : (
              <Copy className="w-3.5 h-3.5 text-primary" />
            )}
            <span>{copied ? 'Copied' : 'Copy Code'}</span>
          </button>
        </div>

        {/* Code Content */}
        <div className="p-4 overflow-auto flex-1 bg-neutral-950">
          <pre className="font-mono text-xs text-neutral-200 leading-relaxed overflow-x-auto whitespace-pre">
            {snippet}
          </pre>
        </div>
      </div>
    </div>
  );
};
