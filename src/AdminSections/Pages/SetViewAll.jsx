import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import AdminDashboard from './AdminDashboard';

// We default sessions to an empty array [] to prevent the "reading 'forEach'" crash!
const SetViewAll = ({ sessions = [], currentTime = new Date() }) => {
    const navigate = useNavigate();

    // Search & Filter States
    const [searchQuery, setSearchQuery] = useState('');
    const [activeFilter, setActiveFilter] = useState('All');
    const [currentPage, setCurrentPage] = useState(1);
    const [backToDashboard, setBackToDashboard] = useState(false); 

    // Calculate Dynamic Real-Time Stats safely
    const computedStats = React.useMemo(() => {
        let openCount = 0;
        let upcomingCount = 0;
        let completedCount = 0;

        sessions?.forEach((sessionItem) => {
            if (!sessionItem) return;
            const isLiveOpen =
                sessionItem.isSessionActive &&
                currentTime >= new Date(sessionItem.dateTimeFrom) &&
                currentTime <= new Date(sessionItem.dateTimeTo);

            const isUpcoming = currentTime < new Date(sessionItem.dateTimeFrom);
            const isCompleted = !sessionItem.isSessionActive || currentTime > new Date(sessionItem.dateTimeTo);

            if (isLiveOpen) {
                openCount++;
            } else if (isUpcoming) {
                upcomingCount++;
            } else if (isCompleted) {
                completedCount++;
            }
        });

        return {
            total: sessions.length,
            open: openCount,
            upcoming: upcomingCount,
            completed: completedCount,
        };
    }, [sessions, currentTime]);

    const formatValue = (num) => (num < 10 ? `0${num}` : num.toString());

    const stats = [
        {
            label: 'Total Sessions',
            value: formatValue(computedStats.total),
            icon: 'calendar_today',
            bgClass: 'bg-emerald-50 text-[#0a634a]',
        },
        {
            label: 'Currently Open',
            value: formatValue(computedStats.open),
            icon: 'sensors',
            bgClass: 'bg-[#baeed9] text-[#0a643a]',
        },
        {
            label: 'Upcoming',
            value: formatValue(computedStats.upcoming),
            icon: 'upcoming',
            bgClass: 'bg-blue-50 text-blue-700',
        },
        {
            label: 'Completed',
            value: formatValue(computedStats.completed),
            icon: 'check_circle',
            bgClass: 'bg-gray-100 text-[#535856]',
        },
    ];

    if (backToDashboard) {
        return <AdminDashboard/>
    }

    const filteredSessions = sessions.filter((session) => {
        if (!session) return false;
        const isLiveOpen =
            session.isSessionActive &&
            currentTime >= new Date(session.dateTimeFrom) &&
            currentTime <= new Date(session.dateTimeTo);
        const isUpcoming = currentTime < new Date(session.dateTimeFrom);
        const status = isLiveOpen ? 'Open' : isUpcoming ? 'Upcoming' : 'Closed';

        const matchesFilter = activeFilter === 'All' || status === activeFilter;
        
        const matchesSearch =
            (session.courseCode && session.courseCode.toLowerCase().includes(searchQuery.toLowerCase())) ||
            (session.courseName && session.courseName.toLowerCase().includes(searchQuery.toLowerCase())) ||
            (session.venue && session.venue.toLowerCase().includes(searchQuery.toLowerCase()));

        return matchesFilter && matchesSearch;
    });

    return (
        <div className="pb-12 mt-4 px-6">
            {/* ── Action Back Header ────────────────────────── */}
            <div className="flex items-center gap-2 mb-6">
                <button 
                    onClick={() => setBackToDashboard(true)} // Takes them back to the Admin Dashboard route smoothly!
                    className="flex items-center gap-1.5 text-sm font-semibold text-[#0a643a] hover:underline cursor-pointer"
                >
                    <span className="material-symbols-outlined text-sm">arrow_back</span>
                    Back to Overview
                </button>
            </div>

            {/* ── Search & Filter Section ───────────────────── */}
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-8">
                <div>
                    <h2 className="text-2xl font-bold text-[#1a1c1a]">Attendance Session Logs</h2>
                    <p className="text-[#3f4941] text-sm mt-1">
                        Overview of active, upcoming, and completed academic check-ins.
                    </p>
                </div>

                <div className="flex flex-wrap items-center gap-4">
                    <div className="relative w-full md:w-80">
                        <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
                            search
                        </span>
                        <input
                            type="text"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="w-full pl-10 pr-4 py-2 bg-white border border-gray-300 rounded-lg focus:border-[#0a643a] outline-none text-sm transition-colors"
                            placeholder="Search courses, codes..."
                        />
                    </div>

                    <div className="flex bg-gray-100 p-1 rounded-lg border border-gray-200">
                        {['All', 'Open', 'Closed', 'Upcoming'].map((filter) => (
                            <button
                                key={filter}
                                onClick={() => setActiveFilter(filter)}
                                className={`px-4 py-1.5 rounded-md text-xs font-semibold transition-all cursor-pointer ${
                                    activeFilter === filter
                                        ? 'bg-[#0a643a] text-white shadow-sm'
                                        : 'text-[#3f4941] hover:bg-gray-200'
                                }`}
                            >
                                {filter}
                            </button>
                        ))}
                    </div>
                </div>
            </div>

            {/* ── Dashboard Statistics Grid ────────────────── */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-12">
                {stats.map((stat, idx) => (
                    <div key={idx} className="bg-white border border-gray-200 p-6 rounded-xl flex items-center gap-5 shadow-sm">
                        <div className={`w-12 h-12 rounded-full flex items-center justify-center ${stat.bgClass}`}>
                            <span
                                className="material-symbols-outlined"
                                style={{ fontVariationSettings: "'FILL' 1" }}
                            >
                                {stat.icon}
                            </span>
                        </div>
                        <div>
                            <p className="text-xs font-medium text-gray-500 uppercase tracking-wider">{stat.label}</p>
                            <p className="text-2xl font-bold text-slate-800">{stat.value}</p>
                        </div>
                    </div>
                ))}
            </div>

            {/* ── Main Sessions List ───────────────────────── */}
            <div className="space-y-4">
                {filteredSessions.length === 0 ? (
                    <div className="bg-white border border-dashed border-gray-300 rounded-xl p-12 text-center text-slate-400 font-medium text-sm">
                        No sessions found.
                    </div>
                ) : (
                    filteredSessions.map((session) => {
                        const isLiveOpen =
                            session.isSessionActive &&
                            currentTime >= new Date(session.dateTimeFrom) &&
                            currentTime <= new Date(session.dateTimeTo);
                        const isUpcoming = currentTime < new Date(session.dateTimeFrom);
                        const status = isLiveOpen ? 'Open' : isUpcoming ? 'Upcoming' : 'Closed';
                        
                        const displayTimeFrom = session.dateTimeFrom
                            ? new Date(session.dateTimeFrom).toLocaleTimeString(undefined, { hour: '2-digit', minute: '2-digit' })
                            : "09:00 AM";
                        const displayTimeTo = session.dateTimeTo
                            ? new Date(session.dateTimeTo).toLocaleTimeString(undefined, { hour: '2-digit', minute: '2-digit' })
                            : "11:00 AM";

                        return (
                            <div
                                key={session._id}
                                className={`bg-white border border-gray-200 rounded-xl p-6 transition-all duration-300 hover:shadow-md flex flex-col md:flex-row items-center gap-8 ${
                                    status === 'Closed' ? 'opacity-75' : ''
                                }`}
                            >
                                <div className={`w-16 h-16 rounded-xl flex items-center justify-center shrink-0 border ${
                                    status === 'Open' ? 'bg-emerald-50 text-[#0a634a] border-emerald-100' :
                                    status === 'Upcoming' ? 'bg-blue-50 text-blue-700 border-blue-100' :
                                    'bg-gray-50 text-gray-500 border-gray-200'
                                }`}>
                                    <span className="material-symbols-outlined text-4xl">terminal</span>
                                </div>

                                <div className="flex-1 grid grid-cols-1 md:grid-cols-4 gap-6 w-full">
                                    <div className="col-span-1">
                                        <p className={`text-xs font-semibold mb-1 uppercase tracking-wide ${
                                            status === 'Open' ? 'text-[#0a634a]' : 
                                            status === 'Upcoming' ? 'text-blue-700' : 'text-gray-500'
                                        }`}>
                                            {session.department || "Academic Unit"}
                                        </p>
                                        <h3 className="font-bold text-slate-800 leading-tight">
                                            {session.courseCode}: {session.courseName}
                                        </h3>
                                    </div>

                                    <div className="flex flex-col justify-center">
                                        <div className="flex items-center gap-2 text-gray-500 text-sm mb-1">
                                            <span className="material-symbols-outlined text-base">schedule</span>
                                            <span>{displayTimeFrom} - {displayTimeTo}</span>
                                        </div>
                                        <div className="flex items-center gap-2 text-gray-500 text-sm">
                                            <span className="material-symbols-outlined text-base">location_on</span>
                                            <span>{session.venue || "Unassigned"}</span>
                                        </div>
                                    </div>

                                    <div className="flex items-center justify-start md:justify-center">
                                        {status === 'Open' && (
                                            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#baeed9] text-[#0a643a] text-xs font-bold border border-emerald-200">
                                                <span className="w-2 h-2 rounded-full bg-[#0a643a] animate-pulse"></span>
                                                Open
                                            </span>
                                        )}
                                        {status === 'Upcoming' && (
                                            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-50 text-blue-700 text-xs font-bold border border-blue-200">
                                                Upcoming
                                            </span>
                                        )}
                                        {status === 'Closed' && (
                                            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-gray-100 text-gray-500 text-xs font-bold border border-gray-200">
                                                Closed
                                            </span>
                                        )}
                                    </div>

                                    <div className="flex items-center justify-end">
                                        {status === 'Open' && (
                                            <button className="w-full md:w-auto px-5 py-2 bg-[#0a643a] text-white rounded-lg font-bold text-sm hover:opacity-90 transition-all flex items-center justify-center gap-2 cursor-pointer">
                                                View Monitor
                                                <span className="material-symbols-outlined text-sm">open_in_new</span>
                                            </button>
                                        )}
                                        {status === 'Upcoming' && (
                                            <button className="w-full md:w-auto px-5 py-2 border border-gray-300 text-gray-600 rounded-lg font-bold text-sm hover:bg-gray-50 transition-all cursor-pointer">
                                                Modify Slot
                                            </button>
                                        )}
                                        {status === 'Closed' && (
                                            <button className="w-full md:w-auto px-5 py-2 border border-[#0a643a] text-[#0a643a] rounded-lg font-bold text-sm hover:bg-[#baeed9]/20 transition-all flex items-center justify-center gap-2 cursor-pointer">
                                                View Report
                                                <span className="material-symbols-outlined text-sm">analytics</span>
                                            </button>
                                        )}
                                    </div>
                                </div>
                            </div>
                        );
                    })
                )}
            </div>
        </div>
    );
};

export default SetViewAll;