import React from 'react';
import { Smartphone, Monitor, Bot } from 'lucide-react';
import { UaPreset } from './types';
import { UA_PRESETS } from './uaParserLogic';

interface UaPresetsBarProps {
  onSelectPreset: (preset: UaPreset) => void;
  activeId?: string;
}

export const UaPresetsBar: React.FC<UaPresetsBarProps> = ({ onSelectPreset, activeId }) => {
  const getIcon = (category: string) => {
    switch (category) {
      case 'Mobile':
        return <Smartphone className="w-3.5 h-3.5 text-primary" />;
      case 'Bot':
        return <Bot className="w-3.5 h-3.5 text-amber-500" />;
      default:
        return <Monitor className="w-3.5 h-3.5 text-primary" />;
    }
  };

  return (
    <div className="flex flex-wrap items-center gap-2">
      <span className="text-xs font-semibold text-outline mr-1">Presets:</span>
      {UA_PRESETS.map((preset) => (
        <button
          key={preset.id}
          type="button"
          onClick={() => onSelectPreset(preset)}
          className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-xl border transition-all ${
            activeId === preset.id
              ? 'bg-primary text-white border-primary shadow-xs'
              : 'bg-surface-container-low hover:bg-surface-container border-outline-variant/60 text-on-surface'
          }`}
        >
          {getIcon(preset.category)}
          <span>{preset.name}</span>
        </button>
      ))}
    </div>
  );
};
