import React, { useEffect, useState, useCallback } from 'react';
import Cards from '../Components/Cards';
import SessionCard from '../Components/SessionCard';
import { useNavigate } from 'react-router-dom';
import SetViewAll from './SetViewAll';
import api from '../../Utils/api';

// Helper function to validate JWT structure & expiration
const isTokenValid = (token) => {
    if (!token || typeof token !== 'string') return false;

    try {
        const payloadBase64 = token.split('.')[1];
        if (!payloadBase64) return false;

        const decodedPayload = JSON.parse(atob(payloadBase64));

        if (decodedPayload.exp) {
            const currentTime = Math.floor(Date.now() / 1000);
            if (decodedPayload.exp < currentTime) {
                return false;
            }
        }
        return true;
    } catch {
        return false;
    }
};

const getAdminProfileFromToken = () => {
    try {
        const token = localStorage.getItem('adminToken');
        if (!token) return null;
        const payload = JSON.parse(atob(token.split('.')[1]));
        return payload || null;
    } catch {
        return null;
    }
};

const AdminDashboard = () => {
    const [generating, setGenerating] = useState(false);
    const [revoking, setRevoking] = useState(false);
    const [invite, setInvite] = useState(null);
    const [error, setError] = useState('');
    const [copied, setCopied] = useState(false);
    const [hours, setHours] = useState(24);

    const [sessions, setSessions] = useState([]);
    const [loadingSessions, setLoadingSessions] = useState(true);
    const [selectedDeptFilter, setSelectedDeptFilter] = useState('All');

    const [stats, setStats] = useState({
        totalStudents: 0,
        presentToday: 0,
        absentToday: 0,
        flaggedLowAttendance: 0
    });
    const [loadingStats, setLoadingStats] = useState(true);

    const [viewAll, setViewAll] = useState(false);
    const [currentTime, setCurrentTime] = useState(new Date());

    const navigate = useNavigate();
    const adminProfile = getAdminProfileFromToken();
    const userRole = adminProfile?.role || 'admin';

    const handleUnauthorized = useCallback(() => {
        localStorage.removeItem('adminToken');
        navigate('/signin', { replace: true });
    }, [navigate]);

    useEffect(() => {
        const handleStorageChange = (e) => {
            if (e.key === 'adminToken') {
                if (!e.newValue || !isTokenValid(e.newValue)) {
                    handleUnauthorized();
                }
            }
        };

        window.addEventListener('storage', handleStorageChange);
        return () => window.removeEventListener('storage', handleStorageChange);
    }, [handleUnauthorized]);

    // Fetch Sessions & Dashboard Data
    const loadDashboardData = useCallback(() => {
        const token = localStorage.getItem('adminToken');
        if (!isTokenValid(token)) {
            handleUnauthorized();
            return;
        }

        setLoadingSessions(true);
        api.get('/admin/sessions')
            .catch(() => api.get('/admin/sessionall'))
            .then((res) => {
                const data = res.data.sessions || res.data.data || res.data || [];
                setSessions(Array.isArray(data) ? data : []);
            })
            .catch((err) => {
                console.error("Failed to fetch sessions:", err);
                if (err.response?.status === 401 || err.response?.status === 403) {
                    handleUnauthorized();
                } else {
                    setError(err.response?.data?.message || 'Failed to retrieve sessions.');
                }
            })
            .finally(() => {
                setLoadingSessions(false);
            });

        api.get('/admin/dashboard-stats')
            .then((res) => {
                if (res.data.success && res.data.stats) {
                    setStats(res.data.stats);
                }
            })
            .catch((err) => {
                console.error("Failed to fetch stats:", err);
            })
            .finally(() => {
                setLoadingStats(false);
            });
    }, [handleUnauthorized]);

    useEffect(() => {
        loadDashboardData();
    }, [loadDashboardData]);

    useEffect(() => {
        const timer = setInterval(() => setCurrentTime(new Date()), 30000);
        return () => clearInterval(timer);
    }, []);

    const handleGenerateToken = async () => {
        const currentToken = localStorage.getItem('adminToken');
        if (!isTokenValid(currentToken)) {
            handleUnauthorized();
            return;
        }

        setGenerating(true);
        setError('');
        setInvite(null);
        setCopied(false);
        try {
            const response = await api.post(`/admin/invite?hours=${hours}`, {});
            setInvite({
                token: response.data.token,
                expiresAt: new Date(response.data.expiresAt).toLocaleString(),
            });
        } catch (err) {
            if (err.response?.status === 401 || err.response?.status === 403) {
                handleUnauthorized();
            } else {
                const msg = err.response?.data?.message || 'Failed to generate token.';
                setError(msg);
            }
        } finally {
            setGenerating(false);
        }
    };

    const handleCopy = () => {
        if (!invite?.token) return;
        navigator.clipboard.writeText(invite.token);
        setCopied(true);
        setTimeout(() => setCopied(false), 2500);
    };

    const handleRevoke = async () => {
        if (!invite?.token) return;
        setRevoking(true);
        setError('');
        try {
            await api.post('/admin/revoke-invite', { token: invite.token });
            setInvite((prev) => prev ? { ...prev, revoked: true } : null);
        } catch (err) {
            const msg = err.response?.data?.message || 'Failed to revoke token.';
            setError(msg);
        } finally {
            setRevoking(false);
        }
    };

    // Extract Unique Faculty Departments for Super Admin View
    const availableDepartments = ['All', ...new Set(sessions.map(s => s.department).filter(Boolean))];

    const filteredSessions = sessions.filter(sessionItem => {
        // Show all active sessions on live feed
        if (sessionItem?.isSessionActive === false) return false;
        if (userRole === 'super_admin' && selectedDeptFilter !== 'All') {
            return sessionItem.department?.toLowerCase() === selectedDeptFilter.toLowerCase();
        }
        return true;
    });

    if (viewAll) {
        return (
            <SetViewAll sessions={sessions} currentTime={currentTime} />
        );
    }

    return (
        <div className="min-h-screen px-4 lg:px-8 pb-24 lg:pb-8 pt-3 max-w-7xl mx-auto">

            {/* ── Role Banner & Header ─────────────────────────────── */}
            <div className="mb-6 bg-white border border-gray-200/80 rounded-2xl p-5 shadow-sm flex flex-col md:flex-row justify-between items-start md:items-center gap-4" data-aos="fade-down" data-aos-duration="550">
                <div>
                    <div className="flex items-center gap-2 mb-1">
                        <span className="text-xl md:text-2xl font-bold text-slate-800">
                            {userRole === 'super_admin' ? '🏛️ Faculty Deanery Command Center' : 'Overview'}
                        </span>
                        <span className={`text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wider ${
                            userRole === 'super_admin'
                                ? 'bg-amber-100 text-amber-900 border border-amber-300'
                                : userRole === 'course_rep'
                                ? 'bg-blue-100 text-blue-900 border border-blue-300'
                                : 'bg-[#baeed9] text-[#0a643a] border border-[#a2dfc6]'
                        }`}>
                            {userRole === 'super_admin' ? 'Super Admin' : userRole === 'course_rep' ? 'Course Rep' : 'Dept Admin'}
                        </span>
                    </div>
                    <p className="text-xs text-slate-500 font-medium">
                        {adminProfile?.faculty ? <strong className="text-slate-700">{adminProfile.faculty}</strong> : 'University System'} 
                        {adminProfile?.department && userRole !== 'super_admin' ? ` • ${adminProfile.department}` : ''}
                        {adminProfile?.level && userRole === 'course_rep' ? ` (${adminProfile.level})` : ''}
                    </p>
                </div>

                <button
                    onClick={loadDashboardData}
                    className="text-xs font-bold text-[#0a643a] bg-[#baeed9]/50 hover:bg-[#baeed9] px-3.5 py-2 rounded-xl transition-colors flex items-center gap-1.5 cursor-pointer"
                >
                    <span className="material-symbols-outlined text-base">refresh</span>
                    <span>Refresh Live Data</span>
                </button>
            </div>

            {/* ── Stat Cards ──────────────────────────────── */}
            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4 md:gap-5 mb-8">
                <div data-aos="fade-up" data-aos-delay="50">
                    <Cards icon="person" title="Total Students" value={loadingStats ? "..." : String(stats.totalStudents)} bgColor="bg-[#e8f0ec]" textColor="text-[#0a634a]" valueColor="text-[#0a634a]" />
                </div>
                <div data-aos="fade-up" data-aos-delay="120">
                    <Cards icon="person_check" title="Present Today" value={loadingStats ? "..." : String(stats.presentToday)} bgColor="bg-[#baeed9]" textColor="text-[#0a634a]" valueColor="text-[#0a634a]" />
                </div>
                <div data-aos="fade-up" data-aos-delay="190">
                    <Cards icon="person_remove" title="Absent Today" value={loadingStats ? "..." : String(stats.absentToday)} bgColor="bg-[#ffdad6]" textColor="text-[#ba1a1a]" valueColor="text-[#ba1a1a]" />
                </div>
                <div data-aos="fade-up" data-aos-delay="260">
                    <Cards icon="warning" title="Flagged < 75%" value={loadingStats ? "..." : String(stats.flaggedLowAttendance)} bgColor="bg-[#e2e3e3]" textColor="text-[#535856]" valueColor="text-[#535856]" />
                </div>
            </div>

            {/* ── Faculty Super Admin Department Filter Tabs ─────────── */}
            {userRole === 'super_admin' && availableDepartments.length > 2 && (
                <div className="bg-white border border-gray-200/80 rounded-2xl p-4 shadow-sm mb-6" data-aos="fade-up">
                    <span className="text-xs font-bold uppercase tracking-wider text-slate-500 block mb-2">
                        Filter Live Lectures By Department:
                    </span>
                    <div className="flex flex-wrap gap-2">
                        {availableDepartments.map((dept) => (
                            <button
                                key={dept}
                                onClick={() => setSelectedDeptFilter(dept)}
                                className={`text-xs px-3.5 py-1.5 rounded-xl font-bold transition-all cursor-pointer ${
                                    selectedDeptFilter === dept
                                        ? 'bg-[#0a643a] text-white shadow-sm'
                                        : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                                }`}
                            >
                                {dept === 'All' ? 'All Faculty Departments' : dept}
                            </button>
                        ))}
                    </div>
                </div>
            )}

            {/* ── Today's Sessions Feed ────────────────────────── */}
            <div className="flex justify-between items-center mb-4" data-aos="fade-up">
                <div className="flex items-center gap-2">
                    <h2 className="text-lg font-bold text-[#1a1c1a]">Active & Upcoming Lecture Sessions</h2>
                    <span className="text-xs bg-[#baeed9] text-[#0a643a] font-bold px-2 py-0.5 rounded-full">
                        {filteredSessions.length} Live
                    </span>
                </div>
                <button
                    onClick={() => setViewAll(true)}
                    className="flex items-center gap-1 text-[#0a643a] font-semibold text-xs cursor-pointer hover:underline"
                >
                    View All History
                    <span className="material-symbols-outlined text-base">arrow_right_alt</span>
                </button>
            </div>

            {/* Today's Sessions List */}
            {loadingSessions ? (
                <div className="py-8 text-center text-sm text-slate-500 font-medium animate-pulse">Loading live session feeds...</div>
            ) : filteredSessions.length === 0 ? (
                <div className="bg-white border border-dashed border-gray-300 rounded-2xl p-8 text-center text-slate-400 font-medium text-sm mb-10" data-aos="fade-up">
                    No active or upcoming lecture sessions currently ongoing.
                </div>
            ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5 md:gap-6 mb-10">
                    {filteredSessions.slice(0, 4).map((sessionItem, sIdx) => {
                        const isLiveOpen =
                            sessionItem.isSessionActive &&
                            currentTime >= new Date(sessionItem.dateTimeFrom) &&
                            currentTime <= new Date(sessionItem.dateTimeTo);

                        const sessionStatus = isLiveOpen ? "OPEN" : "UPCOMING";
                        const bgStatusColor = isLiveOpen ? "bg-[#baeed9]" : "bg-blue-50";
                        const textStatusColor = isLiveOpen ? "text-[#0a643a]" : "text-blue-700";

                        const displayTime = sessionItem.dateTimeFrom
                            ? new Date(sessionItem.dateTimeFrom).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
                            : "09:00 AM";

                        return (
                            <div key={sessionItem._id} data-aos="zoom-in" data-aos-delay={(sIdx % 4) * 80}>
                                <SessionCard
                                    id={sessionItem._id}
                                    sessionName={sessionItem.courseName}
                                    courseName={`${sessionItem.courseCode}: ${sessionItem.courseName}`}
                                    sessionStatus={sessionStatus}
                                    time={displayTime}
                                    bgStatusColor={bgStatusColor}
                                    textStatusColor={textStatusColor}
                                    icon="location_on"
                                    location={sessionItem.venue || "Unassigned"}
                                    onSessionClosed={loadDashboardData}
                                />
                            </div>
                        );
                    })}
                </div>
            )}

            {/* ── Invite Admin / Staff Panel ──────────────────────── */}
            {userRole !== 'course_rep' && (
                <div className="border border-gray-200 rounded-2xl bg-white shadow-sm overflow-hidden mb-6" data-aos="fade-up">
                    <div className="bg-[#f0f4f1] px-6 py-4 flex items-center gap-3 border-b border-gray-200">
                        <span className="material-symbols-outlined text-[#0a643a] text-3xl">
                            person_add
                        </span>
                        <div>
                            <h2 className="font-bold text-[#1a1c1a] text-base">
                                {userRole === 'super_admin' ? 'Generate Staff / Admin / Course Rep Invite Token' : 'Generate Course Rep Invite Token'}
                            </h2>
                            <p className="text-[#3f4941] text-xs">
                                Generate a one-time token and share it with new staff or course reps for account creation.
                            </p>
                        </div>
                    </div>

                    <div className="px-6 py-5">
                        <div className="flex flex-wrap items-end gap-4 mb-4">
                            <div>
                                <label className="block text-xs font-bold text-[#3f4941] mb-1.5">
                                    Token Expiry Window
                                </label>
                                <select
                                    value={hours}
                                    onChange={(e) => setHours(Number(e.target.value))}
                                    className="border border-gray-300 rounded-xl px-3.5 py-2 text-sm bg-white text-gray-700 outline-none focus:border-[#0a643a] font-medium"
                                >
                                    <option value={1}>1 Hour</option>
                                    <option value={6}>6 Hours</option>
                                    <option value={12}>12 Hours</option>
                                    <option value={24}>24 Hours (1 Day)</option>
                                    <option value={48}>48 Hours (2 Days)</option>
                                </select>
                            </div>

                            <button
                                onClick={handleGenerateToken}
                                disabled={generating}
                                className="bg-[#0a643a] hover:bg-[#084d2c] disabled:opacity-60 text-white font-bold text-xs px-5 py-2.5 rounded-xl transition-colors shadow-sm cursor-pointer"
                            >
                                {generating ? 'Generating...' : 'Generate Single-Use Token'}
                            </button>
                        </div>

                        {error && (
                            <p className="text-xs text-red-600 font-medium mb-3">{error}</p>
                        )}

                        {invite && (
                            <div className="bg-emerald-50/60 border border-emerald-200 rounded-xl p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                                <div>
                                    <span className="text-[11px] font-bold text-emerald-800 uppercase tracking-wide block">
                                        Single-Use Verification Token (Expires: {invite.expiresAt})
                                    </span>
                                    <code className="text-sm font-mono font-bold text-slate-800 break-all select-all">
                                        {invite.token}
                                    </code>
                                </div>

                                <div className="flex items-center gap-2">
                                    <button
                                        onClick={handleCopy}
                                        className="bg-[#0a643a] hover:bg-[#084f2e] text-white text-xs font-bold px-3 py-1.5 rounded-lg transition-colors cursor-pointer"
                                    >
                                        {copied ? 'Copied! ✓' : 'Copy Token'}
                                    </button>
                                    <button
                                        onClick={handleRevoke}
                                        disabled={revoking || invite.revoked}
                                        className="bg-red-100 hover:bg-red-200 text-red-800 text-xs font-bold px-3 py-1.5 rounded-lg transition-colors cursor-pointer disabled:opacity-50"
                                    >
                                        {invite.revoked ? 'Revoked' : revoking ? 'Revoking...' : 'Revoke'}
                                    </button>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            )}
        </div>
    );
};

export default AdminDashboard;