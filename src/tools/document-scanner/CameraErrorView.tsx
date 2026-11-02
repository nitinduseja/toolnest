import React, { useRef } from 'react';
import { AlertCircle, RefreshCw, Upload, ShieldAlert, CameraOff } from 'lucide-react';
import { CameraErrorType } from './cameraErrorLogic';

export interface CameraErrorViewProps {
  errorType: CameraErrorType;
  errorMessage: string;
  onRetry: () => void;
  onFileFallback: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

export const CameraErrorView: React.FC<CameraErrorViewProps> = ({
  errorType,
  errorMessage,
  onRetry,
  onFileFallback,
}) => {
  const fileInputRef = useRef<HTMLInputElement>(null);

  return (
    <div className="p-6 max-w-md mx-auto text-center space-y-4">
      <div className="w-12 h-12 mx-auto rounded-full bg-red-500/10 flex items-center justify-center text-red-500">
        {errorType === 'denied' ? (
          <ShieldAlert className="w-6 h-6" />
        ) : errorType === 'notfound' ? (
          <CameraOff className="w-6 h-6" />
        ) : (
          <AlertCircle className="w-6 h-6" />
        )}
      </div>

      <div className="space-y-1">
        <h4 className="text-sm font-semibold text-on-surface">
          {errorType === 'denied' ? 'Camera Permission Denied' : 'Camera Unavailable'}
        </h4>
        <p className="text-xs text-outline">{errorMessage}</p>
      </div>

      {errorType === 'denied' && (
        <div className="p-3 rounded-xl bg-surface-container border border-outline-variant text-[11px] text-left text-on-surface-variant space-y-1.5">
          <p className="font-semibold text-on-surface">How to grant permission:</p>
          <ul className="list-disc list-inside space-y-1 text-outline">
            <li>
              Click the <span className="font-semibold text-on-surface">camera / lock icon</span> in
              your browser address bar.
            </li>
            <li>
              Toggle Camera to <span className="font-semibold text-emerald-500">Allow</span>.
            </li>
            <li>
              On Windows, verify{' '}
              <span className="font-semibold text-on-surface">
                Settings &gt; Privacy &gt; Camera
              </span>{' '}
              is turned ON.
            </li>
          </ul>
        </div>
      )}

      {errorType === 'inuse' && (
        <p className="text-[11px] text-outline">
          Please close any other programs using your webcam (Zoom, Teams, Skype, or other tabs) and
          click Try Again.
        </p>
      )}

      <div className="flex items-center justify-center gap-2 pt-1 flex-wrap">
        <button
          type="button"
          onClick={onRetry}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-surface-container hover:bg-surface-container-high border border-outline-variant text-xs font-semibold text-on-surface transition-colors cursor-pointer"
        >
          <RefreshCw className="w-3.5 h-3.5" />
          <span>Try Again</span>
        </button>

        <button
          type="button"
          onClick={() => fileInputRef.current?.click()}
          className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg bg-primary hover:bg-primary/90 text-on-primary text-xs font-semibold transition-colors cursor-pointer shadow-xs"
        >
          <Upload className="w-3.5 h-3.5" />
          <span>Upload Image / Photo</span>
        </button>

        <input
          ref={fileInputRef}
          type="file"
          accept="image/*,.jpg,.jpeg,.png,.webp,.bmp"
          onClick={(e) => e.stopPropagation()}
          onChange={onFileFallback}
          className="hidden"
        />
      </div>
    </div>
  );
};
