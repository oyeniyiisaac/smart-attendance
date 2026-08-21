import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../../Utils/api';

const isTokenValid = (token) => {
    if (!token || typeof token !== 'string') return false;

    try {
        const payloadBase64 = token.split('.')[1];
        if (!payloadBase64) return false;

        const decodedPayload = JSON.parse(atob(payloadBase64));

        if (decodedPayload.exp) {
            const currentTime = Math.floor(Date.now() / 1000);
            if (decodedPayload.exp < currentTime) {
                return false;
            }
        }
        return true;
    } catch {
        return false;
    }
};

const Reports = () => {
    const [students, setStudents] = useState([]);
    const [courses, setCourses] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedCourse, setSelectedCourse] = useState('');
    const [selectedSemester, setSelectedSemester] = useState('First Semester');
    const [threshold, setThreshold] = useState(75);
    const [metaData, setMetaData] = useState({ faculty: '', department: '', totalClasses: 0 });
    const navigate = useNavigate();

    useEffect(() => {
        const token = localStorage.getItem("adminToken");
        if (!isTokenValid(token)) {
            localStorage.removeItem("adminToken");
            navigate('/signin');
        }
    }, [navigate]);

    // Fetch Available Courses
    useEffect(() => {
        api.get('/admin/courses')
            .then((res) => {
                if (res.data.success && Array.isArray(res.data.courses)) {
                    setCourses(res.data.courses);
                    if (res.data.courses.length > 0) {
                        setSelectedCourse(res.data.courses[0].courseCode);
                    }
                }
            })
            .catch((err) => {
                console.error("Failed to load course list:", err);
            });
    }, []);

    // Fetch reports dynamically from backend API
    useEffect(() => {
        if (!selectedCourse) return;

        const fetchReport = async () => {
            setLoading(true);
            try {
                const res = await api.get(`/admin/reports?courseCode=${selectedCourse}&semester=${selectedSemester}&threshold=${threshold}`);
                setStudents(res.data.students || []);
                setMetaData({
                    faculty: res.data.faculty || '',
                    department: res.data.department || '',
                    totalClasses: res.data.totalClasses || 0
                });
            } catch (err) {
                console.error("Failed to load reports:", err);
            } finally {
                setLoading(false);
            }
        };

        fetchReport();
    }, [selectedCourse, selectedSemester, threshold]);

    const filteredStudents = students.filter((student) => {
        const studentName = student.name || '';
        const matric = student.matric || '';
        return (
            studentName.toLowerCase().includes(searchTerm.toLowerCase()) ||
            matric.toLowerCase().includes(searchTerm.toLowerCase())
        );
    });

    const eligibleCount = filteredStudents.filter(s => s.isEligible).length;
    const ineligibleCount = filteredStudents.length - eligibleCount;
    const currentCourseObj = courses.find(c => c.courseCode === selectedCourse);

    const handleExportCSV = () => {
        if (filteredStudents.length === 0) return;
        const headers = ["Serial No", "Student Name", "Matric Number", "Total Sessions", "Attended", "Attendance %", "Exam Clearance Status"];
        const rows = filteredStudents.map((s, idx) => [
            idx + 1,
            `"${s.name || ''}"`,
            `"${s.matric || ''}"`,
            s.totalClasses || 0,
            s.attended || 0,
            `${s.percentage || 0}%`,
            s.isEligible ? "CLEARED FOR EXAM" : "NOT CLEARED (AT RISK)"
        ]);

        const csvContent = "data:text/csv;charset=utf-8," + [headers.join(","), ...rows.map(e => e.join(","))].join("\n");
        const encodedUri = encodeURI(csvContent);
        const link = document.createElement("a");
        link.setAttribute("href", encodedUri);
        link.setAttribute("download", `Exam_Attendance_Sheet_${selectedCourse}_${selectedSemester.replace(/\s+/g, '_')}.csv`);
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };

    const handlePrintPDF = () => {
        window.print();
    };

    return (
        <div className="min-h-screen bg-[#f8faf8] p-4 lg:p-8 font-sans text-[#1a1c1a] print:bg-white print:p-0">
            
            {/* ── Screen-Only Filter Controls Card ────────────────────────────── */}
            <div className="bg-white border border-gray-200/80 rounded-2xl p-5 shadow-sm mb-6 print:hidden">
                <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 border-b border-gray-100 pb-4 mb-4">
                    <div>
                        <h1 className="text-xl font-bold text-[#0a643a] flex items-center gap-2">
                            <span className="material-symbols-outlined">description</span>
                            Official Examination Attendance Reports
                        </h1>
                        <p className="text-xs text-slate-500 mt-0.5">
                            Generate and print semester examination eligibility sheets for course accreditation and department records.
                        </p>
                    </div>

                    <div className="flex items-center gap-2">
                        <button
                            onClick={handleExportCSV}
                            className="flex items-center gap-1.5 border border-gray-300 bg-white hover:bg-gray-50 text-slate-700 font-semibold text-xs px-3.5 py-2 rounded-xl shadow-sm transition-colors cursor-pointer"
                        >
                            <span className="material-symbols-outlined text-base">download</span>
                            Export CSV
                        </button>
                        <button
                            onClick={handlePrintPDF}
                            className="flex items-center gap-1.5 bg-[#0a643a] hover:bg-[#084f2e] text-white font-bold text-xs px-4 py-2 rounded-xl shadow-sm transition-colors cursor-pointer"
                        >
                            <span className="material-symbols-outlined text-base">print</span>
                            Print / Save Official PDF
                        </button>
                    </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                    {/* Course Select */}
                    <div>
                        <label className="block text-xs font-semibold text-[#535856] mb-1.5">
                            Select Course
                        </label>
                        <select
                            value={selectedCourse}
                            onChange={(e) => setSelectedCourse(e.target.value)}
                            className="w-full border border-gray-300 rounded-xl px-3.5 py-2.5 text-sm outline-none focus:border-[#0a643a] bg-white transition-all cursor-pointer font-medium text-gray-700"
                        >
                            {courses.length === 0 ? (
                                <option value="">No Courses Found</option>
                            ) : (
                                courses.map((c) => (
                                    <option key={c._id} value={c.courseCode}>
                                        {c.courseCode} — {c.courseTitle}
                                    </option>
                                ))
                            )}
                        </select>
                    </div>

                    {/* Semester Select */}
                    <div>
                        <label className="block text-xs font-semibold text-[#535856] mb-1.5">
                            Semester
                        </label>
                        <select
                            value={selectedSemester}
                            onChange={(e) => setSelectedSemester(e.target.value)}
                            className="w-full border border-gray-300 rounded-xl px-3.5 py-2.5 text-sm outline-none focus:border-[#0a643a] bg-white transition-all cursor-pointer font-medium text-gray-700"
                        >
                            <option value="First Semester">First Semester</option>
                            <option value="Second Semester">Second Semester</option>
                        </select>
                    </div>

                    {/* Threshold Rule Selector */}
                    <div>
                        <label className="block text-xs font-semibold text-[#535856] mb-1.5">
                            Exam Threshold Policy
                        </label>
                        <select
                            value={threshold}
                            onChange={(e) => setThreshold(Number(e.target.value))}
                            className="w-full border border-gray-300 rounded-xl px-3.5 py-2.5 text-sm outline-none focus:border-[#0a643a] bg-white transition-all cursor-pointer font-medium text-gray-700"
                        >
                            <option value={75}>75% Minimum Attendance (Standard)</option>
                            <option value={70}>70% Minimum Attendance</option>
                            <option value={80}>80% Minimum Attendance</option>
                            <option value={60}>60% Minimum Attendance</option>
                        </select>
                    </div>

                    {/* Search Field */}
                    <div>
                        <label className="block text-xs font-semibold text-[#535856] mb-1.5">
                            Search Student
                        </label>
                        <div className="relative">
                            <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-lg">
                                search
                            </span>
                            <input
                                type="text"
                                placeholder="Search by name or matric..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="w-full border border-gray-300 rounded-xl pl-9 pr-3.5 py-2.5 text-sm outline-none focus:border-[#0a643a] transition-all"
                            />
                        </div>
                    </div>
                </div>
            </div>

            {/* ── Summary Stats Overview (Screen Only) ─────────────────────────── */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6 print:hidden">
                <div className="bg-white border border-gray-200/80 rounded-2xl p-4 shadow-sm flex items-center justify-between">
                    <div>
                        <span className="text-xs text-slate-500 font-semibold uppercase tracking-wider block">Total Students</span>
                        <span className="text-2xl font-bold text-slate-800">{filteredStudents.length}</span>
                    </div>
                    <div className="w-10 h-10 rounded-full bg-slate-100 flex items-center justify-center text-slate-600">
                        <span className="material-symbols-outlined">groups</span>
                    </div>
                </div>

                <div className="bg-white border border-emerald-200 rounded-2xl p-4 shadow-sm flex items-center justify-between">
                    <div>
                        <span className="text-xs text-emerald-700 font-semibold uppercase tracking-wider block">Cleared for Exams (≥{threshold}%)</span>
                        <span className="text-2xl font-bold text-emerald-800">{eligibleCount}</span>
                    </div>
                    <div className="w-10 h-10 rounded-full bg-emerald-50 flex items-center justify-center text-emerald-600">
                        <span className="material-symbols-outlined">check_circle</span>
                    </div>
                </div>

                <div className="bg-white border border-red-200 rounded-2xl p-4 shadow-sm flex items-center justify-between">
                    <div>
                        <span className="text-xs text-red-700 font-semibold uppercase tracking-wider block">At Risk / Ineligible (&lt;{threshold}%)</span>
                        <span className="text-2xl font-bold text-red-800">{ineligibleCount}</span>
                    </div>
                    <div className="w-10 h-10 rounded-full bg-red-50 flex items-center justify-center text-red-600">
                        <span className="material-symbols-outlined">warning</span>
                    </div>
                </div>
            </div>

            {/* ── Printable Official Examination Attendance Sheet ─────────────── */}
            <div className="bg-white border border-gray-200/80 rounded-2xl shadow-sm overflow-hidden p-6 print:border-none print:shadow-none print:p-0">
                
                {/* Official University Sheet Header (Visible on Screen & Print) */}
                <div className="border-b-2 border-slate-800 pb-5 mb-6 text-center">
                    <h2 className="text-xl font-extrabold uppercase tracking-wider text-slate-900">
                        SMART ATTENDANCE & EXAMINATION MANAGEMENT SYSTEM
                    </h2>
                    <h3 className="text-sm font-bold uppercase tracking-widest text-[#0a643a] mt-0.5">
                        OFFICIAL SEMESTER EXAMINATION ATTENDANCE & ELIGIBILITY REPORT
                    </h3>

                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-4 text-left text-xs bg-slate-50 p-3.5 rounded-xl border border-gray-200 print:bg-white print:border-black">
                        <div>
                            <span className="block text-slate-500 font-medium">Course Code & Title:</span>
                            <strong className="text-slate-900 font-bold">{selectedCourse} — {currentCourseObj?.courseTitle || 'N/A'}</strong>
                        </div>
                        <div>
                            <span className="block text-slate-500 font-medium">Faculty & Department:</span>
                            <strong className="text-slate-900 font-bold">{metaData.faculty || 'All Faculties'} • {metaData.department || 'All Depts'}</strong>
                        </div>
                        <div>
                            <span className="block text-slate-500 font-medium">Semester / Total Classes:</span>
                            <strong className="text-slate-900 font-bold">{selectedSemester} ({metaData.totalClasses} Sessions Held)</strong>
                        </div>
                        <div>
                            <span className="block text-slate-500 font-medium">Exam Policy Rule:</span>
                            <strong className="text-slate-900 font-bold">{threshold}% Minimum Required</strong>
                        </div>
                    </div>
                </div>

                {/* Table Data */}
                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse print:text-xs">
                        <thead>
                            <tr className="border-b-2 border-slate-800 bg-[#f9faf9] text-[#3f4941] text-xs font-bold uppercase tracking-wider print:bg-white print:border-black">
                                <th className="py-3 px-4 w-12 text-center">#</th>
                                <th className="py-3 px-4">Student Name</th>
                                <th className="py-3 px-4">Matric Number</th>
                                <th className="py-3 px-4 text-center">Sessions Held</th>
                                <th className="py-3 px-4 text-center">Attended</th>
                                <th className="py-3 px-4 text-center">Attendance %</th>
                                <th className="py-3 px-4 text-center">Examination Clearance</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-200 text-sm print:text-xs">
                            {loading ? (
                                <tr>
                                    <td colSpan="7" className="py-8 text-center text-sm text-gray-500 font-medium animate-pulse">
                                        Loading examination attendance records...
                                    </td>
                                </tr>
                            ) : filteredStudents.length === 0 ? (
                                <tr>
                                    <td colSpan="7" className="py-8 text-center text-sm text-gray-400 font-medium">
                                        No student attendance records found for this query.
                                    </td>
                                </tr>
                            ) : (
                                filteredStudents.map((student, index) => {
                                    const isEligible = student.isEligible;
                                    const percentage = student.percentage;

                                    return (
                                        <tr key={student.id || index} className="hover:bg-gray-50 transition-colors print:border-b print:border-gray-300">
                                            <td className="py-3 px-4 text-center font-medium text-slate-400 font-mono text-xs">{index + 1}</td>
                                            <td className="py-3 px-4 font-bold text-slate-800">{student.name}</td>
                                            <td className="py-3 px-4 text-slate-600 font-mono text-xs">{student.matric}</td>
                                            <td className="py-3 px-4 text-center font-medium text-slate-700">{student.totalClasses}</td>
                                            <td className="py-3 px-4 text-center font-medium text-slate-700">{student.attended}</td>
                                            <td className="py-3 px-4 text-center font-bold text-slate-800">{percentage}%</td>
                                            <td className="py-3 px-4 text-center">
                                                <span
                                                    className={`inline-block px-3 py-0.5 text-[11px] font-bold rounded-full uppercase tracking-wider ${
                                                        isEligible
                                                            ? 'bg-emerald-100 text-emerald-800 border border-emerald-300 print:text-black print:border-black'
                                                            : 'bg-red-100 text-red-800 border border-red-300 print:text-black print:border-black'
                                                    }`}
                                                >
                                                    {isEligible ? 'CLEARED' : 'INELIGIBLE'}
                                                </span>
                                            </td>
                                        </tr>
                                    );
                                })
                            )}
                        </tbody>
                    </table>
                </div>

                {/* Verification & Approval Signatures Footer (Visible in Print & Screen) */}
                <div className="mt-12 pt-8 border-t-2 border-slate-800 grid grid-cols-3 gap-6 text-center text-xs font-semibold text-slate-700">
                    <div className="flex flex-col items-center">
                        <div className="w-48 border-b border-slate-900 mb-2 h-10" />
                        <span>Course Lecturer Signature & Date</span>
                    </div>

                    <div className="flex flex-col items-center">
                        <div className="w-48 border-b border-slate-900 mb-2 h-10" />
                        <span>Head of Department (HOD) Approval</span>
                    </div>

                    <div className="flex flex-col items-center">
                        <div className="w-48 border-b border-slate-900 mb-2 h-10" />
                        <span>Faculty Deanery Examination Stamp</span>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Reports;