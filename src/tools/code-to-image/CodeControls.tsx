import React from 'react';
import {
  CodeCardConfig,
  SyntaxTheme,
  WindowStyle,
  BackgroundPreset,
  SupportedLanguage,
} from './types';

interface CodeControlsProps {
  config: CodeCardConfig;
  onChange: (config: CodeCardConfig) => void;
}

const THEMES: { id: SyntaxTheme; label: string }[] = [
  { id: 'dracula', label: 'Dracula' },
  { id: 'one-dark', label: 'One Dark' },
  { id: 'nord', label: 'Nord' },
  { id: 'monokai', label: 'Monokai' },
  { id: 'github-dark', label: 'GitHub Dark' },
  { id: 'github-light', label: 'GitHub Light' },
];

const WINDOW_STYLES: { id: WindowStyle; label: string }[] = [
  { id: 'mac', label: 'macOS Dots' },
  { id: 'windows', label: 'Windows' },
  { id: 'minimal', label: 'Minimal' },
  { id: 'none', label: 'None' },
];

const BACKGROUNDS: { id: BackgroundPreset; label: string }[] = [
  { id: 'sunset', label: 'Sunset' },
  { id: 'neon', label: 'Neon' },
  { id: 'ocean', label: 'Ocean' },
  { id: 'aurora', label: 'Aurora' },
  { id: 'midnight', label: 'Midnight' },
  { id: 'peach', label: 'Peach' },
  { id: 'transparent', label: 'Transparent' },
];

const LANGUAGES: { id: SupportedLanguage; label: string }[] = [
  { id: 'typescript', label: 'TypeScript' },
  { id: 'javascript', label: 'JavaScript' },
  { id: 'python', label: 'Python' },
  { id: 'html', label: 'HTML / XML' },
  { id: 'css', label: 'CSS' },
  { id: 'json', label: 'JSON' },
  { id: 'sql', label: 'SQL' },
  { id: 'bash', label: 'Bash / Shell' },
  { id: 'rust', label: 'Rust' },
  { id: 'go', label: 'Go' },
  { id: 'text', label: 'Plain Text' },
];

export const CodeControls: React.FC<CodeControlsProps> = ({ config, onChange }) => {
  return (
    <div className="flex flex-col gap-4 rounded-2xl border border-outline-variant bg-surface-container-low p-4 sm:p-5">
      {/* Code Editor & Filename */}
      <div className="flex flex-col gap-2">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <label htmlFor="code-title" className="text-xs font-semibold text-on-surface">
            Window Title / File
          </label>
          <div className="flex items-center gap-2">
            <label htmlFor="code-language" className="text-xs text-outline font-medium">
              Language:
            </label>
            <select
              id="code-language"
              value={config.language}
              onChange={(e) =>
                onChange({ ...config, language: e.target.value as SupportedLanguage })
              }
              className="h-7 px-2 rounded-lg bg-surface border border-outline-variant text-xs text-on-surface focus:outline-none"
            >
              {LANGUAGES.map((l) => (
                <option key={l.id} value={l.id}>
                  {l.label}
                </option>
              ))}
            </select>
          </div>
        </div>
        <input
          id="code-title"
          type="text"
          value={config.title}
          onChange={(e) => onChange({ ...config, title: e.target.value })}
          placeholder="e.g. index.ts, server.py"
          className="w-full px-3 py-1.5 rounded-lg bg-surface border border-outline-variant text-xs font-mono text-on-surface focus:outline-none"
        />
        <label htmlFor="code-input" className="sr-only">
          Code Snippet
        </label>
        <textarea
          id="code-input"
          rows={10}
          value={config.code}
          onChange={(e) => onChange({ ...config, code: e.target.value })}
          placeholder="Paste or write your code snippet here..."
          className="w-full p-3 rounded-lg bg-surface border border-outline-variant text-xs font-mono text-on-surface focus:outline-none resize-y"
        />
      </div>

      {/* Syntax Theme & Window Controls */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 border-t border-outline-variant/60 pt-3">
        <div className="flex flex-col gap-1.5">
          <span className="text-xs font-semibold text-on-surface">Syntax Theme</span>
          <div className="grid grid-cols-2 gap-1">
            {THEMES.map((th) => (
              <button
                key={th.id}
                type="button"
                onClick={() => onChange({ ...config, theme: th.id })}
                className={`px-2.5 py-1.5 rounded-lg text-xs font-medium transition ${
                  config.theme === th.id
                    ? 'bg-primary text-on-primary font-semibold shadow-2xs'
                    : 'bg-surface border border-outline-variant text-on-surface-variant hover:bg-surface-container'
                }`}
              >
                {th.label}
              </button>
            ))}
          </div>
        </div>

        <div className="flex flex-col gap-1.5">
          <span className="text-xs font-semibold text-on-surface">Window Chrome</span>
          <div className="grid grid-cols-2 gap-1">
            {WINDOW_STYLES.map((ws) => (
              <button
                key={ws.id}
                type="button"
                onClick={() => onChange({ ...config, windowStyle: ws.id })}
                className={`px-2.5 py-1.5 rounded-lg text-xs font-medium transition ${
                  config.windowStyle === ws.id
                    ? 'bg-primary text-on-primary font-semibold shadow-2xs'
                    : 'bg-surface border border-outline-variant text-on-surface-variant hover:bg-surface-container'
                }`}
              >
                {ws.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Canvas Background Gradient */}
      <div className="flex flex-col gap-1.5 border-t border-outline-variant/60 pt-3">
        <span className="text-xs font-semibold text-on-surface">Background Preset</span>
        <div className="flex flex-wrap gap-1.5">
          {BACKGROUNDS.map((bg) => (
            <button
              key={bg.id}
              type="button"
              onClick={() => onChange({ ...config, background: bg.id })}
              className={`px-2.5 py-1 rounded-lg text-xs font-medium transition ${
                config.background === bg.id
                  ? 'bg-primary text-on-primary font-semibold shadow-2xs'
                  : 'bg-surface border border-outline-variant text-on-surface-variant hover:bg-surface-container'
              }`}
            >
              {bg.label}
            </button>
          ))}
        </div>
      </div>

      {/* Sliders: Padding, Radius, Font Size, Line Numbers */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 border-t border-outline-variant/60 pt-3 text-xs">
        <div className="flex flex-col gap-1">
          <div className="flex justify-between text-on-surface-variant">
            <span>Canvas Padding</span>
            <span className="font-mono">{config.padding}px</span>
          </div>
          <input
            type="range"
            aria-label="Canvas Padding"
            min={16}
            max={64}
            value={config.padding}
            onChange={(e) => onChange({ ...config, padding: Number(e.target.value) })}
            className="w-full accent-primary"
          />
        </div>

        <div className="flex flex-col gap-1">
          <div className="flex justify-between text-on-surface-variant">
            <span>Corner Radius</span>
            <span className="font-mono">{config.borderRadius}px</span>
          </div>
          <input
            type="range"
            aria-label="Corner Radius"
            min={4}
            max={24}
            value={config.borderRadius}
            onChange={(e) => onChange({ ...config, borderRadius: Number(e.target.value) })}
            className="w-full accent-primary"
          />
        </div>

        <div className="flex flex-col gap-1">
          <div className="flex justify-between text-on-surface-variant">
            <span>Font Size</span>
            <span className="font-mono">{config.fontSize}px</span>
          </div>
          <input
            type="range"
            aria-label="Font Size"
            min={12}
            max={20}
            value={config.fontSize}
            onChange={(e) => onChange({ ...config, fontSize: Number(e.target.value) })}
            className="w-full accent-primary"
          />
        </div>
      </div>

      <div className="flex items-center gap-2 pt-1 border-t border-outline-variant/60">
        <label className="flex items-center gap-2 text-xs font-medium text-on-surface cursor-pointer select-none">
          <input
            type="checkbox"
            checked={config.showLineNumbers}
            onChange={(e) => onChange({ ...config, showLineNumbers: e.target.checked })}
            className="rounded border-outline-variant text-primary focus:ring-primary accent-primary"
          />
          <span>Show Line Numbers</span>
        </label>
      </div>
    </div>
  );
};
