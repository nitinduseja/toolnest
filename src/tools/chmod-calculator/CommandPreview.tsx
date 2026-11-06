import React, { useState } from 'react';
import { Terminal, Copy, Check, Sliders } from 'lucide-react';
import { ChmodState, CommandOptions } from './types';
import { generateChmodCommands } from './chmodLogic';

interface CommandPreviewProps {
  state: ChmodState;
}

export const CommandPreview: React.FC<CommandPreviewProps> = ({ state }) => {
  const [options, setOptions] = useState<CommandOptions>({
    path: state.isDirectory ? 'public_html/' : 'file.txt',
    recursive: false,
    verbose: false,
    changesOnly: false,
    silent: false,
    sudo: false,
  });

  const [copiedKey, setCopiedKey] = useState<string | null>(null);

  const commands = generateChmodCommands(state, options);

  const handleCopy = (text: string, key: string) => {
    navigator.clipboard.writeText(text);
    setCopiedKey(key);
    setTimeout(() => setCopiedKey(null), 2000);
  };

  const toggleOption = (key: keyof Omit<CommandOptions, 'path'>) => {
    setOptions((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  return (
    <div className="bg-surface-container-low border border-outline-variant/60 rounded-2xl p-4 sm:p-5 shadow-xs space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-bold text-on-surface flex items-center gap-2">
          <Terminal className="w-4 h-4 text-primary" />
          Terminal Command Generator
        </h3>
        <span className="text-[11px] text-outline font-mono">Bash / Zsh / POSIX</span>
      </div>

      {/* Target Path & Options Strip */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3 pt-1">
        <div>
          <label
            htmlFor="target-path-input"
            className="block text-xs font-semibold text-on-surface-variant mb-1"
          >
            Target File or Directory Path
          </label>
          <input
            id="target-path-input"
            type="text"
            value={options.path}
            onChange={(e) => setOptions({ ...options, path: e.target.value })}
            placeholder="e.g., /var/www/html or script.sh"
            className="w-full px-3 py-2 rounded-xl text-xs font-mono bg-surface border border-outline-variant focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary text-on-surface transition-colors"
          />
        </div>

        <div>
          <span className="block text-xs font-semibold text-on-surface-variant mb-1 flex items-center gap-1">
            <Sliders className="w-3 h-3" /> Execution Modifiers
          </span>
          <div className="flex flex-wrap gap-1.5">
            {[
              { key: 'recursive' as const, label: '-R Recursive' },
              { key: 'verbose' as const, label: '-v Verbose' },
              { key: 'changesOnly' as const, label: '-c Changes' },
              { key: 'silent' as const, label: '-f Silent' },
              { key: 'sudo' as const, label: 'sudo Prefix' },
            ].map(({ key, label }) => {
              const active = options[key];
              return (
                <button
                  key={key}
                  type="button"
                  onClick={() => toggleOption(key)}
                  className={`px-2.5 py-1 text-[11px] font-mono rounded-lg border transition-all ${
                    active
                      ? 'bg-primary text-white border-primary shadow-xs font-bold'
                      : 'bg-surface border-outline-variant text-on-surface-variant hover:text-on-surface hover:bg-surface-container'
                  }`}
                >
                  {label}
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* Generated Commands List */}
      <div className="space-y-2.5 pt-2">
        {[
          {
            key: 'octal',
            title: 'Standard Octal Command',
            cmd: commands.octalCommand,
            desc: 'Widely used in deployment scripts and automation',
          },
          {
            key: 'symbolic',
            title: 'Symbolic Notation Command',
            cmd: commands.symbolicCommand,
            desc: 'Applies relative user/group/others flags',
          },
          {
            key: 'find',
            title: 'Bulk Tree Find Command',
            cmd: commands.findCommand,
            desc: 'Safely target only files or directories in folder trees',
          },
        ].map(({ key, title, cmd, desc }) => (
          <div
            key={key}
            className="bg-surface border border-outline-variant/50 rounded-xl p-3 space-y-1.5"
          >
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-bold text-on-surface">{title}</span>
              <span className="text-[10px] text-outline">{desc}</span>
            </div>
            <div className="flex items-center justify-between gap-2 bg-surface-container-high/60 rounded-lg p-2 font-mono text-xs text-on-surface overflow-x-auto">
              <code className="select-all text-primary dark:text-indigo-400">{cmd}</code>
              <button
                type="button"
                onClick={() => handleCopy(cmd, key)}
                className="p-1.5 rounded-md hover:bg-surface-container text-on-surface-variant hover:text-on-surface transition-colors shrink-0"
                title="Copy command"
              >
                {copiedKey === key ? (
                  <Check className="w-3.5 h-3.5 text-emerald-500" />
                ) : (
                  <Copy className="w-3.5 h-3.5" />
                )}
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
