import React, { useState, useMemo } from 'react';
import { SecurityHeadersConfig, ServerTarget } from './types';
import {
  createDefaultConfig,
  evaluateSecurityScore,
  generateServerSnippets,
} from './securityHeadersLogic';
import { SecurityPresetsBar } from './SecurityPresetsBar';
import { SecurityAuditBadge } from './SecurityAuditBadge';
import { Icon } from '@/components/atoms/Icon';

export const SecurityHeaders: React.FC = () => {
  const [config, setConfig] = useState<SecurityHeadersConfig>(createDefaultConfig());
  const [target, setTarget] = useState<ServerTarget>('nginx');
  const [copied, setCopied] = useState<boolean>(false);

  const audit = useMemo(() => evaluateSecurityScore(config), [config]);
  const snippet = useMemo(() => generateServerSnippets(config, target), [config, target]);

  const handleCopy = async () => {
    await navigator.clipboard.writeText(snippet);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="mx-auto flex w-full max-w-6xl flex-col gap-6 p-4 sm:p-6">
      {/* Header */}
      <div className="flex flex-col gap-1">
        <div className="flex items-center gap-2">
          <div className="rounded-lg bg-primary/10 p-2 text-primary">
            <Icon name="ShieldCheck" className="h-6 w-6" />
          </div>
          <div>
            <h1 className="text-xl font-bold tracking-tight text-text-primary sm:text-2xl">
              Security Headers & CSP Builder
            </h1>
            <p className="text-xs text-text-secondary sm:text-sm">
              Design, audit, and generate Content-Security-Policy (CSP), HSTS, and protection
              headers with real-time security grading.
            </p>
          </div>
        </div>
      </div>

      <SecurityPresetsBar onSelect={setConfig} />
      <SecurityAuditBadge audit={audit} />

      {/* Main Grid */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        {/* Controls Column */}
        <div className="flex flex-col gap-4 rounded-xl border border-border/50 bg-surface-primary/70 p-4">
          <span className="text-xs font-semibold uppercase tracking-wider text-text-tertiary">
            Header Configuration
          </span>

          {/* HSTS Controls */}
          <div className="flex flex-col gap-2 rounded-lg border border-border/50 bg-surface-secondary/40 p-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-text-primary">Strict-Transport-Security</span>
              <label className="flex cursor-pointer items-center gap-1.5 text-xs text-text-secondary">
                <input
                  type="checkbox"
                  checked={config.hsts.enabled}
                  onChange={(e) =>
                    setConfig({ ...config, hsts: { ...config.hsts, enabled: e.target.checked } })
                  }
                  className="rounded accent-primary"
                />
                Enabled
              </label>
            </div>
            {config.hsts.enabled && (
              <div className="flex items-center gap-4 pt-1 text-xs text-text-secondary">
                <label className="flex items-center gap-1.5">
                  <input
                    type="checkbox"
                    checked={config.hsts.includeSubDomains}
                    onChange={(e) =>
                      setConfig({
                        ...config,
                        hsts: { ...config.hsts, includeSubDomains: e.target.checked },
                      })
                    }
                    className="rounded accent-primary"
                  />
                  includeSubDomains
                </label>
                <label className="flex items-center gap-1.5">
                  <input
                    type="checkbox"
                    checked={config.hsts.preload}
                    onChange={(e) =>
                      setConfig({ ...config, hsts: { ...config.hsts, preload: e.target.checked } })
                    }
                    className="rounded accent-primary"
                  />
                  preload
                </label>
              </div>
            )}
          </div>

          {/* Frame Protection */}
          <div className="flex flex-col gap-2 rounded-lg border border-border/50 bg-surface-secondary/40 p-3">
            <span className="text-xs font-bold text-text-primary">
              X-Frame-Options (Clickjacking)
            </span>
            <div className="grid grid-cols-3 gap-2">
              {(['DENY', 'SAMEORIGIN', 'OFF'] as const).map((opt) => (
                <button
                  key={opt}
                  type="button"
                  onClick={() => setConfig({ ...config, xFrameOptions: opt })}
                  className={`rounded-lg px-2.5 py-1.5 text-xs font-medium transition ${
                    config.xFrameOptions === opt
                      ? 'bg-primary text-primary-foreground shadow-sm'
                      : 'border border-border/60 bg-surface-primary text-text-secondary'
                  }`}
                >
                  {opt}
                </button>
              ))}
            </div>
          </div>

          {/* Additional Core Toggles */}
          <div className="flex flex-col gap-2 rounded-lg border border-border/50 bg-surface-secondary/40 p-3 text-xs">
            <label className="flex cursor-pointer items-center justify-between">
              <span className="font-semibold text-text-primary">
                X-Content-Type-Options: nosniff
              </span>
              <input
                type="checkbox"
                checked={config.xContentTypeOptions}
                onChange={(e) => setConfig({ ...config, xContentTypeOptions: e.target.checked })}
                className="rounded accent-primary"
              />
            </label>
            <label className="flex cursor-pointer items-center justify-between border-t border-border/30 pt-2">
              <span className="font-semibold text-text-primary">Upgrade-Insecure-Requests</span>
              <input
                type="checkbox"
                checked={config.csp.upgradeInsecure}
                onChange={(e) =>
                  setConfig({
                    ...config,
                    csp: { ...config.csp, upgradeInsecure: e.target.checked },
                  })
                }
                className="rounded accent-primary"
              />
            </label>
          </div>
        </div>

        {/* Server Snippet Export Column */}
        <div className="flex flex-col gap-3 rounded-xl border border-border/50 bg-surface-primary/70 p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-1">
              {(['nginx', 'apache', 'netlify', 'cloudflare', 'raw'] as ServerTarget[]).map(
                (tgt) => (
                  <button
                    key={tgt}
                    type="button"
                    onClick={() => setTarget(tgt)}
                    className={`rounded-md px-2.5 py-1 text-xs font-semibold uppercase transition ${
                      target === tgt
                        ? 'bg-primary text-primary-foreground shadow-sm'
                        : 'text-text-secondary hover:bg-surface-secondary'
                    }`}
                  >
                    {tgt}
                  </button>
                )
              )}
            </div>

            <button
              type="button"
              onClick={handleCopy}
              className="flex items-center gap-1.5 rounded-lg bg-primary/10 px-3 py-1.5 text-xs font-semibold text-primary transition hover:bg-primary/20"
            >
              <Icon name={copied ? 'Check' : 'Copy'} className="h-3.5 w-3.5" />
              <span>{copied ? 'Copied!' : 'Copy Config'}</span>
            </button>
          </div>

          <pre className="h-[21rem] overflow-auto rounded-lg bg-surface-secondary/70 p-3 font-mono text-xs text-text-primary">
            <code>{snippet}</code>
          </pre>
        </div>
      </div>
    </div>
  );
};

export default SecurityHeaders;
