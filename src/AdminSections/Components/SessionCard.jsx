import api from '../../Utils/api';
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const SessionCard = ({
    id,             // Unique Mongo _id of the session
    sessionName,
    sessionStatus,
    courseName,
    courseCode,     // 🎯 Added courseCode prop
    department,     // 🎯 Added department prop
    time,
    icon,
    location,
    bgStatusColor,
    textStatusColor
    }) => {
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);

    const closeSession = async (sessionId) => {
    try {
        setLoading(true);
        const idString = typeof sessionId === 'object' ? sessionId._id : sessionId;

        const response = await api.post(`/admin/end-session/${idString}`, {});

        if (response.data && response.data.success) {
            alert(response.data.message || "Session closed successfully!");
            // Trigger UI refresh
        }
    } catch (error) {
        console.error("Error closing session:", error);
        alert(error.response?.data?.message || "Failed to close session.");
    } finally {
        setLoading(false);
    }
};


    const setViewDetails = () => {
        // Navigate to the monitor path with the dynamic ID param
        navigate(`/admin/monitor/${id}`);
    };

    return (
        <div className='w-[400px] rounded-lg bg-[#ffffff] border-2 border-[#e4ebed]'>
            <div className='flex justify-between items-center py-1 px-3 bg-[#676b6a] rounded-tl-lg rounded-tr-lg'>
                <h3 className='text-white text-[20px] font-semibold'>{sessionName}</h3>
                <span className={`rounded-full px-2 ${bgStatusColor} ${textStatusColor}`}>{sessionStatus}</span>
            </div>
            <hr className='text-[#3f4954]' />
            <div className='py-1 px-2'>
                <div className='flex gap-4 mt-4 mb-2 justify-between'>
                    <h1 className='text-[18px] font-bold'>{courseName}</h1>
                    <span className='text-[#3f4954] font-semibold'>{time}</span>
                </div>
                <p className='text-[#3f4954] flex items-center font-semibold'>
                    <span className="material-symbols-outlined">{icon}</span>{location}
                </p>
                <div className='flex gap-2 text-center justify-between my-4'>
                    <button
                        onClick={setViewDetails}
                        className='flex items-center justify-center py-2 w-full rounded-sm px-6 bg-[#0a643a] text-[18px] text-[#fff] font-semibold cursor-pointer'
                    >
                        View Details
                    </button>
                    <button
                        onClick={() => closeSession(id)}
                        disabled={loading}
                        className='flex items-center justify-center py-2 w-full rounded-sm px-6 border border-[#0a643a] text-[18px] text-[#0a643a] font-semibold cursor-pointer disabled:opacity-50'
                    >
                        {loading ? 'Closing...' : 'Close Session'}
                    </button>
                </div>
            </div>
        </div>
    );
};
export default SessionCard;