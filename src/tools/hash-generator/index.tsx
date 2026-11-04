import React, { useState, useEffect, useRef } from 'react';
import { Copy, Check, Info, AlertTriangle, Key, FileText, Upload, ShieldCheck } from 'lucide-react';
import {
  computeSha256,
  computeSha512,
  computeSha384,
  computeSha1,
  computeMd5,
  computeCrc32,
  computeHmac,
  computeFileHash,
} from './hashLogic';
import { copyToClipboard } from '@/lib/clipboard';

type HashMode = 'text' | 'hmac' | 'file';

interface HashResultItem {
  id: string;
  name: string;
  bits: string;
  value: string;
}

export const HashGeneratorTool: React.FC = () => {
  const [mode, setMode] = useState<HashMode>('text');

  // Text Multi-Hash State
  const [textInput, setTextInput] = useState('Toolnest');
  const [uppercase, setUppercase] = useState(false);
  const [textHashes, setTextHashes] = useState<Record<string, string>>({});
  const [textLoading, setTextLoading] = useState(false);
  const [copiedId, setCopiedId] = useState<string | null>(null);

  // HMAC State
  const [hmacKey, setHmacKey] = useState('');
  const [hmacMessage, setHmacMessage] = useState('');
  const [hmacAlgo, setHmacAlgo] = useState<'SHA-256' | 'SHA-512'>('SHA-256');
  const [hmacResult, setHmacResult] = useState('');
  const [hmacCopied, setHmacCopied] = useState(false);

  // File Checksum State
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [fileHashes, setFileHashes] = useState<Record<string, string>>({});
  const [fileLoading, setFileLoading] = useState(false);
  const [fileError, setFileError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Compute text hashes
  useEffect(() => {
    if (mode !== 'text') return;
    let isCancelled = false;

    if (!textInput) {
      setTextHashes({});
      return;
    }

    setTextLoading(true);
    Promise.all([
      computeSha256(textInput),
      computeSha512(textInput),
      computeSha384(textInput),
      computeSha1(textInput),
      Promise.resolve(computeMd5(textInput)),
      Promise.resolve(computeCrc32(textInput)),
    ])
      .then(([sha256, sha512, sha384, sha1, md5, crc32]) => {
        if (!isCancelled) {
          setTextHashes({
            'SHA-256': sha256,
            'SHA-512': sha512,
            'SHA-384': sha384,
            'SHA-1': sha1,
            MD5: md5,
            'CRC-32': crc32,
          });
          setTextLoading(false);
        }
      })
      .catch(() => {
        if (!isCancelled) setTextLoading(false);
      });

    return () => {
      isCancelled = true;
    };
  }, [textInput, mode]);

  // Compute HMAC
  useEffect(() => {
    if (mode !== 'hmac') return;
    let isCancelled = false;

    if (!hmacKey || !hmacMessage) {
      setHmacResult('');
      return;
    }

    computeHmac(hmacAlgo, hmacKey, hmacMessage)
      .then((res) => {
        if (!isCancelled) setHmacResult(res);
      })
      .catch(() => {
        if (!isCancelled) setHmacResult('');
      });

    return () => {
      isCancelled = true;
    };
  }, [hmacKey, hmacMessage, hmacAlgo, mode]);

  // Compute File Checksums
  const handleFileProcess = async (file: File) => {
    setSelectedFile(file);
    setFileLoading(true);
    setFileError(null);
    setFileHashes({});

    try {
      const [sha256, sha512, sha1] = await Promise.all([
        computeFileHash(file, 'SHA-256'),
        computeFileHash(file, 'SHA-512'),
        computeFileHash(file, 'SHA-1'),
      ]);
      setFileHashes({
        'SHA-256': sha256,
        'SHA-512': sha512,
        'SHA-1': sha1,
      });
    } catch (err) {
      setFileError(err instanceof Error ? err.message : 'Failed to hash file');
    } finally {
      setFileLoading(false);
    }
  };

  const handleCopyHash = async (id: string, value: string) => {
    if (!value) return;
    const formatted = uppercase ? value.toUpperCase() : value.toLowerCase();
    const ok = await copyToClipboard(formatted);
    if (ok) {
      setCopiedId(id);
      setTimeout(() => setCopiedId(null), 2000);
    }
  };

  const formatHash = (val?: string) => {
    if (!val) return '';
    return uppercase ? val.toUpperCase() : val.toLowerCase();
  };

  const hashItems: HashResultItem[] = [
    { id: 'SHA-256', name: 'SHA-256', bits: '256-bit / 64 chars', value: textHashes['SHA-256'] || '' },
    { id: 'SHA-512', name: 'SHA-512', bits: '512-bit / 128 chars', value: textHashes['SHA-512'] || '' },
    { id: 'SHA-384', name: 'SHA-384', bits: '384-bit / 96 chars', value: textHashes['SHA-384'] || '' },
    { id: 'SHA-1', name: 'SHA-1', bits: '160-bit / 40 chars (Legacy)', value: textHashes['SHA-1'] || '' },
    { id: 'MD5', name: 'MD5', bits: '128-bit / 32 chars (Checksum)', value: textHashes['MD5'] || '' },
    { id: 'CRC-32', name: 'CRC-32', bits: '32-bit / 8 chars (Integrity)', value: textHashes['CRC-32'] || '' },
  ];

  return (
    <div className="space-y-4">
      {/* Educational Notice */}
      <div className="p-3.5 rounded-xl bg-surface-container-low border border-outline-variant space-y-2 text-xs text-on-surface-variant">
        <div className="flex items-center gap-2 font-semibold text-on-surface">
          <Info className="w-4 h-4 text-primary shrink-0" />
          <span>Cryptographic Hash vs Password Storage</span>
        </div>
        <p className="leading-relaxed">
          Cryptographic digests are deterministic, one-way functions. Standard fast digests (such as SHA-256 or MD5)
          must <strong>never</strong> be used alone for user passwords without memory-hard, salted algorithms like Argon2 or bcrypt.
          All computations are executed securely client-side in browser memory.
        </p>
      </div>

      {/* Mode Navigation Tabs */}
      <div className="flex flex-wrap items-center justify-between gap-2 border-b border-outline-variant pb-2">
        <div className="flex items-center gap-1.5 p-1 rounded-xl bg-surface-container-low border border-outline-variant">
          <button
            type="button"
            onClick={() => setMode('text')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${
              mode === 'text'
                ? 'bg-primary-container text-on-primary-container shadow-xs'
                : 'text-on-surface-variant hover:text-on-surface hover:bg-surface-container-high'
            }`}
          >
            <FileText className="w-3.5 h-3.5" />
            <span>Multi-Digest</span>
          </button>
          <button
            type="button"
            onClick={() => setMode('hmac')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${
              mode === 'hmac'
                ? 'bg-primary-container text-on-primary-container shadow-xs'
                : 'text-on-surface-variant hover:text-on-surface hover:bg-surface-container-high'
            }`}
          >
            <Key className="w-3.5 h-3.5" />
            <span>HMAC Generator</span>
          </button>
          <button
            type="button"
            onClick={() => setMode('file')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${
              mode === 'file'
                ? 'bg-primary-container text-on-primary-container shadow-xs'
                : 'text-on-surface-variant hover:text-on-surface hover:bg-surface-container-high'
            }`}
          >
            <ShieldCheck className="w-3.5 h-3.5" />
            <span>File Checksum</span>
          </button>
        </div>

        <label className="flex items-center gap-1.5 text-xs text-on-surface cursor-pointer select-none">
          <input
            type="checkbox"
            checked={uppercase}
            onChange={(e) => setUppercase(e.target.checked)}
            className="rounded border-outline-variant text-primary focus:ring-primary"
          />
          <span>Uppercase Hex</span>
        </label>
      </div>

      {/* MODE 1: Multi-Hash Text Digest */}
      {mode === 'text' && (
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
                        {isCopied ? <Check className="w-3.5 h-3.5 text-green-500" /> : <Copy className="w-3.5 h-3.5" />}
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
      )}

      {/* MODE 2: HMAC Generator */}
      {mode === 'hmac' && (
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
                onClick={async () => {
                  if (!hmacResult) return;
                  const ok = await copyToClipboard(formatHash(hmacResult));
                  if (ok) {
                    setHmacCopied(true);
                    setTimeout(() => setHmacCopied(false), 2000);
                  }
                }}
                disabled={!hmacResult}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-primary-container text-on-primary-container text-xs font-semibold hover:opacity-95 transition-opacity disabled:opacity-40"
              >
                {hmacCopied ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{hmacCopied ? 'Copied' : 'Copy HMAC'}</span>
              </button>
            </div>
            <div className="p-3 rounded-lg bg-surface-container-lowest font-mono text-xs text-on-surface break-all select-all">
              {formatHash(hmacResult) || (
                <span className="text-outline italic">Enter secret key and message to generate HMAC</span>
              )}
            </div>
          </div>
        </div>
      )}

      {/* MODE 3: File Checksum */}
      {mode === 'file' && (
        <div className="space-y-4">
          <input
            type="file"
            ref={fileInputRef}
            onChange={(e) => {
              if (e.target.files && e.target.files[0]) {
                handleFileProcess(e.target.files[0]);
              }
            }}
            className="hidden"
          />

          <div
            onDragOver={(e) => e.preventDefault()}
            onDrop={(e) => {
              e.preventDefault();
              if (e.dataTransfer.files && e.dataTransfer.files[0]) {
                handleFileProcess(e.dataTransfer.files[0]);
              }
            }}
            onClick={() => fileInputRef.current?.click()}
            className="p-8 border-2 border-dashed border-outline-variant hover:border-primary rounded-2xl bg-surface-container-low text-center cursor-pointer transition-colors space-y-2"
          >
            <Upload className="w-8 h-8 text-primary mx-auto" />
            <div className="text-sm font-semibold text-on-surface">
              {selectedFile ? selectedFile.name : 'Click or drag a file here to calculate checksums'}
            </div>
            <div className="text-xs text-outline">
              {selectedFile
                ? `${(selectedFile.size / 1024).toFixed(1)} KB — Click to change file`
                : 'Files are read strictly client-side and never uploaded'}
            </div>
          </div>

          {fileError && (
            <div className="p-3 rounded-xl bg-red-500/10 border border-red-500/30 flex items-center gap-2 text-xs text-red-400">
              <AlertTriangle className="w-4 h-4 shrink-0" />
              <span>{fileError}</span>
            </div>
          )}

          {selectedFile && (
            <div className="space-y-2.5">
              <span className="text-xs font-semibold text-on-surface-variant uppercase tracking-wider px-1">
                File Checksums {fileLoading && '(calculating...)'}
              </span>

              {(['SHA-256', 'SHA-512', 'SHA-1'] as const).map((algo) => {
                const val = fileHashes[algo];
                const formatted = formatHash(val);
                const isCopied = copiedId === `file-${algo}`;
                return (
                  <div
                    key={algo}
                    className="p-3 rounded-xl bg-surface-container-low border border-outline-variant space-y-1.5"
                  >
                    <div className="flex items-center justify-between gap-2">
                      <span className="text-xs font-bold text-on-surface">{algo} Checksum</span>
                      <button
                        type="button"
                        onClick={() => handleCopyHash(`file-${algo}`, val)}
                        disabled={!val}
                        className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-surface-container-high hover:bg-surface-container-highest text-on-surface text-xs font-medium transition-colors disabled:opacity-40"
                      >
                        {isCopied ? <Check className="w-3.5 h-3.5 text-green-500" /> : <Copy className="w-3.5 h-3.5" />}
                        <span>{isCopied ? 'Copied' : 'Copy'}</span>
                      </button>
                    </div>

                    <div className="p-2.5 rounded-lg bg-surface-container-lowest font-mono text-xs text-on-surface break-all select-all">
                      {formatted || <span className="text-outline italic">Calculating...</span>}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default HashGeneratorTool;
