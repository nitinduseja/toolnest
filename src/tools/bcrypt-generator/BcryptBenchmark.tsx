import React, { useState } from 'react';
import { Gauge, Play, Cpu } from 'lucide-react';
import { runCostBenchmark } from './bcryptLogic';
import { CostBenchmarkItem } from './types';

export const BcryptBenchmark: React.FC = () => {
  const [running, setRunning] = useState(false);
  const [results, setResults] = useState<CostBenchmarkItem[]>([
    { rounds: 6, durationMs: 8, iterations: 64, securityLevel: 'Fast / Dev' },
    { rounds: 8, durationMs: 32, iterations: 256, securityLevel: 'Fast / Dev' },
    { rounds: 10, durationMs: 125, iterations: 1024, securityLevel: 'Recommended' },
    { rounds: 12, durationMs: 510, iterations: 4096, securityLevel: 'High Security' },
  ]);

  const handleRun = async () => {
    setRunning(true);
    try {
      const res = await runCostBenchmark('BenchPassword2026!', [6, 8, 10, 11]);
      setResults(res);
    } finally {
      setRunning(false);
    }
  };

  return (
    <div className="p-5 rounded-2xl bg-surface-container-low border border-outline-variant/60 space-y-4">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="space-y-0.5">
          <div className="flex items-center gap-2 text-xs font-bold text-on-surface uppercase tracking-wider">
            <Gauge className="w-3.5 h-3.5 text-primary" />
            <span>Cost Factor Performance Benchmark</span>
          </div>
          <p className="text-xs text-outline">
            Bcrypt uses an exponential work factor (2^cost iterations) to resist brute-force
            hardware attacks.
          </p>
        </div>

        <button
          type="button"
          disabled={running}
          onClick={handleRun}
          className="flex items-center gap-1.5 px-3.5 py-1.5 text-xs font-bold rounded-xl bg-primary text-white shadow-xs hover:bg-primary/90 disabled:opacity-50 transition-all cursor-pointer shrink-0"
        >
          <Play className="w-3.5 h-3.5" />
          <span>{running ? 'Benchmarking CPU...' : 'Run Live Benchmark'}</span>
        </button>
      </div>

      {/* Benchmark Table */}
      <div className="overflow-x-auto rounded-xl border border-outline-variant/60 bg-surface-container">
        <table className="w-full text-left border-collapse text-xs">
          <thead>
            <tr className="border-b border-outline-variant/40 bg-surface-container-high/60 text-outline uppercase font-semibold text-[10px]">
              <th className="p-3">Rounds</th>
              <th className="p-3">Key Expansions</th>
              <th className="p-3">Compute Time</th>
              <th className="p-3">Security Level</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-outline-variant/40 font-mono">
            {results.map((item) => (
              <tr
                key={item.rounds}
                className="hover:bg-surface-container-high/40 transition-colors"
              >
                <td className="p-3 font-bold text-on-surface">Round {item.rounds}</td>
                <td className="p-3 text-outline">
                  2^{item.rounds} ({item.iterations.toLocaleString()} iter)
                </td>
                <td className="p-3 font-bold text-primary">{item.durationMs} ms</td>
                <td className="p-3">
                  <span
                    className={`px-2 py-0.5 rounded-full text-[10px] font-sans font-semibold ${
                      item.securityLevel === 'High Security'
                        ? 'bg-purple-500/10 text-purple-500'
                        : item.securityLevel === 'Recommended'
                          ? 'bg-emerald-500/10 text-emerald-500'
                          : 'bg-amber-500/10 text-amber-500'
                    }`}
                  >
                    {item.securityLevel}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Security Advisory Callout */}
      <div className="p-3.5 rounded-xl bg-surface-container border border-outline-variant/40 flex items-start gap-2.5 text-xs text-outline">
        <Cpu className="w-4 h-4 text-primary shrink-0 mt-0.5" />
        <p>
          <strong className="text-on-surface">Work Factor Rule of Thumb:</strong> Each increment of
          1 in cost doubles the computation time required to verify or crack a password. Round 10–12
          is the industry standard balance between server latency and brute-force protection.
        </p>
      </div>
    </div>
  );
};
