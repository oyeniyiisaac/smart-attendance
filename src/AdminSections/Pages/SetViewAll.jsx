import React, { useState, useMemo, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import AdminDashboard from './AdminDashboard';
import api from '../../Utils/api';

const SetViewAll = ({ sessions: initialSessions = [], currentTime = new Date() }) => {
    const navigate = useNavigate();

    const [loadedSessions, setLoadedSessions] = useState(initialSessions);
    const [loading, setLoading] = useState(initialSessions.length === 0);

    // Search & Filter States
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedFaculty, setSelectedFaculty] = useState('All Faculties');
    const [selectedDepartment, setSelectedDepartment] = useState('All Departments');
    const [selectedCourse, setSelectedCourse] = useState('All Courses');
    const [selectedLevel, setSelectedLevel] = useState('All Levels');
    const [activeStatusFilter, setActiveStatusFilter] = useState('All');
    const [viewMode, setViewMode] = useState('sessions'); // 'sessions' | 'departments' | 'courses'
    const [backToDashboard, setBackToDashboard] = useState(false);

    // ── FETCH SESSIONS ────────────────────────────────────────────────────────
    useEffect(() => {
        if (initialSessions.length > 0) {
            setLoadedSessions(initialSessions);
            setLoading(false);
            return;
        }

        fetchSessions();
    }, [initialSessions]);

    const fetchSessions = () => {
        setLoading(true);
        api.get('/admin/sessions')
            .then((res) => {
                const data = res.data.sessions || res.data.data || res.data || [];
                setLoadedSessions(Array.isArray(data) ? data : []);
            })
            .catch((err) => {
                console.error("Failed to load sessions in SetViewAll:", err);
            })
            .finally(() => {
                setLoading(false);
            });
    };

    const sessions = loadedSessions;

    // Helper function to reliably compute status
    const getSessionStatus = (session) => {
        if (!session) return 'Closed';

        if (!session.isSessionActive || currentTime > new Date(session.dateTimeTo)) {
            return 'Closed';
        }

        if (session.isSessionActive && currentTime >= new Date(session.dateTimeFrom)) {
            return 'Open';
        }

        if (session.isSessionActive && currentTime < new Date(session.dateTimeFrom)) {
            return 'Upcoming';
        }

        return 'Closed';
    };

    // ── DYNAMIC EXTRACTORS FOR FILTERS ────────────────────────────────────────
    const facultiesList = useMemo(() => {
        const set = new Set();
        sessions.forEach((s) => {
            if (s.faculty) set.add(s.faculty.trim());
        });
        return ['All Faculties', ...Array.from(set)];
    }, [sessions]);

    const departmentsList = useMemo(() => {
        const set = new Set();
        sessions.forEach((s) => {
            if (selectedFaculty === 'All Faculties' || s.faculty?.trim() === selectedFaculty) {
                if (s.department) set.add(s.department.trim());
            }
        });
        return ['All Departments', ...Array.from(set)];
    }, [sessions, selectedFaculty]);

    const coursesList = useMemo(() => {
        const set = new Set();
        sessions.forEach((s) => {
            const matchesFaculty = selectedFaculty === 'All Faculties' || s.faculty?.trim() === selectedFaculty;
            const matchesDept = selectedDepartment === 'All Departments' || s.department?.trim() === selectedDepartment;
            if (matchesFaculty && matchesDept && s.courseCode) {
                set.add(`${s.courseCode} - ${s.courseName}`);
            }
        });
        return ['All Courses', ...Array.from(set)];
    }, [sessions, selectedFaculty, selectedDepartment]);

    // Reset department/course if parent filter changes
    useEffect(() => {
        if (selectedFaculty !== 'All Faculties' && !departmentsList.includes(selectedDepartment)) {
            setSelectedDepartment('All Departments');
        }
    }, [selectedFaculty, departmentsList, selectedDepartment]);

    useEffect(() => {
        if (selectedDepartment !== 'All Departments' && !coursesList.includes(selectedCourse)) {
            setSelectedCourse('All Courses');
        }
    }, [selectedDepartment, coursesList, selectedCourse]);

    // ── FILTERED SESSIONS ─────────────────────────────────────────────────────
    const filteredSessions = useMemo(() => {
        return sessions.filter((session) => {
            if (!session) return false;

            const status = getSessionStatus(session);
            const matchesStatus = activeStatusFilter === 'All' || status === activeStatusFilter;

            const matchesFaculty =
                selectedFaculty === 'All Faculties' ||
                (session.faculty && session.faculty.trim().toLowerCase() === selectedFaculty.toLowerCase());

            const matchesDept =
                selectedDepartment === 'All Departments' ||
                (session.department && session.department.trim().toLowerCase() === selectedDepartment.toLowerCase());

            const matchesCourse =
                selectedCourse === 'All Courses' ||
                `${session.courseCode} - ${session.courseName}`.toLowerCase() === selectedCourse.toLowerCase();

            const matchesLevel =
                selectedLevel === 'All Levels' ||
                (session.level && session.level.trim().replace(/L$/i, '') === selectedLevel.replace(/L$/i, ''));

            const query = searchQuery.toLowerCase().trim();
            const matchesSearch =
                !query ||
                (session.courseCode && session.courseCode.toLowerCase().includes(query)) ||
                (session.courseName && session.courseName.toLowerCase().includes(query)) ||
                (session.venue && session.venue.toLowerCase().includes(query)) ||
                (session.department && session.department.toLowerCase().includes(query)) ||
                (session.faculty && session.faculty.toLowerCase().includes(query));

            return matchesStatus && matchesFaculty && matchesDept && matchesCourse && matchesLevel && matchesSearch;
        });
    }, [sessions, activeStatusFilter, selectedFaculty, selectedDepartment, selectedCourse, selectedLevel, searchQuery, currentTime]);

    // ── GROUP BY DEPARTMENT SUMMARY ───────────────────────────────────────────
    const departmentGroups = useMemo(() => {
        const groups = {};
        filteredSessions.forEach((s) => {
            const dept = s.department || 'General';
            if (!groups[dept]) {
                groups[dept] = {
                    department: dept,
                    faculty: s.faculty || 'Unassigned',
                    sessionsCount: 0,
                    totalPresent: 0,
                    courses: new Set(),
                    sessions: [],
                };
            }
            groups[dept].sessionsCount += 1;
            groups[dept].totalPresent += s.presentCount || 0;
            if (s.courseCode) groups[dept].courses.add(s.courseCode);
            groups[dept].sessions.push(s);
        });
        return Object.values(groups);
    }, [filteredSessions]);

    // ── GROUP BY COURSE SUMMARY ───────────────────────────────────────────────
    const courseGroups = useMemo(() => {
        const groups = {};
        filteredSessions.forEach((s) => {
            const code = s.courseCode || 'OTHER';
            if (!groups[code]) {
                groups[code] = {
                    courseCode: code,
                    courseName: s.courseName || 'Untitled Course',
                    department: s.department || 'N/A',
                    faculty: s.faculty || 'N/A',
                    level: s.level || '100L',
                    sessionsHeld: 0,
                    totalAttendance: 0,
                    sessions: [],
                };
            }
            groups[code].sessionsHeld += 1;
            groups[code].totalAttendance += s.presentCount || 0;
            groups[code].sessions.push(s);
        });
        return Object.values(groups);
    }, [filteredSessions]);

    // ── COMPUTED STATS ────────────────────────────────────────────────────────
    const computedStats = useMemo(() => {
        let openCount = 0;
        let upcomingCount = 0;
        let completedCount = 0;
        let totalPresentAll = 0;

        filteredSessions.forEach((sessionItem) => {
            const status = getSessionStatus(sessionItem);
            if (status === 'Open') openCount++;
            else if (status === 'Upcoming') upcomingCount++;
            else if (status === 'Closed') completedCount++;
            totalPresentAll += sessionItem.presentCount || 0;
        });

        return {
            total: filteredSessions.length,
            open: openCount,
            upcoming: upcomingCount,
            completed: completedCount,
            totalPresent: totalPresentAll,
        };
    }, [filteredSessions, currentTime]);

    // ── CSV EXPORT ────────────────────────────────────────────────────────────
    const exportToCSV = () => {
        if (filteredSessions.length === 0) {
            alert("No attendance records to export.");
            return;
        }

        const headers = ["Session ID", "Faculty", "Department", "Level", "Course Code", "Course Title", "Venue", "Status", "Date", "Time", "Students Present"];
        const rows = filteredSessions.map((s) => [
            s._id,
            `"${s.faculty || ''}"`,
            `"${s.department || ''}"`,
            s.level || '',
            s.courseCode || '',
            `"${s.courseName || ''}"`,
            `"${s.venue || ''}"`,
            getSessionStatus(s),
            s.dateTimeFrom ? new Date(s.dateTimeFrom).toLocaleDateString() : '',
            s.dateTimeFrom ? `${new Date(s.dateTimeFrom).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })} - ${new Date(s.dateTimeTo).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}` : '',
            s.presentCount || 0
        ]);

        const csvContent = "data:text/csv;charset=utf-8," + [headers.join(","), ...rows.map(e => e.join(","))].join("\n");
        const encodedUri = encodeURI(csvContent);
        const link = document.createElement("a");
        link.setAttribute("href", encodedUri);
        link.setAttribute("download", `Attendance_History_Export_${new Date().toISOString().slice(0, 10)}.csv`);
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };

    if (backToDashboard) {
        return <AdminDashboard />;
    }

    return (
        <div className="pb-16 pt-4 px-4 lg:px-8 max-w-7xl mx-auto min-h-screen">
            {/* ── Top Navigation Bar ────────────────────────────────────────── */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6 pb-4 border-b border-gray-200">
                <div className="flex items-center gap-3">
                    <button
                        onClick={() => setBackToDashboard(true)}
                        className="p-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 transition-colors flex items-center justify-center cursor-pointer"
                        title="Back to Dashboard"
                    >
                        <span className="material-symbols-outlined text-lg">arrow_back</span>
                    </button>
                    <div>
                        <h1 className="text-2xl font-black text-slate-900 tracking-tight">
                            University Attendance History
                        </h1>
                        <p className="text-xs text-slate-500 font-medium">
                            Comprehensive attendance logs broken down by Faculty, Department, and Course.
                        </p>
                    </div>
                </div>

                <div className="flex items-center gap-2">
                    <button
                        onClick={fetchSessions}
                        className="px-3.5 py-2 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 text-xs font-bold text-slate-700 flex items-center gap-1.5 transition-colors cursor-pointer shadow-sm"
                    >
                        <span className="material-symbols-outlined text-base">refresh</span>
                        <span>Refresh</span>
                    </button>
                    <button
                        onClick={exportToCSV}
                        className="px-4 py-2 rounded-xl bg-[#0a643a] hover:bg-[#084f2e] text-white text-xs font-bold flex items-center gap-1.5 transition-colors cursor-pointer shadow-sm"
                    >
                        <span className="material-symbols-outlined text-base">download</span>
                        <span>Export CSV</span>
                    </button>
                </div>
            </div>

            {/* ── Summary Stats Overview ────────────────────────────────────── */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
                <div className="bg-white border border-gray-200/80 rounded-2xl p-5 shadow-sm">
                    <div className="flex items-center justify-between mb-2">
                        <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Filtered Sessions</span>
                        <div className="w-8 h-8 rounded-lg bg-emerald-50 text-[#0a643a] flex items-center justify-center">
                            <span className="material-symbols-outlined text-base">calendar_month</span>
                        </div>
                    </div>
                    <p className="text-2xl font-black text-slate-800">{computedStats.total}</p>
                </div>

                <div className="bg-white border border-gray-200/80 rounded-2xl p-5 shadow-sm">
                    <div className="flex items-center justify-between mb-2">
                        <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Live Open</span>
                        <div className="w-8 h-8 rounded-lg bg-[#baeed9] text-[#0a643a] flex items-center justify-center">
                            <span className="material-symbols-outlined text-base">sensors</span>
                        </div>
                    </div>
                    <p className="text-2xl font-black text-[#0a643a]">{computedStats.open}</p>
                </div>

                <div className="bg-white border border-gray-200/80 rounded-2xl p-5 shadow-sm">
                    <div className="flex items-center justify-between mb-2">
                        <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Completed</span>
                        <div className="w-8 h-8 rounded-lg bg-slate-100 text-slate-600 flex items-center justify-center">
                            <span className="material-symbols-outlined text-base">check_circle</span>
                        </div>
                    </div>
                    <p className="text-2xl font-black text-slate-700">{computedStats.completed}</p>
                </div>

                <div className="bg-white border border-gray-200/80 rounded-2xl p-5 shadow-sm">
                    <div className="flex items-center justify-between mb-2">
                        <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Total Check-Ins</span>
                        <div className="w-8 h-8 rounded-lg bg-blue-50 text-blue-700 flex items-center justify-center">
                            <span className="material-symbols-outlined text-base">how_to_reg</span>
                        </div>
                    </div>
                    <p className="text-2xl font-black text-blue-700">{computedStats.totalPresent}</p>
                </div>
            </div>

            {/* ── Multi-Tier Academic Hierarchy Filters ─────────────────────── */}
            <div className="bg-white border border-gray-200/80 rounded-2xl p-5 shadow-sm mb-6 space-y-4">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 pb-3 border-b border-gray-100">
                    <div className="flex items-center gap-2">
                        <span className="material-symbols-outlined text-[#0a643a] text-lg">filter_alt</span>
                        <h2 className="text-sm font-bold text-slate-800">Academic Hierarchy Filters</h2>
                    </div>

                    {/* View Modes Tabs */}
                    <div className="flex bg-slate-100 p-1 rounded-xl">
                        <button
                            onClick={() => setViewMode('sessions')}
                            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                                viewMode === 'sessions' ? 'bg-white text-[#0a643a] shadow-sm' : 'text-slate-600 hover:text-slate-900'
                            }`}
                        >
                            All Sessions Log
                        </button>
                        <button
                            onClick={() => setViewMode('departments')}
                            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                                viewMode === 'departments' ? 'bg-white text-[#0a643a] shadow-sm' : 'text-slate-600 hover:text-slate-900'
                            }`}
                        >
                            By Department
                        </button>
                        <button
                            onClick={() => setViewMode('courses')}
                            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                                viewMode === 'courses' ? 'bg-white text-[#0a643a] shadow-sm' : 'text-slate-600 hover:text-slate-900'
                            }`}
                        >
                            By Course
                        </button>
                    </div>
                </div>

                {/* Filter Dropdowns Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
                    {/* Faculty Select */}
                    <div>
                        <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-500 mb-1">
                            Faculty
                        </label>
                        <select
                            value={selectedFaculty}
                            onChange={(e) => setSelectedFaculty(e.target.value)}
                            className="w-full bg-slate-50 border border-gray-200 rounded-xl px-3 py-2 text-xs font-semibold text-slate-800 outline-none focus:border-[#0a643a] transition-colors"
                        >
                            {facultiesList.map((f) => (
                                <option key={f} value={f}>{f}</option>
                            ))}
                        </select>
                    </div>

                    {/* Department Select */}
                    <div>
                        <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-500 mb-1">
                            Department
                        </label>
                        <select
                            value={selectedDepartment}
                            onChange={(e) => setSelectedDepartment(e.target.value)}
                            className="w-full bg-slate-50 border border-gray-200 rounded-xl px-3 py-2 text-xs font-semibold text-slate-800 outline-none focus:border-[#0a643a] transition-colors"
                        >
                            {departmentsList.map((d) => (
                                <option key={d} value={d}>{d}</option>
                            ))}
                        </select>
                    </div>

                    {/* Course Select */}
                    <div>
                        <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-500 mb-1">
                            Course Code / Name
                        </label>
                        <select
                            value={selectedCourse}
                            onChange={(e) => setSelectedCourse(e.target.value)}
                            className="w-full bg-slate-50 border border-gray-200 rounded-xl px-3 py-2 text-xs font-semibold text-slate-800 outline-none focus:border-[#0a643a] transition-colors"
                        >
                            {coursesList.map((c) => (
                                <option key={c} value={c}>{c}</option>
                            ))}
                        </select>
                    </div>

                    {/* Academic Level */}
                    <div>
                        <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-500 mb-1">
                            Academic Level
                        </label>
                        <select
                            value={selectedLevel}
                            onChange={(e) => setSelectedLevel(e.target.value)}
                            className="w-full bg-slate-50 border border-gray-200 rounded-xl px-3 py-2 text-xs font-semibold text-slate-800 outline-none focus:border-[#0a643a] transition-colors"
                        >
                            {['All Levels', '100L', '200L', '300L', '400L', '500L'].map((lvl) => (
                                <option key={lvl} value={lvl}>{lvl}</option>
                            ))}
                        </select>
                    </div>
                </div>

                {/* Search Bar & Status Pills */}
                <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-2">
                    <div className="relative w-full sm:w-80">
                        <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 text-base">
                            search
                        </span>
                        <input
                            type="text"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="w-full pl-9 pr-4 py-2 bg-slate-50 border border-gray-200 rounded-xl text-xs font-medium text-slate-800 outline-none focus:border-[#0a643a] transition-colors"
                            placeholder="Search course, code, or venue..."
                        />
                    </div>

                    <div className="flex items-center gap-1.5 w-full sm:w-auto overflow-x-auto pb-1 sm:pb-0">
                        {['All', 'Open', 'Closed', 'Upcoming'].map((status) => (
                            <button
                                key={status}
                                onClick={() => setActiveStatusFilter(status)}
                                className={`px-3 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap transition-all cursor-pointer ${
                                    activeStatusFilter === status
                                        ? 'bg-[#0a643a] text-white shadow-sm'
                                        : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                                }`}
                            >
                                {status === 'All' ? 'All Statuses' : status}
                            </button>
                        ))}
                    </div>
                </div>
            </div>

            {/* ── CONTENT VIEWS ─────────────────────────────────────────────── */}
            {loading ? (
                <div className="py-16 text-center text-sm text-slate-500 font-medium animate-pulse">
                    Loading university attendance logs...
                </div>
            ) : (
                <>
                    {/* ── VIEW MODE 1: ALL SESSIONS LOG ─────────────────────── */}
                    {viewMode === 'sessions' && (
                        <div className="space-y-3">
                            {filteredSessions.length === 0 ? (
                                <div className="bg-white border border-dashed border-gray-300 rounded-2xl p-12 text-center text-slate-400 font-medium text-sm">
                                    No attendance sessions match the selected academic filters.
                                </div>
                            ) : (
                                filteredSessions.map((session) => {
                                    const status = getSessionStatus(session);

                                    const displayDate = session.dateTimeFrom
                                        ? new Date(session.dateTimeFrom).toLocaleDateString([], {
                                              weekday: 'short',
                                              month: 'short',
                                              day: 'numeric',
                                              year: 'numeric',
                                          })
                                        : 'N/A';

                                    const displayTimeFrom = session.dateTimeFrom
                                        ? new Date(session.dateTimeFrom).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
                                        : "09:00 AM";
                                    const displayTimeTo = session.dateTimeTo
                                        ? new Date(session.dateTimeTo).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
                                        : "11:00 AM";

                                    return (
                                        <div
                                            key={session._id}
                                            className="bg-white border border-gray-200/80 rounded-2xl p-5 shadow-sm hover:shadow-md transition-all flex flex-col md:flex-row md:items-center justify-between gap-4"
                                        >
                                            {/* Left: Metadata */}
                                            <div className="flex-1">
                                                <div className="flex flex-wrap items-center gap-2 mb-1.5">
                                                    <span className={`text-[10px] font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-full ${
                                                        status === 'Open'
                                                            ? 'bg-[#baeed9] text-[#0a643a]'
                                                            : status === 'Upcoming'
                                                            ? 'bg-blue-50 text-blue-700'
                                                            : 'bg-slate-100 text-slate-600'
                                                    }`}>
                                                        {status}
                                                    </span>
                                                    <span className="text-[11px] font-semibold text-slate-400">
                                                        {session.faculty || 'Faculty'}
                                                    </span>
                                                    <span className="text-slate-300">•</span>
                                                    <span className="text-[11px] font-bold text-slate-600">
                                                        {session.department}
                                                    </span>
                                                    <span className="text-slate-300">•</span>
                                                    <span className="text-[11px] font-mono text-slate-500">
                                                        {session.level || '100L'}
                                                    </span>
                                                </div>

                                                <h3 className="text-base font-bold text-slate-900 leading-tight">
                                                    {session.courseCode}: {session.courseName}
                                                </h3>

                                                <div className="flex flex-wrap items-center gap-4 mt-2 text-xs text-slate-500 font-medium">
                                                    <span className="flex items-center gap-1">
                                                        <span className="material-symbols-outlined text-base text-slate-400">calendar_today</span>
                                                        <span>{displayDate}</span>
                                                    </span>
                                                    <span className="flex items-center gap-1">
                                                        <span className="material-symbols-outlined text-base text-slate-400">schedule</span>
                                                        <span>{displayTimeFrom} - {displayTimeTo}</span>
                                                    </span>
                                                    <span className="flex items-center gap-1">
                                                        <span className="material-symbols-outlined text-base text-slate-400">location_on</span>
                                                        <span>{session.venue || 'Unassigned'}</span>
                                                    </span>
                                                </div>
                                            </div>

                                            {/* Right: Turnout Count & Actions */}
                                            <div className="flex items-center gap-3 shrink-0 pt-3 md:pt-0 border-t md:border-t-0 border-gray-100">
                                                <div className="bg-[#e6f4ea] border border-[#ceead6] px-3.5 py-2 rounded-xl text-center min-w-[90px]">
                                                    <span className="text-[10px] font-bold uppercase tracking-wider text-[#137333] block">
                                                        Turnout
                                                    </span>
                                                    <span className="text-base font-extrabold text-[#0f5132] font-mono">
                                                        {session.presentCount || 0} Present
                                                    </span>
                                                </div>

                                                <button
                                                    onClick={() => navigate(`/admin/monitor/${session._id}`)}
                                                    className="px-4 py-2 bg-[#0a643a] hover:bg-[#084f2e] text-white text-xs font-bold rounded-xl transition-colors shadow-sm flex items-center gap-1.5 cursor-pointer"
                                                >
                                                    <span className="material-symbols-outlined text-base">visibility</span>
                                                    <span>View Roster</span>
                                                </button>

                                                <button
                                                    onClick={() => navigate('/admin/reports')}
                                                    className="px-3.5 py-2 border border-slate-200 hover:bg-slate-50 text-slate-700 text-xs font-bold rounded-xl transition-colors flex items-center gap-1.5 cursor-pointer"
                                                    title="Open Exam Attendance Sheet"
                                                >
                                                    <span className="material-symbols-outlined text-base">description</span>
                                                    <span>Exam Sheet</span>
                                                </button>
                                            </div>
                                        </div>
                                    );
                                })
                            )}
                        </div>
                    )}

                    {/* ── VIEW MODE 2: BY DEPARTMENT SUMMARY ───────────────── */}
                    {viewMode === 'departments' && (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                            {departmentGroups.length === 0 ? (
                                <div className="col-span-full bg-white border border-dashed border-gray-300 rounded-2xl p-12 text-center text-slate-400 font-medium text-sm">
                                    No departmental attendance records found.
                                </div>
                            ) : (
                                departmentGroups.map((group, idx) => (
                                    <div key={idx} className="bg-white border border-gray-200/80 rounded-2xl p-5 shadow-sm hover:shadow-md transition-all flex flex-col justify-between">
                                        <div>
                                            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block mb-1">
                                                {group.faculty}
                                            </span>
                                            <h3 className="text-base font-bold text-slate-900 mb-3">
                                                {group.department}
                                            </h3>

                                            <div className="grid grid-cols-2 gap-2 mb-4 bg-slate-50 p-3 rounded-xl border border-slate-100">
                                                <div>
                                                    <span className="text-[10px] font-bold text-slate-400 uppercase">Sessions Held</span>
                                                    <p className="text-lg font-black text-slate-800">{group.sessionsCount}</p>
                                                </div>
                                                <div>
                                                    <span className="text-[10px] font-bold text-slate-400 uppercase">Total Present</span>
                                                    <p className="text-lg font-black text-[#0a643a]">{group.totalPresent}</p>
                                                </div>
                                            </div>

                                            <div>
                                                <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-2 block">
                                                    Enrolled Courses ({group.courses.size})
                                                </span>
                                                <div className="flex flex-wrap gap-1.5">
                                                    {Array.from(group.courses).slice(0, 6).map((code) => (
                                                        <span key={code} className="px-2 py-0.5 rounded-md bg-slate-100 text-slate-700 text-[11px] font-bold font-mono">
                                                            {code}
                                                        </span>
                                                    ))}
                                                </div>
                                            </div>
                                        </div>

                                        <button
                                            onClick={() => {
                                                setSelectedDepartment(group.department);
                                                setViewMode('sessions');
                                            }}
                                            className="mt-5 w-full py-2 bg-slate-100 hover:bg-[#baeed9] text-[#0a643a] text-xs font-bold rounded-xl transition-colors flex items-center justify-center gap-1.5 cursor-pointer"
                                        >
                                            <span>View All {group.department} Sessions</span>
                                            <span className="material-symbols-outlined text-sm">arrow_forward</span>
                                        </button>
                                    </div>
                                ))
                            )}
                        </div>
                    )}

                    {/* ── VIEW MODE 3: BY COURSE SUMMARY ───────────────────── */}
                    {viewMode === 'courses' && (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                            {courseGroups.length === 0 ? (
                                <div className="col-span-full bg-white border border-dashed border-gray-300 rounded-2xl p-12 text-center text-slate-400 font-medium text-sm">
                                    No course attendance records found.
                                </div>
                            ) : (
                                courseGroups.map((cg, idx) => (
                                    <div key={idx} className="bg-white border border-gray-200/80 rounded-2xl p-5 shadow-sm hover:shadow-md transition-all flex flex-col justify-between">
                                        <div>
                                            <div className="flex items-center justify-between mb-1">
                                                <span className="text-xs font-black font-mono px-2 py-0.5 rounded-md bg-emerald-50 text-[#0a643a] border border-emerald-200">
                                                    {cg.courseCode}
                                                </span>
                                                <span className="text-xs font-bold text-slate-400">
                                                    {cg.level}
                                                </span>
                                            </div>

                                            <h3 className="text-base font-bold text-slate-900 mt-2 mb-1 leading-tight">
                                                {cg.courseName}
                                            </h3>
                                            <p className="text-xs text-slate-500 font-medium mb-3">
                                                {cg.department}
                                            </p>

                                            <div className="grid grid-cols-2 gap-2 bg-slate-50 p-3 rounded-xl border border-slate-100">
                                                <div>
                                                    <span className="text-[10px] font-bold text-slate-400 uppercase">Lectures Held</span>
                                                    <p className="text-lg font-black text-slate-800">{cg.sessionsHeld}</p>
                                                </div>
                                                <div>
                                                    <span className="text-[10px] font-bold text-slate-400 uppercase">Total Turnout</span>
                                                    <p className="text-lg font-black text-blue-700">{cg.totalAttendance}</p>
                                                </div>
                                            </div>
                                        </div>

                                        <div className="grid grid-cols-2 gap-2 mt-5">
                                            <button
                                                onClick={() => {
                                                    setSelectedCourse(`${cg.courseCode} - ${cg.courseName}`);
                                                    setViewMode('sessions');
                                                }}
                                                className="py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold rounded-xl transition-colors flex items-center justify-center gap-1 cursor-pointer"
                                            >
                                                <span>Logs</span>
                                            </button>
                                            <button
                                                onClick={() => navigate('/admin/reports')}
                                                className="py-2 bg-[#0a643a] hover:bg-[#084f2e] text-white text-xs font-bold rounded-xl transition-colors shadow-sm flex items-center justify-center gap-1 cursor-pointer"
                                            >
                                                <span>Exam Sheet</span>
                                            </button>
                                        </div>
                                    </div>
                                ))
                            )}
                        </div>
                    )}
                </>
            )}
        </div>
    );
};

export default SetViewAll;