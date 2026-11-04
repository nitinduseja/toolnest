import React, { useState, useMemo } from 'react';
import { Copy, Check, Download, Trash2, AlertTriangle, Code2, Sparkles } from 'lucide-react';
import { convertCurl, TargetLanguage } from './curlLogic';
import { copyToClipboard } from '@/lib/clipboard';
import { downloadFile } from '@/lib/downloads';

const SAMPLES = {
  post: `curl -X POST https://api.example.com/v1/users \\
  -H "Authorization: Bearer dev_token_12345" \\
  -H "Content-Type: application/json" \\
  -d '{"name":"Ada Lovelace","email":"ada@computing.org","role":"lead"}'`,
  get: `curl "https://api.github.com/users/torvalds/repos?sort=updated&per_page=5" \\
  -H "Accept: application/vnd.github.v3+json" \\
  -H "User-Agent: Toolnest-App"`,
  auth: `curl -u "admin:secretPass" https://httpbin.org/basic-auth/admin/secretPass`,
};

export const CurlConverterTool: React.FC = () => {
  const [curlInput, setCurlInput] = useState<string>(SAMPLES.post);
  const [targetLang, setTargetLang] = useState<TargetLanguage>('fetch');
  const [copied, setCopied] = useState<boolean>(false);

  const result = useMemo(() => {
    return convertCurl(curlInput, targetLang);
  }, [curlInput, targetLang]);

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
    const extMap: Record<TargetLanguage, string> = {
      fetch: 'js',
      axios: 'js',
      python: 'py',
      go: 'go',
      rust: 'rs',
      php: 'php',
      java: 'java',
    };
    downloadFile(result.code, {
      filename: `request.${extMap[targetLang]}`,
      mimeType: 'text/plain',
    });
  };

  return (
    <div className="space-y-4">
      {/* Target Language Toolbar */}
      <div className="flex flex-wrap items-center justify-between gap-3 p-3 rounded-xl bg-surface-container-low border border-outline-variant">
        <div className="flex flex-wrap items-center gap-3">
          <div className="flex items-center gap-1 p-1 rounded-xl bg-surface-container-high border border-outline-variant/60">
            {[
              { id: 'fetch', label: 'JS Fetch' },
              { id: 'axios', label: 'Axios' },
              { id: 'python', label: 'Python' },
              { id: 'go', label: 'Go' },
              { id: 'rust', label: 'Rust' },
              { id: 'php', label: 'PHP' },
              { id: 'java', label: 'Java' },
            ].map((lang) => (
              <button
                key={lang.id}
                type="button"
                onClick={() => setTargetLang(lang.id as TargetLanguage)}
                className={`px-3 py-1 rounded-lg text-xs font-semibold transition-colors ${
                  targetLang === lang.id
                    ? 'bg-primary-container text-on-primary-container shadow-xs'
                    : 'text-on-surface-variant hover:text-on-surface'
                }`}
              >
                {lang.label}
              </button>
            ))}
          </div>

          <div className="flex items-center gap-1.5 text-xs text-outline">
            <span>Preset:</span>
            <button
              type="button"
              onClick={() => setCurlInput(SAMPLES.post)}
              className="px-2 py-1 rounded bg-surface hover:bg-surface-container border border-outline-variant text-[11px] text-on-surface transition-colors"
            >
              POST JSON
            </button>
            <button
              type="button"
              onClick={() => setCurlInput(SAMPLES.get)}
              className="px-2 py-1 rounded bg-surface hover:bg-surface-container border border-outline-variant text-[11px] text-on-surface transition-colors"
            >
              GET Query
            </button>
            <button
              type="button"
              onClick={() => setCurlInput(SAMPLES.auth)}
              className="px-2 py-1 rounded bg-surface hover:bg-surface-container border border-outline-variant text-[11px] text-on-surface transition-colors"
            >
              Basic Auth
            </button>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => setCurlInput('')}
            className="p-1.5 rounded-lg text-outline hover:text-red-500 hover:bg-surface-container transition-colors"
            title="Clear cURL command"
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
            {copied ? (
              <Check className="w-3.5 h-3.5 text-emerald-500" />
            ) : (
              <Copy className="w-3.5 h-3.5" />
            )}
            <span>{copied ? 'Copied' : 'Copy Code'}</span>
          </button>
          <button
            type="button"
            onClick={handleDownload}
            disabled={!result.code}
            className="p-1.5 rounded-lg text-outline hover:text-on-surface hover:bg-surface-container transition-colors disabled:opacity-40"
            title="Download code snippet"
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

      {/* Split Editors */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <div className="space-y-2">
          <div className="flex items-center justify-between text-xs text-outline px-1">
            <span className="font-medium text-on-surface">cURL Command</span>
            <span className="font-mono text-[11px]">{curlInput.length} chars</span>
          </div>
          <textarea
            value={curlInput}
            onChange={(e) => setCurlInput(e.target.value)}
            placeholder="Paste curl command here (e.g. curl -X POST https://...)..."
            className="w-full h-80 sm:h-96 p-4 rounded-xl bg-surface-container-low border border-outline-variant font-mono text-xs text-on-surface placeholder:text-outline focus:outline-none focus:ring-2 focus:ring-primary-container resize-y"
          />
        </div>

        <div className="space-y-2">
          <div className="flex items-center justify-between text-xs text-outline px-1">
            <span className="font-medium text-on-surface">Generated Code Snippet</span>
            <div className="flex items-center gap-1.5 text-[11px] font-mono text-outline">
              <Code2 className="w-3.5 h-3.5 text-primary" />
              <span className="uppercase">{targetLang}</span>
            </div>
          </div>
          <textarea
            readOnly
            value={result.code}
            placeholder="Parsed code snippet will appear here..."
            className="w-full h-80 sm:h-96 p-4 rounded-xl bg-surface-container-lowest border border-outline-variant font-mono text-xs text-on-surface placeholder:text-outline focus:outline-none resize-y"
          />
        </div>
      </div>

      {/* Security notice */}
      <div className="flex items-center gap-2 text-[11px] text-outline px-1">
        <Sparkles className="w-3.5 h-3.5 text-primary shrink-0" />
        <span>
          cURL parsing is executed 100% locally in browser memory. API tokens, authorization
          headers, and cookies never leave your machine.
        </span>
      </div>
    </div>
  );
};

export default CurlConverterTool;
