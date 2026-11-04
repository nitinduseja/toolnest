import React, { useState, useEffect } from 'react';
import { Info, Key, FileText, ShieldCheck } from 'lucide-react';
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
import { MultiHashTextDigest, HashResultItem } from './MultiHashTextDigest';
import { HmacHasher } from './HmacHasher';
import { FileChecksumHasher } from './FileChecksumHasher';
import { copyToClipboard } from '@/lib/clipboard';

type HashMode = 'text' | 'hmac' | 'file';

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

  // File Checksum State
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [fileHashes, setFileHashes] = useState<Record<string, string>>({});
  const [fileLoading, setFileLoading] = useState(false);
  const [fileError, setFileError] = useState<string | null>(null);

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
      setFileLoading(false);
    } catch (err) {
      setFileError(err instanceof Error ? err.message : 'Failed to calculate file checksum');
      setFileLoading(false);
    }
  };

  const handleCopyHash = async (id: string, hash: string) => {
    if (!hash) return;
    const ok = await copyToClipboard(formatHash(hash));
    if (ok) {
      setCopiedId(id);
      setTimeout(() => setCopiedId(null), 2000);
    }
  };

  const formatHash = (hash: string) => {
    if (!hash) return '';
    return uppercase ? hash.toUpperCase() : hash.toLowerCase();
  };

  const hashItems: HashResultItem[] = [
    {
      id: 'sha256',
      name: 'SHA-256',
      bits: '256-bit',
      value: textHashes['SHA-256'] || '',
    },
    {
      id: 'sha512',
      name: 'SHA-512',
      bits: '512-bit',
      value: textHashes['SHA-512'] || '',
    },
    {
      id: 'sha384',
      name: 'SHA-384',
      bits: '384-bit',
      value: textHashes['SHA-384'] || '',
    },
    {
      id: 'sha1',
      name: 'SHA-1',
      bits: '160-bit (Legacy)',
      value: textHashes['SHA-1'] || '',
    },
    {
      id: 'md5',
      name: 'MD5',
      bits: '128-bit (Legacy)',
      value: textHashes['MD5'] || '',
    },
    {
      id: 'crc32',
      name: 'CRC-32',
      bits: '32-bit (Checksum)',
      value: textHashes['CRC-32'] || '',
    },
  ];

  return (
    <div className="space-y-4">
      {/* Mode Switcher */}
      <div className="flex flex-wrap items-center justify-between gap-3 p-3 rounded-xl bg-surface-container-low border border-outline-variant">
        <div className="flex items-center gap-1 p-1 rounded-xl bg-surface-container-high border border-outline-variant/60">
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
            <span>Multi-Hash Digest</span>
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
        <MultiHashTextDigest
          textInput={textInput}
          setTextInput={setTextInput}
          textLoading={textLoading}
          hashItems={hashItems}
          formatHash={formatHash}
          handleCopyHash={handleCopyHash}
          copiedId={copiedId}
        />
      )}

      {/* MODE 2: HMAC Generator */}
      {mode === 'hmac' && (
        <HmacHasher
          hmacKey={hmacKey}
          setHmacKey={setHmacKey}
          hmacMessage={hmacMessage}
          setHmacMessage={setHmacMessage}
          hmacAlgo={hmacAlgo}
          setHmacAlgo={setHmacAlgo}
          hmacResult={hmacResult}
          formatHash={formatHash}
        />
      )}

      {/* MODE 3: File Checksum */}
      {mode === 'file' && (
        <FileChecksumHasher
          selectedFile={selectedFile}
          handleFileProcess={handleFileProcess}
          fileLoading={fileLoading}
          fileError={fileError}
          fileHashes={fileHashes}
          formatHash={formatHash}
          handleCopyHash={handleCopyHash}
          copiedId={copiedId}
        />
      )}

      <div className="flex items-center gap-2 text-xs text-outline px-1">
        <Info className="w-4 h-4 shrink-0 text-primary" />
        <span>
          Cryptographic hashes are calculated directly in your browser using the native Web Crypto
          API and RFC-compliant algorithms.
        </span>
      </div>
    </div>
  );
};

export default HashGeneratorTool;
