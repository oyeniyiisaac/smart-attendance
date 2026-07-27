import { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import NavBarTop from '../Components/NavBarTop';
import Navbar from '../Components/Navbar';

export default function EnrolCourses() {
    const navigate = useNavigate();
    const [registrations, setRegistrations] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchCourses = async () => {
            try {
                // 1. Get student token from local storage
                const token = localStorage.getItem('studentToken') || localStorage.getItem('token');

                if (!token) {
                    setError('Authentication token missing. Please log in again.');
                    setLoading(false);
                    return;
                }

                // 2. Fetch registered courses from your backend
                const response = await axios.get(
                    'https://smart-backend-1-q3fb.onrender.com/get-student-registrations',
                    {
                        headers: {
                            Authorization: `Bearer ${token}`,
                        },
                    }
                );

                // Assuming response.data.data returns the array of registration records
                setRegistrations(response.data.data || []);
            } catch (err) {
                console.error('Failed to fetch enrolled courses:', err);
                setError(err.response?.data?.message || 'Failed to load courses.');
            } finally {
                setLoading(false);
            }
        };

        fetchCourses();
    }, []);

    // Extract the active/latest registration session
    const latestRegistration = registrations[0];
    const enrolledCourses = latestRegistration?.courses || [];
    const totalUnits = latestRegistration?.totalUnits || enrolledCourses.reduce((sum, c) => sum + (c.unit || 0), 0);
    const sessionText = latestRegistration
        ? `${latestRegistration.academicSession} • ${latestRegistration.semester}`
        : 'Current Academic Session';

    if (loading) {
        return (
            <div className="min-h-screen bg-[#f3f7f5] flex flex-col items-center justify-center p-8 font-sans">
                <div className="w-10 h-10 border-4 border-[#0a643a] border-t-transparent rounded-full animate-spin mb-4"></div>
                <p className="text-gray-500 font-medium text-sm">Loading enrolled courses...</p>
            </div>
        );
    }

    if (error) {
        return (
            <div className="min-h-screen bg-[#f3f7f5] flex items-center justify-center p-8 font-sans">
                <div className="bg-white p-6 rounded-2xl shadow-sm border border-red-100 max-w-md w-full text-center">
                    <span className="material-symbols-outlined text-red-500 text-4xl mb-2">error</span>
                    <h3 className="text-lg font-bold text-gray-800 mb-2">Error Loading Courses</h3>
                    <p className="text-sm text-gray-500 mb-6">{error}</p>
                    <button
                        onClick={() => window.location.reload()}
                        className="bg-[#0a643a] text-white px-5 py-2.5 rounded-xl text-xs font-bold w-full"
                    >
                        Try Again
                    </button>
                </div>
            </div>
        );
    }

    return (
        <>
            <div className="min-h-screen mb-20 lg:mb-3 bg-[#f3f7f5] p-6 md:p-12 font-sans">
                {/* <div className="fixed top-0 left-0 right-0 z-50 bg-white">
                <NavBarTop />
            </div> */}

                {/* Page Header */}
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mt-10 lg:mt-0 mb-10">
                    <div>
                        <h1 className="text-2xl font-bold text-gray-800 tracking-tight mb-1">
                            Enrolled Courses
                        </h1>
                        <p className="text-sm text-gray-500 font-medium">
                            {sessionText} &bull; <span className="font-bold text-gray-700">{totalUnits} Total Units</span>
                        </p>
                    </div>

                    <button
                        onClick={() => navigate('/student/register-course')}
                        className="flex items-center gap-2 bg-[#0a643a] hover:bg-[#08522f] text-white px-5 py-2.5 rounded-xl text-xs font-bold shadow-sm transition-all self-start sm:self-center cursor-pointer"
                    >
                        <span className="material-symbols-outlined text-base">add</span>
                        Register Course
                    </button>
                </div>

                {/* If no registrations are found in DB */}
                {enrolledCourses.length === 0 ? (
                    <div className="bg-white p-12 rounded-2xl border border-gray-200 text-center max-w-xl mx-auto shadow-sm">
                        <span className="material-symbols-outlined text-gray-300 text-5xl mb-3">school</span>
                        <h3 className="text-lg font-bold text-gray-800 mb-1">No Courses Enrolled Yet</h3>
                        <p className="text-sm text-gray-400 mb-6">
                            You have not submitted course registration for this semester.
                        </p>
                        <button
                            onClick={() => navigate('/register-courses')}
                            className="bg-[#0a643a] text-white px-6 py-2.5 rounded-xl text-xs font-bold"
                        >
                            Register Courses Now
                        </button>
                    </div>
                ) : (
                    /* Course Cards Grid */
                    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                        {enrolledCourses.map((course) => {
                            // Demo attendance calculation (or pull course.attendance if stored in DB)
                            const attendance = course.attendance || 85;
                            const isLowAttendance = attendance < 65;

                            return (
                                <div
                                    key={course._id || course.courseId}
                                    className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm transition-all hover:shadow-md"
                                >
                                    {/* Card Top Row */}
                                    <div className="flex items-center justify-between mb-4">
                                        <span className="bg-[#d1fae5] text-[#0a643a] text-xs font-bold px-3 py-1 rounded-full border border-emerald-100">
                                            {course.courseCode}
                                        </span>
                                        <button className="text-gray-400 hover:text-gray-600">
                                            <span className="material-symbols-outlined text-lg">more_vert</span>
                                        </button>
                                    </div>

                                    {/* Course Details */}
                                    <h3 className="text-lg font-bold text-gray-800 mb-4 tracking-tight leading-snug">
                                        {course.courseTitle}
                                    </h3>

                                    <div className="space-y-3 text-xs text-gray-500 font-medium mb-6">
                                        <div className="flex items-center gap-2.5">
                                            <span className="material-symbols-outlined text-base text-gray-400">person</span>
                                            <span>{course.instructor || 'Department Faculty'}</span>
                                        </div>
                                        <div className="flex items-center gap-2.5">
                                            <span className="material-symbols-outlined text-base text-gray-400">schedule</span>
                                            <span>{course.schedule || 'Schedule TBA'}</span>
                                        </div>
                                        <div className="flex items-center gap-2.5">
                                            <span className="material-symbols-outlined text-base text-gray-400">location_on</span>
                                            <span>{course.location || 'Main Campus'}</span>
                                        </div>
                                    </div>

                                    {/* Attendance Bar */}
                                    <div className="border-t border-gray-100 pt-4 space-y-2.5">
                                        <div className="flex items-center justify-between">
                                            <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">
                                                Attendance Rate
                                            </span>
                                            <span className={`text-base font-extrabold ${isLowAttendance ? 'text-red-600' : 'text-[#0a643a]'}`}>
                                                {attendance}%
                                            </span>
                                        </div>

                                        {/* Progress Track */}
                                        <div className="w-full bg-gray-100 rounded-full h-1.5 overflow-hidden">
                                            <div
                                                className={`h-full rounded-full transition-all duration-500 ${isLowAttendance ? 'bg-red-600' : 'bg-[#0a643a]'
                                                    }`}
                                                style={{ width: `${attendance}%` }}
                                            />
                                        </div>

                                        {isLowAttendance && (
                                            <div className="flex items-center gap-1 pt-1 text-red-600">
                                                <span className="material-symbols-outlined text-xs font-bold">warning</span>
                                                <span className="text-[10px] font-bold">Low attendance warning</span>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                )}
                {/* <div className="fixed bottom-0 left-0 right-0 z-40 bg-white border-t border-gray-200">
                <Navbar />
            </div> */}
            </div>
        </>
    );
}