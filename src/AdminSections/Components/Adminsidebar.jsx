import React from 'react';

export default function Adminsidebar({ isOpen, toggleSidebar }) {
    const menuItems = [
        { name: 'Dashboard', icon: '📊', active: false },
        { name: 'Create Session', icon: '📅', active: true },
        { name: 'Reports', icon: '📈', active: false },
        { name: 'Student Management', icon: '👥', active: false },
    ];

    return (
        <>
            {/* Mobile Backdrop Overlay: Closes sidebar when clicking outside of it */}
            {isOpen && (
                <div
                    className="fixed inset-0 bg-black/40 z-40 md:hidden"
                    onClick={toggleSidebar}
                />
            )}

            <aside className={`
        fixed inset-y-0 left-0 w-64 bg-[#f8fafc] border-r border-gray-200 p-6 flex flex-col justify-between z-50 transition-transform duration-300 ease-in-out
        md:relative md:translate-x-0
        ${isOpen ? 'translate-x-0' : '-translate-x-full'}
    `}>
                <div>
                    <div className="flex items-center justify-between mb-8">
                        <h2 className="text-xl font-bold text-slate-800 tracking-tight">
                            Attendance Admin
                        </h2>
                        {/* Close button inside sidebar for mobile viewports */}
                        <button className="md:hidden text-slate-500 hover:text-slate-800" onClick={toggleSidebar}>
                            ✕
                        </button>
                    </div>
                    <nav className="space-y-2">
                        {menuItems.map((item) => (
                            <button
                                key={item.name}
                                className={`w-full flex items-center space-x-3 px-4 py-3 rounded-xl font-medium text-sm transition-all ${item.active
                                        ? 'bg-[#c6f6d5] text-[#0f5132]'
                                        : 'text-slate-600 hover:bg-gray-100'
                                    }`}
                            >
                                <span className="text-lg">{item.icon}</span>
                                <span>{item.name}</span>
                            </button>
                        ))}
                    </nav>
                </div>
            </aside>
        </>
    );
}
