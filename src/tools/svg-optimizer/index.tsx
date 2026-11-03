import React, { useState, useMemo, useRef } from 'react';
import { Sparkles, Trash2, Upload, FileCode2, CheckCircle2 } from 'lucide-react';
import type { SvgOptimizeOptions } from './types';
import {
  DEFAULT_SVG_OPTIONS,
  optimizeSvg,
  calculateSvgStats,
  isValidSvg,
} from './svgOptimizerLogic';
import { SvgControls } from './SvgControls';
import { SvgPreviewStage } from './SvgPreviewStage';

const SAMPLE_RAW_SVG = `<?xml version="1.0" encoding="utf-8"?>
<!-- Generator: Adobe Illustrator 27.0.0, SVG Export Plug-In . SVG Version: 6.00 Build 0)  -->
<!DOCTYPE svg PUBLIC "-//W3C//DTD SVG 1.1//EN" "http://www.w3.org/Graphics/SVG/1.1/DTD/svg11.dtd">
<svg version="1.1" id="Layer_1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" 
     xmlns:inkscape="http://www.inkscape.org/namespaces/inkscape" viewBox="0 0 100.00000 100.00000">
  <metadata>
    <rdf:RDF xmlns:rdf="http://www.w3.org/1999/02/22-rdf-syntax-ns#">
      <cc:Work xmlns:cc="http://creativecommons.org/ns#" rdf:about="">
        <dc:format xmlns:dc="http://purl.org/dc/elements/1.1/">image/svg+xml</dc:format>
      </cc:Work>
    </rdf:RDF>
  </metadata>
  <defs>
    <linearGradient id="SVGID_1_" gradientUnits="userSpaceOnUse" x1="12.34567" y1="15.89012" x2="88.76543" y2="85.43210">
      <stop offset="0" style="stop-color:#6366F1"/>
      <stop offset="1" style="stop-color:#EC4899"/>
    </linearGradient>
  </defs>
  <circle fill="url(#SVGID_1_)" cx="50.00000" cy="50.00000" r="42.55555" inkscape:label="circle-background"/>
  <path fill="#FFFFFF" d="M35.12345 52.88888 L45.99999 63.77777 L65.88888 38.22222" stroke="#FFFFFF" stroke-width="6.00000" stroke-linecap="round" stroke-linejoin="round"/>
</svg>`;

export const SvgOptimizerTool: React.FC = () => {
  const [svgInput, setSvgInput] = useState<string>(SAMPLE_RAW_SVG);
  const [options, setOptions] = useState<SvgOptimizeOptions>(DEFAULT_SVG_OPTIONS);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const isValid = useMemo(() => isValidSvg(svgInput), [svgInput]);

  const optimized = useMemo(() => {
    if (!isValid) return '';
    return optimizeSvg(svgInput, options);
  }, [svgInput, options, isValid]);

  const stats = useMemo(() => {
    return calculateSvgStats(svgInput, optimized);
  }, [svgInput, optimized]);

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (ev) => {
      const content = ev.target?.result as string;
      if (content) setSvgInput(content);
    };
    reader.readAsText(file);
    e.target.value = '';
  };

  const handleDownload = () => {
    const blob = new Blob([optimized], { type: 'image/svg+xml' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'optimized.svg';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    setTimeout(() => URL.revokeObjectURL(url), 1000);
  };

  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      {/* Top Banner */}
      <div className="p-4 rounded-2xl bg-surface-container-low border border-outline-variant flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-base font-bold text-on-surface">SVG Optimizer & Minifier</h2>
            <span className="px-2 py-0.5 rounded-full text-[10px] font-semibold bg-primary/10 text-primary border border-primary/20">
              Client-Side Clean
            </span>
          </div>
          <p className="text-xs text-outline mt-0.5">
            Strip bloated metadata, comments, editor namespaces, round coordinates, and minify SVG
            markup.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => setSvgInput(SAMPLE_RAW_SVG)}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold bg-surface-container hover:bg-surface-container-high border border-outline-variant text-on-surface cursor-pointer"
          >
            <Sparkles className="w-3.5 h-3.5 text-primary" />
            <span>Sample SVG</span>
          </button>
          <button
            type="button"
            onClick={() => fileInputRef.current?.click()}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold bg-surface-container hover:bg-surface-container-high border border-outline-variant text-on-surface cursor-pointer"
          >
            <Upload className="w-3.5 h-3.5 text-primary" />
            <span>Upload SVG</span>
          </button>
          <input
            ref={fileInputRef}
            type="file"
            accept=".svg,image/svg+xml"
            onChange={handleFileUpload}
            className="hidden"
          />
        </div>
      </div>

      {/* SVG Input Area */}
      <div className="space-y-1.5">
        <div className="flex items-center justify-between px-1">
          <label className="text-xs font-semibold text-outline flex items-center gap-1.5">
            <FileCode2 className="w-3.5 h-3.5 text-primary" />
            <span>RAW SVG MARKUP</span>
          </label>
          {svgInput && (
            <button
              type="button"
              onClick={() => setSvgInput('')}
              className="text-xs text-outline hover:text-red-500 flex items-center gap-1 cursor-pointer"
            >
              <Trash2 className="w-3 h-3" />
              <span>Clear</span>
            </button>
          )}
        </div>
        <textarea
          rows={6}
          placeholder="Paste <svg> markup here or upload an .svg file..."
          value={svgInput}
          onChange={(e) => setSvgInput(e.target.value)}
          className="w-full p-3.5 rounded-xl bg-surface-container-low border border-outline-variant text-xs font-mono text-on-surface focus:outline-hidden focus:border-primary"
        />
      </div>

      {/* Optimization Passes */}
      <SvgControls options={options} onChange={setOptions} />

      {/* Stats Bar */}
      {isValid && (
        <div className="p-4 rounded-xl bg-primary/5 border border-primary/20 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
            <span className="font-semibold text-on-surface">SVG Optimized Successfully</span>
          </div>
          <div className="flex items-center gap-4 font-mono">
            <span>
              <span className="text-outline">Original: </span>
              <strong>{stats.originalBytes.toLocaleString()} B</strong>
            </span>
            <span>
              <span className="text-outline">Optimized: </span>
              <strong>{stats.optimizedBytes.toLocaleString()} B</strong>
            </span>
            <span className="px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-600 font-bold">
              Saved {stats.savedBytes.toLocaleString()} B (-{stats.savingsPercentage}%)
            </span>
          </div>
        </div>
      )}

      {/* Preview Stage */}
      {isValid ? (
        <SvgPreviewStage
          rawSvg={svgInput}
          optimizedSvg={optimized}
          stats={stats}
          onDownload={handleDownload}
        />
      ) : (
        <div className="p-8 text-center text-xs text-outline rounded-xl bg-surface-container-low border border-outline-variant">
          Please provide valid SVG code containing &lt;svg&gt; tags.
        </div>
      )}
    </div>
  );
};

export default SvgOptimizerTool;
