import React, { useState, useEffect } from 'react';
import api from '../../Utils/api';
import BackButton from '../../Components/BackButton';

const StudentManagement = () => {
    // State management
    const [students, setStudents] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState('');
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [totalStudents, setTotalStudents] = useState(0);

    // Modal state for Add Student
    const [isAddModalOpen, setIsAddModalOpen] = useState(false);

    // Fetch students list from backend API
    useEffect(() => {
        const fetchStudents = async () => {
            setLoading(true);
            try {
                const response = await api.get('/admin/studentmanagement', {
                    params: {
                        search: searchQuery,
                        page: currentPage,
                        limit: 5
                    }
                });

                if (response.data.success) {
                    setStudents(response.data.students);
                    setTotalPages(response.data.totalPages);
                    setTotalStudents(response.data.totalStudents);
                }
            } catch (error) {
                console.error("Failed to fetch students list:", error);
            } finally {
                setLoading(false);
            }
        };

        const debounceTimer = setTimeout(() => {
            fetchStudents();
        }, 300);

        return () => clearTimeout(debounceTimer);
    }, [searchQuery, currentPage]);

    return (
        <div className="px-4 sm:px-6 pt-3 pb-24 bg-[#f8faf9] min-h-screen font-sans">
            
            <div className="mb-3">
                <BackButton to="/admin/lecturer-dashboard" label="Back to Admin Dashboard" />
            </div>

            {/* ── Top Bar Header ─────────────────────────────── */}
            <div className="flex justify-between items-center mb-6">
                <div className="flex items-center gap-3">
                    <h1 className="text-2xl font-bold text-[#0d1f18]">Student Management</h1>
                </div>

                <button 
                    onClick={() => setIsAddModalOpen(true)}
                    className="flex items-center gap-2 bg-[#0a643a] hover:bg-[#08522f] text-white px-4 py-2.5 rounded-xl text-sm font-medium transition-colors shadow-sm cursor-pointer"
                >
                    <span className="material-symbols-outlined text-base">person_add</span>
                    Add Student
                </button>
            </div>

            {/* ── Search Input Filter ────────────────────────── */}
            <div className="mb-6 max-w-md relative">
                <span className="material-symbols-outlined absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400 text-lg">
                    search
                </span>
                <input
                    type="text"
                    placeholder="Search by name or matric number..."
                    value={searchQuery}
                    onChange={(e) => {
                        setSearchQuery(e.target.value);
                        setCurrentPage(1);
                    }}
                    className="w-full bg-white border border-gray-200 rounded-xl pl-10 pr-4 py-2.5 text-sm outline-none focus:border-[#0a643a] focus:ring-1 focus:ring-[#0a643a] transition-all text-gray-700 shadow-sm"
                />
            </div>

            {/* ── Student Data Table Container ───────────────── */}
            <div className="bg-white border border-gray-200/80 rounded-2xl shadow-sm overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="bg-[#f2f5f3] text-gray-600 text-xs font-semibold uppercase tracking-wider border-b border-gray-200">
                                <th className="py-4 px-6">Name</th>
                                <th className="py-4 px-6">Matric Number</th>
                                <th className="py-4 px-6">Department</th>
                                <th className="py-4 px-6">Enrolled Courses</th>
                                <th className="py-4 px-6 text-center">Status</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100 text-sm text-gray-700">
                            {loading ? (
                                <tr>
                                    <td colSpan="5" className="text-center py-12 text-gray-400 font-medium">
                                        Loading student records...
                                    </td>
                                </tr>
                            ) : students.length === 0 ? (
                                <tr>
                                    <td colSpan="5" className="text-center py-12 text-gray-400 font-medium">
                                        No students found matching your query.
                                    </td>
                                </tr>
                            ) : (
                                students.map((student) => {
                                    const isEligible = student.status?.toLowerCase() === 'eligible';

                                    return (
                                        <tr key={student.id} className="hover:bg-[#f9fbf9] transition-colors">
                                            
                                            {/* Name & Initials Avatar Badge */}
                                            <td className="py-4 px-6 font-medium text-gray-900 flex items-center gap-3">
                                                <div className="w-9 h-9 rounded-full bg-[#c2e8d3] text-[#0a643a] font-bold text-xs flex items-center justify-center shrink-0">
                                                    {student.initials || 'ST'}
                                                </div>
                                                <span>{student.name}</span>
                                            </td>

                                            {/* Matric Number */}
                                            <td className="py-4 px-6 font-mono text-gray-500 text-xs">
                                                {student.matricNumber}
                                            </td>

                                            {/* Department */}
                                            <td className="py-4 px-6 text-gray-600">
                                                {student.department}
                                            </td>

                                            {/* Enrolled Courses */}
                                            <td className="py-4 px-6 text-gray-600">
                                                {student.enrolledCourses}
                                            </td>

                                            {/* Status Badge */}
                                            <td className="py-4 px-6 text-center">
                                                <span className={`inline-block px-3 py-1 rounded-full text-xs font-semibold ${
                                                    student.status?.toLowerCase() === 'eligible'
                                                        ? 'bg-[#e3f6ed] text-[#0a643a]'
                                                        : student.status?.toLowerCase() === 'not enrolled'
                                                        ? 'bg-slate-100 text-slate-600'
                                                        : 'bg-[#fdecea] text-[#ba1a1a]'
                                                }`}>
                                                    {student.status}
                                                </span>
                                            </td>
                                        </tr>
                                    );
                                })
                            )}
                        </tbody>
                    </table>
                </div>

                {/* ── Table Footer & Pagination Controls ───────── */}
                <div className="px-6 py-4 bg-[#f9fbf9] border-t border-gray-100 flex items-center justify-between text-xs text-gray-500">
                    <div>
                        Showing <span className="font-semibold text-gray-700">{students.length}</span> of <span className="font-semibold text-gray-700">{totalStudents}</span> students
                    </div>

                    <div className="flex items-center gap-2">
                        <button
                            onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                            disabled={currentPage === 1}
                            className="p-1.5 rounded-lg border border-gray-200 bg-white hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed transition-colors cursor-pointer"
                        >
                            <span className="material-symbols-outlined text-sm flex items-center">chevron_left</span>
                        </button>

                        <span className="px-2 font-medium text-gray-600">
                            Page {currentPage} of {totalPages || 1}
                        </span>

                        <button
                            onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                            disabled={currentPage >= totalPages}
                            className="p-1.5 rounded-lg border border-gray-200 bg-white hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed transition-colors cursor-pointer"
                        >
                            <span className="material-symbols-outlined text-sm flex items-center">chevron_right</span>
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default StudentManagement;