import React, { useRef, useState, useEffect, useCallback } from 'react';
import { Crop, X, Sparkles, RotateCcw, Check } from 'lucide-react';
import {
  Point,
  QuadCorners,
  getDefaultCorners,
  detectDocumentCorners,
  distance,
} from './edgeDetectionLogic';
import { warpPerspective } from './perspectiveLogic';
import { MagnifierLoupe } from './MagnifierLoupe';

export interface CornerCropModalProps {
  isOpen: boolean;
  imageSrc: string;
  onClose: () => void;
  onApply: (croppedDataUrl: string) => void;
}

type CornerKey = 'tl' | 'tr' | 'br' | 'bl';

export const CornerCropModal: React.FC<CornerCropModalProps> = ({
  isOpen,
  imageSrc,
  onClose,
  onApply,
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const imgRef = useRef<HTMLImageElement | null>(null);
  const [corners, setCorners] = useState<QuadCorners | null>(null);
  const [activeHandle, setActiveHandle] = useState<CornerKey | null>(null);
  const [screenPos, setScreenPos] = useState<Point | null>(null);

  const drawStage = useCallback(() => {
    const canvas = canvasRef.current;
    const img = imgRef.current;
    if (!canvas || !img || !corners) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.drawImage(img, 0, 0, canvas.width, canvas.height);

    // Draw shaded polygon
    ctx.beginPath();
    ctx.moveTo(corners.tl.x, corners.tl.y);
    ctx.lineTo(corners.tr.x, corners.tr.y);
    ctx.lineTo(corners.br.x, corners.br.y);
    ctx.lineTo(corners.bl.x, corners.bl.y);
    ctx.closePath();
    ctx.fillStyle = 'rgba(14, 165, 233, 0.18)';
    ctx.fill();
    ctx.lineWidth = 2.5;
    ctx.strokeStyle = '#0ea5e9';
    ctx.stroke();

    // Draw 4 handles
    const entries: [CornerKey, Point][] = [
      ['tl', corners.tl],
      ['tr', corners.tr],
      ['br', corners.br],
      ['bl', corners.bl],
    ];

    for (const [, pt] of entries) {
      ctx.beginPath();
      ctx.arc(pt.x, pt.y, 10, 0, 2 * Math.PI);
      ctx.fillStyle = '#0ea5e9';
      ctx.fill();
      ctx.lineWidth = 2;
      ctx.strokeStyle = '#ffffff';
      ctx.stroke();
    }
  }, [corners]);

  useEffect(() => {
    if (!isOpen || !imageSrc) return;
    const img = new Image();
    img.crossOrigin = 'anonymous';
    img.onload = () => {
      imgRef.current = img;
      const canvas = canvasRef.current;
      if (canvas) {
        canvas.width = img.width;
        canvas.height = img.height;
        const ctx = canvas.getContext('2d');
        if (ctx) {
          ctx.drawImage(img, 0, 0);
          const imgData = ctx.getImageData(0, 0, img.width, img.height);
          const detected = detectDocumentCorners(imgData);
          setCorners(detected);
        }
      }
    };
    img.src = imageSrc;
  }, [isOpen, imageSrc]);

  useEffect(() => {
    drawStage();
  }, [drawStage]);

  const handlePointerDown = (e: React.PointerEvent<HTMLCanvasElement>) => {
    if (!corners || !canvasRef.current) return;
    const rect = canvasRef.current.getBoundingClientRect();
    const scaleX = canvasRef.current.width / rect.width;
    const scaleY = canvasRef.current.height / rect.height;
    const p: Point = {
      x: (e.clientX - rect.left) * scaleX,
      y: (e.clientY - rect.top) * scaleY,
    };

    let closest: CornerKey = 'tl';
    let minDist = Infinity;
    const list: [CornerKey, Point][] = [
      ['tl', corners.tl],
      ['tr', corners.tr],
      ['br', corners.br],
      ['bl', corners.bl],
    ];
    for (const [key, pt] of list) {
      const d = distance(p, pt);
      if (d < minDist) {
        minDist = d;
        closest = key;
      }
    }
    if (minDist < 45 * scaleX) {
      setActiveHandle(closest);
      const parentRect = e.currentTarget.parentElement?.getBoundingClientRect();
      if (parentRect) {
        setScreenPos({ x: e.clientX - parentRect.left, y: e.clientY - parentRect.top });
      }
      (e.target as HTMLElement).setPointerCapture(e.pointerId);
    }
  };

  const handlePointerMove = (e: React.PointerEvent<HTMLCanvasElement>) => {
    if (!activeHandle || !corners || !canvasRef.current) return;
    const parentRect = e.currentTarget.parentElement?.getBoundingClientRect();
    if (parentRect) {
      setScreenPos({ x: e.clientX - parentRect.left, y: e.clientY - parentRect.top });
    }
    const rect = canvasRef.current.getBoundingClientRect();
    const scaleX = canvasRef.current.width / rect.width;
    const scaleY = canvasRef.current.height / rect.height;
    const x = Math.max(0, Math.min(canvasRef.current.width, (e.clientX - rect.left) * scaleX));
    const y = Math.max(0, Math.min(canvasRef.current.height, (e.clientY - rect.top) * scaleY));

    setCorners((prev) => (prev ? { ...prev, [activeHandle]: { x, y } } : null));
  };

  const handlePointerUp = () => {
    setActiveHandle(null);
    setScreenPos(null);
  };

  const handleApply = () => {
    const canvas = canvasRef.current;
    if (!canvas || !corners) return;
    const ctx = canvas.getContext('2d');
    const img = imgRef.current;
    if (!ctx || !img) return;

    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.drawImage(img, 0, 0);
    const srcData = ctx.getImageData(0, 0, canvas.width, canvas.height);
    const warped = warpPerspective(srcData, corners);

    const outCanvas = document.createElement('canvas');
    outCanvas.width = warped.width;
    outCanvas.height = warped.height;
    const outCtx = outCanvas.getContext('2d');
    if (!outCtx) return;
    outCtx.putImageData(warped, 0, 0);

    onApply(outCanvas.toDataURL('image/jpeg', 0.94));
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-xs">
      <div className="relative w-full max-w-4xl max-h-[90vh] rounded-2xl bg-surface-container-low border border-outline-variant flex flex-col overflow-hidden shadow-2xl">
        {/* Header */}
        <div className="p-4 border-b border-outline-variant flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Crop className="w-5 h-5 text-primary" />
            <span className="text-sm font-semibold text-on-surface">
              Document Edge Detection & Perspective Warp
            </span>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-1.5 rounded-lg hover:bg-surface-container text-on-surface-variant hover:text-on-surface transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Canvas Workspace */}
        <div className="relative flex-1 bg-black/90 p-4 flex items-center justify-center overflow-auto min-h-[300px]">
          <canvas
            ref={canvasRef}
            onPointerDown={handlePointerDown}
            onPointerMove={handlePointerMove}
            onPointerUp={handlePointerUp}
            className="max-h-[60vh] max-w-full object-contain cursor-crosshair touch-none shadow-md rounded"
          />
          <MagnifierLoupe
            sourceCanvas={canvasRef.current}
            pos={corners && activeHandle ? corners[activeHandle] : null}
            screenPos={screenPos}
            visible={!!activeHandle}
          />
        </div>

        {/* Action Toolbar */}
        <div className="p-3 bg-surface-container-lowest border-t border-outline-variant flex items-center justify-between flex-wrap gap-2 text-xs">
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => {
                if (canvasRef.current && imgRef.current) {
                  const ctx = canvasRef.current.getContext('2d');
                  if (ctx) {
                    ctx.drawImage(imgRef.current, 0, 0);
                    const imgData = ctx.getImageData(
                      0,
                      0,
                      imgRef.current.width,
                      imgRef.current.height
                    );
                    setCorners(detectDocumentCorners(imgData));
                  }
                }
              }}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-surface-container hover:bg-surface-container-high text-on-surface transition-colors font-medium"
            >
              <Sparkles className="w-3.5 h-3.5 text-primary" />
              <span>Auto-Detect</span>
            </button>
            <button
              type="button"
              onClick={() => {
                if (canvasRef.current) {
                  setCorners(
                    getDefaultCorners(canvasRef.current.width, canvasRef.current.height, 0.02)
                  );
                }
              }}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-surface-container hover:bg-surface-container-high text-on-surface transition-colors font-medium"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Reset Corners</span>
            </button>
          </div>

          <button
            type="button"
            onClick={handleApply}
            className="flex items-center gap-1.5 px-4 py-2 rounded-lg bg-primary text-on-primary hover:bg-primary/90 font-semibold shadow-xs transition-colors"
          >
            <Check className="w-4 h-4" />
            <span>Apply Crop & Perspective</span>
          </button>
        </div>
      </div>
    </div>
  );
};
