import React, { useRef, useState, useEffect } from 'react';
import { PenTool, X, RotateCcw, Check, Stamp } from 'lucide-react';
import { generateOfficialStamp, StampType } from './stampGeneratorLogic';

export interface SignaturePadModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (signatureDataUrl: string) => void;
}

export const SignaturePadModal: React.FC<SignaturePadModalProps> = ({
  isOpen,
  onClose,
  onSave,
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [tab, setTab] = useState<'draw' | 'stamp'>('draw');
  const [isDrawing, setIsDrawing] = useState<boolean>(false);
  const [penColor, setPenColor] = useState<string>('#0f172a');
  const [hasDrawn, setHasDrawn] = useState<boolean>(false);

  const initCanvas = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    canvas.width = 500;
    canvas.height = 240;
    const ctx = canvas.getContext('2d');
    if (ctx) {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
    }
    setHasDrawn(false);
  };

  useEffect(() => {
    if (isOpen) {
      initCanvas();
    }
  }, [isOpen, tab]);

  const handleSelectStamp = (st: StampType) => {
    if (!canvasRef.current) return;
    generateOfficialStamp(canvasRef.current, st);
    setHasDrawn(true);
  };

  const handlePointerDown = (e: React.PointerEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const rect = canvas.getBoundingClientRect();
    const x = (e.clientX - rect.left) * (canvas.width / rect.width);
    const y = (e.clientY - rect.top) * (canvas.height / rect.height);

    ctx.beginPath();
    ctx.moveTo(x, y);
    ctx.strokeStyle = penColor;
    ctx.lineWidth = 2.5;
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';
    setIsDrawing(true);
    setHasDrawn(true);
    (e.target as HTMLElement).setPointerCapture(e.pointerId);
  };

  const handlePointerMove = (e: React.PointerEvent<HTMLCanvasElement>) => {
    if (!isDrawing) return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const rect = canvas.getBoundingClientRect();
    const x = (e.clientX - rect.left) * (canvas.width / rect.width);
    const y = (e.clientY - rect.top) * (canvas.height / rect.height);

    ctx.lineTo(x, y);
    ctx.stroke();
  };

  const handlePointerUp = () => {
    setIsDrawing(false);
  };

  const handleClear = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (ctx) {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
    }
    setHasDrawn(false);
  };

  const handleSave = () => {
    const canvas = canvasRef.current;
    if (!canvas || !hasDrawn) return;
    const dataUrl = canvas.toDataURL('image/png');
    onSave(dataUrl);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-xs">
      <div className="relative w-full max-w-lg rounded-2xl bg-surface-container-low border border-outline-variant overflow-hidden shadow-2xl flex flex-col">
        {/* Header */}
        <div className="p-4 border-b border-outline-variant flex items-center justify-between">
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={() => setTab('draw')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors ${
                tab === 'draw'
                  ? 'bg-primary text-on-primary shadow-xs'
                  : 'bg-surface-container text-on-surface hover:bg-surface-container-high'
              }`}
            >
              <PenTool className="w-3.5 h-3.5" />
              <span>Signature Pad</span>
            </button>
            <button
              type="button"
              onClick={() => setTab('stamp')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors ${
                tab === 'stamp'
                  ? 'bg-primary text-on-primary shadow-xs'
                  : 'bg-surface-container text-on-surface hover:bg-surface-container-high'
              }`}
            >
              <Stamp className="w-3.5 h-3.5" />
              <span>Business Stamp</span>
            </button>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-1.5 rounded-lg hover:bg-surface-container text-on-surface-variant hover:text-on-surface transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Canvas Drawing Stage */}
        <div className="p-4 bg-white flex flex-col items-center justify-center gap-3">
          {tab === 'stamp' && (
            <div className="flex items-center gap-2 flex-wrap justify-center w-full pb-2 border-b border-slate-200">
              {(['APPROVED', 'CONFIDENTIAL', 'PAID', 'DRAFT'] as StampType[]).map((st) => (
                <button
                  key={st}
                  type="button"
                  onClick={() => handleSelectStamp(st)}
                  className="px-2.5 py-1 rounded text-xs font-bold border border-slate-300 hover:bg-slate-100 transition-colors"
                >
                  {st}
                </button>
              ))}
            </div>
          )}
          <canvas
            ref={canvasRef}
            onPointerDown={tab === 'draw' ? handlePointerDown : undefined}
            onPointerMove={tab === 'draw' ? handlePointerMove : undefined}
            onPointerUp={tab === 'draw' ? handlePointerUp : undefined}
            className="w-full h-48 border border-dashed border-slate-300 rounded-xl cursor-crosshair touch-none"
          />
        </div>

        {/* Controls Bar */}
        <div className="p-3 bg-surface-container-lowest border-t border-outline-variant flex items-center justify-between flex-wrap gap-2 text-xs">
          <div className="flex items-center gap-2">
            {tab === 'draw' && (
              <>
                <span className="text-outline">Color:</span>
                {['#0f172a', '#1d4ed8', '#059669', '#dc2626'].map((col) => (
                  <button
                    key={col}
                    type="button"
                    onClick={() => setPenColor(col)}
                    style={{ backgroundColor: col }}
                    className={`w-6 h-6 rounded-full border-2 transition-transform ${
                      penColor === col
                        ? 'scale-110 border-primary ring-2 ring-primary/40'
                        : 'border-white'
                    }`}
                  />
                ))}
              </>
            )}
            <button
              type="button"
              onClick={handleClear}
              className="flex items-center gap-1 px-2.5 py-1 rounded-lg bg-surface-container hover:bg-surface-container-high text-on-surface"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Clear</span>
            </button>
          </div>

          <button
            type="button"
            onClick={handleSave}
            disabled={!hasDrawn}
            className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg bg-primary text-on-primary hover:bg-primary/90 font-semibold shadow-xs disabled:opacity-40"
          >
            <Check className="w-4 h-4" />
            <span>Apply to Page</span>
          </button>
        </div>
      </div>
    </div>
  );
};
