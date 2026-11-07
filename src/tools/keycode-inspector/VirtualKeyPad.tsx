import React from 'react';
import { Keyboard } from 'lucide-react';
import { KeyEventRecord } from './types';
import { parseKeyboardEvent } from './keycodeLogic';

interface VirtualKeyPadProps {
  onSimulate: (record: KeyEventRecord) => void;
}

const COMMON_KEYS = [
  { label: 'Enter ↵', key: 'Enter', code: 'Enter', keyCode: 13, which: 13 },
  { label: 'Space ␣', key: ' ', code: 'Space', keyCode: 32, which: 32 },
  { label: 'Esc', key: 'Escape', code: 'Escape', keyCode: 27, which: 27 },
  { label: 'Backspace ⌫', key: 'Backspace', code: 'Backspace', keyCode: 8, which: 8 },
  { label: 'Tab ⇥', key: 'Tab', code: 'Tab', keyCode: 9, which: 9 },
  { label: 'Shift ⇧', key: 'Shift', code: 'ShiftLeft', keyCode: 16, which: 16, location: 1 },
  { label: 'Ctrl ⌃', key: 'Control', code: 'ControlLeft', keyCode: 17, which: 17, location: 1 },
  { label: 'Alt ⌥', key: 'Alt', code: 'AltLeft', keyCode: 18, which: 18, location: 1 },
  { label: 'Arrow Up ↑', key: 'ArrowUp', code: 'ArrowUp', keyCode: 38, which: 38 },
  { label: 'Arrow Down ↓', key: 'ArrowDown', code: 'ArrowDown', keyCode: 40, which: 40 },
  { label: 'Key A', key: 'a', code: 'KeyA', keyCode: 65, which: 65 },
  { label: 'Key 1', key: '1', code: 'Digit1', keyCode: 49, which: 49 },
];

export const VirtualKeyPad: React.FC<VirtualKeyPadProps> = ({ onSimulate }) => {
  const handleClick = (item: (typeof COMMON_KEYS)[0]) => {
    const record = parseKeyboardEvent({
      key: item.key,
      code: item.code,
      keyCode: item.keyCode,
      which: item.which,
      location: item.location ?? 0,
      ctrlKey: item.key === 'Control',
      altKey: item.key === 'Alt',
      shiftKey: item.key === 'Shift',
      metaKey: false,
      repeat: false,
    });
    onSimulate(record);
  };

  return (
    <div className="p-4 rounded-2xl bg-surface-container-low border border-outline-variant/60 space-y-3">
      <div className="flex items-center gap-2 text-xs font-bold text-on-surface uppercase tracking-wider">
        <Keyboard className="w-3.5 h-3.5 text-primary" />
        <span>Quick Test Keys (Simulate)</span>
      </div>

      <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 gap-2">
        {COMMON_KEYS.map((k) => (
          <button
            key={k.code}
            type="button"
            onClick={() => handleClick(k)}
            className="px-2.5 py-2 text-xs font-mono font-medium rounded-xl border border-outline-variant/60 bg-surface-container hover:bg-surface-container-high hover:border-primary/50 text-on-surface transition-all text-center truncate active:scale-95"
          >
            {k.label}
          </button>
        ))}
      </div>
    </div>
  );
};
