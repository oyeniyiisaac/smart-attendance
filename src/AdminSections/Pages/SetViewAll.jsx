import React, { useState } from 'react';

export default function SetViewAll() {
    // State for search and status filters
    const [searchQuery, setSearchQuery] = useState('');
    const [activeFilter, setActiveFilter] = useState('All');
    const [currentPage, setCurrentPage] = useState(1);

    // Quick Stats Data
    const stats = [
        {
            label: 'Total Sessions',
            value: '24',
            icon: 'calendar_today',
            bgClass: 'bg-secondary-container/40 text-secondary',
        },
        {
            label: 'Currently Open',
            value: '08',
            icon: 'sensors',
            bgClass: 'bg-green-100 text-primary',
        },
        {
            label: 'Upcoming',
            value: '12',
            icon: 'upcoming',
            bgClass: 'bg-blue-100 text-blue-700',
        },
        {
            label: 'Completed',
            value: '04',
            icon: 'check_circle',
            bgClass: 'bg-surface-container-highest text-on-surface-variant',
        },
    ];

    // Mock Academic Sessions Data
    const sessions = [
        {
            id: 1,
            department: 'Computer Science',
            code: 'CS402: Algorithm Analysis',
            time: '09:00 AM - 11:00 AM',
            location: 'Hall A12',
            status: 'Open',
            icon: 'terminal',
            iconBg: 'bg-primary-container/10 text-primary-container border-primary-container/20',
        },
        {
            id: 2,
            department: 'Mathematics',
            code: 'MTH201: Calculus III',
            time: '11:30 AM - 01:30 PM',
            location: 'Room 405',
            status: 'Upcoming',
            icon: 'functions',
            iconBg: 'bg-blue-100 text-blue-700 border-blue-200',
        },
        {
            id: 3,
            department: 'Social Sciences',
            code: 'SOC105: Intro to Sociology',
            time: '08:00 AM - 09:30 AM',
            location: 'Auditorium B',
            status: 'Closed',
            icon: 'history_edu',
            iconBg: 'bg-surface-container-highest text-on-surface-variant border-outline-variant',
        },
        {
            id: 4,
            department: 'Biology',
            code: 'BIO330: Genetics Lab',
            time: '09:00 AM - 12:00 PM',
            location: 'Lab Wing C',
            status: 'Open',
            icon: 'microwave',
            iconBg: 'bg-primary-container/10 text-primary-container border-primary-container/20',
        },
        {
            id: 5,
            department: 'Law School',
            code: 'LAW501: Constitutional Law',
            time: '02:00 PM - 04:00 PM',
            location: 'Moot Court Hall',
            status: 'Upcoming',
            icon: 'gavel',
            iconBg: 'bg-blue-100 text-blue-700 border-blue-200',
        },
    ];

    return (
        <>
            <main className="ml-[260px] pt-20 min-h-screen px-margin_desktop pb-12">
                {/* Header Section with Search and Filter */}
                <section className="py-10">
                    <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-8">
                        <div>
                            <h2 className="font-headline-lg text-headline-lg text-on-surface mb-2">Today's Sessions</h2>
                            <p className="font-body-md text-body-md text-on-surface-variant">
                                Overview of all active, upcoming, and completed academic sessions for today, October 24th.
                            </p>
                        </div>

                        <div className="flex flex-wrap items-center gap-4">
                            {/* Search Bar */}
                            <div className="relative w-full md:w-80">
                                <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-on-surface-variant">
                                    search
                                </span>
                                <input
                                    type="text"
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                    className="w-full pl-10 pr-4 py-2.5 bg-surface-container-lowest border border-outline-variant rounded-lg focus:ring-2 focus:ring-primary focus:border-primary transition-all text-body-md outline-none"
                                    placeholder="Search courses, codes..."
                                />
                            </div>

                            {/* Role-Selector style Filter */}
                            <div className="flex bg-surface-container-low p-1 rounded-lg border border-outline-variant/30">
                                {['All', 'Open', 'Closed', 'Upcoming'].map((filter) => (
                                    <button
                                        key={filter}
                                        onClick={() => setActiveFilter(filter)}
                                        className={`px-4 py-1.5 rounded-md text-label-lg font-label-lg transition-all ${activeFilter === filter
                                                ? 'bg-primary text-on-primary shadow-sm'
                                                : 'text-on-surface-variant hover:bg-surface-variant/50'
                                            }`}
                                    >
                                        {filter}
                                    </button>
                                ))}
                            </div>
                        </div>
                    </div>

                    {/* Dashboard Statistics Quick-View */}
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-12">
                        {stats.map((stat, idx) => (
                            <div key={idx} className="bg-surface-container-lowest border border-outline-variant p-6 rounded-xl flex items-center gap-5">
                                <div className={`w-12 h-12 rounded-full flex items-center justify-center ${stat.bgClass}`}>
                                    <span
                                        className="material-symbols-outlined"
                                        style={{ fontVariationSettings: "'FILL' 1" }}
                                    >
                                        {stat.icon}
                                    </span>
                                </div>
                                <div>
                                    <p className="text-label-sm font-label-sm text-on-surface-variant uppercase">{stat.label}</p>
                                    <p className="text-headline-md font-headline-md">{stat.value}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </section>

                {/* Main Sessions List */}
                <section className="space-y-4">
                    {sessions
                        .filter((session) => {
                            const matchesFilter = activeFilter === 'All' || session.status === activeFilter;
                            const matchesSearch = session.code.toLowerCase().includes(searchQuery.toLowerCase()) ||
                                session.department.toLowerCase().includes(searchQuery.toLowerCase());
                            return matchesFilter && matchesSearch;
                        })
                        .map((session) => (
                            <div
                                key={session.id}
                                className={`bg-surface-container-lowest border border-outline-variant rounded-xl p-6 transition-all duration-300 card-hover flex flex-col md:flex-row items-center gap-8 ${session.status === 'Closed' ? 'opacity-75' : ''
                                    }`}
                            >
                                <div className={`w-16 h-16 rounded-xl flex items-center justify-center shrink-0 border ${session.iconBg}`}>
                                    <span className="material-symbols-outlined text-4xl">{session.icon}</span>
                                </div>

                                <div className="flex-1 grid grid-cols-1 md:grid-cols-4 gap-6 w-full">
                                    <div className="col-span-1">
                                        <p className={`text-label-sm font-label-sm mb-1 ${session.status === 'Open' ? 'text-primary' :
                                                session.status === 'Upcoming' ? 'text-blue-700' : 'text-on-surface-variant'
                                            }`}>
                                            {session.department}
                                        </p>
                                        <h3 className="font-title-lg text-title-lg text-on-surface leading-tight">
                                            {session.code}
                                        </h3>
                                    </div>

                                    <div className="flex flex-col justify-center">
                                        <div className="flex items-center gap-2 text-on-surface-variant mb-1">
                                            <span className="material-symbols-outlined text-sm">schedule</span>
                                            <span className="text-body-md font-body-md">{session.time}</span>
                                        </div>
                                        <div className="flex items-center gap-2 text-on-surface-variant">
                                            <span className="material-symbols-outlined text-sm">location_on</span>
                                            <span className="text-body-md font-body-md">{session.location}</span>
                                        </div>
                                    </div>

                                    <div className="flex items-center justify-start md:justify-center">
                                        {session.status === 'Open' && (
                                            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-green-100 text-primary text-label-lg font-label-lg border border-primary/20">
                                                <span className="w-2 h-2 rounded-full bg-primary animate-pulse"></span>
                                                Open
                                            </span>
                                        )}
                                        {session.status === 'Upcoming' && (
                                            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-50 text-blue-700 text-label-lg font-label-lg border border-blue-200">
                                                Upcoming
                                            </span>
                                        )}
                                        {session.status === 'Closed' && (
                                            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-surface-variant/50 text-on-surface-variant text-label-lg font-label-lg border border-outline-variant">
                                                Closed
                                            </span>
                                        )}
                                    </div>

                                    <div className="flex items-center justify-end">
                                        {session.status === 'Open' && (
                                            <button className="w-full md:w-auto px-6 py-2.5 bg-primary text-on-primary rounded-lg font-label-lg text-label-lg hover:bg-opacity-90 transition-all flex items-center justify-center gap-2">
                                                View Monitor
                                                <span className="material-symbols-outlined text-sm">open_in_new</span>
                                            </button>
                                        )}
                                        {session.status === 'Upcoming' && (
                                            <button className="w-full md:w-auto px-6 py-2.5 border border-outline-variant text-on-surface-variant rounded-lg font-label-lg text-label-lg hover:bg-surface-container-low transition-all">
                                                Modify Slot
                                            </button>
                                        )}
                                        {session.status === 'Closed' && (
                                            <button className="w-full md:w-auto px-6 py-2.5 border border-primary text-primary rounded-lg font-label-lg text-label-lg hover:bg-primary-container/5 transition-all flex items-center justify-center gap-2">
                                                View Report
                                                <span className="material-symbols-outlined text-sm">analytics</span>
                                            </button>
                                        )}
                                    </div>
                                </div>
                            </div>
                        ))}
                </section>

                {/* Pagination / Load More Footer */}
                <footer className="mt-12 flex items-center justify-between border-t border-outline-variant/30 pt-8">
                    <p className="text-body-md text-on-surface-variant">Showing 5 of 24 sessions</p>
                    <div className="flex items-center gap-2">
                        <button
                            disabled={currentPage === 1}
                            onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                            className="p-2 border border-outline-variant rounded-lg text-on-surface-variant disabled:opacity-30 hover:bg-surface-container transition-colors"
                        >
                            <span className="material-symbols-outlined">chevron_left</span>
                        </button>
                        <div className="flex gap-1">
                            {[1, 2, 3, '...', 5].map((page, idx) => (
                                <button
                                    key={idx}
                                    disabled={page === '...'}
                                    onClick={() => typeof page === 'number' && setCurrentPage(page)}
                                    className={`w-10 h-10 rounded-lg font-label-lg transition-colors ${currentPage === page
                                            ? 'bg-primary text-on-primary'
                                            : page === '...' ? 'cursor-default flex items-center justify-center' : 'hover:bg-surface-container'
                                        }`}
                                >
                                    {page}
                                </button>
                            ))}
                        </div>
                        <button
                            onClick={() => setCurrentPage(prev => Math.min(prev + 1, 5))}
                            className="p-2 border border-outline-variant rounded-lg text-on-surface-variant hover:bg-surface-container transition-colors"
                        >
                            <span className="material-symbols-outlined">chevron_right</span>
                        </button>
                    </div>
                </footer>
            </main>

            {/* Contextual FAB */}
            <button className="fixed bottom-10 right-10 w-16 h-16 bg-primary text-on-primary rounded-2xl shadow-2xl flex items-center justify-center hover:scale-110 active:scale-95 transition-all duration-300 group z-50">
                <span className="material-symbols-outlined text-3xl">add</span>
                <span className="absolute right-full mr-4 px-3 py-1 bg-inverse-surface text-inverse-on-surface text-label-lg rounded opacity-0 group-hover:opacity-100 pointer-events-none whitespace-nowrap transition-opacity">
                    Schedule New
                </span>
            </button>
        </>
    );
}