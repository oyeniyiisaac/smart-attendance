import React, { useState } from 'react';

export default function AttendanceRoster({ session }) {
    const [search, setSearch] = useState('');

    // ── RESILIENT DATA EXTRACTION ──────────────────────────────────────────
    // This checks every possible backend key names so nothing fails silently!
    const liveStudents = 
        session?.checkedInStudents || 
        session?.attendance || 
        session?.students || 
        session?.checkins || 
        [];

    // Filter students based on search queries
    const filteredStudents = liveStudents.filter((student) => {
        if (!student) return false;
        
        // Handle cases where the student is just an ID string (not populated yet by backend)
        if (typeof student === 'string') return false;

        const name = student.name || student.studentId?.name || '';
        const matric = student.matricNumber || student.matric || student.studentId?.matricNumber || '';
        
        return (
            name.toLowerCase().includes(search.toLowerCase()) ||
            matric.toLowerCase().includes(search.toLowerCase())
        );
    });

    return (
        <div className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm flex-1 flex flex-col justify-between">
            <div>
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
                    </div>
                </div>

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
                            {filteredStudents.length === 0 ? (
                                <tr>
                                    <td colSpan="4" className="py-12 text-center text-slate-400 font-medium text-sm">
                                        {liveStudents.length > 0 && typeof liveStudents[0] === 'string' ? (
                                            <span className="text-amber-600 bg-amber-50 px-3 py-1.5 rounded-lg border border-amber-200 inline-block">
                                                ⚠️ Student details are raw IDs. Make sure your backend uses `.populate()` on the check-ins!
                                            </span>
                                        ) : (
                                            "No checked-in students found."
                                        )}
                                    </td>
                                </tr>
                            ) : (
                                filteredStudents.map((item, idx) => {
                                    // Handle cases where students are nested under an object like item.studentId
                                    const studentDetails = item.studentId && typeof item.studentId === 'object' ? item.studentId : item;
                                    
                                    const name = studentDetails.name || "Unknown Student";
                                    const matric = studentDetails.matricNumber || studentDetails.matric || "N/A";
                                    
                                    const rawTime = item.timeCheckedIn || item.time || item.createdAt;
                                    const formattedTime = rawTime 
                                        ? new Date(rawTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
                                        : 'N/A';

                                    return (
                                        <tr key={item._id || idx} className="hover:bg-slate-50/70 transition-colors">
                                            <td className="py-3.5 px-4 font-semibold text-slate-800">{name}</td>
                                            <td className="py-3.5 px-4 text-slate-500">{matric}</td>
                                            <td className="py-3.5 px-4 font-mono text-slate-600">{formattedTime}</td>
                                            <td className="py-3.5 px-4 text-center">
                                                {(item.isLocationVerified ?? item.verified ?? true) && (
                                                    <span className="material-symbols-rounded text-[#137333] bg-[#e6f4ea] p-1 rounded-full text-base inline-block leading-none">
                                                        check_circle
                                                    </span>
                                                )}
                                            </td>
                                        </tr>
                                    );
                                })
                            )}
                        </tbody>
                    </table>
                </div>
            </div>

            <div className="flex items-center justify-between pt-5 border-t border-gray-100 text-xs font-semibold text-slate-500 mt-4">
                <span>Showing {filteredStudents.length} of {liveStudents.length} records</span>
            </div>
        </div>
    );
}