import React, { useRef, useState } from 'react';
import { Upload, Image as ImageIcon } from 'lucide-react';

export interface ImageDropZoneProps {
  onFilesSelected: (files: File[]) => void;
  disabled?: boolean;
}

const isImageFile = (file: File): boolean => {
  if (file.type && file.type.startsWith('image/')) return true;
  return /\.(jpe?g|png|webp|avif|gif|bmp|svg|tiff?|ico)$/i.test(file.name);
};

export const ImageDropZone: React.FC<ImageDropZoneProps> = ({
  onFilesSelected,
  disabled = false,
}) => {
  const [isDragOver, setIsDragOver] = useState<boolean>(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    if (!disabled) setIsDragOver(true);
  };

  const handleDragLeave = () => {
    setIsDragOver(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
    if (disabled || !e.dataTransfer.files) return;

    const files = Array.from(e.dataTransfer.files).filter(isImageFile);
    if (files.length > 0) onFilesSelected(files);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files) return;
    const files = Array.from(e.target.files).filter(isImageFile);
    if (files.length > 0) onFilesSelected(files);
    e.target.value = '';
  };

  const triggerUpload = () => {
    if (!disabled) fileInputRef.current?.click();
  };

  return (
    <div
      role="button"
      tabIndex={0}
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
      onClick={triggerUpload}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          triggerUpload();
        }
      }}
      className={`p-6 sm:p-8 rounded-2xl border-2 border-dashed transition-all text-center cursor-pointer flex flex-col items-center justify-center space-y-2.5 ${
        isDragOver
          ? 'border-primary bg-primary/5 scale-[1.005]'
          : 'border-outline-variant bg-surface-container-low hover:bg-surface-container hover:border-primary/50'
      } ${disabled ? 'opacity-50 pointer-events-none' : ''}`}
    >
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*,.jpg,.jpeg,.png,.webp,.avif,.gif,.bmp"
        multiple
        onClick={(e) => e.stopPropagation()}
        onChange={handleInputChange}
        className="hidden"
      />

      <div className="w-12 h-12 rounded-2xl bg-primary/10 flex items-center justify-center text-primary">
        {isDragOver ? (
          <Upload className="w-6 h-6 animate-bounce" />
        ) : (
          <ImageIcon className="w-6 h-6" />
        )}
      </div>

      <div className="space-y-1">
        <p className="text-xs sm:text-sm font-semibold text-on-surface">
          Drop images here or <span className="text-primary hover:underline">browse</span>
        </p>
        <p className="text-[11px] text-outline">
          Supports JPEG, PNG, WebP, AVIF, GIF, and BMP • 100% Client-Side Privacy
        </p>
      </div>
    </div>
  );
};
