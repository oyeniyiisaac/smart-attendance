import axios from 'axios';
import { useEffect, useState, useCallback } from 'react';
import Cards from '../Components/Cards';
import SessionCard from '../Components/SessionCard';
import { useNavigate } from 'react-router-dom';
import SetViewAll from './SetViewAll';

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
                return false; // Token has expired
            }
        }
        return true;
    } catch (error) {
        return false; // Token is corrupted or tampered with
    }
};

import api from '../../Utils/api';

const AdminDashboard = () => {
    const [generating, setGenerating] = useState(false);
    const [revoking, setRevoking] = useState(false);
    const [invite, setInvite] = useState(null);   // { token, expiresAt, revoked }
    const [error, setError] = useState('');
    const [copied, setCopied] = useState(false);
    const [hours, setHours] = useState(24);

    const [sessions, setSessions] = useState([]);
    const [loadingSessions, setLoadingSessions] = useState(true);

    const [stats, setStats] = useState({
        totalStudents: 0,
        presentToday: 0,
        absentToday: 0,
        flaggedLowAttendance: 0
    });
    const [loadingStats, setLoadingStats] = useState(true);

    // Toggle state to swap between Overview dashboard and Full-Screen Session lists
    const [viewAll, setViewAll] = useState(false);

    // Dynamic clock tick tracker (updates session statuses live every 30s)
    const [currentTime, setCurrentTime] = useState(new Date());

    const navigate = useNavigate();

    const adminInviteUrl = import.meta.env.VITE_ADMIN_INVITE_URL;
    const sessionURI = import.meta.env.VITE_SESSIONALL_URL;
    const admindashboardUrl = import.meta.env.VITE_ADMINDASHBOARD_URL;

    // Helper to clear session & eject user to login
    const handleUnauthorized = useCallback(() => {
        localStorage.removeItem('adminToken');
        navigate('/signin', { replace: true });
    }, [navigate]);

    // 1. Monitor real-time localStorage changes (if user edits/deletes token in DevTools or another tab)
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

    // 2. Initial Auth & Token Sanity Check on Mount
    useEffect(() => {
        const currentToken = localStorage.getItem('adminToken');

        if (!isTokenValid(currentToken)) {
            handleUnauthorized();
            return;
        }

        axios.get(admindashboardUrl, {
            headers: { Authorization: `Bearer ${currentToken}` }
        })
        .then((res) => {
            console.log("Admin Dashboard API Response:", res.data);
            const data = res.data.sessions || res.data.data || res.data;
            setSessions(Array.isArray(data) ? data : []);
        })
        .catch((err) => {
            console.error("Failed to fetch admin dashboard:", err);
            if (err.response?.status === 401 || err.response?.status === 403) {
                handleUnauthorized();
            } else {
                setError(err.response?.data?.message || 'Failed to retrieve admin dashboard.');
            }
        })
        .finally(() => {
            setLoadingSessions(false);
        });
    }, [admindashboardUrl, handleUnauthorized]);

    // 3. Fetch All Sessions Feed
    useEffect(() => {
        const currentToken = localStorage.getItem('adminToken');
        if (!isTokenValid(currentToken)) return;

        setLoadingSessions(true);
        axios.get(`${sessionURI}`, {
            headers: {
                Authorization: `Bearer ${currentToken}`,
                'Content-Type': 'application/json',
                'Accept': 'application/json'
            }
        })
            .then((res) => {
                const fetchedSessions = res.data?.sessions || res.data?.data || res.data || [];
                setSessions(Array.isArray(fetchedSessions) ? fetchedSessions : []);
            })
            .catch((err) => {
                console.error("Failed to fetch dashboard sessions:", err);
                if (err.response?.status === 401 || err.response?.status === 403) {
                    handleUnauthorized();
                } else {
                    setError(err.response?.data?.message || 'Failed to retrieve sessions.');
                }
            })
            .finally(() => {
                setLoadingSessions(false);
            });

    }, [sessionURI, handleUnauthorized]);

    // 4. Fetch Dashboard Stat Cards Metrics
    useEffect(() => {
        const currentToken = localStorage.getItem('adminToken');
        if (!isTokenValid(currentToken)) return;

        api.get('/admin/dashboard-stats')
            .then((res) => {
                if (res.data.success && res.data.stats) {
                    setStats(res.data.stats);
                }
            })
            .catch((err) => {
                console.error("Failed to fetch dashboard stats:", err);
            })
            .finally(() => {
                setLoadingStats(false);
            });
    }, []);

    // 5. Clock Tracker Lifecycle Hook
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
            const response = await axios.post(
                `${adminInviteUrl}?hours=${hours}`,
                {},
                { headers: { Authorization: `Bearer ${currentToken}` } }
            );
            setInvite({
                token: response.data.token,
                expiresAt: new Date(response.data.expiresAt).toLocaleString(),
            });
        } catch (err) {
            if (err.response?.status === 401 || err.response?.status === 403) {
                handleUnauthorized();
            } else {
                const msg = err.response?.data?.message || 'Failed to generate token. Are you logged in?';
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
        const currentToken = localStorage.getItem('adminToken');
        if (!invite?.token || !currentToken) return;
        
        if (!isTokenValid(currentToken)) {
            handleUnauthorized();
            return;
        }

        setRevoking(true);
        setError('');
        try {
            await axios.delete(adminInviteUrl, {
                data: { token: invite.token },
                headers: { Authorization: `Bearer ${currentToken}` },
            });
            setInvite((prev) => ({ ...prev, revoked: true }));
            setTimeout(() => setInvite(null), 2000);
        } catch (err) {
            if (err.response?.status === 401 || err.response?.status === 403) {
                handleUnauthorized();
            } else {
                const msg = err.response?.data?.message || 'Failed to revoke token.';
                setError(msg);
            }
        } finally {
            setRevoking(false);
        }
    };

    const userRole = (() => {
        try {
            const token = localStorage.getItem('adminToken');
            if (!token) return 'admin';
            const payload = JSON.parse(atob(token.split('.')[1]));
            return payload.role || 'admin';
        } catch {
            return 'admin';
        }
    })();

    // Render Full-Screen Sessions View when viewAll is enabled
    if (viewAll) {
        return (
            <SetViewAll sessions={sessions} currentTime={currentTime} />
        );
    }

    return (
        <div className="min-h-screen mt-[0rem] px-6 pb-24 lg:pb-6">

            {/* ── Page Header ─────────────────────────────── */}
            <div className="mb-4">
                <div className="flex items-center gap-2">
                    <h1 className="text-2xl font-bold text-[#1a1c1a]">Overview</h1>
                    <span className="bg-[#baeed9] text-[#0a643a] text-xs font-semibold px-2.5 py-1 rounded-full uppercase tracking-wider">
                        {userRole === 'super_admin' ? 'Faculty Super Admin' : userRole === 'course_rep' ? 'Course Rep' : 'Department Admin'}
                    </span>
                </div>
                <p className="text-[#3f4941] text-sm">Live metrics for today's attendance</p>
            </div>

            {/* ── Stat Cards ──────────────────────────────── */}
            <div className="flex flex-wrap md:flex-nowrap justify-center items-center gap-4 mb-6">
                <Cards icon="person" title="Total Students" value={loadingStats ? "..." : String(stats.totalStudents)} bgColor="bg-[#e8f0ec]" textColor="text-[#0a634a]" valueColor="text-[#0a634a]" />
                <Cards icon="person_check" title="Present Today" value={loadingStats ? "..." : String(stats.presentToday)} bgColor="bg-[#baeed9]" textColor="text-[#0a634a]" valueColor="text-[#0a634a]" />
                <Cards icon="person_remove" title="Absent Today" value={loadingStats ? "..." : String(stats.absentToday)} bgColor="bg-[#ffdad6]" textColor="text-[#ba1a1a]" valueColor="text-[#ba1a1a]" />
                <Cards icon="warning" title="Flagged < 70%" value={loadingStats ? "..." : String(stats.flaggedLowAttendance)} bgColor="bg-[#e2e3e3]" textColor="text-[#535856]" valueColor="text-[#535856]" />
            </div>

            {/* ── Today's Sessions ────────────────────────── */}
            <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-bold text-[#1a1c1a]">Today's Sessions</h2>
                <button
                    onClick={() => setViewAll(true)}
                    className="flex items-center gap-1 text-[#0a643a] font-semibold text-sm cursor-pointer hover:underline"
                >
                    View All
                    <span className="material-symbols-outlined text-base">arrow_right_alt</span>
                </button>
            </div>

            {/* Today's Sessions List (Excluding Closed Sessions) */}
            {loadingSessions ? (
                <div className="py-8 text-center text-sm text-slate-500 font-medium">Loading session feeds...</div>
            ) : sessions.filter(sessionItem => {
                const isClosed = !sessionItem?.isSessionActive || (currentTime > new Date(sessionItem?.dateTimeTo));
                return !isClosed;
            }).length === 0 ? (
                <div className="bg-white border border-dashed border-gray-300 rounded-2xl p-8 text-center text-slate-400 font-medium text-sm mb-12">
                    No active or upcoming lecture sessions found for today.
                </div>
            ) : (
                <div className="flex flex-wrap gap-4 mb-12">
                    {sessions
                        .filter(sessionItem => {
                            const isClosed = !sessionItem?.isSessionActive || (currentTime > new Date(sessionItem?.dateTimeTo));
                            return !isClosed;
                        })
                        .slice(0, 4)
                        .map((sessionItem) => {
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
                                <SessionCard
                                    key={sessionItem._id}
                                    id={sessionItem._id}
                                    sessionName={sessionItem.courseName}
                                    courseName={`${sessionItem.courseCode}: ${sessionItem.courseName}`}
                                    sessionStatus={sessionStatus}
                                    time={displayTime}
                                    bgStatusColor={bgStatusColor}
                                    textStatusColor={textStatusColor}
                                    icon="location_on"
                                    location={sessionItem.venue || "Unassigned"}
                                />
                            );
                        })}
                </div>
            )}

            {/* ── Invite Admin Panel ──────────────────────── */}
            {userRole !== 'course_rep' && (
                <div className="border border-gray-200 rounded-2xl bg-white shadow-sm overflow-hidden">
                    <div className="bg-[#f0f4f1] px-6 py-4 flex items-center gap-3 border-b border-gray-200">
                        <span className="material-symbols-outlined text-[#0a643a] text-3xl">
                            person_add
                        </span>
                        <div>
                            <h2 className="font-bold text-[#1a1c1a] text-lg">Invite New Admin / Course Rep</h2>
                            <p className="text-[#3f4941] text-sm">
                                Generate a one-time invite token and share it with the new admin or course rep.
                                They must use it before it expires.
                            </p>
                        </div>
                    </div>

                    <div className="px-6 py-6">
                        <div className="flex flex-wrap items-end gap-4 mb-5">
                            <div>
                                <label className="block text-sm font-medium text-[#3f4941] mb-1">
                                    Token valid for
                                </label>
                                <select
                                    value={hours}
                                    onChange={(e) => setHours(Number(e.target.value))}
                                    className="border border-gray-300 rounded-lg px-3 py-2 text-sm outline-none focus:border-[#0a643a] transition-colors bg-white"
                                >
                                    <option value={1}>1 hour</option>
                                    <option value={6}>6 hours</option>
                                    <option value={12}>12 hours</option>
                                    <option value={24}>24 hours</option>
                                    <option value={48}>48 hours</option>
                                </select>
                            </div>

                            <button
                                onClick={handleGenerateToken}
                                disabled={generating}
                                className="flex items-center gap-2 bg-[#0a643a] text-white px-5 py-2 rounded-lg font-semibold text-sm disabled:opacity-60 disabled:cursor-not-allowed transition-opacity cursor-pointer"
                            >
                                <span className="material-symbols-outlined text-base">token</span>
                                {generating ? 'Generating...' : 'Generate Invite Token'}
                            </button>
                        </div>

                        {error && (
                            <div className="flex items-center gap-2 bg-[#fdecea] border border-[#ba1a1a] text-[#ba1a1a] rounded-lg px-4 py-3 text-sm mb-4">
                                <span className="material-symbols-outlined text-base">error</span>
                                {error}
                            </div>
                        )}

                        {invite && (
                            <div className={`border w-[100%] rounded-xl p-5 transition-colors ${invite.revoked ? 'bg-[#fff4f4] border-[#ba1a1a]' : 'bg-[#f0f4f1] border-[#baeed9]'}`}>
                                <div className="flex items-center justify-between mb-2">
                                    <span className={`text-sm font-semibold flex items-center gap-1 ${invite.revoked ? 'text-[#ba1a1a]' : 'text-[#0a643a]'}`}>
                                        <span className="material-symbols-outlined text-base">
                                            {invite.revoked ? 'cancel' : 'check_circle'}
                                        </span>
                                        {invite.revoked ? 'Token revoked — it can no longer be used' : 'Token generated — share this with the user'}
                                    </span>
                                    <span className="text-xs text-[#535856] bg-[#e2e3e3] px-2 py-1 lg:rounded-full rounded-lg ml-auto">
                                        Expires: {invite.expiresAt}
                                    </span>
                                </div>

                                <div className="lg:flex items-center w-[100%] gap-2 mt-3 bg-white border border-gray-200 rounded-lg px-4 py-3">
                                    <code className={`flex-1 text-sm break-all font-mono ${invite.revoked ? 'line-through text-[#9e9e9e]' : 'text-[#1a1c1a]'}`}>
                                        {invite.token}
                                    </code>
                                    <div className="mt-2 lg:mt-0 flex items-center gap-2">
                                        {!invite.revoked && (
                                            <button
                                                onClick={handleCopy}
                                                title="Copy token"
                                                className="flex items-center gap-1 text-sm text-[#0a643a] font-semibold border border-[#0a643a] px-3 py-1 rounded-lg hover:bg-[#baeed9] transition-colors whitespace-nowrap cursor-pointer"
                                            >
                                                <span className="material-symbols-outlined text-base">
                                                    {copied ? 'check' : 'content_copy'}
                                                </span>
                                                {copied ? 'Copied!' : 'Copy'}
                                            </button>
                                        )}
                                        {!invite.revoked && (
                                            <button
                                                onClick={handleRevoke}
                                                disabled={revoking}
                                                title="Revoke token"
                                                className="flex items-center gap-1 text-sm text-[#ba1a1a] font-semibold border border-[#ba1a1a] px-3 py-1 rounded-lg hover:bg-[#fdecea] disabled:opacity-60 disabled:cursor-not-allowed transition-colors whitespace-nowrap cursor-pointer"
                                            >
                                                <span className="material-symbols-outlined text-base">block</span>
                                                {revoking ? 'Revoking...' : 'Revoke'}
                                            </button>
                                        )}
                                    </div>
                                </div>

                                <p className="text-xs text-[#535856] mt-3 flex items-center gap-1">
                                    <span className="material-symbols-outlined text-sm">info</span>
                                    This token is single-use and expires automatically. Generate a new one if needed.
                                </p>
                            </div>
                        )}
                    </div>
                </div>
            )}
        </div>
    );
};

export default AdminDashboard;