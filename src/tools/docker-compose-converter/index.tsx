import React, { useState, useMemo } from 'react';
import { Terminal, Copy, Check, Download, AlertTriangle, Layers, Trash2 } from 'lucide-react';
import { convertDockerRunToCompose, DOCKER_PRESETS } from './dockerLogic';
import { DockerPreset } from './types';
import { DockerPresetsBar } from './DockerPresetsBar';
import { copyToClipboard } from '@/lib/clipboard';
import { downloadFile } from '@/lib/downloads';

export const DockerComposeConverterTool: React.FC = () => {
  const [command, setCommand] = useState<string>(DOCKER_PRESETS[0].command);
  const [copied, setCopied] = useState(false);

  const { yaml, parsed, warnings } = useMemo(() => {
    return convertDockerRunToCompose(command);
  }, [command]);

  const handleCopy = async () => {
    const ok = await copyToClipboard(yaml);
    if (ok) {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const handleDownload = () => {
    downloadFile(yaml, { filename: 'docker-compose.yml', mimeType: 'text/yaml' });
  };

  const handleSelectPreset = (preset: DockerPreset) => {
    setCommand(preset.command);
  };

  return (
    <div className="space-y-6 max-w-5xl mx-auto pb-12">
      {/* Top Banner */}
      <div className="p-4 sm:p-5 rounded-2xl bg-surface-container-low border border-outline-variant/60 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="p-2.5 rounded-xl bg-primary/10 text-primary">
            <Layers className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-base font-bold text-on-surface">Docker Run to Compose Converter</h2>
            <p className="text-xs text-outline mt-0.5">
              Transform CLI docker run commands into production-ready docker-compose.yml files.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={handleDownload}
            className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-xl border border-outline-variant hover:bg-surface-container text-on-surface transition-all"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Download YAML</span>
          </button>
          <button
            type="button"
            onClick={handleCopy}
            className="flex items-center gap-1.5 px-3.5 py-1.5 text-xs font-bold rounded-xl bg-primary text-white shadow-xs hover:bg-primary/90 transition-all"
          >
            {copied ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
            <span>{copied ? 'Copied!' : 'Copy YAML'}</span>
          </button>
        </div>
      </div>

      {/* Interactive Presets */}
      <DockerPresetsBar onSelectPreset={handleSelectPreset} />

      {/* Dual Column Editor / Viewer */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* Left: Input Docker Run Command */}
        <div className="space-y-2">
          <div className="flex items-center justify-between text-xs px-1 text-on-surface-variant">
            <span className="font-semibold flex items-center gap-1.5">
              <Terminal className="w-3.5 h-3.5 text-primary" /> Docker Run Command
            </span>
            <button
              type="button"
              onClick={() => setCommand('')}
              className="p-1 rounded-lg hover:text-red-500 hover:bg-surface-container transition-colors"
              title="Clear command"
            >
              <Trash2 className="w-3.5 h-3.5" />
            </button>
          </div>
          <textarea
            value={command}
            onChange={(e) => setCommand(e.target.value)}
            placeholder="Paste docker run command here (e.g. docker run -d -p 80:80 nginx:alpine)..."
            className="w-full h-64 p-4 rounded-2xl bg-surface-container-low border border-outline-variant font-mono text-xs text-on-surface placeholder:text-outline focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary resize-y"
          />
        </div>

        {/* Right: Output Docker Compose YAML */}
        <div className="space-y-2">
          <div className="flex items-center justify-between text-xs px-1 text-on-surface-variant">
            <span className="font-semibold">Generated docker-compose.yml</span>
            <span className="font-mono text-[10px] text-outline">version: &quot;3.8&quot;</span>
          </div>
          <pre className="w-full h-64 p-4 rounded-2xl bg-surface-container-lowest border border-outline-variant font-mono text-xs text-on-surface overflow-auto whitespace-pre leading-relaxed select-text">
            <code>{yaml}</code>
          </pre>
        </div>
      </div>

      {/* Warnings & Parsed Summary */}
      {warnings.length > 0 && (
        <div className="p-3.5 rounded-xl bg-amber-500/10 border border-amber-500/20 text-xs text-amber-600 dark:text-amber-400 flex items-center gap-2">
          <AlertTriangle className="w-4 h-4 shrink-0" />
          <span>{warnings.join(' ')}</span>
        </div>
      )}

      {/* Parsed Attributes Pills */}
      <div className="bg-surface-container-low border border-outline-variant/60 rounded-2xl p-4 shadow-xs space-y-2">
        <span className="text-xs font-bold text-on-surface block">Parsed Attributes</span>
        <div className="flex flex-wrap gap-2 text-xs">
          <div className="px-2.5 py-1 rounded-lg bg-surface border border-outline-variant/40 flex items-center gap-1.5 font-mono">
            <span className="text-outline">Image:</span>
            <span className="font-semibold text-primary">{parsed.image || 'None'}</span>
          </div>
          <div className="px-2.5 py-1 rounded-lg bg-surface border border-outline-variant/40 flex items-center gap-1.5 font-mono">
            <span className="text-outline">Ports:</span>
            <span className="font-semibold text-on-surface">
              {parsed.ports.length > 0 ? parsed.ports.join(', ') : 'None'}
            </span>
          </div>
          <div className="px-2.5 py-1 rounded-lg bg-surface border border-outline-variant/40 flex items-center gap-1.5 font-mono">
            <span className="text-outline">Volumes:</span>
            <span className="font-semibold text-on-surface">{parsed.volumes.length}</span>
          </div>
          <div className="px-2.5 py-1 rounded-lg bg-surface border border-outline-variant/40 flex items-center gap-1.5 font-mono">
            <span className="text-outline">Env Vars:</span>
            <span className="font-semibold text-on-surface">
              {Object.keys(parsed.environment).length}
            </span>
          </div>
          {parsed.restart && (
            <div className="px-2.5 py-1 rounded-lg bg-surface border border-outline-variant/40 flex items-center gap-1.5 font-mono">
              <span className="text-outline">Restart:</span>
              <span className="font-semibold text-on-surface">{parsed.restart}</span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default DockerComposeConverterTool;
