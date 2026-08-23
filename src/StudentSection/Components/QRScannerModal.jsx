import React, { useState, useEffect, useRef } from 'react';

export function QRScannerModal({ isOpen, onClose, onScanSuccess, courseCode, expectedSessionId }) {
  const [cameraActive, setCameraActive] = useState(false);
  const [cameraError, setCameraError] = useState('');
  const [manualCode, setManualCode] = useState('');
  const [activeTab, setActiveTab] = useState('camera'); // 'camera' | 'manual'
  const [torchOn, setTorchOn] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [decoderLoaded, setDecoderLoaded] = useState(false);

  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const fileInputRef = useRef(null);
  const streamRef = useRef(null);
  const animationFrameRef = useRef(null);

  // 1. Dynamically load jsQR script if not natively present
  useEffect(() => {
    if (window.jsQR || 'BarcodeDetector' in window) {
      setDecoderLoaded(true);
      return;
    }

    const script = document.createElement('script');
    script.src = 'https://cdn.jsdelivr.net/npm/jsqr@1.4.0/dist/jsQR.min.js';
    script.async = true;
    script.onload = () => setDecoderLoaded(true);
    script.onerror = () => setDecoderLoaded(false);
    document.body.appendChild(script);

    return () => {
      // Keep script in document for reuse
    };
  }, []);

  // 2. Start Camera Stream
  useEffect(() => {
    if (!isOpen || activeTab !== 'camera') {
      stopCamera();
      return;
    }

    let isMounted = true;

    async function startCamera() {
      setCameraError('');
      try {
        const stream = await navigator.mediaDevices.getUserMedia({
          video: {
            facingMode: { ideal: 'environment' },
            width: { ideal: 1280 },
            height: { ideal: 720 },
          },
          audio: false,
        });

        if (!isMounted) {
          stream.getTracks().forEach((t) => t.stop());
          return;
        }

        streamRef.current = stream;
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
          videoRef.current.setAttribute('playsinline', 'true');
          await videoRef.current.play();
          setCameraActive(true);
          startScanningLoop();
        }
      } catch (err) {
        console.error("Camera Error:", err);
        setCameraError(
          err.name === 'NotAllowedError'
            ? 'Camera permission denied. Please allow camera access or use the manual passcode tab.'
            : 'Unable to start camera. Please switch to manual passcode entry.'
        );
        setActiveTab('manual');
      }
    }

    startCamera();

    return () => {
      isMounted = false;
      stopCamera();
    };
  }, [isOpen, activeTab, decoderLoaded]);

  const stopCamera = () => {
    if (animationFrameRef.current) {
      cancelAnimationFrame(animationFrameRef.current);
      animationFrameRef.current = null;
    }
    if (streamRef.current) {
      streamRef.current.getTracks().forEach((t) => t.stop());
      streamRef.current = null;
    }
    setCameraActive(false);
    setTorchOn(false);
  };

  // Toggle Torch / Flashlight if supported
  const toggleTorch = async () => {
    if (!streamRef.current) return;
    const track = streamRef.current.getVideoTracks()[0];
    if (track && track.getCapabilities && track.getCapabilities().torch) {
      try {
        await track.applyConstraints({
          advanced: [{ torch: !torchOn }],
        });
        setTorchOn(!torchOn);
      } catch (e) {
        console.error("Flashlight error:", e);
      }
    }
  };

  // Universal QR Decoder Loop (BarcodeDetector + jsQR)
  const startScanningLoop = () => {
    let barcodeDetector = null;
    if ('BarcodeDetector' in window) {
      try {
        barcodeDetector = new window.BarcodeDetector({ formats: ['qr_code'] });
      } catch (e) {
        console.warn("BarcodeDetector init error, falling back to jsQR:", e);
      }
    }

    const scanFrame = async () => {
      if (!videoRef.current || videoRef.current.readyState < 2 || isProcessing) {
        animationFrameRef.current = requestAnimationFrame(scanFrame);
        return;
      }

      try {
        // Attempt 1: Native BarcodeDetector (Super Fast on supported browsers)
        if (barcodeDetector) {
          const barcodes = await barcodeDetector.detect(videoRef.current);
          if (barcodes.length > 0) {
            handleParsedQR(barcodes[0].rawValue);
            return;
          }
        }

        // Attempt 2: Canvas frame reading via jsQR (Universal Fallback for iOS/Android/Desktop)
        if (window.jsQR) {
          const canvas = canvasRef.current || document.createElement('canvas');
          const ctx = canvas.getContext('2d', { willReadFrequently: true });
          const video = videoRef.current;
          
          if (video.videoWidth > 0 && video.videoHeight > 0) {
            canvas.width = video.videoWidth;
            canvas.height = video.videoHeight;
            ctx.drawImage(video, 0, 0, canvas.width, canvas.height);

            const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
            const code = window.jsQR(imageData.data, imageData.width, imageData.height, {
              inversionAttempts: 'dontInvert',
            });

            if (code && code.data) {
              handleParsedQR(code.data);
              return;
            }
          }
        }
      } catch (err) {
        // Continue scanning silently
      }

      animationFrameRef.current = requestAnimationFrame(scanFrame);
    };

    animationFrameRef.current = requestAnimationFrame(scanFrame);
  };

  // Handle Photo Upload QR scan
  const handlePhotoUpload = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const img = new Image();
      img.onload = () => {
        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d');
        canvas.width = img.width;
        canvas.height = img.height;
        ctx.drawImage(img, 0, 0);

        if (window.jsQR) {
          const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
          const code = window.jsQR(imageData.data, imageData.width, imageData.height);
          if (code && code.data) {
            handleParsedQR(code.data);
            return;
          }
        }
        alert("Could not detect a valid attendance QR code in this image. Please try again or use the manual passcode.");
      };
      img.src = event.target?.result;
    };
    reader.readAsDataURL(file);
  };

  const handleParsedQR = (text) => {
    if (isProcessing) return;
    setIsProcessing(true);

    if (navigator.vibrate) {
      try { navigator.vibrate(120); } catch {}
    }

    try {
      const data = JSON.parse(text);
      stopCamera();
      onScanSuccess({
        courseCode: courseCode || data.courseCode,
        sessionId: data.sessionId || expectedSessionId,
        slot: data.slot,
        timestamp: data.ts || Date.now(),
        rawQR: text,
        verificationMethodChosen: 'qr',
      });
    } catch {
      // If raw text was scanned instead of JSON
      stopCamera();
      onScanSuccess({
        courseCode: courseCode,
        sessionId: expectedSessionId,
        rawQR: text,
        verificationMethodChosen: 'qr',
        timestamp: Date.now(),
      });
    }
  };

  const handleManualSubmit = (e) => {
    e.preventDefault();
    if (!manualCode.trim()) return;

    stopCamera();
    onScanSuccess({
      courseCode: courseCode,
      sessionId: expectedSessionId,
      passcode: manualCode.trim().replace(/\s+/g, ''),
      rawQR: manualCode.trim(),
      verificationMethodChosen: 'qr',
      timestamp: Date.now(),
    });
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl w-full max-w-md overflow-hidden shadow-2xl flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between p-4 bg-[#0a643a] text-white">
          <div className="flex items-center gap-2">
            <span className="material-symbols-outlined text-2xl">qr_code_scanner</span>
            <h3 className="font-bold text-base">Scan Live Class QR Code</h3>
          </div>
          <button
            onClick={() => {
              stopCamera();
              onClose();
            }}
            className="text-white/80 hover:text-white transition-colors cursor-pointer"
          >
            <span className="material-symbols-outlined text-2xl">close</span>
          </button>
        </div>

        {/* Tab Selection */}
        <div className="flex border-b border-gray-200 bg-slate-50">
          <button
            onClick={() => setActiveTab('camera')}
            className={`flex-1 py-2.5 text-xs font-bold transition-colors flex items-center justify-center gap-1.5 cursor-pointer ${
              activeTab === 'camera'
                ? 'border-b-2 border-[#0a643a] text-[#0a643a] bg-white'
                : 'text-slate-500 hover:text-slate-800'
            }`}
          >
            <span className="material-symbols-outlined text-sm">photo_camera</span>
            Live Camera Scanner
          </button>
          <button
            onClick={() => setActiveTab('manual')}
            className={`flex-1 py-2.5 text-xs font-bold transition-colors flex items-center justify-center gap-1.5 cursor-pointer ${
              activeTab === 'manual'
                ? 'border-b-2 border-[#0a643a] text-[#0a643a] bg-white'
                : 'text-slate-500 hover:text-slate-800'
            }`}
          >
            <span className="material-symbols-outlined text-sm">dialpad</span>
            Manual 6-Digit Passcode
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-5 flex-1 flex flex-col items-center">
          {activeTab === 'camera' ? (
            <div className="w-full flex flex-col items-center">
              <div className="relative w-full aspect-square max-w-[280px] bg-black rounded-2xl overflow-hidden shadow-inner flex items-center justify-center">
                <video
                  ref={videoRef}
                  className="w-full h-full object-cover"
                />

                {/* Reticle Viewfinder */}
                <div className="absolute inset-0 border-2 border-dashed border-emerald-400/70 m-8 rounded-xl pointer-events-none flex items-center justify-center">
                  <div className="w-full h-0.5 bg-emerald-400 shadow-[0_0_8px_#34d399] animate-bounce" />
                </div>

                {!cameraActive && !cameraError && (
                  <div className="absolute inset-0 flex flex-col items-center justify-center text-white/70 bg-black/60 text-xs">
                    <span className="material-symbols-outlined text-3xl animate-spin mb-2">progress_activity</span>
                    <span>Starting Camera...</span>
                  </div>
                )}
              </div>

              {cameraError && (
                <p className="text-xs text-red-600 bg-red-50 p-2.5 rounded-lg border border-red-200 mt-3 text-center">
                  {cameraError}
                </p>
              )}

              <div className="flex items-center justify-between w-full mt-4 text-xs text-slate-500">
                <div className="flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                  <span>Aim directly at the projector screen</span>
                </div>
                {cameraActive && (
                  <button
                    type="button"
                    onClick={toggleTorch}
                    className="p-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold flex items-center gap-1 cursor-pointer"
                    title="Toggle Flashlight"
                  >
                    <span className="material-symbols-outlined text-base">
                      {torchOn ? 'flash_on' : 'flash_off'}
                    </span>
                    <span>{torchOn ? 'Torch On' : 'Torch'}</span>
                  </button>
                )}
              </div>

              {/* Upload QR Image Fallback */}
              <div className="w-full mt-4 pt-3 border-t border-gray-100 flex justify-center">
                <input
                  type="file"
                  ref={fileInputRef}
                  accept="image/*"
                  onChange={handlePhotoUpload}
                  className="hidden"
                />
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  className="text-xs text-[#0a643a] hover:underline font-semibold flex items-center gap-1 cursor-pointer"
                >
                  <span className="material-symbols-outlined text-base">image</span>
                  Upload / Snap photo from Gallery
                </button>
              </div>
            </div>
          ) : (
            <form onSubmit={handleManualSubmit} className="w-full space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Enter 6-Digit Live Passcode
                </label>
                <input
                  type="text"
                  placeholder="e.g. 482 910"
                  value={manualCode}
                  maxLength={7}
                  onChange={(e) => setManualCode(e.target.value)}
                  className="w-full border-2 border-emerald-600/40 rounded-xl p-3 text-center text-2xl font-mono font-bold tracking-widest text-[#0a643a] bg-emerald-50/30 focus:outline-none focus:border-[#0a643a]"
                  required
                />
                <p className="text-[11px] text-slate-400 mt-2 text-center">
                  Look below the rotating QR on the lecturer's screen for the 6-digit passcode.
                </p>
              </div>

              <button
                type="submit"
                className="w-full bg-[#0a643a] hover:bg-[#08522f] text-white py-3 rounded-xl font-bold text-sm transition-colors cursor-pointer shadow-sm"
              >
                Mark Attendance with Passcode
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}

export default QRScannerModal;
