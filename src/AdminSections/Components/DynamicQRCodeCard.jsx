import React, { useState, useEffect } from 'react';
import { generateQRCodeSVG } from '../../Utils/qrGenerator';

export function DynamicQRCodeCard({ session }) {
  const [timeLeft, setTimeLeft] = useState(20);
  const [qrSvg, setQrSvg] = useState('');
  const [currentSlot, setCurrentSlot] = useState(0);
  const [isProjectorMode, setIsProjectorMode] = useState(false);

  // Interval length in seconds
  const ROTATION_INTERVAL = 20;

  useEffect(() => {
    const updateQR = () => {
      const now = Date.now();
      const slot = Math.floor(now / (ROTATION_INTERVAL * 1000));
      const secondsInSlot = Math.floor((now / 1000) % ROTATION_INTERVAL);
      const remaining = ROTATION_INTERVAL - secondsInSlot;

      setTimeLeft(remaining);

      if (slot !== currentSlot && session) {
        setCurrentSlot(slot);
        const payload = JSON.stringify({
          app: "SMART_ATTENDANCE",
          sessionId: session._id,
          courseCode: session.courseCode,
          slot: slot,
          ts: now
        });
        const svgString = generateQRCodeSVG(payload, 280, "#0a643a", "#ffffff");
        setQrSvg(svgString);
      }
    };

    updateQR();
    const interval = setInterval(updateQR, 1000);
    return () => clearInterval(interval);
  }, [session, currentSlot]);

  if (!session) return null;

  const progressPercent = ((ROTATION_INTERVAL - timeLeft) / ROTATION_INTERVAL) * 100;

  return (
    <>
      {/* Standard Monitor Widget */}
      <div className="bg-white border border-gray-200 rounded-xl p-5 shadow-sm flex flex-col items-center text-center">
        <div className="w-full flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-ping" />
            <span className="text-xs font-bold uppercase tracking-wider text-slate-700">Dynamic Anti-Proxy QR</span>
          </div>
          <button
            onClick={() => setIsProjectorMode(true)}
            className="text-xs font-semibold text-[#0a643a] bg-[#baeed9]/60 hover:bg-[#baeed9] px-2.5 py-1 rounded-lg transition-colors flex items-center gap-1 cursor-pointer"
            title="Expand to Fullscreen Projector Mode"
          >
            <span className="material-symbols-outlined text-sm">fullscreen</span>
            <span>Projector Mode</span>
          </button>
        </div>

        {/* QR Code Container */}
        <div className="bg-[#f0f4f1] p-3 rounded-2xl border border-[#baeed9] shadow-inner mb-3">
          {qrSvg ? (
            <div
              className="w-56 h-56 flex items-center justify-center bg-white p-2 rounded-xl shadow-sm"
              dangerouslySetInnerHTML={{ __html: qrSvg }}
            />
          ) : (
            <div className="w-56 h-56 flex items-center justify-center text-xs text-slate-400">
              Generating Live Code...
            </div>
          )}
        </div>

        {/* Countdown Progress Bar */}
        <div className="w-full bg-slate-100 rounded-full h-2 mb-2 overflow-hidden">
          <div
            className="bg-[#0a643a] h-full transition-all duration-1000 ease-linear rounded-full"
            style={{ width: `${100 - progressPercent}%` }}
          />
        </div>

        <div className="w-full flex items-center justify-between text-xs text-slate-500 font-medium">
          <span>Refreshes in:</span>
          <span className="font-mono font-bold text-[#0a643a] bg-[#baeed9]/40 px-2 py-0.5 rounded">
            {timeLeft}s
          </span>
        </div>

        <p className="text-[11px] text-slate-400 mt-2">
          Rotates automatically every 20s. Screenshots forwarded on WhatsApp expire in 20 seconds.
        </p>
      </div>

      {/* 📺 Fullscreen Projector Mode Modal */}
      {isProjectorMode && (
        <div className="fixed inset-0 z-50 bg-slate-900/95 backdrop-blur-md flex flex-col items-center justify-center p-6 text-white animate-fadeIn">
          <button
            onClick={() => setIsProjectorMode(false)}
            className="absolute top-6 right-6 bg-white/10 hover:bg-white/20 text-white rounded-full p-3 transition-colors cursor-pointer flex items-center justify-center"
          >
            <span className="material-symbols-outlined text-2xl">close</span>
          </button>

          <div className="text-center max-w-xl mb-6">
            <div className="inline-flex items-center gap-2 bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 px-3 py-1 rounded-full text-xs font-semibold uppercase tracking-wider mb-2">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              Live Lecture Attendance
            </div>
            <h2 className="text-3xl font-extrabold tracking-tight">
              {session.courseCode}: {session.courseName}
            </h2>
            <p className="text-sm text-slate-300 mt-1">
              Point your smartphone camera at the screen to mark your attendance.
            </p>
          </div>

          <div className="bg-white p-6 rounded-3xl shadow-2xl border-4 border-emerald-500/40">
            {qrSvg && (
              <div
                className="w-80 h-80 sm:w-96 sm:h-96 flex items-center justify-center"
                dangerouslySetInnerHTML={{ __html: qrSvg.replace('width="280"', 'width="380"').replace('height="280"', 'height="380"') }}
              />
            )}
          </div>

          {/* Projector Countdown Meter */}
          <div className="w-80 sm:w-96 mt-6">
            <div className="w-full bg-white/10 rounded-full h-3 mb-2 overflow-hidden">
              <div
                className="bg-emerald-400 h-full transition-all duration-1000 ease-linear rounded-full"
                style={{ width: `${100 - progressPercent}%` }}
              />
            </div>
            <div className="flex items-center justify-between text-xs text-slate-400 font-mono">
              <span>Anti-Proxy Security Active</span>
              <span className="text-emerald-400 font-bold font-mono text-sm">
                Next QR Code in {timeLeft}s
              </span>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

export default DynamicQRCodeCard;
