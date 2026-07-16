import React, { useState, useEffect } from 'react';
import SessionHero from '../Components/SessionHero';
import AttendanceRoster from '../Components/AttendanceRoster';
import SessionInsights from '../Components/SessionInsights';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';

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

        // Construct the full URL targeting your single-item backend route
        const singleSessionUrl = `${import.meta.env.VITE_SINGLE_SESSION_BASE_URL}/${id}`;

        axios.get(singleSessionUrl, {
            headers: {
                Authorization: `Bearer ${token}`,
                'Content-Type': 'application/json',
                'Accept': 'application/json'
            }
        })
            .then((res) => {
                // Set the single object payload directly to state
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
            // Target the update/close endpoint on your backend
            // Note: If you don't have a custom `/close` endpoint, 
            // you can send a PATCH directly to the session base url
            const patchUrl = `${import.meta.env.VITE_SINGLE_SESSION_BASE_URL}/${id}`;
            
            await axios.patch(
                patchUrl,
                { isSessionActive: false },
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                        'Content-Type': 'application/json',
                    }
                }
            );

            alert("Session closed successfully!");
            // Redirect back to the overview dashboard smoothly!
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
        <div className="max-w-7xl mx-auto space-y-6 p-4">
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
            <div className="flex flex-col lg:flex-row gap-6 items-stretch w-full">
                {/* Left Aspect: Roster Sheet Module */}
                <AttendanceRoster session={sessionData} />

                {/* Right Aspect: Context Analytics Panels */}
                <SessionInsights session={sessionData} />
            </div>
        </div>
    );
}