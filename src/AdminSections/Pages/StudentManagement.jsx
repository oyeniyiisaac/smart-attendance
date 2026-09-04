import React, { useState, useEffect } from 'react';
import api from '../../Utils/api';
import BackButton from '../../Components/BackButton';
import { Modal, ModalHeader, ModalBody } from 'flowbite-react';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

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

    // 🔒 Device Reset Modal State
    const [resetModalStudent, setResetModalStudent] = useState(null);
    const [isResettingDevice, setIsResettingDevice] = useState(false);

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

    const handleConfirmResetDevice = async () => {
        if (!resetModalStudent) return;
        try {
            setIsResettingDevice(true);
            const response = await api.post('/admin/reset-student-device', {
                studentId: resetModalStudent.id,
                matricno: resetModalStudent.matricNumber
            });

            if (response.data.success) {
                toast.success(response.data.message || "Device binding reset successfully!");
                // Update local state
                setStudents(prev => prev.map(st => {
                    if (st.id === resetModalStudent.id) {
                        return {
                            ...st,
                            deviceId: null,
                            deviceInfo: null,
                            deviceResetRequested: false,
                            deviceResetReason: ''
                        };
                    }
                    return st;
                }));
                setResetModalStudent(null);
            }
        } catch (error) {
            console.error("Device reset error:", error);
            toast.error(error.response?.data?.message || "Failed to reset student device binding.");
        } finally {
            setIsResettingDevice(false);
        }
    };

    return (
        <div className="px-4 sm:px-6 pt-3 pb-24 bg-[#f8faf9] min-h-screen font-sans">
            
            <div className="mb-3">
                <BackButton to="/admin/lecturer-dashboard" label="Back to Admin Dashboard" />
            </div>

            {/* ── Top Bar Header ─────────────────────────────── */}
            <div className="flex justify-between items-center mb-6" data-aos="fade-down" data-aos-duration="500">
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
            <div className="mb-6 max-w-md relative" data-aos="fade-down" data-aos-delay="100">
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
            <div className="bg-white border border-gray-200/80 rounded-2xl shadow-sm overflow-hidden" data-aos="fade-up" data-aos-delay="150">
                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="bg-[#f2f5f3] text-gray-600 text-xs font-semibold uppercase tracking-wider border-b border-gray-200">
                                <th className="py-4 px-6">Name</th>
                                <th className="py-4 px-6">Matric Number</th>
                                <th className="py-4 px-6">Department</th>
                                <th className="py-4 px-6">Enrolled Courses</th>
                                <th className="py-4 px-6 text-center">Status</th>
                                <th className="py-4 px-6">Device Binding</th>
                                <th className="py-4 px-6 text-center">Action</th>
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

                                            {/* 🔒 1-to-1 Device Binding Info */}
                                            <td className="py-4 px-6">
                                                {student.deviceId ? (
                                                    <div className="space-y-1">
                                                        <div className="flex items-center gap-1.5 font-semibold text-slate-800 text-xs">
                                                            <span className="material-symbols-outlined text-emerald-600 text-sm">phonelink_lock</span>
                                                            <span className="truncate max-w-[140px]" title={student.deviceInfo?.name}>
                                                                {student.deviceInfo?.name || "Bound Device"}
                                                            </span>
                                                        </div>
                                                        {student.deviceResetRequested && (
                                                            <span className="inline-flex items-center gap-1 text-[10px] font-bold text-amber-800 bg-amber-100 px-2 py-0.5 rounded-md border border-amber-300 animate-pulse">
                                                                <span className="material-symbols-outlined text-xs">priority_high</span>
                                                                <span>Reset Requested</span>
                                                            </span>
                                                        )}
                                                    </div>
                                                ) : (
                                                    <span className="text-gray-400 text-xs italic flex items-center gap-1">
                                                        <span className="material-symbols-outlined text-gray-300 text-sm">phonelink_off</span>
                                                        <span>No device bound</span>
                                                    </span>
                                                )}
                                            </td>

                                            {/* Action Buttons */}
                                            <td className="py-4 px-6 text-center">
                                                {student.deviceId || student.deviceResetRequested ? (
                                                    <button
                                                        onClick={() => setResetModalStudent(student)}
                                                        className="inline-flex items-center gap-1 px-2.5 py-1.5 bg-amber-50 hover:bg-amber-100 text-amber-800 border border-amber-200 rounded-xl text-xs font-bold transition-all shadow-sm cursor-pointer"
                                                        title="Reset device binding for this student"
                                                    >
                                                        <span className="material-symbols-outlined text-sm">device_reset</span>
                                                        <span>Reset</span>
                                                    </button>
                                                ) : (
                                                    <span className="text-gray-300 text-xs font-mono">-</span>
                                                )}
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

            {/* ── RESET DEVICE BINDING CONFIRMATION MODAL ────────────────────── */}
            <Modal show={!!resetModalStudent} size="md" onClose={() => setResetModalStudent(null)}>
                <ModalHeader className="border-b border-gray-100 px-6 py-4">
                    <div className="flex items-center gap-2">
                        <span className="material-symbols-outlined text-amber-600 text-xl">device_reset</span>
                        <h3 className="text-sm font-bold text-slate-900">Reset Student Device Binding</h3>
                    </div>
                </ModalHeader>
                <ModalBody className="p-6 space-y-4">
                    {resetModalStudent && (
                        <>
                            <div className="bg-amber-50 border border-amber-200 rounded-xl p-3.5 text-xs text-amber-900 space-y-1">
                                <p className="font-bold flex items-center gap-1.5">
                                    <span className="material-symbols-outlined text-base">warning</span>
                                    <span>Anti-Proxy Security Action</span>
                                </p>
                                <p className="leading-relaxed text-[11px] opacity-90">
                                    Resetting device binding will unlink the currently registered device for <strong>{resetModalStudent.name}</strong> ({resetModalStudent.matricNumber}).
                                    The student will be permitted to register a new device upon their next mobile login.
                                </p>
                            </div>

                            <div className="bg-slate-50 border border-gray-200 rounded-xl p-3 text-xs space-y-2">
                                <div className="flex justify-between">
                                    <span className="text-slate-500 font-medium">Student Name:</span>
                                    <span className="font-bold text-slate-800">{resetModalStudent.name}</span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-slate-500 font-medium">Matric Number:</span>
                                    <span className="font-mono font-bold text-slate-800">{resetModalStudent.matricNumber}</span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-slate-500 font-medium">Bound Hardware:</span>
                                    <span className="font-semibold text-slate-700">{resetModalStudent.deviceInfo?.name || resetModalStudent.deviceId || "Registered Device"}</span>
                                </div>
                                {resetModalStudent.deviceResetRequested && (
                                    <div className="pt-2 border-t border-gray-200">
                                        <span className="text-[11px] font-bold text-amber-700 block mb-1">Student's Stated Reason:</span>
                                        <p className="text-[11px] text-slate-700 italic bg-white p-2 rounded-lg border border-amber-200">
                                            "{resetModalStudent.deviceResetReason || 'No reason provided'}"
                                        </p>
                                    </div>
                                )}
                            </div>

                            <div className="flex justify-end gap-2 pt-2">
                                <button
                                    type="button"
                                    onClick={() => setResetModalStudent(null)}
                                    className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold rounded-xl transition-colors cursor-pointer"
                                >
                                    Cancel
                                </button>
                                <button
                                    type="button"
                                    disabled={isResettingDevice}
                                    onClick={handleConfirmResetDevice}
                                    className="px-4 py-2 bg-amber-600 hover:bg-amber-700 disabled:opacity-60 text-white text-xs font-bold rounded-xl transition-colors shadow-sm cursor-pointer flex items-center gap-1.5"
                                >
                                    <span className="material-symbols-outlined text-sm">check_circle</span>
                                    <span>{isResettingDevice ? "Resetting..." : "Confirm & Reset Device"}</span>
                                </button>
                            </div>
                        </>
                    )}
                </ModalBody>
            </Modal>

            <ToastContainer />
        </div>
    );
};

export default StudentManagement;