import React, { useState, useEffect } from 'react';
import { Database, Copy, Check, Trash2, Download, Sparkles, Minimize2 } from 'lucide-react';
import { formatSql, minifySql, getSampleSql, KeywordCase, IndentSize } from './sqlLogic';
import { copyToClipboard } from '@/lib/clipboard';
import { downloadFile } from '@/lib/downloads';

export const SqlFormatterTool: React.FC = () => {
  const [input, setInput] = useState<string>(getSampleSql());
  const [output, setOutput] = useState<string>('');
  const [keywordCase, setKeywordCase] = useState<KeywordCase>('upper');
  const [indent, setIndent] = useState<IndentSize>('2');
  const [copied, setCopied] = useState<boolean>(false);

  useEffect(() => {
    if (!input.trim()) {
      setOutput('');
      return;
    }
    setOutput(formatSql(input, { keywordCase, indent }));
  }, [input, keywordCase, indent]);

  const handleMinify = () => {
    if (!input.trim()) return;
    setOutput(minifySql(input));
  };

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
    downloadFile(output, {
      filename: 'query.sql',
      mimeType: 'text/plain;charset=utf-8',
    });
  };

  return (
    <div className="space-y-4">
      {/* Notice Ribbon */}
      <div className="p-3.5 rounded-xl bg-surface-container-low border border-outline-variant flex items-center justify-between flex-wrap gap-2 text-xs text-on-surface-variant">
        <div className="flex items-center gap-2">
          <Database className="w-4 h-4 text-primary shrink-0" />
          <span>
            <strong>Client-Side SQL Engine:</strong> Formats, indents, and beautifies SQL queries
            in-browser with zero network transmission.
          </span>
        </div>
        <div className="flex items-center gap-1.5">
          <button
            type="button"
            onClick={() => setInput(getSampleSql())}
            className="flex items-center gap-1 px-2.5 py-1 rounded-lg bg-surface-container hover:bg-surface-container-high text-on-surface text-xs font-medium transition-colors"
          >
            <Sparkles className="w-3.5 h-3.5 text-primary" />
            <span>Sample</span>
          </button>
          <button
            type="button"
            onClick={() => setInput('')}
            disabled={!input}
            className="p-1 rounded text-outline hover:text-red-400 hover:bg-surface-container transition-colors disabled:opacity-40"
            title="Clear SQL"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Formatting Options Toolbar */}
      <div className="flex flex-wrap items-center justify-between gap-3 p-3 rounded-xl bg-surface-container-low border border-outline-variant text-xs">
        <div className="flex flex-wrap items-center gap-4">
          {/* Keyword Casing Selector */}
          <div className="flex items-center gap-2">
            <span className="font-semibold text-outline uppercase tracking-wider text-[11px]">
              Keyword Case
            </span>
            <div className="flex bg-surface-container rounded-lg p-0.5 border border-outline-variant/40">
              <button
                type="button"
                onClick={() => setKeywordCase('upper')}
                className={`px-2.5 py-1 rounded-md font-semibold transition-colors ${
                  keywordCase === 'upper'
                    ? 'bg-primary text-on-primary shadow-xs'
                    : 'text-on-surface-variant hover:text-on-surface'
                }`}
              >
                UPPER
              </button>
              <button
                type="button"
                onClick={() => setKeywordCase('lower')}
                className={`px-2.5 py-1 rounded-md font-semibold transition-colors ${
                  keywordCase === 'lower'
                    ? 'bg-primary text-on-primary shadow-xs'
                    : 'text-on-surface-variant hover:text-on-surface'
                }`}
              >
                lower
              </button>
              <button
                type="button"
                onClick={() => setKeywordCase('preserve')}
                className={`px-2.5 py-1 rounded-md font-semibold transition-colors ${
                  keywordCase === 'preserve'
                    ? 'bg-primary text-on-primary shadow-xs'
                    : 'text-on-surface-variant hover:text-on-surface'
                }`}
              >
                Preserve
              </button>
            </div>
          </div>

          {/* Indent Selector */}
          <div className="flex items-center gap-2">
            <span className="font-semibold text-outline uppercase tracking-wider text-[11px]">
              Indent
            </span>
            <div className="flex bg-surface-container rounded-lg p-0.5 border border-outline-variant/40">
              {(['2', '4', 'tab'] as IndentSize[]).map((size) => (
                <button
                  key={size}
                  type="button"
                  onClick={() => setIndent(size)}
                  className={`px-2.5 py-1 rounded-md font-semibold transition-colors ${
                    indent === size
                      ? 'bg-primary text-on-primary shadow-xs'
                      : 'text-on-surface-variant hover:text-on-surface'
                  }`}
                >
                  {size === 'tab' ? 'Tab' : `${size} Spaces`}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={handleMinify}
            disabled={!input}
            className="flex items-center gap-1 px-3 py-1.5 rounded-lg bg-surface-container hover:bg-surface-container-high text-on-surface font-medium transition-colors disabled:opacity-40"
            title="Collapse into a single line"
          >
            <Minimize2 className="w-3.5 h-3.5" />
            <span>Minify</span>
          </button>
          <button
            type="button"
            onClick={handleCopy}
            disabled={!output}
            className="flex items-center gap-1 px-3 py-1.5 rounded-lg bg-surface-container hover:bg-surface-container-high text-on-surface font-medium transition-colors disabled:opacity-40"
          >
            {copied ? (
              <Check className="w-3.5 h-3.5 text-emerald-500" />
            ) : (
              <Copy className="w-3.5 h-3.5" />
            )}
            <span>{copied ? 'Copied' : 'Copy'}</span>
          </button>
          <button
            type="button"
            onClick={handleDownload}
            disabled={!output}
            className="flex items-center gap-1 px-3 py-1.5 rounded-lg bg-surface-container hover:bg-surface-container-high text-on-surface font-medium transition-colors disabled:opacity-40"
            title="Download .sql file"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Export</span>
          </button>
        </div>
      </div>

      {/* Editor & Preview Panes */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* Input Editor */}
        <div className="space-y-2">
          <div className="flex items-center justify-between px-1">
            <label className="text-xs font-semibold text-outline uppercase tracking-wider">
              Input SQL Query
            </label>
            <span className="text-[11px] font-mono text-outline">
              {input.length} chars • {input ? input.split('\n').length : 0} lines
            </span>
          </div>
          <textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Paste raw SQL query here..."
            className="w-full h-80 sm:h-[460px] p-4 rounded-xl bg-surface-container-low border border-outline-variant font-mono text-xs text-on-surface placeholder:text-outline focus:outline-none focus:ring-2 focus:ring-primary-container resize-y"
          />
        </div>

        {/* Formatted Output */}
        <div className="space-y-2">
          <div className="flex items-center justify-between px-1">
            <label className="text-xs font-semibold text-outline uppercase tracking-wider">
              Formatted SQL
            </label>
            <span className="text-[11px] font-mono text-outline">
              {output.length} chars • {output ? output.split('\n').length : 0} lines
            </span>
          </div>
          <textarea
            readOnly
            value={output}
            placeholder="Formatted query will appear here..."
            className="w-full h-80 sm:h-[460px] p-4 rounded-xl bg-surface-container-lowest border border-outline-variant font-mono text-xs text-on-surface placeholder:text-outline focus:outline-none resize-y"
          />
        </div>
      </div>
    </div>
  );
};

export default SqlFormatterTool;
