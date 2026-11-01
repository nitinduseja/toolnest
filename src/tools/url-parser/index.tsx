import React, { useState, useMemo, useEffect } from 'react';
import {
  Globe,
  Copy,
  Check,
  RotateCcw,
  ExternalLink,
  Link as LinkIcon,
  AlertCircle,
} from 'lucide-react';
import {
  parseUrlString,
  buildUrlString,
  getSampleUrls,
  QueryParamItem,
  SampleUrl,
} from './urlLogic';
import { UrlComponentsCard } from './UrlComponentsCard';
import { QueryParamsTable } from './QueryParamsTable';
import { copyToClipboard } from '@/lib/clipboard';

const SAMPLES = getSampleUrls();

export const UrlParserTool: React.FC = () => {
  const [rawInput, setRawInput] = useState<string>(SAMPLES[0].url);
  const [activeSample, setActiveSample] = useState<string | null>(SAMPLES[0].label);
  const [params, setParams] = useState<QueryParamItem[]>([]);
  const [copiedUrl, setCopiedUrl] = useState<boolean>(false);
  const [isDecodedView, setIsDecodedView] = useState<boolean>(false);

  const parsed = useMemo(() => parseUrlString(rawInput), [rawInput]);

  // Sync parsed params on initial load or raw input change from samples/typing
  useEffect(() => {
    if (parsed.isValid) {
      setParams(parsed.params);
    }
  }, [parsed]);

  const reconstructedUrl = useMemo(() => {
    if (!parsed.isValid) return rawInput;
    return buildUrlString(rawInput, params);
  }, [rawInput, params, parsed.isValid]);

  const displayReconstructed = useMemo(() => {
    if (!isDecodedView) return reconstructedUrl;
    try {
      return decodeURI(reconstructedUrl);
    } catch {
      return reconstructedUrl;
    }
  }, [reconstructedUrl, isDecodedView]);

  const handleSelectSample = (sample: SampleUrl) => {
    setActiveSample(sample.label);
    setRawInput(sample.url);
  };

  const handleRawInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setActiveSample(null);
    setRawInput(e.target.value);
  };

  const handleParamsChange = (newParams: QueryParamItem[]) => {
    setActiveSample(null);
    setParams(newParams);
  };

  const handleReset = () => {
    handleSelectSample(SAMPLES[0]);
  };

  const handleCopyReconstructed = async () => {
    if (!reconstructedUrl) return;
    const ok = await copyToClipboard(reconstructedUrl);
    if (ok) {
      setCopiedUrl(true);
      setTimeout(() => setCopiedUrl(false), 2000);
    }
  };

  return (
    <div className="space-y-6">
      {/* Notice Ribbon */}
      <div className="p-3.5 rounded-xl bg-surface-container-low border border-outline-variant flex items-center justify-between flex-wrap gap-2 text-xs text-on-surface-variant">
        <div className="flex items-center gap-2">
          <Globe className="w-4 h-4 text-primary shrink-0" />
          <span>
            <strong>Client-Side URL Inspector:</strong> Parses, modifies, and validates URLs and
            query arguments in-browser. Zero server tracking.
          </span>
        </div>
        <button
          type="button"
          onClick={handleReset}
          className="flex items-center gap-1 px-2.5 py-1 rounded-lg bg-surface-container hover:bg-surface-container-high text-on-surface text-xs font-medium transition-colors"
        >
          <RotateCcw className="w-3.5 h-3.5" />
          <span>Reset</span>
        </button>
      </div>

      {/* Preset Samples */}
      <div className="flex flex-wrap items-center gap-2">
        <span className="text-xs font-semibold text-outline uppercase tracking-wider">
          Samples:
        </span>
        {SAMPLES.map((sample) => {
          const isActive = activeSample === sample.label;
          return (
            <button
              key={sample.label}
              type="button"
              onClick={() => handleSelectSample(sample)}
              className={`px-3 py-1 rounded-lg text-xs font-medium transition-all ${
                isActive
                  ? 'bg-primary text-on-primary border border-primary shadow-xs font-semibold'
                  : 'bg-surface-container-low hover:bg-surface-container border border-outline-variant text-on-surface'
              }`}
            >
              {sample.label}
            </button>
          );
        })}
      </div>

      {/* URL Input Bar */}
      <div className="p-4 rounded-xl bg-surface-container-low border border-outline-variant space-y-2">
        <label
          htmlFor="raw-url-input"
          className="block text-xs font-semibold text-outline uppercase tracking-wider"
        >
          Raw Target URL
        </label>
        <div className="relative">
          <input
            id="raw-url-input"
            type="text"
            value={rawInput}
            onChange={handleRawInputChange}
            placeholder="Paste URL here (e.g., https://example.com/api?search=test)..."
            className="w-full py-2.5 pl-3 pr-10 rounded-lg bg-surface-container-lowest border border-outline-variant font-mono text-xs text-on-surface placeholder:text-outline focus:outline-hidden focus:border-primary transition-colors"
          />
        </div>
        {!parsed.isValid && rawInput.trim() && (
          <div className="flex items-center gap-1.5 text-xs text-error">
            <AlertCircle className="w-3.5 h-3.5 shrink-0" />
            <span>{parsed.errorMessage || 'Invalid URL format'}</span>
          </div>
        )}
      </div>

      {/* Live Reconstructed URL Banner */}
      <div className="p-4 rounded-2xl bg-surface-container-low border border-outline-variant space-y-3 shadow-xs">
        <div className="flex items-center justify-between flex-wrap gap-2 text-xs">
          <div className="flex items-center gap-1.5 font-semibold text-outline uppercase tracking-wider">
            <LinkIcon className="w-4 h-4 text-primary" />
            <span>Live Synchronized URL</span>
          </div>

          <div className="flex items-center gap-2">
            <div className="flex bg-surface-container rounded-lg p-0.5 border border-outline-variant/40">
              <button
                type="button"
                onClick={() => setIsDecodedView(false)}
                className={`px-2 py-0.5 rounded text-[11px] font-semibold transition-colors ${
                  !isDecodedView
                    ? 'bg-primary text-on-primary shadow-xs'
                    : 'text-on-surface-variant hover:text-on-surface'
                }`}
              >
                Encoded
              </button>
              <button
                type="button"
                onClick={() => setIsDecodedView(true)}
                className={`px-2 py-0.5 rounded text-[11px] font-semibold transition-colors ${
                  isDecodedView
                    ? 'bg-primary text-on-primary shadow-xs'
                    : 'text-on-surface-variant hover:text-on-surface'
                }`}
              >
                Decoded
              </button>
            </div>

            <button
              type="button"
              onClick={handleCopyReconstructed}
              disabled={!reconstructedUrl}
              className="flex items-center gap-1 px-2.5 py-1 rounded-lg bg-primary text-on-primary hover:bg-primary/90 text-xs font-semibold transition-colors shadow-xs disabled:opacity-40"
            >
              {copiedUrl ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
              <span>{copiedUrl ? 'Copied' : 'Copy'}</span>
            </button>

            {reconstructedUrl && (
              <a
                href={reconstructedUrl}
                target="_blank"
                rel="noopener noreferrer"
                title="Open in new tab"
                className="p-1.5 rounded-lg bg-surface-container hover:bg-surface-container-high text-on-surface transition-colors"
              >
                <ExternalLink className="w-3.5 h-3.5" />
              </a>
            )}
          </div>
        </div>

        <div className="p-3.5 rounded-xl bg-surface-container-lowest border border-outline-variant font-mono text-xs text-on-surface break-all select-all">
          {displayReconstructed || 'No valid URL constructed.'}
        </div>
      </div>

      {/* Grid: Components Card & Query Params Table */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        <div className="lg:col-span-5">
          <UrlComponentsCard parsed={parsed} />
        </div>
        <div className="lg:col-span-7">
          <QueryParamsTable params={params} onChange={handleParamsChange} />
        </div>
      </div>
    </div>
  );
};

export default UrlParserTool;
