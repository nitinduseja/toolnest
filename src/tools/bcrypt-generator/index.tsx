import React, { useState } from 'react';
import { KeyRound, ShieldCheck, CheckCircle2, Gauge } from 'lucide-react';
import { BcryptHasher } from './BcryptHasher';
import { BcryptVerifier } from './BcryptVerifier';
import { BcryptBenchmark } from './BcryptBenchmark';

type TabType = 'hasher' | 'verifier' | 'benchmark';

export const BcryptGeneratorTool: React.FC = () => {
  const [activeTab, setActiveTab] = useState<TabType>('hasher');

  return (
    <div className="space-y-6 max-w-4xl mx-auto pb-12">
      {/* Banner */}
      <div className="p-4 sm:p-5 rounded-2xl bg-surface-container-low border border-outline-variant/60 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="p-2.5 rounded-xl bg-primary/10 text-primary">
            <KeyRound className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-base font-bold text-on-surface">Bcrypt & Password Hash Studio</h2>
            <p className="text-xs text-outline mt-0.5">
              Generate salted bcrypt password hashes, verify credentials, and benchmark cost
              factors.
            </p>
          </div>
        </div>

        {/* Tab Buttons */}
        <div className="p-1 rounded-xl bg-surface-container border border-outline-variant/60 flex gap-1">
          <button
            type="button"
            onClick={() => setActiveTab('hasher')}
            className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-lg transition-all ${
              activeTab === 'hasher'
                ? 'bg-primary text-white shadow-xs'
                : 'text-outline hover:text-on-surface'
            }`}
          >
            <ShieldCheck className="w-3.5 h-3.5" />
            <span>Generate</span>
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('verifier')}
            className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-lg transition-all ${
              activeTab === 'verifier'
                ? 'bg-primary text-white shadow-xs'
                : 'text-outline hover:text-on-surface'
            }`}
          >
            <CheckCircle2 className="w-3.5 h-3.5" />
            <span>Verify</span>
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('benchmark')}
            className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-lg transition-all ${
              activeTab === 'benchmark'
                ? 'bg-primary text-white shadow-xs'
                : 'text-outline hover:text-on-surface'
            }`}
          >
            <Gauge className="w-3.5 h-3.5" />
            <span>Benchmark</span>
          </button>
        </div>
      </div>

      {/* Main Tab View */}
      {activeTab === 'hasher' && <BcryptHasher />}
      {activeTab === 'verifier' && <BcryptVerifier />}
      {activeTab === 'benchmark' && <BcryptBenchmark />}
    </div>
  );
};

export default BcryptGeneratorTool;
