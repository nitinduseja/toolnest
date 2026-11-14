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
  { id: 'php', label: 'PHP' },
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
  const update = (partial: Partial<CodeCardConfig>) => {
    onChange({ ...config, ...partial });
  };

  const updateNumber = (key: 'padding' | 'borderRadius' | 'fontSize', value: number) => {
    if (!Number.isFinite(value)) return;

    update({ [key]: value });
  };

  return (
    <div className="flex flex-col gap-4 rounded-2xl border border-outline-variant bg-surface-container-low p-4 sm:p-5">
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
                update({
                  language: e.target.value as SupportedLanguage,
                })
              }
              className="h-7 px-2 rounded-lg bg-surface border border-outline-variant text-xs text-on-surface focus:outline-none"
            >
              {LANGUAGES.map((language) => (
                <option key={language.id} value={language.id}>
                  {language.label}
                </option>
              ))}
            </select>
          </div>
        </div>

        <input
          id="code-title"
          type="text"
          maxLength={200}
          value={config.title}
          onChange={(e) => update({ title: e.target.value })}
          placeholder="e.g. index.ts, server.py"
          className="w-full px-3 py-1.5 rounded-lg bg-surface border border-outline-variant text-xs font-mono text-on-surface focus:outline-none"
        />

        <label htmlFor="code-input" className="sr-only">
          Code Snippet
        </label>

        <textarea
          id="code-input"
          rows={10}
          maxLength={100000}
          spellCheck={false}
          value={config.code}
          onChange={(e) => update({ code: e.target.value })}
          placeholder="Paste or write your code snippet here..."
          className="w-full p-3 rounded-lg bg-surface border border-outline-variant text-xs font-mono text-on-surface focus:outline-none resize-y"
        />
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 border-t border-outline-variant/60 pt-3">
        <div className="flex flex-col gap-1.5">
          <span className="text-xs font-semibold text-on-surface">Syntax Theme</span>

          <div className="grid grid-cols-2 gap-1">
            {THEMES.map((theme) => (
              <button
                key={theme.id}
                type="button"
                aria-pressed={config.theme === theme.id}
                onClick={() => update({ theme: theme.id })}
                className={`px-2.5 py-1.5 rounded-lg text-xs font-medium transition ${
                  config.theme === theme.id
                    ? 'bg-primary text-on-primary font-semibold shadow-2xs'
                    : 'bg-surface border border-outline-variant text-on-surface-variant hover:bg-surface-container'
                }`}
              >
                {theme.label}
              </button>
            ))}
          </div>
        </div>

        <div className="flex flex-col gap-1.5">
          <span className="text-xs font-semibold text-on-surface">Window Chrome</span>

          <div className="grid grid-cols-2 gap-1">
            {WINDOW_STYLES.map((style) => (
              <button
                key={style.id}
                type="button"
                aria-pressed={config.windowStyle === style.id}
                onClick={() => update({ windowStyle: style.id })}
                className={`px-2.5 py-1.5 rounded-lg text-xs font-medium transition ${
                  config.windowStyle === style.id
                    ? 'bg-primary text-on-primary font-semibold shadow-2xs'
                    : 'bg-surface border border-outline-variant text-on-surface-variant hover:bg-surface-container'
                }`}
              >
                {style.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="flex flex-col gap-1.5 border-t border-outline-variant/60 pt-3">
        <span className="text-xs font-semibold text-on-surface">Background Preset</span>

        <div className="flex flex-wrap gap-1.5">
          {BACKGROUNDS.map((background) => (
            <button
              key={background.id}
              type="button"
              aria-pressed={config.background === background.id}
              onClick={() => update({ background: background.id })}
              className={`px-2.5 py-1 rounded-lg text-xs font-medium transition ${
                config.background === background.id
                  ? 'bg-primary text-on-primary font-semibold shadow-2xs'
                  : 'bg-surface border border-outline-variant text-on-surface-variant hover:bg-surface-container'
              }`}
            >
              {background.label}
            </button>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 border-t border-outline-variant/60 pt-3 text-xs">
        <div className="flex flex-col gap-1">
          <div className="flex justify-between text-on-surface-variant">
            <label htmlFor="canvas-padding">Canvas Padding</label>
            <span className="font-mono">{config.padding}px</span>
          </div>

          <input
            id="canvas-padding"
            type="range"
            min={16}
            max={64}
            value={config.padding}
            onChange={(e) => updateNumber('padding', Number(e.target.value))}
            className="w-full accent-primary"
          />
        </div>

        <div className="flex flex-col gap-1">
          <div className="flex justify-between text-on-surface-variant">
            <label htmlFor="corner-radius">Corner Radius</label>
            <span className="font-mono">{config.borderRadius}px</span>
          </div>

          <input
            id="corner-radius"
            type="range"
            min={4}
            max={24}
            value={config.borderRadius}
            onChange={(e) => updateNumber('borderRadius', Number(e.target.value))}
            className="w-full accent-primary"
          />
        </div>

        <div className="flex flex-col gap-1">
          <div className="flex justify-between text-on-surface-variant">
            <label htmlFor="font-size">Font Size</label>
            <span className="font-mono">{config.fontSize}px</span>
          </div>

          <input
            id="font-size"
            type="range"
            min={12}
            max={20}
            value={config.fontSize}
            onChange={(e) => updateNumber('fontSize', Number(e.target.value))}
            className="w-full accent-primary"
          />
        </div>
      </div>

      <div className="flex items-center gap-2 pt-1 border-t border-outline-variant/60">
        <label className="flex items-center gap-2 text-xs font-medium text-on-surface cursor-pointer select-none">
          <input
            type="checkbox"
            checked={config.showLineNumbers}
            onChange={(e) => update({ showLineNumbers: e.target.checked })}
            className="rounded border-outline-variant text-primary focus:ring-primary accent-primary"
          />
          <span>Show Line Numbers</span>
        </label>
      </div>
    </div>
  );
};
