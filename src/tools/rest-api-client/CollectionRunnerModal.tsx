import React, { useState, useEffect, useCallback } from 'react';
import { Play, CheckCircle2, XCircle, Clock, X, RotateCcw, Loader2 } from 'lucide-react';
import { ApiRequest, Environment, CollectionRunReport, CollectionRunItemResult } from './types';
import { runCollectionSequence } from './collectionRunnerLogic';

export interface CollectionRunnerModalProps {
  isOpen: boolean;
  collectionName: string;
  requests: ApiRequest[];
  environment: Environment | null;
  onClose: () => void;
}

export const CollectionRunnerModal: React.FC<CollectionRunnerModalProps> = ({
  isOpen,
  collectionName,
  requests,
  environment,
  onClose,
}) => {
  const [isRunning, setIsRunning] = useState<boolean>(false);
  const [completedResults, setCompletedResults] = useState<CollectionRunItemResult[]>([]);
  const [report, setReport] = useState<CollectionRunReport | null>(null);

  const startRun = useCallback(async () => {
    if (requests.length === 0) return;
    setIsRunning(true);
    setCompletedResults([]);
    setReport(null);

    const finalReport = await runCollectionSequence(
      { collectionName, requests, env: environment },
      (itemResult) => {
        setCompletedResults((prev) => [...prev, itemResult]);
      }
    );

    setReport(finalReport);
    setIsRunning(false);
  }, [collectionName, requests, environment]);

  useEffect(() => {
    if (isOpen) {
      startRun();
    }
  }, [isOpen, startRun]);

  if (!isOpen) return null;

  const passedCount = completedResults.filter((r) => r.passed).length;
  const failedCount = completedResults.length - passedCount;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
      <div className="w-full max-w-2xl max-h-[85vh] rounded-2xl bg-surface-container-low border border-outline-variant overflow-hidden shadow-2xl flex flex-col">
        {/* Header */}
        <div className="p-4 border-b border-outline-variant flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Play className="w-5 h-5 text-primary" />
            <div>
              <span className="text-sm font-semibold text-on-surface block">
                Collection Runner: {collectionName}
              </span>
              <span className="text-[11px] text-outline">
                {requests.length} requests in sequence
                {environment ? ` • Env: ${environment.name}` : ''}
              </span>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-1.5 rounded-lg hover:bg-surface-container text-on-surface-variant hover:text-on-surface"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Progress & Metrics */}
        <div className="p-4 border-b border-outline-variant/60 bg-surface-container-lowest/50 space-y-3">
          <div className="flex items-center justify-between text-xs">
            <span className="font-medium text-on-surface">
              {isRunning
                ? `Running (${completedResults.length} / ${requests.length})`
                : 'Execution Finished'}
            </span>
            <div className="flex items-center gap-3">
              <span className="flex items-center gap-1 text-emerald-600 font-semibold">
                <CheckCircle2 className="w-3.5 h-3.5" />
                <span>{passedCount} Passed</span>
              </span>
              <span className="flex items-center gap-1 text-red-600 font-semibold">
                <XCircle className="w-3.5 h-3.5" />
                <span>{failedCount} Failed</span>
              </span>
              {report && (
                <span className="flex items-center gap-1 text-outline">
                  <Clock className="w-3.5 h-3.5" />
                  <span>{report.totalTimeMs} ms</span>
                </span>
              )}
            </div>
          </div>

          <div className="w-full h-1.5 rounded-full bg-surface-container overflow-hidden">
            <div
              className={`h-full transition-all duration-300 ${failedCount > 0 ? 'bg-amber-500' : 'bg-primary'}`}
              style={{
                width: `${requests.length > 0 ? (completedResults.length / requests.length) * 100 : 0}%`,
              }}
            />
          </div>
        </div>

        {/* Results List */}
        <div className="flex-1 overflow-y-auto p-4 space-y-2">
          {completedResults.map((item, idx) => (
            <div
              key={`${item.requestId}_${idx}`}
              className="p-3 rounded-xl bg-surface-container border border-outline-variant flex items-center justify-between gap-3 text-xs"
            >
              <div className="flex items-center gap-2.5 min-w-0 flex-1">
                {item.passed ? (
                  <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
                ) : (
                  <XCircle className="w-4 h-4 text-red-500 shrink-0" />
                )}
                <span className="font-mono font-bold text-[11px] text-primary shrink-0">
                  {item.method}
                </span>
                <div className="min-w-0 flex-1">
                  <p className="font-semibold text-on-surface truncate">{item.requestName}</p>
                  <p className="text-[11px] font-mono text-outline truncate">{item.url}</p>
                  {item.error && <p className="text-[10px] text-red-500 truncate">{item.error}</p>}
                </div>
              </div>

              <div className="flex items-center gap-2 shrink-0">
                <span
                  className={`px-2 py-0.5 rounded text-[10px] font-mono font-bold ${
                    item.status >= 200 && item.status < 300
                      ? 'bg-emerald-500/10 text-emerald-600'
                      : 'bg-red-500/10 text-red-600'
                  }`}
                >
                  {item.status || 'ERR'} {item.statusText}
                </span>
                <span className="text-[10px] text-outline font-mono">{item.timeMs}ms</span>
              </div>
            </div>
          ))}
        </div>

        {/* Footer */}
        <div className="p-3 bg-surface-container-lowest border-t border-outline-variant flex items-center justify-between">
          <span className="text-xs text-outline">
            {isRunning && (
              <span className="flex items-center gap-1.5 text-primary">
                <Loader2 className="w-3.5 h-3.5 animate-spin" />
                Executing requests...
              </span>
            )}
          </span>
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={startRun}
              disabled={isRunning}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-surface-container hover:bg-surface-container-high border border-outline-variant text-xs font-semibold text-on-surface disabled:opacity-40"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Run Again</span>
            </button>
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-1.5 rounded-lg bg-primary text-on-primary text-xs font-semibold hover:bg-primary/90"
            >
              Close
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
