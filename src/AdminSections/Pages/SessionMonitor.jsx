import React, { useState, useEffect } from 'react';
import SessionHero from '../Components/SessionHero';
import AttendanceRoster from '../Components/AttendanceRoster';
import SessionInsights from '../Components/SessionInsights';
import { useParams } from 'react-router-dom';
import axios from 'axios';

export default function SessionMonitor() {
    const { id } = useParams(); // Grabs the database ObjectId cleanly from the URL parameter
    const [sessionData, setSessionData] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const token = localStorage.getItem('adminToken');
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
    }, [id]);

    // Handle initial network loading state
    if (loading) {
        return (
            <div className="text-white text-center mt-10 animate-pulse">
                Loading session profile configuration...
            </div>
        );
    }

    // Handle edge case where no matching ID document came back from MongoDB
    if (!sessionData) {
        return (
            <div className="text-white text-center mt-10 border border-red-500/30 p-4 bg-red-950/20 rounded">
                Session data records not found.
            </div>
        );
    }
    const displayDate = sessionData.dateTimeFrom
        ? new Date(sessionData.dateTimeFrom).toLocaleDateString()
        : "N/A";

    return (
        <div className="max-w-7xl mx-auto space-y-6 p-4">
            {/* CRITICAL FIX: Removed the .map() wrapper loop completely!
            We are rendering the single sessionData object straight into your Hero section.
            */}
            <SessionHero
                key={sessionData._id}
                session={sessionData}
                courseName={`${sessionData.courseCode}: ${sessionData.courseName}`}
                icon="location_on"
                location={sessionData.venue}
                calender="event"
                time={displayDate}
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
