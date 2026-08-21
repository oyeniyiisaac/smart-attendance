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
                return false; // Token has expired
            }
        }
        return true;
    } catch (error) {
        return false; // Token is corrupted or tampered with
    }
};

const Reports = () => {
    const [students, setStudents] = useState([]);
    const [courses, setCourses] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedCourse, setSelectedCourse] = useState('');
    const [selectedSemester, setSelectedSemester] = useState('Second Semester');
    const navigate = useNavigate();

    useEffect(() => {
        const token = localStorage.getItem("adminToken");
        if (!isTokenValid(token)) {
            localStorage.removeItem("adminToken");
            navigate('/signin');
        }
    }, [navigate]);

    // Fetch Available Courses Dynamically
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
                const res = await api.get(`/admin/reports?courseCode=${selectedCourse}&semester=${selectedSemester}`);
                setStudents(res.data.students || res.data.data || []);
            } catch (err) {
                console.error("Failed to load reports:", err);
            } finally {
                setLoading(false);
            }
        };

        fetchReport();
    }, [selectedCourse, selectedSemester]);

    // Filter dynamic students array based on search input
    const filteredStudents = students.filter((student) => {
        const studentName = student.name || student.studentName || '';
        const matric = student.matric || student.matricNumber || '';
        return (
            studentName.toLowerCase().includes(searchTerm.toLowerCase()) ||
            matric.toLowerCase().includes(searchTerm.toLowerCase())
        );
    });

    const handleExportCSV = () => {
        if (filteredStudents.length === 0) return;
        const headers = ["Student Name", "Matric Number", "Total Classes", "Attended", "Attendance %", "Eligibility Status"];
        const rows = filteredStudents.map(s => [
            `"${s.name || ''}"`,
            `"${s.matric || ''}"`,
            s.totalClasses || 0,
            s.attended || 0,
            `${s.percentage || 0}%`,
            s.isEligible ? "Eligible" : "At Risk"
        ]);

        const csvContent = "data:text/csv;charset=utf-8," + [headers.join(","), ...rows.map(e => e.join(","))].join("\n");
        const encodedUri = encodeURI(csvContent);
        const link = document.createElement("a");
        link.setAttribute("href", encodedUri);
        link.setAttribute("download", `Attendance_Report_${selectedCourse}_${selectedSemester.replace(/\s+/g, '_')}.csv`);
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };

    const handleExportPDF = () => {
        window.print();
    };

    return (
        <div className="min-h-screen bg-[#f8faf8] p-6 lg:p-8 font-sans text-[#1a1c1a]">
            {/* ── Page Header ─────────────────────────────────────── */}
            <div className="mb-6">
                <h1 className="text-xl font-semibold text-[#3f4941]">Attendance Reports</h1>
            </div>

            {/* ── Filter Controls Card ────────────────────────────── */}
            <div className="bg-white border border-gray-200/80 rounded-2xl p-5 shadow-sm mb-6">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    {/* Course Select */}
                    <div>
                        <label className="block text-xs font-semibold text-[#535856] mb-1.5">
                            Course
                        </label>
                        <select
                            value={selectedCourse}
                            onChange={(e) => setSelectedCourse(e.target.value)}
                            className="w-full border border-gray-300 rounded-xl px-3.5 py-2.5 text-sm outline-none focus:border-[#0a643a] focus:ring-1 focus:ring-[#0a643a] bg-white transition-all cursor-pointer font-medium text-gray-700"
                        >
                            {courses.length === 0 ? (
                                <option value="">No Courses Found</option>
                            ) : (
                                courses.map((c) => (
                                    <option key={c._id} value={c.courseCode}>
                                        {c.courseCode} - {c.courseTitle}
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
                            className="w-full border border-gray-300 rounded-xl px-3.5 py-2.5 text-sm outline-none focus:border-[#0a643a] focus:ring-1 focus:ring-[#0a643a] bg-white transition-all cursor-pointer font-medium text-gray-700"
                        >
                            <option value="First Semester">First Semester</option>
                            <option value="Second Semester">Second Semester</option>
                        </select>
                    </div>

                    {/* Search Field */}
                    <div>
                        <label className="block text-xs font-semibold text-[#535856] mb-1.5">
                            Search by student name
                        </label>
                        <div className="relative">
                            <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-lg">
                                search
                            </span>
                            <input
                                type="text"
                                placeholder="e.g. John Doe"
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="w-full border border-gray-300 rounded-xl pl-9 pr-3.5 py-2.5 text-sm outline-none focus:border-[#0a643a] focus:ring-1 focus:ring-[#0a643a] transition-all"
                            />
                        </div>
                    </div>
                </div>
            </div>

            {/* ── Table Action Header ─────────────────────────────── */}
            <div className="flex flex-wrap items-center justify-between gap-4 mb-4">
                <p className="text-sm font-medium text-[#535856]">
                    Showing <span className="font-semibold text-gray-800">{filteredStudents.length}</span> student records
                </p>

                <div className="flex items-center gap-3">
                    <button
                        onClick={handleExportCSV}
                        className="flex items-center gap-1.5 border border-gray-300 bg-white text-[#0a643a] font-semibold text-xs px-4 py-2 rounded-xl shadow-sm hover:bg-gray-50 transition-colors cursor-pointer"
                    >
                        <span className="material-symbols-outlined text-base">download</span>
                        Export CSV
                    </button>
                    <button
                        onClick={handleExportPDF}
                        className="flex items-center gap-1.5 border border-gray-300 bg-white text-[#0a643a] font-semibold text-xs px-4 py-2 rounded-xl shadow-sm hover:bg-gray-50 transition-colors cursor-pointer"
                    >
                        <span className="material-symbols-outlined text-base">picture_as_pdf</span>
                        Export PDF
                    </button>
                </div>
            </div>

            {/* ── Data Table ─────────────────────────────────────── */}
            <div className="bg-white border border-gray-200/80 rounded-2xl shadow-sm overflow-hidden mb-6">
                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="border-b border-gray-200/80 bg-[#f9faf9] text-[#3f4941] text-xs font-bold uppercase tracking-wider">
                                <th className="py-3.5 px-6">Student Name</th>
                                <th className="py-3.5 px-6">Matric Number</th>
                                <th className="py-3.5 px-6 text-center">Total Classes</th>
                                <th className="py-3.5 px-6 text-center">Attended</th>
                                <th className="py-3.5 px-6 text-center">Attendance %</th>
                                <th className="py-3.5 px-6 text-center">Eligibility Status</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100 text-sm">
                            {loading ? (
                                <tr>
                                    <td colSpan="6" className="py-8 text-center text-sm text-gray-500 font-medium">
                                        Loading attendance report records...
                                    </td>
                                </tr>
                            ) : filteredStudents.length === 0 ? (
                                <tr>
                                    <td colSpan="6" className="py-8 text-center text-sm text-gray-400 font-medium">
                                        No student records found for this query.
                                    </td>
                                </tr>
                            ) : (
                                filteredStudents.map((student, index) => {
                                    const totalClasses = student.totalClasses || student.totalSessions || 0;
                                    const attended = student.attended || 0;
                                    const percentage = totalClasses > 0
                                        ? ((attended / totalClasses) * 100).toFixed(1)
                                        : 0;
                                    const isEligible = percentage >= 70;

                                    return (
                                        <tr key={student._id || student.id || index} className="hover:bg-gray-50/80 transition-colors">
                                            <td className="py-4 px-6 font-semibold text-gray-800">{student.name || student.studentName}</td>
                                            <td className="py-4 px-6 text-gray-500 font-mono text-xs">{student.matric || student.matricNumber}</td>
                                            <td className="py-4 px-6 text-center font-medium text-gray-700">{totalClasses}</td>
                                            <td className="py-4 px-6 text-center font-medium text-gray-700">{attended}</td>
                                            <td className="py-4 px-6 text-center">
                                                <div className="inline-flex flex-col items-center">
                                                    <span className="font-semibold text-gray-800">{percentage}%</span>
                                                    <div className="w-10 h-1 bg-gray-200 rounded-full mt-1 overflow-hidden">
                                                        <div
                                                            className={`h-full rounded-full ${isEligible ? 'bg-[#0a643a]' : 'bg-[#ba1a1a]'}`}
                                                            style={{ width: `${Math.min(percentage, 100)}%` }}
                                                        />
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="py-4 px-6 text-center">
                                                <span
                                                    className={`inline-block px-4 py-1 text-xs font-semibold rounded-full ${isEligible
                                                        ? 'bg-[#e8f5e9] text-[#0a643a] border border-[#baeed9]'
                                                        : 'bg-[#fdecea] text-[#ba1a1a] border border-[#ffdad6]'
                                                        }`}
                                                >
                                                    {isEligible ? 'Eligible' : 'At Risk'}
                                                </span>
                                            </td>
                                        </tr>
                                    );
                                })
                            )}
                        </tbody>
                    </table>
                </div>

                {/* Table Pagination Footer */}
                <div className="flex items-center justify-between px-6 py-3.5 border-t border-gray-100 text-xs text-gray-500 font-medium">
                    <span>Page 1 of 1</span>
                    <div className="flex items-center gap-2">
                        <button className="p-1 rounded-lg border border-gray-200 text-gray-400 hover:text-gray-700 hover:border-gray-300 transition-colors">
                            <span className="material-symbols-outlined text-base">chevron_left</span>
                        </button>
                        <button className="p-1 rounded-lg border border-gray-200 text-gray-600 hover:text-gray-900 hover:border-gray-300 transition-colors">
                            <span className="material-symbols-outlined text-base">chevron_right</span>
                        </button>
                    </div>
                </div>
            </div>

            {/* ── Summary Insights Cards ───────────────────────────── */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="lg:col-span-2 bg-[#064e3b] text-white rounded-2xl p-6 relative overflow-hidden shadow-sm flex flex-col justify-between min-h-[160px]">
                    <div className="absolute right-0 bottom-0 top-0 w-1/3 bg-white/5 rounded-l-full pointer-events-none" />

                    <div className="relative z-10 max-w-xl">
                        <h3 className="text-lg font-bold mb-2">Overall Course Compliance</h3>
                        <p className="text-emerald-100 text-xs leading-relaxed mb-5">
                            Current attendance trends show eligibility rates computed directly from active semester records.
                        </p>
                    </div>

                    <div className="relative z-10">
                        <button className="bg-white text-[#064e3b] font-semibold text-xs px-4 py-2.5 rounded-xl hover:bg-emerald-50 transition-colors shadow-sm cursor-pointer">
                            View Detailed Insights
                        </button>
                    </div>
                </div>

                <div className="bg-[#f0f4f1] border border-gray-200/80 rounded-2xl p-6 flex flex-col items-center justify-center text-center shadow-sm">
                    <div className="w-10 h-10 rounded-full bg-white flex items-center justify-center shadow-xs mb-3 text-[#0a643a]">
                        <span className="material-symbols-outlined text-2xl">info</span>
                    </div>
                    <h4 className="text-sm font-bold text-gray-800 mb-1">Threshold Warning</h4>
                    <p className="text-xs text-[#535856] max-w-xs leading-relaxed">
                        System-wide 70% attendance policy is currently active for all courses.
                    </p>
                </div>
            </div>
        </div>
    );
};

export default Reports;