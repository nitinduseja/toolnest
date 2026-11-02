import React, { useRef, useState } from 'react';
import { X, ZoomIn, ZoomOut, Move } from 'lucide-react';
import { StampOverlay } from './scannerDb';

export interface PageStampOverlayProps {
  stamp: StampOverlay | null;
  onUpdate: (stamp: StampOverlay | null) => void;
}

export const PageStampOverlay: React.FC<PageStampOverlayProps> = ({ stamp, onUpdate }) => {
  const [isDragging, setIsDragging] = useState<boolean>(false);
  const [isSelected, setIsSelected] = useState<boolean>(true);
  const dragStartRef = useRef<{ clientX: number; clientY: number; startX: number; startY: number }>(
    { clientX: 0, clientY: 0, startX: 0, startY: 0 }
  );

  if (!stamp || !stamp.dataUrl) return null;

  const handlePointerDown = (e: React.PointerEvent<HTMLDivElement>) => {
    e.stopPropagation();
    setIsSelected(true);
    setIsDragging(true);
    dragStartRef.current = {
      clientX: e.clientX,
      clientY: e.clientY,
      startX: stamp.xPercent,
      startY: stamp.yPercent,
    };
    (e.target as HTMLElement).setPointerCapture(e.pointerId);
  };

  const handlePointerMove = (e: React.PointerEvent<HTMLDivElement>) => {
    if (!isDragging) return;
    const parent = e.currentTarget.parentElement;
    if (!parent) return;

    const rect = parent.getBoundingClientRect();
    const deltaX = ((e.clientX - dragStartRef.current.clientX) / rect.width) * 100;
    const deltaY = ((e.clientY - dragStartRef.current.clientY) / rect.height) * 100;

    const nextX = Math.max(0, Math.min(85, dragStartRef.current.startX + deltaX));
    const nextY = Math.max(0, Math.min(85, dragStartRef.current.startY + deltaY));

    onUpdate({ ...stamp, xPercent: nextX, yPercent: nextY });
  };

  const adjustScale = (delta: number) => {
    const nextScale = Math.max(0.5, Math.min(2.5, (stamp.scale || 1) + delta));
    onUpdate({ ...stamp, scale: nextScale });
  };

  const isNearTop = stamp.yPercent < 15;

  return (
    <div
      style={{
        position: 'absolute',
        left: `${stamp.xPercent}%`,
        top: `${stamp.yPercent}%`,
        transform: `scale(${stamp.scale || 1})`,
        transformOrigin: 'top left',
      }}
      onClick={(e) => {
        e.stopPropagation();
        setIsSelected(true);
      }}
      className={`group absolute cursor-grab active:cursor-grabbing select-none touch-none p-1.5 border-2 rounded transition-colors ${
        isSelected
          ? 'border-primary bg-primary/10 shadow-lg'
          : 'border-dashed border-primary/40 hover:border-primary bg-white/20'
      }`}
    >
      <div
        onPointerDown={handlePointerDown}
        onPointerMove={handlePointerMove}
        onPointerUp={() => setIsDragging(false)}
        className="w-full h-full"
      >
        <img
          src={stamp.dataUrl}
          alt="Stamp or signature"
          className="w-32 h-auto pointer-events-none drop-shadow block"
        />
      </div>

      {/* Persistent Corner Delete Button */}
      <button
        type="button"
        onClick={(e) => {
          e.stopPropagation();
          onUpdate(null);
        }}
        title="Remove signature"
        className="absolute -top-3 -right-3 w-6 h-6 rounded-full bg-red-600 hover:bg-red-700 text-white flex items-center justify-center shadow-lg transition-transform hover:scale-110 cursor-pointer z-30"
      >
        <X className="w-3.5 h-3.5" />
      </button>

      {/* Floating Scale & Move Toolbar (Directly attached with no hover gap) */}
      <div
        className={`absolute right-0 flex items-center gap-1 bg-neutral-900/90 text-white rounded-md px-2 py-1 text-[11px] shadow-xl z-20 transition-opacity ${
          isNearTop ? 'top-full mt-1.5' : 'bottom-full mb-1.5'
        } ${isSelected ? 'opacity-100' : 'opacity-0 group-hover:opacity-100'}`}
      >
        <Move className="w-3 h-3 text-white/50 shrink-0" />
        <span className="text-[10px] text-white/60 mr-1">Drag</span>
        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            adjustScale(-0.15);
          }}
          title="Make smaller"
          className="p-0.5 hover:text-primary transition-colors cursor-pointer"
        >
          <ZoomOut className="w-3.5 h-3.5" />
        </button>
        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            adjustScale(0.15);
          }}
          title="Make larger"
          className="p-0.5 hover:text-primary transition-colors cursor-pointer"
        >
          <ZoomIn className="w-3.5 h-3.5" />
        </button>
      </div>
    </div>
  );
};
