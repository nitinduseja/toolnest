import React from 'react';

export interface QrWifiState {
  ssid: string;
  setSsid: (val: string) => void;
  password: string;
  setPassword: (val: string) => void;
  encryption: 'WPA' | 'WEP' | 'nopass';
  setEncryption: (val: 'WPA' | 'WEP' | 'nopass') => void;
  hidden: boolean;
  setHidden: (val: boolean) => void;
}

export interface QrVCardState {
  first: string;
  setFirst: (val: string) => void;
  last: string;
  setLast: (val: string) => void;
  org: string;
  setOrg: (val: string) => void;
  phone: string;
  setPhone: (val: string) => void;
  email: string;
  setEmail: (val: string) => void;
}

export interface QrEmailState {
  to: string;
  setTo: (val: string) => void;
  subject: string;
  setSubject: (val: string) => void;
  body: string;
  setBody: (val: string) => void;
}

interface QrTemplateFormsProps {
  template: 'text' | 'wifi' | 'vcard' | 'email';
  wifi: QrWifiState;
  vcard: QrVCardState;
  email: QrEmailState;
}

export const QrTemplateForms: React.FC<QrTemplateFormsProps> = ({
  template,
  wifi,
  vcard,
  email,
}) => {
  if (template === 'wifi') {
    return (
      <div className="p-4 rounded-xl bg-surface-container-low border border-outline-variant space-y-3">
        <h3 className="text-xs font-semibold uppercase tracking-wider text-outline">
          Wi-Fi Network Credentials
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
          <div className="space-y-1">
            <label className="text-on-surface font-medium">SSID / Network Name</label>
            <input
              type="text"
              value={wifi.ssid}
              onChange={(e) => wifi.setSsid(e.target.value)}
              placeholder="e.g. MyOffice_5G"
              className="w-full px-3 py-2 rounded-lg bg-surface border border-outline-variant font-medium text-xs text-on-surface focus:outline-none"
            />
          </div>
          <div className="space-y-1">
            <label className="text-on-surface font-medium">Password</label>
            <input
              type="text"
              value={wifi.password}
              onChange={(e) => wifi.setPassword(e.target.value)}
              placeholder="Network password"
              className="w-full px-3 py-2 rounded-lg bg-surface border border-outline-variant font-medium text-xs text-on-surface focus:outline-none"
            />
          </div>
          <div className="space-y-1">
            <label className="text-on-surface font-medium">Security</label>
            <select
              value={wifi.encryption}
              onChange={(e) => wifi.setEncryption(e.target.value as 'WPA' | 'WEP' | 'nopass')}
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
                checked={wifi.hidden}
                onChange={(e) => wifi.setHidden(e.target.checked)}
                className="rounded border-outline-variant text-primary focus:ring-primary"
              />
              <span>Hidden SSID</span>
            </label>
          </div>
        </div>
      </div>
    );
  }

  if (template === 'vcard') {
    return (
      <div className="p-4 rounded-xl bg-surface-container-low border border-outline-variant space-y-3">
        <h3 className="text-xs font-semibold uppercase tracking-wider text-outline">
          Contact Card Details
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
          <div className="space-y-1">
            <label className="text-on-surface font-medium">First Name</label>
            <input
              type="text"
              value={vcard.first}
              onChange={(e) => vcard.setFirst(e.target.value)}
              placeholder="John"
              className="w-full px-3 py-2 rounded-lg bg-surface border border-outline-variant text-xs text-on-surface focus:outline-none"
            />
          </div>
          <div className="space-y-1">
            <label className="text-on-surface font-medium">Last Name</label>
            <input
              type="text"
              value={vcard.last}
              onChange={(e) => vcard.setLast(e.target.value)}
              placeholder="Doe"
              className="w-full px-3 py-2 rounded-lg bg-surface border border-outline-variant text-xs text-on-surface focus:outline-none"
            />
          </div>
          <div className="space-y-1">
            <label className="text-on-surface font-medium">Organization</label>
            <input
              type="text"
              value={vcard.org}
              onChange={(e) => vcard.setOrg(e.target.value)}
              placeholder="Company or Studio"
              className="w-full px-3 py-2 rounded-lg bg-surface border border-outline-variant text-xs text-on-surface focus:outline-none"
            />
          </div>
          <div className="space-y-1">
            <label className="text-on-surface font-medium">Phone</label>
            <input
              type="tel"
              value={vcard.phone}
              onChange={(e) => vcard.setPhone(e.target.value)}
              placeholder="+1 555-0199"
              className="w-full px-3 py-2 rounded-lg bg-surface border border-outline-variant text-xs text-on-surface focus:outline-none"
            />
          </div>
          <div className="sm:col-span-2 space-y-1">
            <label className="text-on-surface font-medium">Email</label>
            <input
              type="email"
              value={vcard.email}
              onChange={(e) => vcard.setEmail(e.target.value)}
              placeholder="john.doe@example.com"
              className="w-full px-3 py-2 rounded-lg bg-surface border border-outline-variant text-xs text-on-surface focus:outline-none"
            />
          </div>
        </div>
      </div>
    );
  }

  if (template === 'email') {
    return (
      <div className="p-4 rounded-xl bg-surface-container-low border border-outline-variant space-y-3">
        <h3 className="text-xs font-semibold uppercase tracking-wider text-outline">
          Mailto Draft
        </h3>
        <div className="space-y-3 text-xs">
          <div className="space-y-1">
            <label className="text-on-surface font-medium">Recipient Email</label>
            <input
              type="email"
              value={email.to}
              onChange={(e) => email.setTo(e.target.value)}
              placeholder="recipient@example.com"
              className="w-full px-3 py-2 rounded-lg bg-surface border border-outline-variant text-xs text-on-surface focus:outline-none"
            />
          </div>
          <div className="space-y-1">
            <label className="text-on-surface font-medium">Subject</label>
            <input
              type="text"
              value={email.subject}
              onChange={(e) => email.setSubject(e.target.value)}
              placeholder="Meeting Follow-up"
              className="w-full px-3 py-2 rounded-lg bg-surface border border-outline-variant text-xs text-on-surface focus:outline-none"
            />
          </div>
          <div className="space-y-1">
            <label className="text-on-surface font-medium">Body</label>
            <textarea
              value={email.body}
              onChange={(e) => email.setBody(e.target.value)}
              placeholder="Enter email message body..."
              className="w-full h-20 p-2.5 rounded-lg bg-surface border border-outline-variant font-mono text-xs text-on-surface focus:outline-none resize-y"
            />
          </div>
        </div>
      </div>
    );
  }

  return null;
};
