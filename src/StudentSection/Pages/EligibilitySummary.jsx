import React, { useState, useEffect } from 'react';
import api from '../../Utils/api';
import BackButton from '../../Components/BackButton';

const getStudentProfile = () => {
    try {
        const token = localStorage.getItem('token') || localStorage.getItem('studentToken');
        if (!token) return { name: 'Student', matricno: 'N/A', department: 'Computer Science', faculty: 'Faculty of Computing' };
        const payload = JSON.parse(atob(token.split('.')[1]));
        const name = payload.firstname && payload.lastname ? `${payload.firstname} ${payload.lastname}` : payload.name || payload.firstname || 'Student';
        return {
            name,
            matricno: payload.matricno || payload.id || 'N/A',
            department: payload.department || 'Computer Science',
            faculty: payload.faculty || 'Faculty of Computing',
        };
    } catch {
        return { name: 'Student', matricno: 'N/A', department: 'Computer Science', faculty: 'Faculty of Computing' };
    }
};

const EligibilitySummary = () => {
    const studentProfile = getStudentProfile();
    const [courses, setCourses] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchAttendance = async () => {
            setLoading(true);
            try {
                const res = await api.get('/my-attendance?limit=100');
                const records = res.data.records || res.data || [];

                // Group records by courseCode
                const courseMap = {};
                records.forEach((r) => {
                    const code = r.courseCode || 'GENERAL';
                    if (!courseMap[code]) {
                        courseMap[code] = { total: 0, attended: 0, title: r.courseName || code };
                    }
                    courseMap[code].total += 1;
                    if (r.status?.toLowerCase() === 'present') {
                        courseMap[code].attended += 1;
                    }
                });

                const courseList = Object.keys(courseMap).map((code) => {
                    const { total, attended, title } = courseMap[code];
                    const percentage = total > 0 ? Math.round((attended / total) * 100) : 0;
                    return {
                        courseCode: code,
                        title,
                        total,
                        attended,
                        percentage,
                        isEligible: percentage >= 75
                    };
                });

                setCourses(courseList);
            } catch (err) {
                console.error("Failed to load attendance eligibility:", err);
            } finally {
                setLoading(false);
            }
        };

        fetchAttendance();
    }, []);

    const ineligibleCount = courses.filter(c => !c.isEligible).length;
    const isOverallEligible = courses.length > 0 && ineligibleCount === 0;

    return (
        <div className="min-h-screen bg-[#fafdf4] pt-3 px-4 lg:px-8 pb-24 font-sans mt-6 lg:mt-0">
            <div className="mb-3">
                <BackButton to="/student/dashboard" label="Back to Student Dashboard" />
            </div>
            
            {/* Warning Banner if Ineligible */}
            {ineligibleCount > 0 && (
                <div className="bg-[#ffdad6] border border-[#f7cac7] p-4 rounded-2xl mb-6 flex items-center gap-3 text-[#ba1a1a]">
                    <span className="material-symbols-outlined text-2xl">warning</span>
                    <span className="text-sm font-semibold">
                        Attention: You are currently ineligible for examination in {ineligibleCount} course(s) due to attendance below 75%.
                    </span>
                </div>
            )}

            {/* Profile & Overall Clearance Badge */}
            <div className="bg-white border border-gray-200/80 rounded-2xl p-5 shadow-sm mb-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                    <h1 className="text-xl sm:text-2xl font-bold text-slate-800">{studentProfile.name}</h1>
                    <p className="text-xs text-slate-500 font-medium mt-0.5">
                        {studentProfile.department} • Matric: <strong className="font-mono text-slate-700">{studentProfile.matricno}</strong>
                    </p>
                </div>

                <div className={`flex items-center gap-2 px-4 py-2.5 rounded-xl border text-xs font-bold ${
                    isOverallEligible
                        ? 'bg-emerald-50 text-emerald-800 border-emerald-200'
                        : 'bg-amber-50 text-amber-900 border-amber-200'
                }`}>
                    <span className="material-symbols-outlined text-base">
                        {isOverallEligible ? 'verified' : 'pending_actions'}
                    </span>
                    <span>Overall Exam Status: {isOverallEligible ? 'Fully Cleared' : 'Review Required'}</span>
                </div>
            </div>

            {/* Course Cards Grid */}
            <div className="mb-8">
                <h2 className="text-base font-bold text-slate-800 mb-4">Course Clearance Breakdown (75% Minimum Required)</h2>
                
                {loading ? (
                    <div className="text-center py-12 text-slate-500 text-sm font-medium animate-pulse">
                        Loading your course attendance records...
                    </div>
                ) : courses.length === 0 ? (
                    <div className="bg-white border border-dashed border-gray-300 rounded-2xl p-8 text-center text-slate-400 text-sm font-medium">
                        No active attendance records found yet for this semester.
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {courses.map((course) => (
                            <div
                                key={course.courseCode}
                                className={`bg-white border rounded-2xl p-5 shadow-sm flex flex-col justify-between ${
                                    course.isEligible ? 'border-gray-200/80' : 'border-red-200 bg-red-50/20'
                                }`}
                            >
                                <div className="flex items-start justify-between gap-3 mb-4">
                                    <div>
                                        <h3 className="text-base font-bold text-slate-800">{course.courseCode}</h3>
                                        <p className="text-xs text-slate-500 font-medium">{course.title}</p>
                                    </div>
                                    <span className={`text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wider ${
                                        course.isEligible
                                            ? 'bg-emerald-100 text-emerald-800 border border-emerald-300'
                                            : 'bg-red-100 text-red-800 border border-red-300'
                                    }`}>
                                        {course.isEligible ? 'Cleared' : 'Ineligible'}
                                    </span>
                                </div>

                                <div>
                                    <div className="flex justify-between items-center text-xs font-semibold text-slate-600 mb-1.5">
                                        <span>Attendance Rate ({course.attended}/{course.total} lectures)</span>
                                        <span className="font-bold text-slate-800">{course.percentage}%</span>
                                    </div>
                                    <div className="w-full h-2 bg-gray-100 rounded-full overflow-hidden">
                                        <div
                                            className={`h-full rounded-full transition-all ${
                                                course.isEligible ? 'bg-[#0a643a]' : 'bg-[#ba1a1a]'
                                            }`}
                                            style={{ width: `${Math.min(course.percentage, 100)}%` }}
                                        />
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>

            {/* Appeal / Correction Notice */}
            <div className="bg-white border border-gray-200 rounded-2xl p-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4 shadow-sm">
                <div>
                    <h3 className="text-base font-bold text-slate-800">Need to appeal attendance?</h3>
                    <p className="text-xs text-slate-500 font-medium mt-0.5">
                        Submit attendance correction requests directly to your course lecturer before the semester examination clearance cutoff date.
                    </p>
                </div>
                <button
                    type="button"
                    onClick={() => alert("Please consult your course representative or department admin for formal attendance review requests.")}
                    className="bg-[#0a643a] hover:bg-[#084f2e] text-white text-xs font-bold px-5 py-2.5 rounded-xl transition-colors cursor-pointer whitespace-nowrap"
                >
                    Contact Course Lecturer
                </button>
            </div>
        </div>
    );
};

export default EligibilitySummary;
