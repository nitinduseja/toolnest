import React, { useState, useEffect, useMemo } from 'react';
import { AlertTriangle, Wifi, User, Mail, Link as LinkIcon } from 'lucide-react';
import {
  generateQrDataUrl,
  generateQrSvg,
  buildWifiPayload,
  buildVCardPayload,
  buildEmailPayload,
  QrErrorCorrectionLevel,
} from './qrLogic';
import { QrTemplateForms } from './QrTemplateForms';
import { QrPreviewCard } from './QrPreviewCard';
import { QrOptionsPanel } from './QrOptionsPanel';
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
  const activePayload = useMemo(() => {
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
          {/* Plaintext Form */}
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

          {/* Wi-Fi, vCard, and Email Template Forms */}
          <QrTemplateForms
            template={template}
            wifi={{
              ssid: wifiSsid,
              setSsid: setWifiSsid,
              password: wifiPassword,
              setPassword: setWifiPassword,
              encryption: wifiEncryption,
              setEncryption: setWifiEncryption,
              hidden: wifiHidden,
              setHidden: setWifiHidden,
            }}
            vcard={{
              first: vcardFirst,
              setFirst: setVcardFirst,
              last: vcardLast,
              setLast: setVcardLast,
              org: vcardOrg,
              setOrg: setVcardOrg,
              phone: vcardPhone,
              setPhone: setVcardPhone,
              email: vcardEmail,
              setEmail: setVcardEmail,
            }}
            email={{
              to: emailTo,
              setTo: setEmailTo,
              subject: emailSubject,
              setSubject: setEmailSubject,
              body: emailBody,
              setBody: setEmailBody,
            }}
          />

          {error && (
            <div className="p-3 rounded-xl bg-red-500/10 border border-red-500/30 flex items-center gap-2.5 text-xs text-red-400">
              <AlertTriangle className="w-4 h-4 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          {/* Customization Options */}
          <QrOptionsPanel
            size={size}
            setSize={setSize}
            margin={margin}
            setMargin={setMargin}
            ecc={ecc}
            setEcc={setEcc}
            darkColor={darkColor}
            setDarkColor={setDarkColor}
            lightColor={lightColor}
            setLightColor={setLightColor}
          />
        </div>

        {/* Live Preview & Download Card */}
        <QrPreviewCard
          size={size}
          dataUrl={dataUrl}
          svgString={svgString}
          copiedSvg={copiedSvg}
          handleDownloadPng={handleDownloadPng}
          handleDownloadSvg={handleDownloadSvg}
          handleCopySvg={handleCopySvg}
        />
      </div>
    </div>
  );
};

export default QrGeneratorTool;
