import React, { useState, useEffect } from 'react';
import SessionHero from '../Components/SessionHero';
import AttendanceRoster from '../Components/AttendanceRoster';
import SessionInsights from '../Components/SessionInsights';
import DynamicQRCodeCard from '../Components/DynamicQRCodeCard';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../../Utils/api';
import BackButton from '../../Components/BackButton';

export default function SessionMonitor() {
    const { id } = useParams(); // Grabs the database ObjectId cleanly from the URL parameter
    const navigate = useNavigate();
    const [sessionData, setSessionData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [closing, setClosing] = useState(false);

    const token = localStorage.getItem('adminToken');

    useEffect(() => {
        if (!token) {
            navigate('/signin');
            return;
        }

        api.get(`/admin/monitor/${id}`)
            .then((res) => {
                setSessionData(res.data.data);
            })
            .catch((err) => {
                console.error("Failed to load targeted session details:", err);
            })
            .finally(() => {
                setLoading(false);
            });
    }, [id, token, navigate]);

    // ── CLOSE SESSION API HANDLER ──────────────────────────
    const handleCloseSession = async () => {
        if (!window.confirm("Are you sure you want to close this attendance session immediately?")) {
            return;
        }

        setClosing(true);
        try {
            await api.patch(`/admin/close-session/${id}`, { isSessionActive: false });
            alert("Session closed successfully!");
            navigate('/admin/lecturer-dashboard'); 
        } catch (err) {
            console.error("Failed to close session:", err);
            alert(err.response?.data?.message || "Failed to close the session. Please try again.");
        } finally {
            setClosing(false);
        }
    };

    // Handle initial network loading state
    if (loading) {
        return (
            <div className="text-[#0a643a] text-center mt-10 animate-pulse font-medium">
                Loading session profile configuration...
            </div>
        );
    }

    // Handle edge case where no matching ID document came back from MongoDB
    if (!sessionData) {
        return (
            <div className="text-red-700 text-center mt-10 border border-red-200 p-4 bg-red-50 rounded-xl max-w-md mx-auto">
                Session data records not found.
            </div>
        );
    }

    const displayDate = sessionData.dateTimeFrom
        ? new Date(sessionData.dateTimeFrom).toLocaleDateString()
        : "N/A";

    return (
        <div className="max-w-7xl mx-auto space-y-5 px-4 pt-3 pb-24">
            <div className="flex justify-between items-center">
                <BackButton to="/admin/lecturer-dashboard" label="Back to Admin Dashboard" />
            </div>

            {/* Pass handleCloseSession and closing state to your Hero section */}
            <SessionHero
                key={sessionData._id}
                session={sessionData}
                courseName={`${sessionData.courseCode}: ${sessionData.courseName}`}
                icon="location_on"
                location={sessionData.venue}
                calender="event"
                time={displayDate}
                onCloseSession={handleCloseSession}
                isClosing={closing}
            />

            {/* Main Grid Content Matrix Setup */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start w-full">
                {/* Column 1 & 2: Roster Sheet Module */}
                <div className="lg:col-span-2 space-y-6">
                    <AttendanceRoster session={sessionData} />
                </div>

                {/* Column 3: Live Dynamic QR Code & Insights */}
                <div className="space-y-6">
                    <DynamicQRCodeCard session={sessionData} />
                    <SessionInsights session={sessionData} />
                </div>
            </div>
        </div>
    );
}