import React, { useState, useEffect, useCallback } from 'react';
import { JwtAlgorithm, JwtPreset, JwtVerificationResult } from './types';
import { signJwt, verifyJwt, JWT_PRESETS } from './jwtStudioLogic';
import { JwtPresetsBar } from './JwtPresetsBar';
import { JwtTokenBreakdown } from './JwtTokenBreakdown';
import { Icon } from '@/components/atoms/Icon';

const INITIAL_PRESET = JWT_PRESETS[0];

export const JwtStudio: React.FC = () => {
  const [headerJson, setHeaderJson] = useState<string>(
    JSON.stringify(INITIAL_PRESET.header, null, 2)
  );
  const [payloadJson, setPayloadJson] = useState<string>(
    JSON.stringify(INITIAL_PRESET.payload, null, 2)
  );
  const [secret, setSecret] = useState<string>(INITIAL_PRESET.secret);
  const [token, setToken] = useState<string>('');
  const [verification, setVerification] = useState<JwtVerificationResult>({
    isValid: true,
    isExpired: false,
    message: 'Initializing...',
  });

  const generateAndVerify = useCallback(async () => {
    try {
      const headerObj = JSON.parse(headerJson);
      const payloadObj = JSON.parse(payloadJson);
      const generatedToken = await signJwt(headerObj, payloadObj, secret);
      setToken(generatedToken);
      const vResult = await verifyJwt(generatedToken, secret);
      setVerification(vResult);
    } catch {
      setVerification({
        isValid: false,
        isExpired: false,
        message: 'Invalid JSON Syntax',
      });
    }
  }, [headerJson, payloadJson, secret]);

  useEffect(() => {
    void generateAndVerify();
  }, [generateAndVerify]);

  const handleSelectPreset = (preset: JwtPreset) => {
    setHeaderJson(JSON.stringify(preset.header, null, 2));
    setPayloadJson(JSON.stringify(preset.payload, null, 2));
    setSecret(preset.secret);
  };

  const handleSetAlgorithm = (alg: JwtAlgorithm) => {
    try {
      const parsed = JSON.parse(headerJson);
      parsed.alg = alg;
      setHeaderJson(JSON.stringify(parsed, null, 2));
    } catch {
      setHeaderJson(JSON.stringify({ alg, typ: 'JWT' }, null, 2));
    }
  };

  const handleAddExpirySeconds = (seconds: number) => {
    try {
      const parsed = JSON.parse(payloadJson);
      const now = Math.floor(Date.now() / 1000);
      parsed.iat = now;
      parsed.exp = now + seconds;
      setPayloadJson(JSON.stringify(parsed, null, 2));
    } catch {
      // Ignore invalid JSON state
    }
  };

  return (
    <div className="mx-auto flex w-full max-w-6xl flex-col gap-6 p-4 sm:p-6">
      {/* Header */}
      <div className="flex flex-col gap-1">
        <div className="flex items-center gap-2">
          <div className="rounded-lg bg-primary/10 p-2 text-primary">
            <Icon name="KeyRound" className="h-6 w-6" />
          </div>
          <div>
            <h1 className="text-xl font-bold tracking-tight text-text-primary sm:text-2xl">
              JWT Studio & Signature Debugger
            </h1>
            <p className="text-xs text-text-secondary sm:text-sm">
              Mint, debug, and verify JSON Web Tokens client-side with HMAC cryptographic signing,
              expiry timers, and tamper checks.
            </p>
          </div>
        </div>
      </div>

      <JwtPresetsBar onSelect={handleSelectPreset} />

      {/* Token Output Breakdown */}
      <JwtTokenBreakdown token={token} verification={verification} />

      {/* Editor Grid */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        {/* Header & Secret Controls */}
        <div className="flex flex-col gap-4">
          <div className="flex flex-col gap-2 rounded-xl border border-border/50 bg-surface-primary/70 p-4">
            <div className="flex items-center justify-between">
              <label
                htmlFor="jwt-header-editor"
                className="text-xs font-semibold uppercase tracking-wider text-red-500"
              >
                HEADER: Algorithm & Type
              </label>
              <div className="flex items-center gap-1">
                {(['HS256', 'HS384', 'HS512', 'none'] as JwtAlgorithm[]).map((alg) => (
                  <button
                    key={alg}
                    type="button"
                    onClick={() => handleSetAlgorithm(alg)}
                    className="rounded border border-border/60 bg-surface-secondary px-2 py-0.5 text-[11px] font-mono text-text-secondary hover:border-primary/50"
                  >
                    {alg}
                  </button>
                ))}
              </div>
            </div>
            <textarea
              id="jwt-header-editor"
              rows={4}
              value={headerJson}
              onChange={(e) => setHeaderJson(e.target.value)}
              className="w-full rounded-lg border border-border/60 bg-surface-secondary/70 p-2.5 font-mono text-xs text-text-primary focus:border-primary focus:outline-none"
            />
          </div>

          {/* Secret Key Input */}
          <div className="flex flex-col gap-2 rounded-xl border border-border/50 bg-surface-primary/70 p-4">
            <label
              htmlFor="jwt-secret-input"
              className="text-xs font-semibold uppercase tracking-wider text-cyan-500"
            >
              SIGNATURE SECRET KEY (HMAC)
            </label>
            <input
              id="jwt-secret-input"
              type="text"
              value={secret}
              onChange={(e) => setSecret(e.target.value)}
              placeholder="Enter your HMAC signing secret..."
              className="w-full rounded-lg border border-border/60 bg-surface-secondary/70 px-3 py-2 font-mono text-xs text-text-primary focus:border-primary focus:outline-none"
            />
          </div>
        </div>

        {/* Payload JSON Editor */}
        <div className="flex flex-col gap-2 rounded-xl border border-border/50 bg-surface-primary/70 p-4">
          <div className="flex items-center justify-between">
            <label
              htmlFor="jwt-payload-editor"
              className="text-xs font-semibold uppercase tracking-wider text-purple-500"
            >
              PAYLOAD: Data Claims
            </label>
            <div className="flex items-center gap-1 text-[11px]">
              <span className="text-text-tertiary">Quick Expiry:</span>
              <button
                type="button"
                onClick={() => handleAddExpirySeconds(900)}
                className="rounded bg-surface-secondary px-2 py-0.5 text-text-secondary hover:text-text-primary"
              >
                +15m
              </button>
              <button
                type="button"
                onClick={() => handleAddExpirySeconds(3600)}
                className="rounded bg-surface-secondary px-2 py-0.5 text-text-secondary hover:text-text-primary"
              >
                +1h
              </button>
              <button
                type="button"
                onClick={() => handleAddExpirySeconds(86400)}
                className="rounded bg-surface-secondary px-2 py-0.5 text-text-secondary hover:text-text-primary"
              >
                +24h
              </button>
            </div>
          </div>
          <textarea
            id="jwt-payload-editor"
            rows={10}
            value={payloadJson}
            onChange={(e) => setPayloadJson(e.target.value)}
            className="w-full rounded-lg border border-border/60 bg-surface-secondary/70 p-2.5 font-mono text-xs text-text-primary focus:border-primary focus:outline-none"
          />
        </div>
      </div>
    </div>
  );
};

export default JwtStudio;
