import React from 'react';
import { useNavigate } from 'react-router-dom';

const SessionCard = ({
    id, // <-- Make sure to pass the unique database _id as a prop!
    sessionName,
    sessionStatus,
    courseName,
    time,
    icon,
    location,
    bgStatusColor,
    textStatusColor
}) => {
    const navigate = useNavigate();

    const setViewDetails = () => {
        // Navigate to the monitor path with the unique dynamic ID param
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
                    <button onClick={setViewDetails} className='flex items-center justify-center py-2 w-full rounded-sm px-6 bg-[#0a643a] text-[18px] text-[#fff] font-semibold cursor-pointer'>
                        View Details
                    </button>
                    <button className='flex items-center justify-center py-2 w-full rounded-sm px-6 border border-[#0a643a] text-[18px] text-[#0a643a] font-semibold cursor-pointer'>
                        Close Session
                    </button>
                </div>
            </div>
        </div>
    );
};

export default SessionCard;
