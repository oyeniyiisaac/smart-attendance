import React from 'react';

const Cards = ({ icon, title, value, bgColor = 'bg-emerald-50', textColor = 'text-[#0a643a]', valueColor = 'text-slate-900' }) => {
    return (
        <div className="w-full bg-white border border-gray-200/80 rounded-2xl p-5 shadow-sm hover:shadow-md transition-all flex flex-col justify-between">
            <div className="flex items-center justify-between mb-3">
                <span className="text-xs font-bold uppercase tracking-wider text-slate-500 line-clamp-1">
                    {title}
                </span>
                <div className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 ${bgColor} ${textColor}`}>
                    <span className="material-symbols-outlined text-lg">
                        {icon}
                    </span>
                </div>
            </div>
            <div>
                <p className={`text-2xl sm:text-3xl font-black tracking-tight ${valueColor}`}>
                    {value}
                </p>
            </div>
        </div>
    );
};

export default Cards;
