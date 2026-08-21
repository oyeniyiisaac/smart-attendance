import React from 'react';

export default function SessionHero({
    session,
    courseName,
    icon,
    location,
    calender,
    time,
    onCloseSession,
    isClosing
}) {
    const checkedInCount = session?.checkedInStudents?.length || 0;

    return (
        <div className="bg-white border border-gray-200/80 rounded-2xl p-6 shadow-sm flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
            {/* Course Metadata Details */}
            <div>
                <div className="flex items-center gap-2 mb-1">
                    <span className="text-xs font-bold px-2.5 py-0.5 rounded-full bg-[#baeed9] text-[#0a643a] uppercase tracking-wider">
                        {session?.isSessionActive ? 'Live Open' : 'Closed'}
                    </span>
                    <span className="text-xs text-slate-400 font-medium">
                        {session?.department} • {session?.level || '100L'}
                    </span>
                </div>
                <h1 className="text-xl md:text-2xl font-extrabold text-slate-800 tracking-tight">
                    {courseName}
                </h1>
                <div className="flex flex-wrap items-center gap-4 mt-2 text-xs font-medium text-slate-500">
                    <span className="flex items-center gap-1">
                        <span className="material-symbols-outlined text-base text-slate-400">{icon}</span> {location}
                    </span>
                    <span className="text-slate-300">•</span>
                    <span className="flex items-center gap-1">
                        <span className="material-symbols-outlined text-base text-slate-400">{calender}</span> {time}
                    </span>
                </div>
            </div>

            {/* Live Metric Stats Counter & Close Action */}
            <div className="flex items-center gap-4 w-full md:w-auto justify-between md:justify-end">
                <div className="bg-[#e6f4ea] border border-[#ceead6] px-4 py-2 rounded-xl flex flex-col items-center min-w-[100px]">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-[#137333]">Checked-In</span>
                    <span className="text-xl font-extrabold text-[#0f5132] font-mono">{checkedInCount} Present</span>
                </div>

                {session?.isSessionActive && (
                    <button
                        onClick={onCloseSession}
                        disabled={isClosing}
                        className="bg-[#b3261e] hover:bg-[#8c1d18] disabled:opacity-60 text-white font-bold text-xs px-4 py-2.5 rounded-xl flex items-center gap-1.5 shadow-sm transition-colors cursor-pointer"
                    >
                        <span className="material-symbols-outlined text-base">stop_circle</span>
                        <span>{isClosing ? 'Closing...' : 'Close Session'}</span>
                    </button>
                )}
            </div>
        </div>
    );
}
