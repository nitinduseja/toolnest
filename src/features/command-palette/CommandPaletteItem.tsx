import React from 'react';
import { Command } from 'cmdk';
import { CornerDownLeft, ChevronRight, ArrowRight } from 'lucide-react';
import { Icon } from '@/components/atoms/Icon';
import { ToolDefinition, CategoryDefinition } from '@/registry/types';

export const ITEM_SELECTION_CLASSES =
  'flex items-center justify-between px-3.5 py-2.5 rounded-xl cursor-pointer transition-all duration-100 ' +
  'text-on-surface hover:bg-surface-container-high ' +
  'aria-selected:bg-primary-container aria-selected:text-on-primary-container aria-selected:font-semibold aria-selected:shadow-sm ' +
  'data-[selected=true]:bg-primary-container data-[selected=true]:text-on-primary-container data-[selected=true]:font-semibold data-[selected=true]:shadow-sm';

interface ToolItemProps {
  tool: ToolDefinition;
  prefix?: 'tool' | 'recent';
  onSelect: () => void;
}

export const PaletteToolItem: React.FC<ToolItemProps> = ({ tool, prefix = 'tool', onSelect }) => {
  return (
    <Command.Item
      value={`${prefix}: ${tool.name} ${tool.keywords.join(' ')}`}
      onSelect={onSelect}
      className={ITEM_SELECTION_CLASSES}
    >
      <div className="flex items-center gap-3 min-w-0">
        <div className="w-8 h-8 rounded-lg bg-surface-container-high flex items-center justify-center text-primary shrink-0">
          <Icon name={tool.iconName} className="w-4 h-4" />
        </div>
        <div className="min-w-0">
          <p className="text-xs sm:text-sm font-medium truncate">{tool.name}</p>
          <p className="text-[11px] text-on-surface-variant truncate opacity-80">
            {tool.description}
          </p>
        </div>
      </div>

      <div className="flex items-center gap-2 shrink-0 ml-3">
        <span className="text-[10px] font-mono px-2 py-0.5 rounded-md bg-surface-container border border-outline-variant/50 text-on-surface-variant uppercase">
          {tool.category}
        </span>
        <CornerDownLeft className="w-3.5 h-3.5 opacity-60" />
      </div>
    </Command.Item>
  );
};

interface CategoryItemProps {
  category: CategoryDefinition;
  onSelect: () => void;
}

export const PaletteCategoryItem: React.FC<CategoryItemProps> = ({ category, onSelect }) => {
  return (
    <Command.Item
      value={`category: ${category.name}`}
      onSelect={onSelect}
      className={ITEM_SELECTION_CLASSES}
    >
      <div className="flex items-center gap-3">
        <div className="w-8 h-8 rounded-lg bg-surface-container-high flex items-center justify-center text-primary shrink-0">
          <Icon name={category.iconName} className="w-4 h-4" />
        </div>
        <div>
          <p className="text-xs sm:text-sm font-medium">{category.name}</p>
          <p className="text-[11px] text-on-surface-variant line-clamp-1">{category.description}</p>
        </div>
      </div>
      <ChevronRight className="w-4 h-4 opacity-60 shrink-0" />
    </Command.Item>
  );
};

interface ActionItemProps {
  label: string;
  value: string;
  onSelect: () => void;
}

export const PaletteActionItem: React.FC<ActionItemProps> = ({ label, value, onSelect }) => {
  return (
    <Command.Item value={value} onSelect={onSelect} className={ITEM_SELECTION_CLASSES}>
      <span className="text-xs sm:text-sm">{label}</span>
      <ArrowRight className="w-3.5 h-3.5 opacity-60 shrink-0" />
    </Command.Item>
  );
};
