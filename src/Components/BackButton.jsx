import React from 'react';
import { useNavigate } from 'react-router-dom';

const BackButton = ({ to, label = "Back", className = "" }) => {
    const navigate = useNavigate();

    const handleClick = () => {
        if (to) {
            navigate(to);
        } else {
            navigate(-1);
        }
    };

    return (
        <button
            type="button"
            onClick={handleClick}
            className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white hover:bg-emerald-50/70 border border-gray-200/80 shadow-xs text-xs font-bold text-slate-700 hover:text-[#0a643a] transition-all cursor-pointer group ${className}`}
            title={label}
        >
            <span className="material-symbols-outlined text-base text-[#0a643a] group-hover:-translate-x-0.5 transition-transform">
                arrow_back
            </span>
            <span>{label}</span>
        </button>
    );
};

export default BackButton;
