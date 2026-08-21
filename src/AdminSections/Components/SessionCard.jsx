import api from '../../Utils/api';
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const SessionCard = ({
    id,
    sessionName,
    sessionStatus,
    courseName,
    courseCode,
    department,
    time,
    icon = 'location_on',
    location = 'Unassigned Venue',
    bgStatusColor = 'bg-[#baeed9]',
    textStatusColor = 'text-[#0a643a]',
    onSessionClosed
}) => {
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);

    const closeSession = async (sessionId) => {
        if (!window.confirm("Are you sure you want to end this attendance session?")) {
            return;
        }

        try {
            setLoading(true);
            const idString = typeof sessionId === 'object' ? sessionId._id : sessionId;
            const response = await api.post(`/admin/end-session/${idString}`, {});

            if (response.data && response.data.success) {
                alert(response.data.message || "Session closed successfully!");
                if (onSessionClosed) {
                    onSessionClosed(idString);
                } else {
                    window.location.reload();
                }
            }
        } catch (error) {
            console.error("Error closing session:", error);
            alert(error.response?.data?.message || "Failed to close session.");
        } finally {
            setLoading(false);
        }
    };

    const setViewDetails = () => {
        if (!id) {
            alert("Invalid session ID.");
            return;
        }
        navigate(`/admin/monitor/${id}`);
    };

    return (
        <div className="w-full bg-white rounded-2xl border border-gray-200/80 shadow-sm overflow-hidden flex flex-col justify-between hover:shadow-md transition-all">
            {/* Header banner */}
            <div className="flex justify-between items-center px-4 py-3 bg-slate-800 text-white">
                <h3 className="text-sm font-bold truncate max-w-[200px]" title={sessionName}>
                    {sessionName}
                </h3>
                <span className={`text-[11px] font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-full ${bgStatusColor} ${textStatusColor}`}>
                    {sessionStatus}
                </span>
            </div>

            {/* Body */}
            <div className="p-4 flex-1 flex flex-col justify-between space-y-3">
                <div>
                    <div className="flex items-start justify-between gap-2">
                        <h4 className="text-base font-bold text-slate-800 leading-tight">
                            {courseName}
                        </h4>
                        <span className="text-xs font-semibold text-slate-500 shrink-0">
                            {time}
                        </span>
                    </div>

                    <p className="text-xs text-slate-500 font-medium flex items-center gap-1 mt-2">
                        <span className="material-symbols-outlined text-base text-slate-400">
                            {icon}
                        </span>
                        <span>{location}</span>
                    </p>
                </div>

                {/* Actions */}
                <div className="grid grid-cols-2 gap-2 pt-2 border-t border-gray-100">
                    <button
                        onClick={setViewDetails}
                        className="w-full py-2 bg-[#0a643a] hover:bg-[#084f2e] text-white text-xs font-bold rounded-xl transition-colors shadow-sm flex items-center justify-center gap-1 cursor-pointer"
                    >
                        <span className="material-symbols-outlined text-base">visibility</span>
                        <span>View Details</span>
                    </button>
                    <button
                        onClick={() => closeSession(id)}
                        disabled={loading}
                        className="w-full py-2 border border-red-300 hover:bg-red-50 text-red-700 text-xs font-bold rounded-xl transition-colors disabled:opacity-50 flex items-center justify-center gap-1 cursor-pointer"
                    >
                        <span className="material-symbols-outlined text-base">stop_circle</span>
                        <span>{loading ? 'Closing...' : 'Close'}</span>
                    </button>
                </div>
            </div>
        </div>
    );
};

export default SessionCard;