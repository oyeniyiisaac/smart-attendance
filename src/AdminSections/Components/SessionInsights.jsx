import React from 'react';

export default function SessionInsights() {
    const bars = [25, 45, 90, 65, 30, 20]; // Mocking heights for arrival intensities

    return (
        <div className="w-full lg:w-80 flex flex-col gap-6">

            {/* SUB-BLOCK A: Chart Insights Card Container */}
            <div className="bg-white border border-gray-200 rounded-xl p-5 shadow-sm">
                <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-4">Session Insights</h4>
                <div className="flex items-center justify-between mb-4">
                    <span className="text-sm font-bold text-slate-700">Arrival Intensity</span>
                    <span className="text-xs font-bold text-[#137333] bg-[#e6f4ea] px-2 py-0.5 rounded">
                        +12% vs last week
                    </span>
                </div>

                {/* Simplified custom responsive histogram render block */}
                <div className="h-24 flex items-end justify-between gap-2 px-1 mb-3">
                    {bars.map((height, i) => (
                        <div key={i} className="flex-1 bg-slate-100 rounded-t h-full flex items-end">
                            <div
                                className={`w-full rounded-t transition-all duration-500 ${i === 2 ? 'bg-[#0a643a]' : i === 3 ? 'bg-[#188a53]' : 'bg-slate-300'}`}
                                style={{ height: `${height}%` }}
                            />
                        </div>
                    ))}
                </div>
                <p className="text-xs text-slate-500 leading-normal">
                    Peak arrival recorded at <strong className="text-slate-700 font-semibold">09:05 AM</strong> with 8 students checking in simultaneously.
                </p>
            </div>

            {/* SUB-BLOCK B: Venue Verification Satellite Geofencing Data Panel */}
            <div className="bg-white border border-gray-200 rounded-xl p-5 shadow-sm flex-1 flex flex-col">
                <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-4">Venue Verification</h4>

                {/* Radius badge metric layout frame */}
                <div className="flex items-start gap-3 bg-slate-50 border border-gray-100 p-3 rounded-xl mb-4">
                    <div className="w-12 h-12 rounded-lg border-2 border-emerald-600 bg-white flex items-center justify-center font-bold text-xs text-emerald-800 rotate-45 flex-shrink-0">
                        <span className="-rotate-45">92%</span>
                    </div>
                    <div>
                        <h5 className="text-xs font-bold text-slate-800">Geo-fence Active</h5>
                        <p className="text-[11px] text-slate-500 mt-0.5">Radius: 50m from Hall A12</p>
                    </div>
                </div>

                {/* Mock Simulated Map Area with Target Reticle */}
                <div className="flex-1 min-h-[140px] relative bg-slate-900 border border-gray-200 rounded-lg overflow-hidden">
                    <div className="absolute inset-0 opacity-40 bg-[radial-gradient(#ffffff_1px,transparent_1px)] [background-size:12px_12px] bg-center" />

                    {/* Target Overlay Marker Elements visually representing image_878e7f.png layout */}
                    <div className="absolute inset-0 flex items-center justify-center">
                        <div className="w-16 h-16 rounded-full border-2 border-dashed border-emerald-500/80 bg-emerald-500/10 animate-pulse flex items-center justify-center">
                            <div className="w-2 h-2 rounded-full bg-red-500 shadow-md shadow-red-500/50" />
                        </div>
                    </div>
                    <span className="absolute bottom-1.5 right-1.5 text-[9px] text-white/50 bg-black/40 px-1.5 py-0.5 rounded font-mono">
                        GPS LOCK
                    </span>
                </div>
            </div>

        </div>
    );
}
