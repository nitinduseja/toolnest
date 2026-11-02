import React, { useRef, useState, useEffect } from 'react';
import { Camera, X, RefreshCw, AlertCircle, Zap, ZapOff, Layers, Check } from 'lucide-react';

export interface CameraScannerModalProps {
  isOpen: boolean;
  onClose: () => void;
  onCapture: (dataUrl: string) => void;
}

export const CameraScannerModal: React.FC<CameraScannerModalProps> = ({
  isOpen,
  onClose,
  onCapture,
}) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [facingMode, setFacingMode] = useState<'environment' | 'user'>('environment');
  const [hasTorch, setHasTorch] = useState<boolean>(false);
  const [torchOn, setTorchOn] = useState<boolean>(false);
  const [batchMode, setBatchMode] = useState<boolean>(false);
  const [batchCount, setBatchCount] = useState<number>(0);
  const [flashActive, setFlashActive] = useState<boolean>(false);

  useEffect(() => {
    if (!isOpen) return;

    let active = true;
    async function startCamera() {
      try {
        setErrorMsg(null);
        if (streamRef.current) {
          streamRef.current.getTracks().forEach((t) => t.stop());
        }
        const stream = await navigator.mediaDevices.getUserMedia({
          video: { facingMode, width: { ideal: 1920 }, height: { ideal: 1080 } },
          audio: false,
        });
        if (!active) {
          stream.getTracks().forEach((t) => t.stop());
          return;
        }
        streamRef.current = stream;
        const track = stream.getVideoTracks()[0];
        const caps = (track?.getCapabilities?.() || {}) as { torch?: boolean };
        setHasTorch(Boolean(caps.torch));
        setTorchOn(false);

        if (videoRef.current) {
          videoRef.current.srcObject = stream;
          await videoRef.current.play();
        }
      } catch (err) {
        setErrorMsg(err instanceof Error ? err.message : 'Unable to access camera.');
      }
    }

    startCamera();

    return () => {
      active = false;
      if (streamRef.current) {
        streamRef.current.getTracks().forEach((t) => t.stop());
      }
    };
  }, [isOpen, facingMode]);

  const toggleTorch = async () => {
    const track = streamRef.current?.getVideoTracks()[0];
    if (track) {
      try {
        const next = !torchOn;
        await track.applyConstraints({
          advanced: [{ torch: next } as MediaTrackConstraintSet],
        });
        setTorchOn(next);
      } catch {
        // Torch constraint failed
      }
    }
  };

  const handleCapture = () => {
    if (!videoRef.current) return;
    const video = videoRef.current;
    const canvas = document.createElement('canvas');
    canvas.width = video.videoWidth || 1280;
    canvas.height = video.videoHeight || 720;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
    const dataUrl = canvas.toDataURL('image/jpeg', 0.95);
    onCapture(dataUrl);

    if (batchMode) {
      setBatchCount((c) => c + 1);
      setFlashActive(true);
      setTimeout(() => setFlashActive(false), 200);
    } else {
      onClose();
    }
  };

  const toggleCamera = () => {
    setFacingMode((prev) => (prev === 'environment' ? 'user' : 'environment'));
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-xs">
      <div className="relative w-full max-w-2xl rounded-2xl bg-surface-container-low border border-outline-variant overflow-hidden shadow-2xl flex flex-col">
        {/* Header */}
        <div className="p-4 border-b border-outline-variant flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Camera className="w-5 h-5 text-primary" />
            <span className="text-sm font-semibold text-on-surface">Camera Scanner</span>
            {batchMode && (
              <span className="px-2 py-0.5 rounded-full bg-primary/20 text-primary text-[11px] font-semibold">
                Batch Mode ({batchCount})
              </span>
            )}
          </div>
          <div className="flex items-center gap-2">
            {hasTorch && (
              <button
                type="button"
                onClick={toggleTorch}
                title={torchOn ? 'Turn off flash' : 'Turn on flash'}
                className={`p-1.5 rounded-lg border transition-colors ${
                  torchOn
                    ? 'bg-amber-500/20 border-amber-500/40 text-amber-500'
                    : 'bg-surface-container border-outline-variant text-on-surface hover:bg-surface-container-high'
                }`}
              >
                {torchOn ? <Zap className="w-4 h-4" /> : <ZapOff className="w-4 h-4" />}
              </button>
            )}
            <button
              type="button"
              onClick={() => setBatchMode((b) => !b)}
              title={batchMode ? 'Switch to single photo' : 'Switch to batch scanning'}
              className={`flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-medium border transition-colors ${
                batchMode
                  ? 'bg-primary text-on-primary border-primary'
                  : 'bg-surface-container border-outline-variant text-on-surface hover:bg-surface-container-high'
              }`}
            >
              <Layers className="w-3.5 h-3.5" />
              <span>{batchMode ? 'Batch' : 'Single'}</span>
            </button>
            <button
              type="button"
              onClick={toggleCamera}
              title="Flip camera"
              className="p-1.5 rounded-lg bg-surface-container hover:bg-surface-container-high text-on-surface transition-colors"
            >
              <RefreshCw className="w-4 h-4" />
            </button>
            <button
              type="button"
              onClick={onClose}
              className="p-1.5 rounded-lg hover:bg-surface-container text-on-surface-variant hover:text-on-surface transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Video Canvas Stage */}
        <div className="relative bg-black aspect-4/3 flex items-center justify-center overflow-hidden">
          {errorMsg ? (
            <div className="p-6 text-center space-y-2 text-error">
              <AlertCircle className="w-8 h-8 mx-auto" />
              <p className="text-xs font-semibold">{errorMsg}</p>
              <p className="text-[11px] text-outline">
                Please ensure camera permissions are granted in your browser.
              </p>
            </div>
          ) : (
            <video
              ref={videoRef}
              playsInline
              autoPlay
              muted
              className="w-full h-full object-cover"
            />
          )}

          {/* Guide Overlay */}
          {!errorMsg && (
            <div className="absolute inset-8 border-2 border-dashed border-white/60 pointer-events-none rounded-xl" />
          )}

          {/* Shutter flash animation */}
          {flashActive && (
            <div className="absolute inset-0 bg-white pointer-events-none animate-fade-out" />
          )}
        </div>

        {/* Capture Bar */}
        <div className="p-4 bg-surface-container-lowest border-t border-outline-variant flex items-center justify-between">
          <div className="w-24">
            {batchMode && batchCount > 0 && (
              <span className="text-xs font-semibold text-outline">
                {batchCount} {batchCount === 1 ? 'page' : 'pages'}
              </span>
            )}
          </div>
          <button
            type="button"
            onClick={handleCapture}
            disabled={Boolean(errorMsg)}
            className="w-14 h-14 rounded-full border-4 border-white bg-primary hover:bg-primary/90 flex items-center justify-center text-on-primary transition-all shadow-lg active:scale-95 disabled:opacity-40"
          >
            <Camera className="w-6 h-6" />
          </button>
          <div className="w-24 flex justify-end">
            {batchMode && batchCount > 0 && (
              <button
                type="button"
                onClick={onClose}
                className="flex items-center gap-1 px-3 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-semibold shadow-xs transition-colors"
              >
                <Check className="w-3.5 h-3.5" />
                <span>Done</span>
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
