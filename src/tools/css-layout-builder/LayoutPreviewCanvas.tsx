import React, { CSSProperties } from 'react';
import { Plus, Minus } from 'lucide-react';
import { LayoutMode, FlexConfig, GridConfig, LayoutItem } from './types';

interface LayoutPreviewCanvasProps {
  mode: LayoutMode;
  flexConfig: FlexConfig;
  gridConfig: GridConfig;
  items: LayoutItem[];
  onAddItem: () => void;
  onRemoveItem: () => void;
}

export const LayoutPreviewCanvas: React.FC<LayoutPreviewCanvasProps> = ({
  mode,
  flexConfig,
  gridConfig,
  items,
  onAddItem,
  onRemoveItem,
}) => {
  const getContainerStyle = (): CSSProperties => {
    if (mode === 'flex') {
      return {
        display: 'flex',
        flexDirection: flexConfig.direction,
        justifyContent: flexConfig.justifyContent,
        alignItems: flexConfig.alignItems,
        flexWrap: flexConfig.wrap,
        gap: `${flexConfig.gap}px`,
      };
    }
    return {
      display: 'grid',
      gridTemplateColumns: `repeat(${gridConfig.columns}, minmax(0, 1fr))`,
      gap: `${gridConfig.gap}px`,
      justifyItems: gridConfig.justifyItems,
      alignItems: gridConfig.alignItems,
    };
  };

  return (
    <div className="p-4 sm:p-5 rounded-2xl bg-surface-container-low border border-outline-variant/60 space-y-3">
      {/* Canvas Toolbar */}
      <div className="flex items-center justify-between text-xs">
        <span className="font-bold text-on-surface uppercase tracking-wider">
          Canvas ({items.length} items)
        </span>
        <div className="flex items-center gap-1.5">
          <button
            type="button"
            disabled={items.length <= 1}
            onClick={onRemoveItem}
            className="p-1 rounded-lg border border-outline-variant/60 bg-surface-container hover:bg-surface-container-high disabled:opacity-40 text-outline hover:text-error transition-all"
            title="Remove item"
          >
            <Minus className="w-3.5 h-3.5" />
          </button>
          <button
            type="button"
            disabled={items.length >= 16}
            onClick={onAddItem}
            className="flex items-center gap-1 px-2.5 py-1 text-xs font-semibold rounded-lg bg-primary text-white hover:bg-primary/90 transition-all shadow-xs"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Add Item</span>
          </button>
        </div>
      </div>

      {/* Styled Layout Stage */}
      <div className="p-4 rounded-2xl bg-surface-container border border-outline-variant/60 min-h-[360px] overflow-auto">
        <div
          data-testid="layout-container"
          style={getContainerStyle()}
          className="w-full min-h-[320px] p-4 rounded-xl border border-dashed border-outline-variant/80 bg-surface-container-highest/20 transition-all duration-200"
        >
          {items.map((item, idx) => (
            <div
              key={item.id}
              className="p-4 rounded-xl bg-surface-container-low border border-outline-variant/60 text-on-surface shadow-xs flex flex-col items-center justify-center min-w-[70px] min-h-[70px] transition-all hover:border-primary/60 group"
            >
              <span className="font-bold font-mono text-sm text-primary">#{idx + 1}</span>
              <span className="text-[11px] text-outline mt-0.5">{item.label}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
