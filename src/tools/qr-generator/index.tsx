import React, { useState, useEffect } from 'react';
import {
  Download,
  AlertTriangle,
  Wifi,
  User,
  Mail,
  Link as LinkIcon,
  Copy,
  Check,
} from 'lucide-react';
import {
  generateQrDataUrl,
  generateQrSvg,
  buildWifiPayload,
  buildVCardPayload,
  buildEmailPayload,
  QrErrorCorrectionLevel,
} from './qrLogic';
import { copyToClipboard } from '@/lib/clipboard';
import { downloadFile } from '@/lib/downloads';

type QrTemplate = 'text' | 'wifi' | 'vcard' | 'email';

export const QrGeneratorTool: React.FC = () => {
  const [template, setTemplate] = useState<QrTemplate>('text');

  // Text / Raw
  const [text, setText] = useState('https://toolnest.netlify.app');

  // Wi-Fi template state
  const [wifiSsid, setWifiSsid] = useState('');
  const [wifiPassword, setWifiPassword] = useState('');
  const [wifiEncryption, setWifiEncryption] = useState<'WPA' | 'WEP' | 'nopass'>('WPA');
  const [wifiHidden, setWifiHidden] = useState(false);

  // vCard template state
  const [vcardFirst, setVcardFirst] = useState('');
  const [vcardLast, setVcardLast] = useState('');
  const [vcardOrg, setVcardOrg] = useState('');
  const [vcardPhone, setVcardPhone] = useState('');
  const [vcardEmail, setVcardEmail] = useState('');

  // Email template state
  const [emailTo, setEmailTo] = useState('');
  const [emailSubject, setEmailSubject] = useState('');
  const [emailBody, setEmailBody] = useState('');

  // QR Config
  const [size, setSize] = useState(300);
  const [margin, setMargin] = useState(2);
  const [ecc, setEcc] = useState<QrErrorCorrectionLevel>('M');
  const [darkColor, setDarkColor] = useState('#000000');
  const [lightColor, setLightColor] = useState('#ffffff');

  // Generated outputs
  const [dataUrl, setDataUrl] = useState('');
  const [svgString, setSvgString] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [copiedSvg, setCopiedSvg] = useState(false);

  // Active payload calculation
  const activePayload = React.useMemo(() => {
    switch (template) {
      case 'wifi':
        return wifiSsid
          ? buildWifiPayload({
              ssid: wifiSsid,
              password: wifiPassword,
              encryption: wifiEncryption,
              hidden: wifiHidden,
            })
          : '';
      case 'vcard':
        return vcardFirst || vcardLast
          ? buildVCardPayload({
              firstName: vcardFirst,
              lastName: vcardLast,
              organization: vcardOrg,
              phone: vcardPhone,
              email: vcardEmail,
            })
          : '';
      case 'email':
        return emailTo ? buildEmailPayload(emailTo, emailSubject, emailBody) : '';
      case 'text':
      default:
        return text;
    }
  }, [
    template,
    text,
    wifiSsid,
    wifiPassword,
    wifiEncryption,
    wifiHidden,
    vcardFirst,
    vcardLast,
    vcardOrg,
    vcardPhone,
    vcardEmail,
    emailTo,
    emailSubject,
    emailBody,
  ]);

  useEffect(() => {
    let cancelled = false;
    if (!activePayload.trim()) {
      setDataUrl('');
      setSvgString('');
      setError(null);
      return;
    }

    Promise.all([
      generateQrDataUrl(activePayload, {
        width: size,
        margin,
        darkColor,
        lightColor,
        errorCorrectionLevel: ecc,
      }),
      generateQrSvg(activePayload, {
        width: size,
        margin,
        darkColor,
        lightColor,
        errorCorrectionLevel: ecc,
      }),
    ])
      .then(([pngUrl, svg]) => {
        if (!cancelled) {
          setDataUrl(pngUrl);
          setSvgString(svg);
          setError(null);
        }
      })
      .catch((err: unknown) => {
        if (!cancelled) {
          setError(err instanceof Error ? err.message : 'QR generation failed');
          setDataUrl('');
          setSvgString('');
        }
      });

    return () => {
      cancelled = true;
    };
  }, [activePayload, size, margin, darkColor, lightColor, ecc]);

  const handleDownloadPng = () => {
    if (!dataUrl) return;
    const link = document.createElement('a');
    link.href = dataUrl;
    link.download = 'qrcode.png';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleDownloadSvg = () => {
    if (!svgString) return;
    downloadFile(svgString, { filename: 'qrcode.svg', mimeType: 'image/svg+xml' });
  };

  const handleCopySvg = async () => {
    if (!svgString) return;
    const ok = await copyToClipboard(svgString);
    if (ok) {
      setCopiedSvg(true);
      setTimeout(() => setCopiedSvg(false), 2000);
    }
  };

  return (
    <div className="space-y-6">
      {/* Template Selector Bar */}
      <div className="flex flex-wrap items-center gap-1.5 p-1 rounded-xl bg-surface-container-low border border-outline-variant">
        {[
          { id: 'text', label: 'URL / Plaintext', icon: LinkIcon },
          { id: 'wifi', label: 'Wi-Fi Network', icon: Wifi },
          { id: 'vcard', label: 'Contact Card (vCard)', icon: User },
          { id: 'email', label: 'Email Draft', icon: Mail },
        ].map((t) => {
          const Icon = t.icon;
          return (
            <button
              key={t.id}
              type="button"
              onClick={() => setTemplate(t.id as QrTemplate)}
              className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors ${
                template === t.id
                  ? 'bg-primary-container text-on-primary-container shadow-xs'
                  : 'text-on-surface-variant hover:text-on-surface hover:bg-surface-container-high'
              }`}
            >
              <Icon className="w-3.5 h-3.5" />
              <span>{t.label}</span>
            </button>
          );
        })}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left 2 Cols: Form Inputs & Styling Controls */}
        <div className="lg:col-span-2 space-y-4">
          {/* Template Input Forms */}
          {template === 'text' && (
            <div className="space-y-2">
              <div className="flex items-center justify-between text-xs text-outline px-1">
                <label htmlFor="qr-input" className="font-medium">
                  URL or Plaintext
                </label>
                <button
                  type="button"
                  onClick={() => setText('')}
                  className="hover:text-red-500 transition-colors"
                >
                  Clear
                </button>
              </div>
              <textarea
                id="qr-input"
                value={text}
                onChange={(e) => setText(e.target.value)}
                placeholder="Enter text or URL to generate QR code..."
                className="w-full h-32 p-4 rounded-xl bg-surface-container-low border border-outline-variant font-mono text-xs text-on-surface placeholder:text-outline focus:outline-none focus:ring-2 focus:ring-primary-container resize-y"
              />
            </div>
          )}

          {template === 'wifi' && (
            <div className="p-4 rounded-xl bg-surface-container-low border border-outline-variant space-y-3">
              <h3 className="text-xs font-semibold uppercase tracking-wider text-outline">
                Wi-Fi Network Credentials
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                <div className="space-y-1">
                  <label className="text-on-surface font-medium">SSID / Network Name</label>
                  <input
                    type="text"
                    value={wifiSsid}
                    onChange={(e) => setWifiSsid(e.target.value)}
                    placeholder="e.g. MyOffice_5G"
                    className="w-full px-3 py-2 rounded-lg bg-surface border border-outline-variant font-medium text-xs text-on-surface focus:outline-none"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-on-surface font-medium">Password</label>
                  <input
                    type="text"
                    value={wifiPassword}
                    onChange={(e) => setWifiPassword(e.target.value)}
                    placeholder="Network password"
                    className="w-full px-3 py-2 rounded-lg bg-surface border border-outline-variant font-medium text-xs text-on-surface focus:outline-none"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-on-surface font-medium">Security</label>
                  <select
                    value={wifiEncryption}
                    onChange={(e) => setWifiEncryption(e.target.value as 'WPA' | 'WEP' | 'nopass')}
                    className="w-full h-9 px-3 rounded-lg bg-surface border border-outline-variant text-xs text-on-surface focus:outline-none"
                  >
                    <option value="WPA">WPA / WPA2 / WPA3</option>
                    <option value="WEP">WEP (Legacy)</option>
                    <option value="nopass">None (Open Network)</option>
                  </select>
                </div>
                <div className="flex items-center pt-5">
                  <label className="flex items-center gap-2 cursor-pointer select-none text-on-surface">
                    <input
                      type="checkbox"
                      checked={wifiHidden}
                      onChange={(e) => setWifiHidden(e.target.checked)}
                      className="rounded border-outline-variant text-primary focus:ring-primary"
                    />
                    <span>Hidden SSID</span>
                  </label>
                </div>
              </div>
            </div>
          )}

          {template === 'vcard' && (
            <div className="p-4 rounded-xl bg-surface-container-low border border-outline-variant space-y-3">
              <h3 className="text-xs font-semibold uppercase tracking-wider text-outline">
                Contact Card Details
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                <div className="space-y-1">
                  <label className="text-on-surface font-medium">First Name</label>
                  <input
                    type="text"
                    value={vcardFirst}
                    onChange={(e) => setVcardFirst(e.target.value)}
                    placeholder="John"
                    className="w-full px-3 py-2 rounded-lg bg-surface border border-outline-variant text-xs text-on-surface focus:outline-none"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-on-surface font-medium">Last Name</label>
                  <input
                    type="text"
                    value={vcardLast}
                    onChange={(e) => setVcardLast(e.target.value)}
                    placeholder="Doe"
                    className="w-full px-3 py-2 rounded-lg bg-surface border border-outline-variant text-xs text-on-surface focus:outline-none"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-on-surface font-medium">Organization</label>
                  <input
                    type="text"
                    value={vcardOrg}
                    onChange={(e) => setVcardOrg(e.target.value)}
                    placeholder="Company or Studio"
                    className="w-full px-3 py-2 rounded-lg bg-surface border border-outline-variant text-xs text-on-surface focus:outline-none"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-on-surface font-medium">Phone</label>
                  <input
                    type="tel"
                    value={vcardPhone}
                    onChange={(e) => setVcardPhone(e.target.value)}
                    placeholder="+1 555-0199"
                    className="w-full px-3 py-2 rounded-lg bg-surface border border-outline-variant text-xs text-on-surface focus:outline-none"
                  />
                </div>
                <div className="sm:col-span-2 space-y-1">
                  <label className="text-on-surface font-medium">Email</label>
                  <input
                    type="email"
                    value={vcardEmail}
                    onChange={(e) => setVcardEmail(e.target.value)}
                    placeholder="john.doe@example.com"
                    className="w-full px-3 py-2 rounded-lg bg-surface border border-outline-variant text-xs text-on-surface focus:outline-none"
                  />
                </div>
              </div>
            </div>
          )}

          {template === 'email' && (
            <div className="p-4 rounded-xl bg-surface-container-low border border-outline-variant space-y-3">
              <h3 className="text-xs font-semibold uppercase tracking-wider text-outline">
                Mailto Draft
              </h3>
              <div className="space-y-3 text-xs">
                <div className="space-y-1">
                  <label className="text-on-surface font-medium">Recipient Email</label>
                  <input
                    type="email"
                    value={emailTo}
                    onChange={(e) => setEmailTo(e.target.value)}
                    placeholder="recipient@example.com"
                    className="w-full px-3 py-2 rounded-lg bg-surface border border-outline-variant text-xs text-on-surface focus:outline-none"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-on-surface font-medium">Subject</label>
                  <input
                    type="text"
                    value={emailSubject}
                    onChange={(e) => setEmailSubject(e.target.value)}
                    placeholder="Meeting Follow-up"
                    className="w-full px-3 py-2 rounded-lg bg-surface border border-outline-variant text-xs text-on-surface focus:outline-none"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-on-surface font-medium">Body</label>
                  <textarea
                    value={emailBody}
                    onChange={(e) => setEmailBody(e.target.value)}
                    placeholder="Enter email message body..."
                    className="w-full h-20 p-2.5 rounded-lg bg-surface border border-outline-variant font-mono text-xs text-on-surface focus:outline-none resize-y"
                  />
                </div>
              </div>
            </div>
          )}

          {error && (
            <div className="p-3 rounded-xl bg-red-500/10 border border-red-500/30 flex items-center gap-2.5 text-xs text-red-400">
              <AlertTriangle className="w-4 h-4 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          {/* Customization Options */}
          <div className="p-4 rounded-xl bg-surface-container-low border border-outline-variant space-y-3">
            <h3 className="text-xs font-semibold uppercase tracking-wider text-outline">
              Options &amp; Dimensions
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
              <div>
                <label className="text-on-surface-variant block mb-1">Pixel Size ({size}px)</label>
                <select
                  value={size}
                  onChange={(e) => setSize(Number(e.target.value))}
                  className="w-full h-9 px-3 rounded-lg bg-surface border border-outline-variant text-xs text-on-surface focus:outline-none"
                >
                  <option value={200}>200 x 200 px</option>
                  <option value={300}>300 x 300 px</option>
                  <option value={400}>400 x 400 px</option>
                  <option value={600}>600 x 600 px (HD)</option>
                </select>
              </div>

              <div>
                <label className="text-on-surface-variant block mb-1">
                  Quiet Zone Margin ({margin})
                </label>
                <select
                  value={margin}
                  onChange={(e) => setMargin(Number(e.target.value))}
                  className="w-full h-9 px-3 rounded-lg bg-surface border border-outline-variant text-xs text-on-surface focus:outline-none"
                >
                  <option value={1}>Compact (1 module)</option>
                  <option value={2}>Standard (2 modules)</option>
                  <option value={4}>Generous (4 modules)</option>
                </select>
              </div>

              <div>
                <label className="text-on-surface-variant block mb-1">
                  Error Correction ({ecc})
                </label>
                <select
                  value={ecc}
                  onChange={(e) => setEcc(e.target.value as QrErrorCorrectionLevel)}
                  className="w-full h-9 px-3 rounded-lg bg-surface border border-outline-variant text-xs text-on-surface focus:outline-none"
                >
                  <option value="L">L (~7% damage recovery)</option>
                  <option value="M">M (~15% recovery, default)</option>
                  <option value="Q">Q (~25% damage recovery)</option>
                  <option value="H">H (~30% damage recovery)</option>
                </select>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
              <div className="flex items-center gap-3">
                <label className="text-on-surface-variant text-xs">QR Foreground:</label>
                <input
                  type="color"
                  value={darkColor}
                  onChange={(e) => setDarkColor(e.target.value)}
                  className="w-8 h-8 rounded border border-outline-variant cursor-pointer"
                />
                <span className="font-mono text-xs">{darkColor}</span>
              </div>

              <div className="flex items-center gap-3">
                <label className="text-on-surface-variant text-xs">Background:</label>
                <input
                  type="color"
                  value={lightColor}
                  onChange={(e) => setLightColor(e.target.value)}
                  className="w-8 h-8 rounded border border-outline-variant cursor-pointer"
                />
                <span className="font-mono text-xs">{lightColor}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Right Col: Live Preview & Downloads */}
        <div className="p-6 rounded-2xl bg-surface-container-low border border-outline-variant flex flex-col items-center justify-between text-center space-y-4">
          <div className="w-full flex items-center justify-between text-xs text-outline">
            <span className="font-semibold uppercase">QR Code Preview</span>
            <span className="font-mono text-[11px]">
              {size}x{size}
            </span>
          </div>

          <div className="p-3 bg-white rounded-xl shadow-md border border-outline-variant/60">
            {dataUrl ? (
              <img
                src={dataUrl}
                alt="Generated QR Code"
                className="w-48 h-48 object-contain rounded"
              />
            ) : (
              <div className="w-48 h-48 flex items-center justify-center text-zinc-400 text-xs italic">
                Enter payload to render
              </div>
            )}
          </div>

          <div className="w-full space-y-2">
            <button
              type="button"
              onClick={handleDownloadPng}
              disabled={!dataUrl}
              className="w-full h-10 inline-flex items-center justify-center gap-2 rounded-xl bg-primary-container text-on-primary-container text-xs font-semibold hover:opacity-95 shadow-sm transition-opacity disabled:opacity-40"
            >
              <Download className="w-4 h-4" />
              <span>Download PNG Image</span>
            </button>

            <div className="grid grid-cols-2 gap-2">
              <button
                type="button"
                onClick={handleDownloadSvg}
                disabled={!svgString}
                className="h-9 inline-flex items-center justify-center gap-1.5 rounded-lg bg-surface hover:bg-surface-container text-xs font-medium text-on-surface border border-outline-variant transition-colors disabled:opacity-40"
              >
                <Download className="w-3.5 h-3.5" />
                <span>Vector SVG</span>
              </button>

              <button
                type="button"
                onClick={handleCopySvg}
                disabled={!svgString}
                className="h-9 inline-flex items-center justify-center gap-1.5 rounded-lg bg-surface hover:bg-surface-container text-xs font-medium text-on-surface border border-outline-variant transition-colors disabled:opacity-40"
              >
                {copiedSvg ? (
                  <Check className="w-3.5 h-3.5 text-emerald-500" />
                ) : (
                  <Copy className="w-3.5 h-3.5" />
                )}
                <span>{copiedSvg ? 'Copied' : 'Copy SVG'}</span>
              </button>
            </div>

            <p className="text-[11px] text-outline pt-1">
              Generated locally via Canvas &amp; SVG vector rendering. Zero external servers.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default QrGeneratorTool;
