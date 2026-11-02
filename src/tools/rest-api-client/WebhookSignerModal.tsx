import React, { useState } from 'react';
import { ShieldCheck, X, KeyRound, Check } from 'lucide-react';
import { WebhookProvider, generateWebhookSignature } from './webhookLogic';
import { KeyValueItem } from './types';

export interface WebhookSignerModalProps {
  isOpen: boolean;
  payload: string;
  headers: KeyValueItem[];
  onClose: () => void;
  onApplyHeader: (newHeaders: KeyValueItem[]) => void;
}

const PROVIDERS: { id: WebhookProvider; label: string; header: string }[] = [
  { id: 'github', label: 'GitHub (X-Hub-Signature-256)', header: 'X-Hub-Signature-256' },
  { id: 'stripe', label: 'Stripe (Stripe-Signature)', header: 'Stripe-Signature' },
  { id: 'shopify', label: 'Shopify (X-Shopify-Hmac-Sha256)', header: 'X-Shopify-Hmac-Sha256' },
  { id: 'slack', label: 'Slack (X-Slack-Signature)', header: 'X-Slack-Signature' },
  { id: 'custom', label: 'Custom SHA256', header: 'X-Signature-SHA256' },
];

export const WebhookSignerModal: React.FC<WebhookSignerModalProps> = ({
  isOpen,
  payload,
  headers,
  onClose,
  onApplyHeader,
}) => {
  const [provider, setProvider] = useState<WebhookProvider>('github');
  const [secret, setSecret] = useState<string>('');
  const [isGenerating, setIsGenerating] = useState<boolean>(false);

  if (!isOpen) return null;

  const handleSign = async () => {
    if (!secret.trim()) return;
    setIsGenerating(true);
    try {
      const res = await generateWebhookSignature(provider, secret.trim(), payload || '');
      const existingIdx = headers.findIndex(
        (h) => h.key.toLowerCase() === res.headerName.toLowerCase()
      );

      let nextHeaders: KeyValueItem[];
      if (existingIdx > -1) {
        nextHeaders = headers.map((h, i) =>
          i === existingIdx ? { ...h, value: res.headerValue, enabled: true } : h
        );
      } else {
        nextHeaders = [
          ...headers,
          { id: `h_sig_${Date.now()}`, key: res.headerName, value: res.headerValue, enabled: true },
        ];
      }
      onApplyHeader(nextHeaders);
      onClose();
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
      <div className="w-full max-w-md rounded-2xl bg-surface-container-low border border-outline-variant overflow-hidden shadow-2xl flex flex-col">
        {/* Header */}
        <div className="p-4 border-b border-outline-variant flex items-center justify-between">
          <div className="flex items-center gap-2">
            <ShieldCheck className="w-5 h-5 text-emerald-500" />
            <span className="text-sm font-semibold text-on-surface">
              Sign Webhook Payload (HMAC)
            </span>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-1.5 rounded-lg hover:bg-surface-container text-on-surface-variant hover:text-on-surface"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Content */}
        <div className="p-4 space-y-3 text-xs">
          <div>
            <label className="block text-outline font-semibold mb-1">Webhook Provider</label>
            <select
              value={provider}
              onChange={(e) => setProvider(e.target.value as WebhookProvider)}
              className="w-full p-2 rounded-lg bg-surface-container border border-outline-variant text-on-surface focus:outline-hidden"
            >
              {PROVIDERS.map((p) => (
                <option key={p.id} value={p.id}>
                  {p.label}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-outline font-semibold mb-1">Webhook Secret</label>
            <div className="flex items-center gap-2 p-2 rounded-lg bg-surface-container border border-outline-variant">
              <KeyRound className="w-4 h-4 text-primary shrink-0" />
              <input
                type="password"
                value={secret}
                onChange={(e) => setSecret(e.target.value)}
                placeholder="whsec_..."
                className="w-full bg-transparent font-mono text-on-surface focus:outline-hidden"
              />
            </div>
            <p className="text-[11px] text-outline mt-1">
              Secret is processed purely in your browser via Web Crypto API. Never transmitted.
            </p>
          </div>
        </div>

        {/* Footer */}
        <div className="p-3 bg-surface-container-lowest border-t border-outline-variant flex items-center justify-end gap-2">
          <button
            type="button"
            onClick={onClose}
            className="px-3 py-1.5 rounded-lg text-xs font-semibold text-on-surface hover:bg-surface-container"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={handleSign}
            disabled={!secret.trim() || isGenerating}
            className="flex items-center gap-1.5 px-4 py-2 rounded-lg bg-primary text-on-primary hover:bg-primary/90 text-xs font-semibold shadow-xs disabled:opacity-40"
          >
            <Check className="w-3.5 h-3.5" />
            <span>Calculate & Apply Header</span>
          </button>
        </div>
      </div>
    </div>
  );
};
