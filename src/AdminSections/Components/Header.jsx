import React from 'react';

export default function Header({ toggleSidebar }) {
    return (
        <header className="bg-[#f8fafc] border-b border-gray-200 px-8 py-4 flex items-center justify-between">
            <div className="flex items-center space-x-3">
                {/* Toggle trigger button visible on mobile layout frames */}
                <button
                    onClick={toggleSidebar}
                    className="text-slate-600 hover:text-slate-800 md:hidden text-xl mr-1 focus:outline-none"
                >
                    ☰
                </button>
                <span className="text-slate-400 text-lg hidden md:inline">☰</span>
                <h1 className="text-lg font-bold text-[#0f5132]">Admin Portal</h1>
            </div>
            <div className="flex items-center space-x-3">
                <img
                    src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=100"
                    alt="Admin Profile"
                    className="w-9 h-9 rounded-md object-cover border border-gray-300"
                />
            </div>
        </header>
    );
}
