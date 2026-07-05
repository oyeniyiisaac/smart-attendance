import React from 'react';

export default function SessionHero({courseName, icon, location, calender, time, timeout, counter}) {
    return (
        <div className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
            {/* Course Metadata Details */}
            <div>
                <h1 className="text-2xl md:text-3xl font-bold text-slate-800 tracking-tight">
                    {courseName}
                </h1>
                <div className="flex items-center gap-4 mt-2 text-sm font-medium text-slate-500">
                    <span className="flex items-center gap-1">
                        <span className="material-symbols-outlined text-base">{ icon }</span> {location}
                    </span>
                    <span className="text-slate-300">•</span>
                    <span className="flex items-center gap-1">
                        <span className="material-symbols-outlined text-base">{calender}</span> {time}
                    </span>
                </div>
            </div>

            {/* Live Timer and Metric Stats Counter */}
            <div className="flex items-center gap-6 w-full md:w-auto justify-between md:justify-end">
                <div className="flex flex-col items-end">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">{timeout}</span>
                    <div className="flex items-center gap-1 text-3xl font-extrabold text-[#0a643a] tracking-tight font-mono">
                        <span>{counter}</span>
                        <span className="material-symbols-outlined text-xl animate-spin text-slate-400">hourglass_top</span>
                    </div>
                </div>

                <div className="bg-[#e6f4ea] border border-[#ceead6] px-4 py-2 rounded-lg flex flex-col items-center min-w-[90px]">
                    <span className="text-[9px] font-bold uppercase tracking-wide text-[#137333]">Attendance</span>
                    <span className="text-lg font-bold text-[#0f5132]">24 / 60</span>
                </div>

                <button className="bg-[#b3261e] hover:bg-[#8c1d18] text-white font-semibold text-sm px-4 py-2.5 rounded-lg flex items-center gap-2 shadow-sm transition-colors cursor-pointer">
                    <span className="material-symbols-outlined text-base">cancel</span>
                    <span>Close Session</span>
                </button>
            </div>
        </div>
    );
}
