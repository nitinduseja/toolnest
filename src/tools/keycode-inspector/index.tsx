import React, { useState, useEffect, useCallback } from 'react';
import { Keyboard, Code, Copy, Check, ShieldAlert, RotateCcw } from 'lucide-react';
import { KeyEventRecord } from './types';
import { parseKeyboardEvent, getKeyDisplay } from './keycodeLogic';
import { KeyHistoryList } from './KeyHistoryList';
import { KeySnippetModal } from './KeySnippetModal';
import { VirtualKeyPad } from './VirtualKeyPad';
import { copyToClipboard } from '@/lib/clipboard';

const DEFAULT_EVENT = parseKeyboardEvent({
  key: 'Enter',
  code: 'Enter',
  keyCode: 13,
  which: 13,
  location: 0,
  ctrlKey: false,
  altKey: false,
  shiftKey: false,
  metaKey: false,
  repeat: false,
});

export const KeycodeInspectorTool: React.FC = () => {
  const [currentEvent, setCurrentEvent] = useState<KeyEventRecord>(DEFAULT_EVENT);
  const [history, setHistory] = useState<KeyEventRecord[]>([DEFAULT_EVENT]);
  const [showModal, setShowModal] = useState(false);
  const [copiedField, setCopiedField] = useState<string | null>(null);
  const [interceptMode, setInterceptMode] = useState(false);

  const handleKeyDown = useCallback(
    (e: KeyboardEvent) => {
      if (interceptMode) {
        e.preventDefault();
      }
      const parsed = parseKeyboardEvent(e);
      setCurrentEvent(parsed);
      setHistory((prev) => [parsed, ...prev.filter((p) => p.code !== parsed.code).slice(0, 19)]);
    },
    [interceptMode]
  );

  useEffect(() => {
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [handleKeyDown]);

  const handleCopy = async (field: string, text: string) => {
    const ok = await copyToClipboard(text);
    if (ok) {
      setCopiedField(field);
      setTimeout(() => setCopiedField(null), 1500);
    }
  };

  const handleSimulate = (record: KeyEventRecord) => {
    setCurrentEvent(record);
    setHistory((prev) => [record, ...prev.filter((p) => p.code !== record.code).slice(0, 19)]);
  };

  const keyDisplay = getKeyDisplay(currentEvent.key);

  return (
    <div className="space-y-6 max-w-5xl mx-auto pb-12">
      {/* Banner */}
      <div className="p-4 sm:p-5 rounded-2xl bg-surface-container-low border border-outline-variant/60 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="p-2.5 rounded-xl bg-primary/10 text-primary">
            <Keyboard className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-base font-bold text-on-surface">
              Keycode & Keyboard Event Inspector
            </h2>
            <p className="text-xs text-outline mt-0.5">
              Press any key on your keyboard to instantly inspect key codes, event properties, and
              modifiers.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => setInterceptMode(!interceptMode)}
            className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-xl border transition-all ${
              interceptMode
                ? 'bg-amber-500/10 border-amber-500/40 text-amber-500'
                : 'border-outline-variant hover:bg-surface-container text-outline'
            }`}
            title="Prevent default browser actions (e.g. Tab, Space scroll, F5)"
          >
            <ShieldAlert className="w-3.5 h-3.5" />
            <span>Intercept: {interceptMode ? 'ON' : 'OFF'}</span>
          </button>

          <button
            type="button"
            onClick={() => setShowModal(true)}
            className="flex items-center gap-1.5 px-3.5 py-1.5 text-xs font-bold rounded-xl bg-primary text-white shadow-xs hover:bg-primary/90 transition-all"
          >
            <Code className="w-3.5 h-3.5" />
            <span>Generate Code</span>
          </button>
        </div>
      </div>

      {/* Main Big Key Display */}
      <div className="p-8 sm:p-12 rounded-3xl bg-surface-container-low border border-outline-variant/60 flex flex-col items-center justify-center text-center relative overflow-hidden shadow-xs">
        <div className="absolute top-4 right-4 flex items-center gap-1.5">
          <button
            type="button"
            onClick={() => {
              setCurrentEvent(DEFAULT_EVENT);
              setHistory([DEFAULT_EVENT]);
            }}
            className="p-1.5 text-xs text-outline hover:text-on-surface rounded-lg hover:bg-surface-container transition-colors"
            title="Reset to default"
          >
            <RotateCcw className="w-3.5 h-3.5" />
          </button>
        </div>

        <span className="text-xs uppercase font-bold tracking-widest text-outline mb-2">
          JavaScript keyCode / which
        </span>
        <div
          data-testid="hero-keycode"
          className="text-7xl sm:text-9xl font-black font-mono text-primary tracking-tight transition-transform duration-100"
        >
          {currentEvent.keyCode}
        </div>
        <div
          data-testid="hero-key-display"
          className="mt-3 px-4 py-1.5 rounded-full bg-surface-container border border-outline-variant/60 font-mono text-sm sm:text-base font-semibold text-on-surface"
        >
          {keyDisplay}
        </div>

        {/* Modifiers Pill Strip */}
        <div className="flex flex-wrap items-center justify-center gap-2 mt-6">
          {[
            { label: 'Control', active: currentEvent.ctrlKey },
            { label: 'Alt / Option', active: currentEvent.altKey },
            { label: 'Shift', active: currentEvent.shiftKey },
            { label: 'Meta / Cmd', active: currentEvent.metaKey },
            { label: 'Repeat', active: currentEvent.repeat },
          ].map((mod) => (
            <span
              key={mod.label}
              className={`px-3 py-1 rounded-xl text-xs font-semibold border transition-all ${
                mod.active
                  ? 'bg-primary text-white border-primary shadow-xs font-bold'
                  : 'bg-surface-container/50 border-outline-variant/40 text-outline/60'
              }`}
            >
              {mod.label}
            </span>
          ))}
        </div>
      </div>

      {/* Detailed Properties Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { key: 'event.key', label: 'event.key', val: currentEvent.key },
          { key: 'event.code', label: 'event.code', val: currentEvent.code },
          { key: 'event.which', label: 'event.which', val: String(currentEvent.which) },
          { key: 'event.location', label: 'location', val: currentEvent.locationName },
        ].map((item) => (
          <div
            key={item.key}
            className="p-4 rounded-2xl bg-surface-container-low border border-outline-variant/60 flex flex-col justify-between gap-3"
          >
            <div>
              <span className="text-xs font-medium text-outline uppercase">{item.label}</span>
              <p className="text-base font-bold font-mono text-on-surface truncate mt-1">
                {item.val || '""'}
              </p>
            </div>
            <button
              type="button"
              onClick={() => handleCopy(item.key, item.val)}
              className="flex items-center justify-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-xl border border-outline-variant/60 bg-surface-container hover:bg-surface-container-high text-on-surface transition-all"
            >
              {copiedField === item.key ? (
                <>
                  <Check className="w-3.5 h-3.5 text-emerald-500" />
                  <span className="text-emerald-500">Copied</span>
                </>
              ) : (
                <>
                  <Copy className="w-3.5 h-3.5" />
                  <span>Copy</span>
                </>
              )}
            </button>
          </div>
        ))}
      </div>

      {/* Virtual Simulation Keypad */}
      <VirtualKeyPad onSimulate={handleSimulate} />

      {/* History Drawer / List */}
      <KeyHistoryList
        history={history}
        activeId={currentEvent.id}
        onSelect={setCurrentEvent}
        onClear={() => setHistory([])}
      />

      {/* Snippet Modal */}
      {showModal && <KeySnippetModal event={currentEvent} onClose={() => setShowModal(false)} />}
    </div>
  );
};

export default KeycodeInspectorTool;
