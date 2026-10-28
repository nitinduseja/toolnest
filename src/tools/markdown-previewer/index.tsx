import React, { useState, useMemo } from 'react';
import {
  Copy,
  Check,
  Trash2,
  Download,
  Code,
  Eye,
  Columns2,
  FileText,
  Clock,
  Sparkles,
} from 'lucide-react';
import { calculateMarkdownStats, renderMarkdownToHtml, getSampleMarkdown } from './markdownLogic';
import { copyToClipboard } from '@/lib/clipboard';
import { downloadFile } from '@/lib/downloads';

export const MarkdownPreviewerTool: React.FC = () => {
  const [markdown, setMarkdown] = useState<string>(getSampleMarkdown());
  const [activeTab, setActiveTab] = useState<'split' | 'edit' | 'preview'>('split');
  const [copiedKey, setCopiedKey] = useState<string | null>(null);

  const stats = useMemo(() => calculateMarkdownStats(markdown), [markdown]);
  const renderedHtml = useMemo(() => renderMarkdownToHtml(markdown), [markdown]);

  const handleCopy = async (content: string, key: string) => {
    if (!content) return;
    const ok = await copyToClipboard(content);
    if (ok) {
      setCopiedKey(key);
      setTimeout(() => setCopiedKey(null), 2000);
    }
  };

  const handleDownloadMd = () => {
    if (!markdown) return;
    downloadFile(markdown, {
      filename: 'document.md',
      mimeType: 'text/markdown;charset=utf-8',
    });
  };

  return (
    <div className="space-y-4">
      {/* Privacy Notice & Stats Ribbon */}
      <div className="p-3.5 rounded-xl bg-surface-container-low border border-outline-variant flex items-center justify-between flex-wrap gap-3 text-xs text-on-surface-variant">
        <div className="flex items-center gap-2">
          <FileText className="w-4 h-4 text-primary shrink-0" />
          <span>
            <strong>Local In-Memory Rendering:</strong> Your markdown is rendered directly inside
            your browser. Zero external APIs or data transmission.
          </span>
        </div>

        <div className="flex items-center gap-3 font-mono text-[11px] text-outline">
          <span>{stats.words} words</span>
          <span>•</span>
          <span>{stats.characters} chars</span>
          <span>•</span>
          <span>{stats.lines} lines</span>
          <span>•</span>
          <span className="flex items-center gap-1">
            <Clock className="w-3 h-3" />
            {stats.readingTimeMinutes} min read
          </span>
        </div>
      </div>

      {/* Action Toolbar */}
      <div className="flex flex-wrap items-center justify-between gap-2 p-2.5 rounded-xl bg-surface-container-low border border-outline-variant">
        <div className="flex items-center gap-2">
          {/* View Mode Switcher */}
          <div className="flex bg-surface-container rounded-lg p-0.5 border border-outline-variant/40">
            <button
              type="button"
              onClick={() => setActiveTab('split')}
              className={`flex items-center gap-1 px-2.5 py-1 rounded-md text-xs font-semibold transition-colors ${
                activeTab === 'split'
                  ? 'bg-primary text-on-primary shadow-xs'
                  : 'text-on-surface-variant hover:text-on-surface'
              }`}
            >
              <Columns2 className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Split</span>
            </button>
            <button
              type="button"
              onClick={() => setActiveTab('edit')}
              className={`flex items-center gap-1 px-2.5 py-1 rounded-md text-xs font-semibold transition-colors ${
                activeTab === 'edit'
                  ? 'bg-primary text-on-primary shadow-xs'
                  : 'text-on-surface-variant hover:text-on-surface'
              }`}
            >
              <Code className="w-3.5 h-3.5" />
              <span>Edit</span>
            </button>
            <button
              type="button"
              onClick={() => setActiveTab('preview')}
              className={`flex items-center gap-1 px-2.5 py-1 rounded-md text-xs font-semibold transition-colors ${
                activeTab === 'preview'
                  ? 'bg-primary text-on-primary shadow-xs'
                  : 'text-on-surface-variant hover:text-on-surface'
              }`}
            >
              <Eye className="w-3.5 h-3.5" />
              <span>Preview</span>
            </button>
          </div>

          <button
            type="button"
            onClick={() => setMarkdown(getSampleMarkdown())}
            className="flex items-center gap-1 px-2.5 py-1 rounded-lg bg-surface-container hover:bg-surface-container-high text-xs font-medium text-on-surface transition-colors"
          >
            <Sparkles className="w-3.5 h-3.5 text-primary" />
            <span>Sample</span>
          </button>
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => handleCopy(markdown, 'markdown')}
            disabled={!markdown}
            className="flex items-center gap-1 px-2.5 py-1 rounded-lg bg-surface-container hover:bg-surface-container-high text-xs font-medium text-on-surface transition-colors disabled:opacity-40"
          >
            {copiedKey === 'markdown' ? (
              <Check className="w-3.5 h-3.5 text-emerald-500" />
            ) : (
              <Copy className="w-3.5 h-3.5" />
            )}
            <span>{copiedKey === 'markdown' ? 'Copied' : 'Copy MD'}</span>
          </button>

          <button
            type="button"
            onClick={() => handleCopy(renderedHtml, 'html')}
            disabled={!renderedHtml}
            className="flex items-center gap-1 px-2.5 py-1 rounded-lg bg-surface-container hover:bg-surface-container-high text-xs font-medium text-on-surface transition-colors disabled:opacity-40"
          >
            {copiedKey === 'html' ? (
              <Check className="w-3.5 h-3.5 text-emerald-500" />
            ) : (
              <Code className="w-3.5 h-3.5" />
            )}
            <span>{copiedKey === 'html' ? 'Copied' : 'Copy HTML'}</span>
          </button>

          <button
            type="button"
            onClick={handleDownloadMd}
            disabled={!markdown}
            className="flex items-center gap-1 px-2.5 py-1 rounded-lg bg-surface-container hover:bg-surface-container-high text-xs font-medium text-on-surface transition-colors disabled:opacity-40"
            title="Download .md file"
          >
            <Download className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Export</span>
          </button>

          <button
            type="button"
            onClick={() => setMarkdown('')}
            disabled={!markdown}
            className="p-1.5 rounded-lg text-outline hover:text-red-400 hover:bg-surface-container transition-colors disabled:opacity-40"
            title="Clear Markdown"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Editor & Preview Split Panes */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* Editor Pane */}
        {(activeTab === 'split' || activeTab === 'edit') && (
          <div className={`space-y-2 ${activeTab === 'edit' ? 'lg:col-span-2' : ''}`}>
            <label className="text-xs font-semibold text-outline uppercase tracking-wider px-1 block">
              Markdown Source
            </label>
            <textarea
              value={markdown}
              onChange={(e) => setMarkdown(e.target.value)}
              placeholder="Type or paste Markdown here..."
              className="w-full h-[520px] p-4 rounded-xl bg-surface-container-low border border-outline-variant font-mono text-xs text-on-surface placeholder:text-outline focus:outline-none focus:ring-2 focus:ring-primary-container resize-y"
            />
          </div>
        )}

        {/* Live Preview Pane */}
        {(activeTab === 'split' || activeTab === 'preview') && (
          <div className={`space-y-2 ${activeTab === 'preview' ? 'lg:col-span-2' : ''}`}>
            <label className="text-xs font-semibold text-outline uppercase tracking-wider px-1 block">
              Rendered Preview
            </label>
            <div
              className="markdown-preview w-full h-[520px] p-5 rounded-xl bg-surface-container-lowest border border-outline-variant overflow-y-auto"
              dangerouslySetInnerHTML={{
                __html:
                  renderedHtml ||
                  '<p class="text-outline italic">Live preview will appear here...</p>',
              }}
            />
          </div>
        )}
      </div>
    </div>
  );
};

export default MarkdownPreviewerTool;
