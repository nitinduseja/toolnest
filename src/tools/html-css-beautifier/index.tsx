import React, { useState, useMemo } from 'react';
import { Copy, Check, Download, Trash2, Code, Sparkles } from 'lucide-react';
import {
  formatHtml,
  minifyHtml,
  formatCss,
  minifyCss,
  CodeLanguage,
  CodeAction,
} from './htmlCssLogic';
import { copyToClipboard } from '@/lib/clipboard';
import { downloadFile } from '@/lib/downloads';

const SAMPLES = {
  html: `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<title>Toolnest App</title>
<link rel="stylesheet" href="styles.css">
</head>
<body>
<!-- Main Workspace Container -->
<div class="app-layout">
<header class="navbar"><h1>Toolnest Toolbox</h1></header>
<main class="content">
<section class="card"><p>100% in-browser processing with zero telemetry.</p><button type="button" class="btn">Launch Tool</button></section>
</main>
</div>
</body>
</html>`,
  css: `/* Toolnest Global Design System Styles */
:root {
  --primary: #4a6ee0;
  --bg-surface: #121318;
}
.btn {
  display: inline-flex;
  align-items: center;
  padding: 8px 16px;
  border-radius: 8px;
  background-color: var(--primary);
  color: #ffffff;
  font-weight: 600;
  transition: opacity 0.2s ease-in-out;
}
.btn:hover {
  opacity: 0.9;
}`,
};

export const HtmlCssBeautifierTool: React.FC = () => {
  const [lang, setLang] = useState<CodeLanguage>('html');
  const [action, setAction] = useState<CodeAction>('beautify');
  const [indent, setIndent] = useState<number>(2);
  const [input, setInput] = useState<string>(SAMPLES.html);
  const [copied, setCopied] = useState<boolean>(false);

  const output = useMemo(() => {
    if (lang === 'html') {
      return action === 'beautify' ? formatHtml(input, indent) : minifyHtml(input);
    } else {
      return action === 'beautify' ? formatCss(input, indent) : minifyCss(input);
    }
  }, [lang, action, indent, input]);

  const handleCopy = async () => {
    if (!output) return;
    const ok = await copyToClipboard(output);
    if (ok) {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const handleDownload = () => {
    if (!output) return;
    const ext = lang === 'html' ? 'html' : 'css';
    const filename = action === 'minify' ? `code.min.${ext}` : `code.${ext}`;
    downloadFile(output, { filename, mimeType: lang === 'html' ? 'text/html' : 'text/css' });
  };

  const handleLanguageChange = (newLang: CodeLanguage) => {
    setLang(newLang);
    setInput(newLang === 'html' ? SAMPLES.html : SAMPLES.css);
  };

  return (
    <div className="space-y-4">
      {/* Configuration Toolbar */}
      <div className="flex flex-wrap items-center justify-between gap-3 p-3 rounded-xl bg-surface-container-low border border-outline-variant">
        <div className="flex flex-wrap items-center gap-3">
          {/* Language selector */}
          <div className="flex items-center gap-1 p-1 rounded-xl bg-surface-container-high border border-outline-variant/60">
            <button
              type="button"
              onClick={() => handleLanguageChange('html')}
              className={`px-3 py-1 rounded-lg text-xs font-semibold transition-colors ${
                lang === 'html'
                  ? 'bg-primary-container text-on-primary-container shadow-xs'
                  : 'text-on-surface-variant hover:text-on-surface'
              }`}
            >
              HTML
            </button>
            <button
              type="button"
              onClick={() => handleLanguageChange('css')}
              className={`px-3 py-1 rounded-lg text-xs font-semibold transition-colors ${
                lang === 'css'
                  ? 'bg-primary-container text-on-primary-container shadow-xs'
                  : 'text-on-surface-variant hover:text-on-surface'
              }`}
            >
              CSS
            </button>
          </div>

          {/* Action selector */}
          <div className="flex items-center gap-1 p-1 rounded-xl bg-surface-container-high border border-outline-variant/60">
            <button
              type="button"
              onClick={() => setAction('beautify')}
              className={`px-3 py-1 rounded-lg text-xs font-semibold transition-colors ${
                action === 'beautify'
                  ? 'bg-primary-container text-on-primary-container shadow-xs'
                  : 'text-on-surface-variant hover:text-on-surface'
              }`}
            >
              Format / Beautify
            </button>
            <button
              type="button"
              onClick={() => setAction('minify')}
              className={`px-3 py-1 rounded-lg text-xs font-semibold transition-colors ${
                action === 'minify'
                  ? 'bg-primary-container text-on-primary-container shadow-xs'
                  : 'text-on-surface-variant hover:text-on-surface'
              }`}
            >
              Minify
            </button>
          </div>

          {action === 'beautify' && (
            <div className="flex items-center gap-1.5 text-xs text-outline">
              <span>Indent:</span>
              <select
                value={indent}
                onChange={(e) => setIndent(Number(e.target.value))}
                className="h-8 px-2 rounded-lg bg-surface border border-outline-variant text-xs text-on-surface focus:outline-none"
              >
                <option value={2}>2 Spaces</option>
                <option value={4}>4 Spaces</option>
              </select>
            </div>
          )}
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => setInput(lang === 'html' ? SAMPLES.html : SAMPLES.css)}
            className="px-2.5 py-1.5 rounded-lg text-xs text-on-surface-variant hover:bg-surface-container transition-colors"
          >
            Sample
          </button>
          <button
            type="button"
            onClick={() => setInput('')}
            className="p-1.5 rounded-lg text-outline hover:text-red-500 hover:bg-surface-container transition-colors"
            title="Clear Input"
          >
            <Trash2 className="w-4 h-4" />
          </button>
          <div className="h-4 w-px bg-outline-variant" />
          <button
            type="button"
            onClick={handleCopy}
            disabled={!output}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-surface hover:bg-surface-container text-xs font-medium text-on-surface border border-outline-variant transition-colors disabled:opacity-40"
          >
            {copied ? <Check className="w-3.5 h-3.5 text-emerald-500" /> : <Copy className="w-3.5 h-3.5" />}
            <span>{copied ? 'Copied' : 'Copy'}</span>
          </button>
          <button
            type="button"
            onClick={handleDownload}
            disabled={!output}
            className="p-1.5 rounded-lg text-outline hover:text-on-surface hover:bg-surface-container transition-colors disabled:opacity-40"
            title="Download file"
          >
            <Download className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Split Editors */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <div className="space-y-2">
          <div className="flex items-center justify-between text-xs text-outline px-1">
            <span className="font-medium text-on-surface">{lang.toUpperCase()} Source Input</span>
            <span className="font-mono text-[11px]">{input.length} chars</span>
          </div>
          <textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder={`Paste raw ${lang.toUpperCase()} markup here...`}
            className="w-full h-80 sm:h-96 p-4 rounded-xl bg-surface-container-low border border-outline-variant font-mono text-xs text-on-surface placeholder:text-outline focus:outline-none focus:ring-2 focus:ring-primary-container resize-y"
          />
        </div>

        <div className="space-y-2">
          <div className="flex items-center justify-between text-xs text-outline px-1">
            <span className="font-medium text-on-surface">
              {action === 'beautify' ? 'Beautified Output' : 'Minified Output'}
            </span>
            <div className="flex items-center gap-1.5 text-[11px] font-mono text-outline">
              <Code className="w-3.5 h-3.5 text-primary" />
              <span>{output.length} chars</span>
            </div>
          </div>
          <textarea
            readOnly
            value={output}
            placeholder="Formatted output will appear here..."
            className="w-full h-80 sm:h-96 p-4 rounded-xl bg-surface-container-lowest border border-outline-variant font-mono text-xs text-on-surface placeholder:text-outline focus:outline-none resize-y"
          />
        </div>
      </div>

      {/* Tip footer */}
      <div className="flex items-center gap-2 text-[11px] text-outline px-1">
        <Sparkles className="w-3.5 h-3.5 text-primary shrink-0" />
        <span>
          Processed 100% locally in browser memory. HTML comments, indentation levels, and CSS declarations are cleanly structured without external libraries.
        </span>
      </div>
    </div>
  );
};

export default HtmlCssBeautifierTool;

