import React, { useState, useMemo } from 'react';
import {
  Globe,
  Monitor,
  Smartphone,
  Tablet,
  Bot,
  Copy,
  Check,
  RotateCcw,
  Sparkles,
  Cpu,
  Layers,
  FileCode,
} from 'lucide-react';
import { parseUserAgent, UA_PRESETS } from './uaParserLogic';
import { UaPresetsBar } from './UaPresetsBar';
import { UaPreset } from './types';
import { copyToClipboard } from '@/lib/clipboard';

export const UserAgentParserTool: React.FC = () => {
  const [uaInput, setUaInput] = useState<string>(
    typeof navigator !== 'undefined' ? navigator.userAgent : UA_PRESETS[0].ua
  );
  const [activePresetId, setActivePresetId] = useState<string | undefined>(undefined);
  const [copiedUa, setCopiedUa] = useState(false);
  const [copiedJson, setCopiedJson] = useState(false);

  const parsed = useMemo(() => parseUserAgent(uaInput), [uaInput]);

  const handleSelectPreset = (preset: UaPreset) => {
    setActivePresetId(preset.id);
    setUaInput(preset.ua);
  };

  const handleDetectSelf = () => {
    if (typeof navigator !== 'undefined' && navigator.userAgent) {
      setActivePresetId(undefined);
      setUaInput(navigator.userAgent);
    }
  };

  const handleCopyUa = async () => {
    const ok = await copyToClipboard(uaInput);
    if (ok) {
      setCopiedUa(true);
      setTimeout(() => setCopiedUa(false), 2000);
    }
  };

  const handleCopyJson = async () => {
    const ok = await copyToClipboard(JSON.stringify(parsed, null, 2));
    if (ok) {
      setCopiedJson(true);
      setTimeout(() => setCopiedJson(false), 2000);
    }
  };

  const getDeviceIcon = () => {
    switch (parsed.device.type) {
      case 'Mobile':
        return <Smartphone className="w-5 h-5 text-primary" />;
      case 'Tablet':
        return <Tablet className="w-5 h-5 text-primary" />;
      case 'Bot':
        return <Bot className="w-5 h-5 text-amber-500" />;
      default:
        return <Monitor className="w-5 h-5 text-primary" />;
    }
  };

  return (
    <div className="space-y-6 max-w-5xl mx-auto pb-12">
      {/* Banner */}
      <div className="p-4 sm:p-5 rounded-2xl bg-surface-container-low border border-outline-variant/60 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="p-2.5 rounded-xl bg-primary/10 text-primary">
            <Globe className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-base font-bold text-on-surface">
              User-Agent & Client Hints Parser
            </h2>
            <p className="text-xs text-outline mt-0.5">
              Inspect, analyze, and breakdown browser, operating system, rendering engine, and
              device metadata.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={handleDetectSelf}
            className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-xl border border-outline-variant hover:bg-surface-container text-on-surface transition-all"
            title="Auto-detect current device browser"
          >
            <Sparkles className="w-3.5 h-3.5 text-primary" />
            <span>Detect My Browser</span>
          </button>
          <button
            type="button"
            onClick={handleCopyJson}
            className="flex items-center gap-1.5 px-3.5 py-1.5 text-xs font-bold rounded-xl bg-primary text-white shadow-xs hover:bg-primary/90 transition-all"
          >
            {copiedJson ? <Check className="w-3.5 h-3.5" /> : <FileCode className="w-3.5 h-3.5" />}
            <span>{copiedJson ? 'Copied JSON!' : 'Export JSON'}</span>
          </button>
        </div>
      </div>

      {/* Preset Bar */}
      <UaPresetsBar onSelectPreset={handleSelectPreset} activeId={activePresetId} />

      {/* Input Textarea Card */}
      <div className="p-4 sm:p-5 rounded-2xl bg-surface-container-low border border-outline-variant/60 space-y-3">
        <div className="flex items-center justify-between">
          <label
            htmlFor="ua-input"
            className="text-xs font-bold text-on-surface uppercase tracking-wider"
          >
            User-Agent String
          </label>
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => setUaInput('')}
              className="text-xs text-outline hover:text-error flex items-center gap-1 transition-colors"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Clear</span>
            </button>
            <button
              type="button"
              onClick={handleCopyUa}
              className="text-xs text-outline hover:text-primary flex items-center gap-1 transition-colors"
            >
              {copiedUa ? (
                <Check className="w-3.5 h-3.5 text-emerald-500" />
              ) : (
                <Copy className="w-3.5 h-3.5" />
              )}
              <span>{copiedUa ? 'Copied' : 'Copy UA'}</span>
            </button>
          </div>
        </div>

        <textarea
          id="ua-input"
          value={uaInput}
          onChange={(e) => {
            setActivePresetId(undefined);
            setUaInput(e.target.value);
          }}
          rows={3}
          placeholder="Paste or enter any User-Agent string here..."
          className="w-full px-3.5 py-2.5 rounded-xl bg-surface-container border border-outline-variant/60 text-on-surface font-mono text-xs focus:outline-hidden focus:ring-2 focus:ring-primary/40 transition-all resize-y"
        />
      </div>

      {/* Bot Detection Banner */}
      {parsed.isBot && (
        <div className="p-4 rounded-2xl bg-amber-500/10 border border-amber-500/30 flex items-center gap-3 text-amber-500">
          <Bot className="w-5 h-5 shrink-0" />
          <div className="text-xs">
            <span className="font-bold">Automated Crawler / Search Engine Bot Detected: </span>
            <span>{parsed.botDetails || 'Web Spider'}</span>
          </div>
        </div>
      )}

      {/* Visual Report Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Browser Card */}
        <div className="p-5 rounded-2xl bg-surface-container-low border border-outline-variant/60 space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-outline uppercase tracking-wider">
              Browser
            </span>
            <Globe className="w-4 h-4 text-primary" />
          </div>
          <div data-testid="ua-browser-name" className="text-xl font-bold text-on-surface">
            {parsed.browser.name}
          </div>
          <div className="text-xs text-outline font-mono">
            Version: <span className="text-on-surface font-semibold">{parsed.browser.version}</span>
          </div>
        </div>

        {/* Operating System Card */}
        <div className="p-5 rounded-2xl bg-surface-container-low border border-outline-variant/60 space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-outline uppercase tracking-wider">OS</span>
            <Cpu className="w-4 h-4 text-primary" />
          </div>
          <div data-testid="ua-os-name" className="text-xl font-bold text-on-surface">
            {parsed.os.name}
          </div>
          <div className="text-xs text-outline font-mono">
            Version: <span className="text-on-surface font-semibold">{parsed.os.version}</span>
          </div>
        </div>

        {/* Device Type Card */}
        <div className="p-5 rounded-2xl bg-surface-container-low border border-outline-variant/60 space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-outline uppercase tracking-wider">
              Device Type
            </span>
            {getDeviceIcon()}
          </div>
          <div data-testid="ua-device-type" className="text-xl font-bold text-on-surface">
            {parsed.device.type}
          </div>
          <div className="text-xs text-outline font-mono">
            Arch: <span className="text-on-surface font-semibold">{parsed.cpu.architecture}</span>
          </div>
        </div>

        {/* Rendering Engine Card */}
        <div className="p-5 rounded-2xl bg-surface-container-low border border-outline-variant/60 space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-outline uppercase tracking-wider">
              Engine
            </span>
            <Layers className="w-4 h-4 text-primary" />
          </div>
          <div data-testid="ua-engine-name" className="text-xl font-bold text-on-surface">
            {parsed.engine.name}
          </div>
          <div className="text-xs text-outline font-mono">
            Version: <span className="text-on-surface font-semibold">{parsed.engine.version}</span>
          </div>
        </div>
      </div>

      {/* JSON Inspection Details */}
      <div className="p-4 sm:p-5 rounded-2xl bg-surface-container-low border border-outline-variant/60 space-y-3">
        <span className="text-xs font-bold text-on-surface uppercase tracking-wider">
          Parsed Metadata JSON
        </span>
        <pre className="p-4 rounded-xl bg-surface-container-highest/60 border border-outline-variant/50 font-mono text-xs text-on-surface overflow-x-auto leading-relaxed">
          {JSON.stringify(parsed, null, 2)}
        </pre>
      </div>
    </div>
  );
};

export default UserAgentParserTool;
