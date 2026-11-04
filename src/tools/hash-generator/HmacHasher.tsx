import React, { useState } from 'react';
import { Copy, Check } from 'lucide-react';
import { copyToClipboard } from '@/lib/clipboard';

interface HmacHasherProps {
  hmacKey: string;
  setHmacKey: (val: string) => void;
  hmacMessage: string;
  setHmacMessage: (val: string) => void;
  hmacAlgo: 'SHA-256' | 'SHA-512';
  setHmacAlgo: (algo: 'SHA-256' | 'SHA-512') => void;
  hmacResult: string;
  formatHash: (val: string) => string;
}

export const HmacHasher: React.FC<HmacHasherProps> = ({
  hmacKey,
  setHmacKey,
  hmacMessage,
  setHmacMessage,
  hmacAlgo,
  setHmacAlgo,
  hmacResult,
  formatHash,
}) => {
  const [hmacCopied, setHmacCopied] = useState(false);

  const handleCopy = async () => {
    if (!hmacResult) return;
    const ok = await copyToClipboard(formatHash(hmacResult));
    if (ok) {
      setHmacCopied(true);
      setTimeout(() => setHmacCopied(false), 2000);
    }
  };

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        <div className="space-y-1.5">
          <label htmlFor="hmac-key" className="text-xs font-medium text-on-surface">
            Secret Key
          </label>
          <input
            id="hmac-key"
            type="text"
            value={hmacKey}
            onChange={(e) => setHmacKey(e.target.value)}
            placeholder="Enter secret key (e.g. my-secure-salt)..."
            className="w-full px-3 py-2 rounded-xl bg-surface-container-low border border-outline-variant font-mono text-xs text-on-surface placeholder:text-outline focus:outline-none focus:ring-2 focus:ring-primary-container"
          />
        </div>

        <div className="space-y-1.5">
          <label htmlFor="hmac-algo" className="text-xs font-medium text-on-surface">
            HMAC Algorithm
          </label>
          <select
            id="hmac-algo"
            value={hmacAlgo}
            onChange={(e) => setHmacAlgo(e.target.value as 'SHA-256' | 'SHA-512')}
            className="w-full px-3 py-2 rounded-xl bg-surface-container-low border border-outline-variant font-medium text-xs text-on-surface focus:outline-none focus:ring-2 focus:ring-primary-container"
          >
            <option value="SHA-256">HMAC-SHA256 (Standard)</option>
            <option value="SHA-512">HMAC-SHA512 (Extended)</option>
          </select>
        </div>
      </div>

      <div className="space-y-1.5">
        <label htmlFor="hmac-msg" className="text-xs font-medium text-on-surface">
          Message Payload
        </label>
        <textarea
          id="hmac-msg"
          value={hmacMessage}
          onChange={(e) => setHmacMessage(e.target.value)}
          placeholder="Enter message to authenticate..."
          className="w-full h-28 p-3 rounded-xl bg-surface-container-low border border-outline-variant font-mono text-xs text-on-surface placeholder:text-outline focus:outline-none focus:ring-2 focus:ring-primary-container resize-y"
        />
      </div>

      <div className="p-4 rounded-xl bg-surface-container-low border border-outline-variant space-y-2.5">
        <div className="flex items-center justify-between">
          <span className="text-xs font-bold text-on-surface">HMAC Signature</span>
          <button
            type="button"
            onClick={handleCopy}
            disabled={!hmacResult}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-primary-container text-on-primary-container text-xs font-semibold hover:opacity-95 transition-opacity disabled:opacity-40"
          >
            {hmacCopied ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
            <span>{hmacCopied ? 'Copied' : 'Copy HMAC'}</span>
          </button>
        </div>
        <div className="p-3 rounded-lg bg-surface-container-lowest font-mono text-xs text-on-surface break-all select-all">
          {formatHash(hmacResult) || (
            <span className="text-outline italic">
              Enter secret key and message to generate HMAC
            </span>
          )}
        </div>
      </div>
    </div>
  );
};
