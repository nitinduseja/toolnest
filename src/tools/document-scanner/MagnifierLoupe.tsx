import React, { useEffect, useRef } from 'react';
import { Point } from './edgeDetectionLogic';

export interface MagnifierLoupeProps {
  sourceCanvas: HTMLCanvasElement | null;
  pos: Point | null; // Coordinate on source canvas
  screenPos: Point | null; // Coordinate on UI container
  visible: boolean;
  size?: number;
  zoom?: number;
}

function drawCrosshairs(ctx: CanvasRenderingContext2D, size: number): void {
  const mid = size / 2;
  ctx.strokeStyle = '#ef4444'; // Red crosshair
  ctx.lineWidth = 1.5;
  ctx.beginPath();
  ctx.moveTo(mid - 12, mid);
  ctx.lineTo(mid + 12, mid);
  ctx.moveTo(mid, mid - 12);
  ctx.lineTo(mid, mid + 12);
  ctx.stroke();

  ctx.strokeStyle = 'rgba(255, 255, 255, 0.8)';
  ctx.lineWidth = 1;
  ctx.beginPath();
  ctx.arc(mid, mid, 6, 0, Math.PI * 2);
  ctx.stroke();
}

export const MagnifierLoupe: React.FC<MagnifierLoupeProps> = ({
  sourceCanvas,
  pos,
  screenPos,
  visible,
  size = 110,
  zoom = 2.4,
}) => {
  const loupeRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    if (!visible || !pos || !sourceCanvas || !loupeRef.current) return;
    const loupe = loupeRef.current;
    const ctx = loupe.getContext('2d');
    if (!ctx) return;

    ctx.clearRect(0, 0, size, size);
    ctx.imageSmoothingQuality = 'high';

    const sampleW = size / zoom;
    const sampleH = size / zoom;
    const sx = Math.max(0, Math.min(sourceCanvas.width - sampleW, pos.x - sampleW / 2));
    const sy = Math.max(0, Math.min(sourceCanvas.height - sampleH, pos.y - sampleH / 2));

    ctx.drawImage(sourceCanvas, sx, sy, sampleW, sampleH, 0, 0, size, size);
    drawCrosshairs(ctx, size);
  }, [visible, pos, sourceCanvas, size, zoom]);

  if (!visible || !pos || !screenPos) return null;

  const topOffset = Math.max(12, screenPos.y - size - 24);
  const leftOffset = Math.max(12, screenPos.x - size / 2);

  return (
    <div
      style={{
        position: 'absolute',
        left: `${leftOffset}px`,
        top: `${topOffset}px`,
        width: `${size}px`,
        height: `${size}px`,
        pointerEvents: 'none',
      }}
      className="rounded-full shadow-2xl border-2 border-white ring-2 ring-primary/80 overflow-hidden z-50 bg-black/80"
    >
      <canvas ref={loupeRef} width={size} height={size} className="w-full h-full block" />
    </div>
  );
};
