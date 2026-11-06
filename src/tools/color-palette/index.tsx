import React, { useState } from 'react';
import { Palette, Image as ImageIcon, Sparkles, Download } from 'lucide-react';
import { ExtractedColor } from './types';
import { ImagePaletteExtractor } from './ImagePaletteExtractor';
import { HarmonicPaletteGenerator } from './HarmonicPaletteGenerator';
import { PaletteExportModal } from './PaletteExportModal';

export const ColorPaletteTool: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'image' | 'harmony'>('image');
  const [extractedColors, setExtractedColors] = useState<ExtractedColor[]>([]);
  const [harmonicHexes, setHarmonicHexes] = useState<string[]>([]);
  const [isExportOpen, setIsExportOpen] = useState(false);

  const currentColors =
    activeTab === 'image'
      ? extractedColors.map((c) => c.hex)
      : harmonicHexes.length > 0
        ? harmonicHexes
        : ['#635bff', '#10b981', '#f59e0b'];

  return (
    <div className="space-y-6 max-w-5xl mx-auto pb-12">
      {/* Header Banner */}
      <div className="p-4 sm:p-5 rounded-2xl bg-surface-container-low border border-outline-variant/60 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="p-2.5 rounded-xl bg-primary/10 text-primary">
            <Palette className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-base font-bold text-on-surface">Color Palette & Contrast Studio</h2>
            <p className="text-xs text-outline mt-0.5">
              Extract dominant palettes from images, generate harmonic color schemes, and test WCAG
              contrast.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {/* Mode Switcher */}
          <div className="flex bg-surface-container rounded-xl p-1 border border-outline-variant/50">
            <button
              type="button"
              onClick={() => setActiveTab('image')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                activeTab === 'image'
                  ? 'bg-primary text-white shadow-xs'
                  : 'text-on-surface-variant hover:text-on-surface'
              }`}
            >
              <ImageIcon className="w-3.5 h-3.5" />
              <span>Image</span>
            </button>
            <button
              type="button"
              onClick={() => setActiveTab('harmony')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                activeTab === 'harmony'
                  ? 'bg-primary text-white shadow-xs'
                  : 'text-on-surface-variant hover:text-on-surface'
              }`}
            >
              <Sparkles className="w-3.5 h-3.5" />
              <span>Harmonies</span>
            </button>
          </div>

          <button
            type="button"
            onClick={() => setIsExportOpen(true)}
            className="flex items-center gap-1.5 px-3.5 py-1.5 text-xs font-bold rounded-xl border border-outline-variant/80 hover:bg-surface-container text-on-surface transition-all"
            title="Export Palette"
          >
            <Download className="w-3.5 h-3.5 text-primary" />
            <span className="hidden xs:inline">Export</span>
          </button>
        </div>
      </div>

      {/* Main Tab Views */}
      {activeTab === 'image' ? (
        <ImagePaletteExtractor
          colors={extractedColors}
          onColorsExtracted={(c) => setExtractedColors(c)}
        />
      ) : (
        <HarmonicPaletteGenerator onColorsGenerated={(h) => setHarmonicHexes(h)} />
      )}

      {/* Export Modal */}
      <PaletteExportModal
        isOpen={isExportOpen}
        onClose={() => setIsExportOpen(false)}
        colors={currentColors}
      />
    </div>
  );
};

export default ColorPaletteTool;
