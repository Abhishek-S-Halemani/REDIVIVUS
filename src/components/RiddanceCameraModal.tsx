import React, { useRef, useState, useEffect } from 'react';
import { Camera, X, RefreshCw, AlertCircle, Upload, Sparkles, Image as ImageIcon } from 'lucide-react';

interface RiddanceCameraModalProps {
  isOpen: boolean;
  onClose: () => void;
  onCapture: (imageDataUrl: string) => void;
}

export const RiddanceCameraModal: React.FC<RiddanceCameraModalProps> = ({
  isOpen,
  onClose,
  onCapture,
}) => {
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const [facingMode, setFacingMode] = useState<'environment' | 'user'>('environment');
  const [isInitializing, setIsInitializing] = useState<boolean>(true);
  const [isSimulated, setIsSimulated] = useState<boolean>(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [flashActive, setFlashActive] = useState<boolean>(false);

  useEffect(() => {
    if (!isOpen) {
      stopCamera();
      return;
    }

    startCamera();

    return () => {
      stopCamera();
    };
  }, [isOpen, facingMode]);

  const stopCamera = () => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach((track) => track.stop());
      streamRef.current = null;
    }
  };

  const startCamera = async () => {
    setIsInitializing(true);
    setErrorMessage(null);
    setIsSimulated(false);
    stopCamera();

    if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
      enableSimulatedCamera('Camera access is not available in this environment. Activated AI camera simulator.');
      return;
    }

    try {
      // First attempt: with facingMode constraint
      let stream: MediaStream;
      try {
        stream = await navigator.mediaDevices.getUserMedia({
          video: { facingMode: { ideal: facingMode } },
          audio: false,
        });
      } catch {
        // Fallback attempt: simple video constraint
        stream = await navigator.mediaDevices.getUserMedia({
          video: true,
          audio: false,
        });
      }

      streamRef.current = stream;

      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        await videoRef.current.play();
      }
      setIsInitializing(false);
    } catch (err: any) {
      console.warn('Hardware camera failed, activating live simulated camera mode:', err);
      enableSimulatedCamera(
        err.name === 'NotAllowedError'
          ? 'Camera permission was denied. Switched to live camera simulator.'
          : 'Hardware camera stream unavailable. Switched to live camera simulator.'
      );
    }
  };

  const enableSimulatedCamera = (msg: string) => {
    setIsSimulated(true);
    setErrorMessage(msg);
    setIsInitializing(false);
  };

  const handleCaptureSnapshot = () => {
    setFlashActive(true);
    setTimeout(() => setFlashActive(false), 200);

    const canvas = document.createElement('canvas');
    canvas.width = 640;
    canvas.height = 480;
    const ctx = canvas.getContext('2d');

    if (!ctx) return;

    if (!isSimulated && videoRef.current && videoRef.current.readyState >= 2 && videoRef.current.videoWidth > 0) {
      const video = videoRef.current;
      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;

      if (facingMode === 'user') {
        ctx.translate(canvas.width, 0);
        ctx.scale(-1, 1);
      }

      ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
      const dataUrl = canvas.toDataURL('image/jpeg', 0.9);
      stopCamera();
      onCapture(dataUrl);
      onClose();
      return;
    }

    // Fallback or Simulated Mode: Draw realistic high-contrast test waste image on canvas
    ctx.fillStyle = '#18181b';
    ctx.fillRect(0, 0, 640, 480);

    // Gradient background for object highlight
    const grad = ctx.createRadialGradient(320, 240, 20, 320, 240, 300);
    grad.addColorStop(0, '#3f3f46');
    grad.addColorStop(1, '#09090b');
    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, 640, 480);

    // Draw simulated scrap object (Circuit PCB / Bottle structure)
    ctx.fillStyle = '#065f46';
    ctx.fillRect(160, 120, 320, 240);

    // Copper traces
    ctx.strokeStyle = '#f59e0b';
    ctx.lineWidth = 4;
    ctx.beginPath();
    ctx.moveTo(180, 140); ctx.lineTo(300, 140); ctx.lineTo(340, 200); ctx.lineTo(440, 200);
    ctx.moveTo(180, 280); ctx.lineTo(260, 280); ctx.lineTo(310, 220); ctx.lineTo(440, 220);
    ctx.stroke();

    // Metallic contacts
    ctx.fillStyle = '#fbbf24';
    for (let i = 0; i < 6; i++) {
      ctx.fillRect(200 + i * 40, 160, 20, 20);
      ctx.fillRect(200 + i * 40, 300, 20, 20);
    }

    // Label overlay
    ctx.fillStyle = '#ffffff';
    ctx.font = 'bold 16px sans-serif';
    ctx.fillText('RIDDANCE AI CAMERA SNAPSHOT', 180, 80);
    ctx.font = '12px monospace';
    ctx.fillText(`TIMESTAMP: ${new Date().toISOString()}`, 180, 100);

    const simulatedDataUrl = canvas.toDataURL('image/jpeg', 0.9);
    stopCamera();
    onCapture(simulatedDataUrl);
    onClose();
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const dataUrl = event.target?.result as string;
      stopCamera();
      onCapture(dataUrl);
      onClose();
    };
    reader.readAsDataURL(file);
  };

  const toggleCameraFacing = () => {
    setFacingMode((prev) => (prev === 'environment' ? 'user' : 'environment'));
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-60 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in duration-200">
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        onChange={handleFileUpload}
        className="hidden"
      />

      <div className="relative w-full max-w-lg bg-slate-950 rounded-[32px] border border-white/10 shadow-[0_30px_90px_rgba(0,0,0,0.6)] overflow-hidden flex flex-col">
        {/* Header */}
        <div className="px-5 py-3.5 border-b border-white/10 flex items-center justify-between text-white bg-slate-900/80">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-full bg-rose-600/30 text-rose-400 flex items-center justify-center">
              <Camera className="w-4 h-4" />
            </div>
            <div>
              <div className="text-xs font-bold flex items-center gap-1.5">
                <span>Riddance Live Waste Camera</span>
                {isSimulated && (
                  <span className="text-[9px] bg-amber-500/20 text-amber-300 border border-amber-500/40 px-1.5 py-0.2 rounded font-mono">
                    Simulated Feed
                  </span>
                )}
              </div>
              <div className="text-[10px] text-slate-400">Position waste or scrap item in frame</div>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {!isSimulated && (
              <button
                onClick={toggleCameraFacing}
                className="p-2 rounded-xl bg-white/10 hover:bg-white/20 text-white transition-colors cursor-pointer"
                title="Flip Camera"
              >
                <RefreshCw className="w-3.5 h-3.5" />
              </button>
            )}
            <button
              onClick={() => fileInputRef.current?.click()}
              className="p-2 rounded-xl bg-white/10 hover:bg-white/20 text-white transition-colors cursor-pointer"
              title="Upload file from gallery"
            >
              <Upload className="w-3.5 h-3.5" />
            </button>
            <button
              onClick={onClose}
              className="p-2 rounded-xl bg-white/10 hover:bg-white/20 text-white transition-colors cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Viewfinder Area */}
        <div className="relative w-full aspect-[4/3] bg-black overflow-hidden flex items-center justify-center">
          {flashActive && <div className="absolute inset-0 bg-white z-20 pointer-events-none" />}

          {!isSimulated ? (
            <video
              ref={videoRef}
              playsInline
              muted
              autoPlay
              className={`w-full h-full object-cover ${facingMode === 'user' ? 'scale-x-[-1]' : ''}`}
            />
          ) : (
            /* Live Simulated Viewfinder Frame */
            <div className="relative w-full h-full bg-gradient-to-br from-slate-900 via-zinc-900 to-black flex flex-col items-center justify-center p-6 text-center overflow-hidden">
              <div className="absolute inset-0 opacity-20 bg-[radial-gradient(#f43f5e_1px,transparent_1px)] [background-size:16px_16px] animate-pulse" />

              <div className="relative z-10 space-y-3 max-w-xs">
                <div className="w-16 h-16 rounded-3xl bg-rose-500/20 border border-rose-500/40 text-rose-400 flex items-center justify-center mx-auto shadow-lg shadow-rose-500/20">
                  <Sparkles className="w-8 h-8 animate-pulse" />
                </div>
                <div>
                  <h4 className="text-sm font-extrabold text-white">AI Vision Viewfinder Ready</h4>
                  <p className="text-xs text-slate-400 mt-1 leading-relaxed">
                    {errorMessage || 'Tap "Click Photo" below to capture and run AI waste recyclability analysis.'}
                  </p>
                </div>
                <button
                  onClick={() => fileInputRef.current?.click()}
                  className="px-3.5 py-1.5 rounded-xl bg-white/10 hover:bg-white/20 text-white text-xs font-semibold border border-white/20 transition-all cursor-pointer inline-flex items-center gap-1.5"
                >
                  <ImageIcon className="w-3.5 h-3.5 text-rose-400" />
                  <span>Choose Gallery Image Instead</span>
                </button>
              </div>
            </div>
          )}

          {/* Viewfinder Target Guidelines */}
          <div className="absolute inset-6 pointer-events-none border border-white/25 rounded-2xl flex flex-col justify-between p-3">
            <div className="flex justify-between">
              <div className="w-4 h-4 border-t-2 border-l-2 border-rose-500 rounded-tl-sm" />
              <div className="w-4 h-4 border-t-2 border-r-2 border-rose-500 rounded-tr-sm" />
            </div>
            <div className="text-center">
              <span className="text-[10px] font-mono text-white/80 bg-black/60 px-2.5 py-0.5 rounded-full border border-white/15 backdrop-blur-md">
                AI Vision Auto-Detect Active
              </span>
            </div>
            <div className="flex justify-between">
              <div className="w-4 h-4 border-b-2 border-l-2 border-rose-500 rounded-bl-sm" />
              <div className="w-4 h-4 border-b-2 border-r-2 border-rose-500 rounded-br-sm" />
            </div>
          </div>

          {isInitializing && (
            <div className="absolute inset-0 flex flex-col items-center justify-center bg-black/80 text-white gap-2">
              <div className="w-6 h-6 border-2 border-rose-500 border-t-transparent rounded-full animate-spin" />
              <span className="text-xs font-medium text-slate-300">Initializing camera lens...</span>
            </div>
          )}
        </div>

        {/* Shutter Footer Controls */}
        <div className="p-4 bg-slate-900 border-t border-white/10 flex flex-col items-center justify-center gap-2">
          <div className="flex items-center gap-2 w-full max-w-xs justify-center">
            <button
              onClick={handleCaptureSnapshot}
              disabled={isInitializing}
              className="flex-1 px-6 py-3.5 rounded-full bg-rose-600 hover:bg-rose-500 active:scale-95 text-white font-extrabold text-sm tracking-wide transition-all cursor-pointer shadow-lg shadow-rose-600/40 flex items-center justify-center gap-2 disabled:opacity-40"
            >
              <Camera className="w-5 h-5 text-white stroke-[2.2]" />
              <span>Click Photo</span>
            </button>
          </div>
          <span className="text-[11px] text-slate-400">Tap to capture image and analyze recyclability with Gemini Vision</span>
        </div>
      </div>
    </div>
  );
};
