import axios from 'axios';
import { useEffect, useState } from 'react';
import Cards from '../Components/Cards';
import SessionCard from '../Components/SessionCard';
import { useNavigate } from 'react-router-dom';
import SetViewAll from './SetViewAll';

const AdminDashboard = () => {
    const [generating, setGenerating] = useState(false);
    const [revoking, setRevoking] = useState(false);
    const [invite, setInvite] = useState(null);   // { token, expiresAt, revoked }
    const [error, setError] = useState('');
    const [copied, setCopied] = useState(false);
    const [hours, setHours] = useState(24);

    const [sessions, setSessions] = useState([]);
    const [loadingSessions, setLoadingSessions] = useState(true);

    // STEP 1: Define a toggle state to swap between Overview dashboard and Full-Screen Session lists
    const [viewAll, setViewAll] = useState(false);

    // FIXED: Adding a dynamic clock tick tracker to automatically update session statuses live every 30 seconds
    const [currentTime, setCurrentTime] = useState(new Date());

    const navigate = useNavigate();

    const adminInviteUrl = import.meta.env.VITE_ADMIN_INVITE_URL;
    const sessionURI = import.meta.env.VITE_SESSIONALL_URL;
    const admindashboardUrl = import.meta.env.VITE_ADMINDASHBOARD_URL
    const token = localStorage.getItem('adminToken');

    // 1. Clock Tracker Lifecycle Hook
    useEffect(() => {
        const timer = setInterval(() => setCurrentTime(new Date()), 30000); // ticks every 30s
        return () => clearInterval(timer);
    }, []);

    useEffect(() => {
        if (token) {
            axios.get(`${admindashboardUrl}`, {
                headers: { Authorization: `Bearer ${token}` }
            })
                .then((response) => {
                    console.log('Protected dashboard data:', response)
                })
                .catch((error) => {
                    navigate('/signin')
                    console.error('Error fetching protected dashboard data:', error)
                })

        } else {
            navigate('/signin')
            console.warn('No token found. Please sign in to access the dashboard.')
        }
    }, [token])

    // 2. Fetch Sessions Lifecycle Hook
    useEffect(() => {
        if (!token) {
            navigate('/admin/login');
            return;
        }

        setLoadingSessions(true);
        axios.get(`${sessionURI}`, {
            headers: {
                Authorization: `Bearer ${token}`,
                'Content-Type': 'application/json',
                'Accept': 'application/json'
            }
        })
            .then((res) => {
                setSessions(res.data.data || []);
            })
            .catch((err) => {
                console.error("Failed to fetch dashboard sessions:", err);
                setError(err.response?.data?.message || 'Failed to retrieve active sessions.');
            })
            .finally(() => {
                setLoadingSessions(false);
            });

    }, [token, navigate, sessionURI]);

    const handleGenerateToken = async () => {
        if (!token) {
            navigate('/admin/login');
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
                { headers: { Authorization: `Bearer ${token}` } }
            );
            setInvite({
                token: response.data.token,
                expiresAt: new Date(response.data.expiresAt).toLocaleString(),
            });
        } catch (err) {
            const msg = err.response?.data?.message || 'Failed to generate token. Are you logged in?';
            setError(msg);
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
        if (!invite?.token || !token) return;
        setRevoking(true);
        setError('');
        try {
            await axios.delete(adminInviteUrl, {
                data: { token: invite.token },
                headers: { Authorization: `Bearer ${token}` },
            });
            setInvite((prev) => ({ ...prev, revoked: true }));
            setTimeout(() => setInvite(null), 2000);
        } catch (err) {
            const msg = err.response?.data?.message || 'Failed to revoke token.';
            setError(msg);
        } finally {
            setRevoking(false);
        }
    };

    // If "View All" is true, we will temporarily show a simple placeholder 
    // so we can test that the button is working perfectly before inserting the full design!
    if (viewAll) {
        return (
            <SetViewAll
                sessions={sessions}
                loading={loadingSessions}
                onBack={() => setViewAll(false)}
            />
        );
    }

    return (
        <div className="min-h-screen mt-[0rem] px-6 pb-24 lg:pb-6">

            {/* ── Page Header ─────────────────────────────── */}
            <div className="mb-4">
                <h1 className="text-2xl font-bold text-[#1a1c1a]">Overview</h1>
                <p className="text-[#3f4941] text-sm">Live metrics for today's attendance</p>
            </div>

            {/* ── Stat Cards ──────────────────────────────── */}
            <div className="flex flex-wrap md:flex-nowrap justify-center items-center gap-4 mb-6">
                <Cards icon="person" title="Total Students" value="150" bgColor="bg-[#e8f0ec]" textColor="text-[#0a634a]" valueColor="text-[#0a634a]" />
                <Cards icon="person_check" title="Present Today" value="120" bgColor="bg-[#baeed9]" textColor="text-[#0a634a]" valueColor="text-[#0a634a]" />
                <Cards icon="person_remove" title="Absent Today" value="30" bgColor="bg-[#ffdad6]" textColor="text-[#ba1a1a]" valueColor="text-[#ba1a1a]" />
                <Cards icon="warning" title="Flagged < 70%" value="15" bgColor="bg-[#e2e3e3]" textColor="text-[#535856]" valueColor="text-[#535856]" />
            </div>

            {/* ── Today's Sessions ────────────────────────── */}
            <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-bold text-[#1a1c1a]">Today's Sessions</h2>
                {/* STEP 2: Update click handler on View All */}
                <button
                    onClick={() => setViewAll(true)}
                    className="flex items-center gap-1 text-[#0a643a] font-semibold text-sm cursor-pointer"
                >
                    View All
                    <span className="material-symbols-outlined text-base">arrow_right_alt</span>
                </button>
            </div>

            {/* Dynamic Rendering List Layer */}
            {/* Today's Sessions List (Excluding Closed Sessions) */}
            {loadingSessions ? (
                <div className="py-8 text-center text-sm text-slate-500 font-medium">Loading session feeds...</div>
            ) : sessions.filter(sessionItem => {
                // A session is closed if it is explicitly inactive OR the current time has passed its end time
                const isClosed = !sessionItem.isSessionActive || (currentTime > new Date(sessionItem.dateTimeTo));
                return !isClosed; // Only keep sessions that are NOT closed (i.e. Open or Upcoming)
            }).length === 0 ? (
                <div className="bg-white border border-dashed border-gray-300 rounded-2xl p-8 text-center text-slate-400 font-medium text-sm mb-12">
                    No active or upcoming lecture sessions found for today.
                </div>
            ) : (
                <div className="flex flex-wrap gap-4 mb-12">
                    {sessions
                        .filter(sessionItem => {
                            const isClosed = !sessionItem.isSessionActive || (currentTime > new Date(sessionItem.dateTimeTo));
                            return !isClosed;
                        })
                        .slice(0, 4) // Only show the first 4 active/upcoming sessions
                        .map((sessionItem) => {
                            const isLiveOpen =
                                sessionItem.isSessionActive &&
                                currentTime >= new Date(sessionItem.dateTimeFrom) &&
                                currentTime <= new Date(sessionItem.dateTimeTo);

                            const sessionStatus = isLiveOpen ? "OPEN" : "UPCOMING";
                            const bgStatusColor = isLiveOpen ? "bg-[#baeed9]" : "bg-blue-50";
                            const textStatusColor = isLiveOpen ? "text-[#0a643a]" : "text-blue-700";

                            const displayTime = sessionItem.dateTimeFrom
                                ? new Date(sessionItem.dateTimeFrom).toLocaleTimeString(undefined, { hour: '2-digit', minute: '2-digit' })
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
            <div className="border border-gray-200 rounded-2xl bg-white shadow-sm overflow-hidden">
                <div className="bg-[#f0f4f1] px-6 py-4 flex items-center gap-3 border-b border-gray-200">
                    <span className="material-symbols-outlined text-[#0a643a] text-3xl">
                        person_add
                    </span>
                    <div>
                        <h2 className="font-bold text-[#1a1c1a] text-lg">Invite New Admin</h2>
                        <p className="text-[#3f4941] text-sm">
                            Generate a one-time invite token and share it with the new admin.
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
                                    {invite.revoked ? 'Token revoked — it can no longer be used' : 'Token generated — share this with the new admin'}
                                </span>
                                <span className="text-xs text-[#535856] bg-[#e2e3e3] px-2 py-1 lg:rounded-full rounded-lg ml-auto">
                                    Expires: {invite.expiresAt}
                                </span>
                            </div>

                            <div className="lg:flex  items-center w-[100%] gap-2 mt-3 bg-white border border-gray-200 rounded-lg px-4 py-3">
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
        </div>
    );
};

export default AdminDashboard;