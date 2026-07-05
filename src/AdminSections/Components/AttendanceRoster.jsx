import React, { useState } from 'react';

export default function AttendanceRoster() {
    const [search, setSearch] = useState('');

    const rosterData = [
        { name: 'Adewale Johnson', matric: 'ENG/19/0422', time: '09:04 AM', verified: true },
        { name: 'Elena Rodriguez', matric: 'SCI/20/1105', time: '09:05 AM', verified: true },
        { name: 'Chen Wei', matric: 'ENG/19/0882', time: '09:08 AM', verified: true },
        { name: 'Sarah Jenkins', matric: 'ART/21/0043', time: '09:12 AM', verified: true },
        { name: 'Oluwatobi Adeyemi', matric: 'ENG/19/0511', time: '09:15 AM', verified: true },
        { name: 'Isabella Moretti', matric: 'SCI/20/2290', time: '09:18 AM', verified: true },
        { name: 'Marcus Thorne', matric: 'ENG/19/0415', time: '09:22 AM', verified: true },
    ];

    return (
        <div className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm flex-1 flex flex-col justify-between">
            <div>
                {/* Header toolbar component filtering parameters */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-5">
                    <h3 className="text-lg font-bold text-slate-800">Live Attendance Roster</h3>
                    <div className="flex items-center gap-2">
                        <div className="relative">
                            <span className="material-symbols-outlined text-slate-400 text-lg absolute left-3 top-1/2 -translate-y-1/2">search</span>
                            <input
                                type="text"
                                placeholder="Search student..."
                                value={search}
                                onChange={(e) => setSearch(e.target.value)}
                                className="pl-9 pr-4 py-1.5 border border-gray-300 rounded-lg text-sm bg-slate-50 focus:outline-none focus:border-[#0a643a] w-full sm:w-48"
                            />
                        </div>
                        <button className="flex items-center gap-1 px-3 py-1.5 border border-gray-300 rounded-lg text-sm font-semibold text-slate-600 bg-white hover:bg-slate-50 cursor-pointer">
                            <span className="material-symbols-outlined text-base">filter_list</span> Filter
                        </button>
                    </div>
                </div>

                {/* Dynamic Responsive Roster Table viewport */}
                <div className="overflow-x-auto">
                    <table className="w-full text-left text-sm border-collapse">
                        <thead>
                            <tr className="border-b border-gray-200 text-xs font-bold text-slate-500 uppercase tracking-wider bg-slate-50/50">
                                <th className="py-3 px-4">Student Name</th>
                                <th className="py-3 px-4">Matric Number</th>
                                <th className="py-3 px-4">Time Checked In</th>
                                <th className="py-3 px-4 text-center">Location Verified</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100 text-slate-700 font-medium">
                            {rosterData.map((row, idx) => (
                                <tr key={idx} className="hover:bg-slate-50/70 transition-colors">
                                    <td className="py-3.5 px-4 font-semibold text-slate-800">{row.name}</td>
                                    <td className="py-3.5 px-4 text-slate-500">{row.matric}</td>
                                    <td className="py-3.5 px-4 font-mono text-slate-600">{row.time}</td>
                                    <td className="py-3.5 px-4 text-center">
                                        {row.verified && (
                                            <span className="material-symbols-rounded text-[#137333] bg-[#e6f4ea] p-1 rounded-full text-base inline-block leading-none">
                                                check_circle
                                            </span>
                                        )}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Pagination component frame elements */}
            <div className="flex items-center justify-between pt-5 border-t border-gray-100 text-xs font-semibold text-slate-500 mt-4">
                <span>Showing 7 of 24 records</span>
                <div className="flex items-center gap-1.5">
                    <button className="p-1 border border-gray-300 rounded bg-white hover:bg-slate-50 text-slate-600 disabled:opacity-50 cursor-pointer" disabled>
                        <span className="material-symbols-outlined text-base leading-none">chevron_left</span>
                    </button>
                    <button className="p-1 border border-gray-300 rounded bg-white hover:bg-slate-50 text-slate-600 cursor-pointer">
                        <span className="material-symbols-outlined text-base leading-none">chevron_right</span>
                    </button>
                </div>
            </div>
        </div>
    );
}
