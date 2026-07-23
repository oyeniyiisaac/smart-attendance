import React, { useState, useEffect } from 'react';
import axios from 'axios';
import NavBarTop from '../Components/NavBarTop';
import Navbar from '../Components/Navbar';

const departments = [
    'All Departments',
    'Computer Science',
    'Mathematics',
    'Engineering',
    'Business Administration',
    'Humanities',
];

export default function StudentCourseRegistration() {
    const [courses, setCourses] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    const [selectedDept, setSelectedDept] = useState('All Departments');
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedCourseIds, setSelectedCourseIds] = useState([]);

    // ── Fetch Courses ──────────────────────────────────────────────────────
    const fetchCourses = async () => {
        setLoading(true);
        setError('');
        try {
            const token = localStorage.getItem('token') || localStorage.getItem('studentToken');
            const response = await axios.get('https://smart-backend-1-q3fb.onrender.com/admin/courses', {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });

            const courseData = response.data.courses || response.data;
            setCourses(courseData);
        } catch (err) {
            console.error('Failed to fetch courses:', err);
            setError(err.response?.data?.message || 'Failed to load courses from database.');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchCourses();
    }, []);

    // ── Selection Logic ───────────────────────────────────────────────────
    const toggleCourseSelect = (courseId) => {
        if (selectedCourseIds.includes(courseId)) {
            setSelectedCourseIds(selectedCourseIds.filter((id) => id !== courseId));
        } else {
            setSelectedCourseIds([...selectedCourseIds, courseId]);
        }
    };

    // ── Filter Logic ──────────────────────────────────────────────────────
    const filteredCourses = courses.filter((course) => {
        const matchesDept =
            selectedDept === 'All Departments' ||
            course.department?.toLowerCase() === selectedDept.toLowerCase() ||
            course.faculty?.toLowerCase() === selectedDept.toLowerCase();

        const matchesSearch =
            course.courseTitle?.toLowerCase().includes(searchQuery.toLowerCase()) ||
            course.courseCode?.toLowerCase().includes(searchQuery.toLowerCase()) ||
            course.instructor?.toLowerCase().includes(searchQuery.toLowerCase());

        return matchesDept && matchesSearch;
    });

    const selectedCoursesList = courses.filter((c) => selectedCourseIds.includes(c._id));
    const totalUnits = selectedCoursesList.reduce((sum, c) => sum + (Number(c.unit) || Number(c.units) || 0), 0);

    return (
        <div className="min-h-screen bg-[#f3f7f5] font-sans text-[#2d3748] relative flex flex-col">
            
            {/* ── Top Navbar Container ──────────────────────────────────── */}
            <div className="fixed top-0 left-0 right-0 z-50 bg-white">
                <NavBarTop />
            </div>

            {/* ── Main Page Content ───────────────────────────────────────────
                💡 Added pt-24 (6rem) to clear the top bar 
                💡 Added pb-48 (12rem) to ensure cards clear the bottom floating bar
            */}
            <main className="max-w-7xl mx-auto w-full px-6 pt-24 pb-48 space-y-6 flex-grow">

                {/* Search Bar */}
                <div className="relative max-w-2xl">
                    <span className="material-symbols-outlined absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400 text-lg">
                        search
                    </span>
                    <input
                        type="text"
                        placeholder="Search courses, professors, or codes..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="w-full bg-white border border-gray-300 rounded-lg pl-10 pr-4 py-2.5 text-sm outline-none focus:border-[#0a643a] focus:ring-1 focus:ring-[#0a643a] transition-all shadow-sm"
                    />
                </div>

                {/* Department Pills */}
                <div className="flex flex-wrap gap-2.5 items-center">
                    {departments.map((dept) => {
                        const isActive = selectedDept === dept;
                        return (
                            <button
                                key={dept}
                                onClick={() => setSelectedDept(dept)}
                                className={`px-4 py-2 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
                                    isActive
                                        ? 'bg-[#0a643a] text-white shadow-sm'
                                        : 'bg-[#e2e8f0]/60 hover:bg-[#e2e8f0] text-gray-600 border border-gray-200/50'
                                }`}
                            >
                                {dept}
                            </button>
                        );
                    })}
                </div>

                {/* Error Banner */}
                {error && (
                    <div className="bg-red-50 text-red-600 p-4 rounded-xl text-sm border border-red-200">
                        {error}
                    </div>
                )}

                {/* Course Grid */}
                {loading ? (
                    <div className="text-center py-20 text-gray-500 font-medium">
                        Loading courses from database...
                    </div>
                ) : filteredCourses.length === 0 ? (
                    <div className="text-center py-20 text-gray-400 font-medium">
                        No courses found matching your criteria.
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 pt-2">
                        {filteredCourses.map((course) => {
                            const courseId = course._id;
                            const isSelected = selectedCourseIds.includes(courseId);

                            const enrolled = course.enrolled ?? 0;
                            const capacity = course.capacity ?? 60;
                            const isFull = enrolled >= capacity;
                            const percentFilled = Math.min(100, (enrolled / capacity) * 100);
                            const units = course.unit || course.units || 3;

                            return (
                                <div
                                    key={courseId}
                                    className={`bg-white rounded-2xl border transition-all flex flex-col justify-between overflow-hidden shadow-sm ${
                                        isSelected
                                            ? 'border-[#0a643a] ring-2 ring-[#0a643a]/20'
                                            : 'border-gray-200'
                                    }`}
                                >
                                    <div className="p-5 space-y-4">
                                        <div className="flex justify-between items-center">
                                            <span className="text-xs font-bold text-gray-400 tracking-wider">
                                                {course.courseCode}
                                            </span>
                                            {isSelected && (
                                                <span className="bg-[#0a643a] text-white text-[10px] font-extrabold px-2.5 py-0.5 rounded-full tracking-wider uppercase">
                                                    SELECTED
                                                </span>
                                            )}
                                        </div>

                                        <h3 className="text-lg font-bold text-[#1a202c] leading-snug">
                                            {course.courseTitle}
                                        </h3>

                                        <div className="space-y-2 text-xs text-gray-600 pt-1">
                                            <div className="flex items-center gap-2">
                                                <span className="material-symbols-outlined text-base text-gray-400">
                                                    person
                                                </span>
                                                <span>{course.instructor || 'Department Faculty'}</span>
                                            </div>

                                            <div className="flex items-center gap-2">
                                                <span className="material-symbols-outlined text-base text-gray-400">
                                                    calendar_today
                                                </span>
                                                <span>{course.semester || 'Current Semester'}</span>
                                            </div>

                                            <div className="flex items-center gap-2">
                                                <span className="material-symbols-outlined text-base text-gray-400">
                                                    grade
                                                </span>
                                                <span>{units} Units / Credits</span>
                                            </div>
                                        </div>

                                        <div className="pt-3 space-y-1.5">
                                            <div className="flex justify-between text-[11px] font-semibold">
                                                <span className="text-gray-500">Capacity</span>
                                                <span
                                                    className={
                                                        isFull ? 'text-red-600 font-bold' : 'text-[#0a643a]'
                                                    }
                                                >
                                                    {enrolled}/{capacity}{' '}
                                                    {isFull ? '- Waitlisted' : 'enrolled'}
                                                </span>
                                            </div>

                                            <div className="w-full bg-gray-200 rounded-full h-1.5 overflow-hidden">
                                                <div
                                                    className={`h-full transition-all duration-300 ${
                                                        isFull ? 'bg-red-500' : 'bg-[#0a643a]'
                                                    }`}
                                                    style={{ width: `${percentFilled}%` }}
                                                ></div>
                                            </div>
                                        </div>
                                    </div>

                                    <div>
                                        {isFull ? (
                                            <button
                                                disabled
                                                className="w-full bg-gray-100 text-gray-400 py-3 text-xs font-semibold flex items-center justify-center gap-2 cursor-not-allowed border-t border-gray-100"
                                            >
                                                <span className="material-symbols-outlined text-sm">
                                                    hourglass_empty
                                                </span>
                                                Registration Pending
                                            </button>
                                        ) : isSelected ? (
                                            <button
                                                onClick={() => toggleCourseSelect(courseId)}
                                                className="w-full bg-[#0a643a] text-white py-3 text-xs font-semibold flex items-center justify-center gap-2 hover:bg-[#08522f] transition-colors cursor-pointer"
                                            >
                                                <span className="material-symbols-outlined text-sm">
                                                    check_circle
                                                </span>
                                                Course Selected
                                            </button>
                                        ) : (
                                            <button
                                                onClick={() => toggleCourseSelect(courseId)}
                                                className="w-full bg-[#0a643a] text-white py-3 text-xs font-semibold hover:bg-[#08522f] transition-colors cursor-pointer"
                                            >
                                                Register Course
                                            </button>
                                        )}
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                )}
            </main>

            {/* ── Floating Summary Bar ─────────────────────────────────────────
                💡 Increased from bottom-20 to bottom-24 so it sits completely ABOVE the bottom nav
            */}
            <div className="fixed bottom-24 left-1/2 -translate-x-1/2 w-[92%] max-w-5xl bg-[#2a3437] text-white rounded-2xl p-3 shadow-2xl flex items-center justify-between border border-gray-700/50 z-30">
                <div className="flex items-center gap-3">
                    <div className="bg-[#0a643a] p-2.5 rounded-xl flex items-center justify-center">
                        <span className="material-symbols-outlined text-white text-lg">
                            description
                        </span>
                    </div>

                    <div>
                        <p className="text-[11px] text-gray-400 font-medium">
                            Registration Summary
                        </p>
                        <p className="text-sm font-bold text-white tracking-wide">
                            {totalUnits} Units Selected{' '}
                            <span className="text-gray-400 font-normal mx-1">|</span>{' '}
                            {selectedCourseIds.length}{' '}
                            {selectedCourseIds.length === 1 ? 'Course' : 'Courses'}
                        </p>
                    </div>
                </div>

                <div className="flex items-center gap-3">
                    <button className="px-4 py-2 rounded-xl text-xs font-semibold bg-[#374347] hover:bg-[#435257] border border-gray-600 text-gray-200 transition-colors cursor-pointer">
                        View Cart
                    </button>

                    <button className="px-5 py-2 rounded-xl text-xs font-bold bg-[#6ee7b7] hover:bg-[#5ee0ad] text-[#0d1f18] transition-colors cursor-pointer shadow-sm">
                        Finalize Registration
                    </button>
                </div>
            </div>

            {/* ── Bottom App Navbar ─────────────────────────────────────────── */}
            <div className="fixed bottom-0 left-0 right-0 z-40 bg-white border-t border-gray-200">
                <Navbar />
            </div>
        </div>
    );
}