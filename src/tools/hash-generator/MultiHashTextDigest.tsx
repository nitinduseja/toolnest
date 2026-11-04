import React from 'react';
import { Copy, Check } from 'lucide-react';

export interface HashResultItem {
  id: string;
  name: string;
  bits: string;
  value: string;
}

interface MultiHashTextDigestProps {
  textInput: string;
  setTextInput: (val: string) => void;
  textLoading: boolean;
  hashItems: HashResultItem[];
  formatHash: (val: string) => string;
  handleCopyHash: (id: string, val: string) => void;
  copiedId: string | null;
}

export const MultiHashTextDigest: React.FC<MultiHashTextDigestProps> = ({
  textInput,
  setTextInput,
  textLoading,
  hashItems,
  formatHash,
  handleCopyHash,
  copiedId,
}) => {
  return (
    <div className="space-y-4">
      <div className="space-y-2">
        <div className="flex items-center justify-between text-xs text-outline px-1">
          <label htmlFor="hash-input" className="font-medium text-on-surface">
            Input Plaintext ({textInput.length} characters)
          </label>
          <button
            type="button"
            onClick={() => setTextInput('')}
            className="hover:text-red-500 transition-colors"
          >
            Clear
          </button>
        </div>
        <textarea
          id="hash-input"
          value={textInput}
          onChange={(e) => setTextInput(e.target.value)}
          placeholder="Type or paste text to compute digests in real-time..."
          className="w-full h-28 p-3.5 rounded-xl bg-surface-container-low border border-outline-variant font-mono text-xs text-on-surface placeholder:text-outline focus:outline-none focus:ring-2 focus:ring-primary-container resize-y"
        />
      </div>

      <div className="space-y-2.5">
        <span className="text-xs font-semibold text-on-surface-variant uppercase tracking-wider px-1">
          Available Digests {textLoading && '(computing...)'}
        </span>

        <div className="grid grid-cols-1 gap-2.5">
          {hashItems.map((item) => {
            const formatted = formatHash(item.value);
            const isCopied = copiedId === item.id;
            return (
              <div
                key={item.id}
                className="p-3 rounded-xl bg-surface-container-low border border-outline-variant space-y-1.5 hover:border-outline transition-colors"
              >
                <div className="flex items-center justify-between gap-2">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-bold text-on-surface">{item.name}</span>
                    <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-surface-container-high text-on-surface-variant">
                      {item.bits}
                    </span>
                  </div>
                  <button
                    type="button"
                    onClick={() => handleCopyHash(item.id, item.value)}
                    disabled={!item.value}
                    className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-surface-container-high hover:bg-surface-container-highest text-on-surface text-xs font-medium transition-colors disabled:opacity-40"
                  >
                    {isCopied ? (
                      <Check className="w-3.5 h-3.5 text-green-500" />
                    ) : (
                      <Copy className="w-3.5 h-3.5" />
                    )}
                    <span>{isCopied ? 'Copied' : 'Copy'}</span>
                  </button>
                </div>

                <div className="p-2.5 rounded-lg bg-surface-container-lowest font-mono text-xs text-on-surface break-all select-all">
                  {formatted || <span className="text-outline italic">No input provided</span>}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
