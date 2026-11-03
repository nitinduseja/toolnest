import React from 'react';
import { Settings2 } from 'lucide-react';
import { SvgOptimizeOptions } from './types';

export interface SvgControlsProps {
  options: SvgOptimizeOptions;
  onChange: (options: SvgOptimizeOptions) => void;
}

export const SvgControls: React.FC<SvgControlsProps> = ({ options, onChange }) => {
  const toggle = (key: keyof SvgOptimizeOptions) => {
    onChange({ ...options, [key]: !options[key] });
  };

  const toggles: { key: keyof SvgOptimizeOptions; label: string; desc: string }[] = [
    {
      key: 'removeDoctype',
      label: 'Strip DOCTYPE & XML Header',
      desc: 'Removes <?xml> and <!DOCTYPE>',
    },
    {
      key: 'removeComments',
      label: 'Strip Comments',
      desc: 'Removes all <!-- comments -->',
    },
    {
      key: 'removeMetadata',
      label: 'Strip Metadata',
      desc: 'Removes <metadata> tags',
    },
    {
      key: 'removeEditorData',
      label: 'Strip Editor Namespaces',
      desc: 'Removes Inkscape, Illustrator & Sketch tags',
    },
    {
      key: 'cleanIds',
      label: 'Clean Generic IDs',
      desc: 'Removes unreferenced auto-generated IDs',
    },
    {
      key: 'collapseWhitespace',
      label: 'Minify Whitespace',
      desc: 'Collapses whitespace between tags',
    },
  ];

  return (
    <div className="p-4 sm:p-5 rounded-2xl bg-surface-container-low border border-outline-variant space-y-4">
      <div className="flex items-center justify-between">
        <span className="text-xs font-semibold text-outline flex items-center gap-1.5">
          <Settings2 className="w-3.5 h-3.5 text-primary" />
          <span>OPTIMIZATION PASSES</span>
        </span>

        {/* Precision */}
        <div className="flex items-center gap-2 text-xs">
          <span className="text-outline">Precision:</span>
          <span className="font-mono font-bold text-primary">{options.precision} decimals</span>
          <input
            type="range"
            min="0"
            max="4"
            step="1"
            value={options.precision}
            onChange={(e) => onChange({ ...options, precision: Number(e.target.value) })}
            className="w-24 accent-primary cursor-pointer"
          />
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2.5">
        {toggles.map((t) => {
          const active = Boolean(options[t.key]);
          return (
            <button
              key={t.key}
              type="button"
              onClick={() => toggle(t.key)}
              className={`p-2.5 rounded-xl border text-left transition-all cursor-pointer ${
                active
                  ? 'bg-primary/10 border-primary/40 text-on-surface'
                  : 'bg-surface-container hover:bg-surface-container-high border-outline-variant text-outline'
              }`}
            >
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold text-on-surface">{t.label}</span>
                <span
                  className={`w-2 h-2 rounded-full ${active ? 'bg-primary' : 'bg-outline-variant'}`}
                />
              </div>
              <span className="text-[10px] text-outline mt-0.5 block">{t.desc}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
};
