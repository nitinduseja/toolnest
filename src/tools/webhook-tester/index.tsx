import React, { useState, useEffect } from 'react';
import { Send, Sparkles, RefreshCw } from 'lucide-react';
import { WebhookProvider, WebhookSignatureResult } from './types';
import { WEBHOOK_TEMPLATES } from './webhookTemplates';
import { generateProviderSignature } from './webhookLogic';
import { WebhookHeadersView } from './WebhookHeadersView';

export const WebhookTesterTool: React.FC = () => {
  const [provider, setProvider] = useState<WebhookProvider>('github');
  const [secret, setSecret] = useState<string>('whsec_my_super_secret_key_123');
  const [showSecret, setShowSecret] = useState<boolean>(false);
  const [targetUrl, setTargetUrl] = useState<string>('https://httpbin.org/post');
  const [payload, setPayload] = useState<string>(WEBHOOK_TEMPLATES[0].payload);
  const [signatureResult, setSignatureResult] = useState<WebhookSignatureResult | null>(null);
  const [isSending, setIsSending] = useState<boolean>(false);
  const [sendResult, setSendResult] = useState<{ status: number; text: string } | null>(null);

  useEffect(() => {
    let isCancelled = false;
    generateProviderSignature({
      provider,
      payload,
      secret,
    }).then((res) => {
      if (!isCancelled) setSignatureResult(res);
    });
    return () => {
      isCancelled = true;
    };
  }, [provider, payload, secret]);

  const handleApplyTemplate = (templateId: string) => {
    const tmpl = WEBHOOK_TEMPLATES.find((t) => t.id === templateId);
    if (tmpl) {
      setProvider(tmpl.provider);
      setPayload(tmpl.payload);
      setSendResult(null);
    }
  };

  const handleSendTest = async () => {
    if (!signatureResult || !targetUrl) return;
    setIsSending(true);
    setSendResult(null);
    try {
      const headers: Record<string, string> = {
        'Content-Type': 'application/json',
        [signatureResult.headerName]: signatureResult.headerValue,
      };
      const res = await fetch(targetUrl, {
        method: 'POST',
        headers,
        body: payload,
      });
      const text = await res.text();
      setSendResult({ status: res.status, text: text.slice(0, 1000) });
    } catch (err) {
      setSendResult({
        status: 0,
        text:
          err instanceof Error
            ? err.message
            : 'Network / CORS error. Use cURL for direct localhost calls.',
      });
    } finally {
      setIsSending(false);
    }
  };

  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      {/* Top Banner */}
      <div className="p-4 rounded-2xl bg-surface-container-low border border-outline-variant flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-base font-bold text-on-surface">
              Webhook Payload Generator &amp; Signer
            </h2>
            <span className="px-2 py-0.5 rounded-full text-[10px] font-semibold bg-primary/10 text-primary border border-primary/20">
              Studio Tool
            </span>
          </div>
          <p className="text-xs text-outline mt-0.5">
            Craft simulated webhooks, compute provider HMAC-SHA256 signatures, and inspect
            verification headers.
          </p>
        </div>

        {/* Template Buttons */}
        <div className="flex flex-wrap items-center gap-1.5">
          <span className="text-xs text-outline font-medium mr-1 flex items-center gap-1">
            <Sparkles className="w-3.5 h-3.5 text-primary" />
            Events:
          </span>
          {WEBHOOK_TEMPLATES.map((tmpl) => (
            <button
              key={tmpl.id}
              type="button"
              onClick={() => handleApplyTemplate(tmpl.id)}
              className="px-2.5 py-1 rounded-lg text-xs font-medium bg-surface hover:bg-surface-container border border-outline-variant text-on-surface transition-colors cursor-pointer"
            >
              {tmpl.name}
            </button>
          ))}
        </div>
      </div>

      {/* Configuration Inputs */}
      <div className="p-4 rounded-2xl bg-surface-container-low border border-outline-variant space-y-4">
        <h3 className="text-xs font-bold uppercase tracking-wider text-outline">
          Signing Parameters
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
          {/* Provider */}
          <div>
            <label className="text-outline text-[11px] font-medium">Provider Format</label>
            <select
              value={provider}
              onChange={(e) => setProvider(e.target.value as WebhookProvider)}
              className="w-full mt-1 px-3 py-2 rounded-xl bg-surface border border-outline-variant text-on-surface"
            >
              <option value="github">GitHub (sha256=hex)</option>
              <option value="stripe">Stripe (t=ts,v1=hex)</option>
              <option value="shopify">Shopify (base64)</option>
              <option value="slack">Slack (v0=hex)</option>
              <option value="custom">Generic (raw hex)</option>
            </select>
          </div>

          {/* Secret Key */}
          <div>
            <label className="text-outline text-[11px] font-medium flex items-center justify-between">
              <span>Webhook Secret</span>
              <button
                type="button"
                onClick={() => setShowSecret(!showSecret)}
                className="text-primary hover:underline text-[10px] cursor-pointer"
              >
                {showSecret ? 'Hide' : 'Show'}
              </button>
            </label>
            <div className="relative mt-1">
              <input
                type={showSecret ? 'text' : 'password'}
                value={secret}
                onChange={(e) => setSecret(e.target.value)}
                className="w-full px-3 py-2 rounded-xl bg-surface border border-outline-variant text-on-surface font-mono"
              />
            </div>
          </div>

          {/* Target URL */}
          <div>
            <label className="text-outline text-[11px] font-medium">Target URL Endpoint</label>
            <input
              type="url"
              value={targetUrl}
              onChange={(e) => setTargetUrl(e.target.value)}
              className="w-full mt-1 px-3 py-2 rounded-xl bg-surface border border-outline-variant text-on-surface font-mono"
            />
          </div>
        </div>
      </div>

      {/* Payload Editor */}
      <div className="space-y-1.5">
        <label className="text-xs font-semibold text-outline px-1">
          JSON WEBHOOK PAYLOAD (BODY)
        </label>
        <textarea
          rows={10}
          value={payload}
          onChange={(e) => setPayload(e.target.value)}
          placeholder="Paste JSON webhook payload..."
          className="w-full p-3.5 rounded-xl bg-surface-container-low border border-outline-variant text-xs font-mono text-on-surface focus:outline-hidden focus:border-primary"
        />
      </div>

      {/* Signature & Header View */}
      <WebhookHeadersView
        signatureResult={signatureResult}
        targetUrl={targetUrl}
        payload={payload}
      />

      {/* Direct Test Dispatcher */}
      <div className="p-4 rounded-2xl bg-surface-container-low border border-outline-variant space-y-3">
        <div className="flex items-center justify-between">
          <div className="text-xs font-bold uppercase tracking-wider text-outline">
            Test Dispatch
          </div>
          <button
            type="button"
            onClick={handleSendTest}
            disabled={isSending}
            className="flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-semibold bg-primary text-on-primary hover:opacity-90 transition-opacity cursor-pointer shadow-xs disabled:opacity-50"
          >
            {isSending ? (
              <RefreshCw className="w-3.5 h-3.5 animate-spin" />
            ) : (
              <Send className="w-3.5 h-3.5" />
            )}
            <span>{isSending ? 'Sending Webhook...' : 'Send Test Webhook'}</span>
          </button>
        </div>

        {sendResult && (
          <div className="p-3 rounded-xl bg-surface border border-outline-variant space-y-1 text-xs">
            <div className="flex items-center gap-2">
              <span className="font-semibold text-on-surface">Response:</span>
              <span
                className={`font-mono font-bold ${
                  sendResult.status >= 200 && sendResult.status < 300
                    ? 'text-emerald-500'
                    : 'text-amber-500'
                }`}
              >
                Status {sendResult.status || 'Client Error'}
              </span>
            </div>
            <pre className="p-2.5 rounded-lg bg-surface-container-lowest text-[11px] font-mono text-on-surface overflow-x-auto max-h-40">
              <code>{sendResult.text}</code>
            </pre>
          </div>
        )}
      </div>
    </div>
  );
};

export default WebhookTesterTool;
