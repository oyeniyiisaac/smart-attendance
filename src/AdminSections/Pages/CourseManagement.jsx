import React, { useState, useEffect } from 'react';
import api from '../../Utils/api';

const CourseManagement = () => {
    const [courses, setCourses] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState('');
    const [semesterFilter, setSemesterFilter] = useState('2025/2026 First Semester');
    const [isAddModalOpen, setIsAddModalOpen] = useState(false);

    // New Course Form State
    const [formData, setFormData] = useState({
        courseCode: '',
        courseTitle: '',
        semester: '2025/2026 First Semester',
        unit: 3
    });

    const [formLoading, setFormLoading] = useState(false);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');

    // Fetch Courses
    const fetchCourses = async () => {
        setLoading(true);
        try {
            const res = await api.get('/admin/courses', {
                params: { search: searchQuery, semester: semesterFilter }
            });
            if (res.data.success) {
                setCourses(res.data.courses);
            }
        } catch (err) {
            console.error("Failed to fetch courses:", err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        const timer = setTimeout(() => {
            fetchCourses();
        }, 300);
        return () => clearTimeout(timer);
    }, [searchQuery, semesterFilter]);

    // Handle Create Course Form Submit
    const handleCreateCourse = async (e) => {
        e.preventDefault();
        setError('');
        setSuccess('');
        setFormLoading(true);

        try {
            const payload = {
                ...formData,
                faculty: formData.faculty,
                department: formData.department
            };

            const res = await api.post('/admin/create-course', payload);

            if (res.data.success) {
                setSuccess('Course added successfully!');
                fetchCourses();
                setTimeout(() => {
                    setIsAddModalOpen(false);
                    setSuccess('');
                }, 1200);
            }
        } catch (err) {
            setError(err.response?.data?.message || 'Failed to add course.');
        } finally {
            setFormLoading(false);
        }
    };

    // Handle Delete Course
    const handleDeleteCourse = async (courseId) => {
        if (!window.confirm('Are you sure you want to delete this course?')) return;

        try {
            await api.delete(`/admin/delete-course/${courseId}`);
            fetchCourses();
        } catch (err) {
            alert(err.response?.data?.message || 'Failed to delete course.');
        }
    };

    return (
        <div className="p-6 bg-[#f8faf9] min-h-screen font-sans">

            {/* ── Header Bar ───────────────────────────────── */}
            <div className="flex justify-between items-center mb-6">
                <div>
                    <h1 className="text-2xl font-bold text-[#0d1f18]">Course Management</h1>
                    <p className="text-sm text-gray-500">Manage departmental course offerings per semester</p>
                </div>

                <button
                    onClick={() => setIsAddModalOpen(true)}
                    className="flex items-center gap-2 bg-[#0a643a] hover:bg-[#08522f] text-white px-4 py-2.5 rounded-xl text-sm font-medium transition-colors cursor-pointer shadow-sm"
                >
                    <span className="material-symbols-outlined text-base">add_book</span>
                    Add Course
                </button>
            </div>

            {/* ── Filters & Search ─────────────────────────── */}
            <div className="flex flex-wrap gap-4 mb-6 items-center justify-between">
                <div className="relative flex-1 max-w-md">
                    <span className="material-symbols-outlined absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400 text-lg">
                        search
                    </span>
                    <input
                        type="text"
                        placeholder="Search by code or title..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="w-full bg-white border border-gray-200 rounded-xl pl-10 pr-4 py-2.5 text-sm outline-none focus:border-[#0a643a] focus:ring-1 focus:ring-[#0a643a] transition-all text-gray-700 shadow-sm"
                    />
                </div>

                <select
                    value={semesterFilter}
                    onChange={(e) => setSemesterFilter(e.target.value)}
                    className="bg-white border border-gray-200 rounded-xl px-4 py-2.5 text-sm outline-none focus:border-[#0a643a] text-gray-700 shadow-sm"
                >
                    <option value="2025/2026 First Semester">2025/2026 First Semester</option>
                    <option value="2025/2026 Second Semester">2025/2026 Second Semester</option>
                </select>
            </div>

            {/* ── Course Table ─────────────────────────────── */}
            <div className="bg-white border border-gray-200/80 rounded-2xl shadow-sm overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="bg-[#f2f5f3] text-gray-600 text-xs font-semibold uppercase tracking-wider border-b border-gray-200">
                                <th className="py-4 px-6">Course Code</th>
                                <th className="py-4 px-6">Course Title</th>
                                <th className="py-4 px-6">Unit</th>
                                <th className="py-4 px-6">Semester</th>
                                <th className="py-4 px-6 text-center">Action</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100 text-sm text-gray-700">
                            {loading ? (
                                <tr>
                                    <td colSpan="5" className="text-center py-12 text-gray-400 font-medium">
                                        Loading course catalog...
                                    </td>
                                </tr>
                            ) : courses.length === 0 ? (
                                <tr>
                                    <td colSpan="5" className="text-center py-12 text-gray-400 font-medium">
                                        No courses found for this semester.
                                    </td>
                                </tr>
                            ) : (
                                courses.map((course) => (
                                    <tr key={course._id} className="hover:bg-[#f9fbf9] transition-colors">
                                        <td className="py-4 px-6 font-mono font-semibold text-[#0a643a]">
                                            {course.courseCode}
                                        </td>
                                        <td className="py-4 px-6 font-medium text-gray-900">
                                            {course.courseTitle}
                                        </td>
                                        <td className="py-4 px-6 text-gray-600">
                                            {course.unit} Units
                                        </td>
                                        <td className="py-4 px-6 text-gray-500 text-xs">
                                            {course.semester}
                                        </td>
                                        <td className="py-4 px-6 text-center">
                                            <button
                                                onClick={() => handleDeleteCourse(course._id)}
                                                className="text-red-600 hover:text-red-800 p-1.5 rounded-lg hover:bg-red-50 transition-colors cursor-pointer"
                                                title="Delete Course"
                                            >
                                                <span className="material-symbols-outlined text-lg">delete</span>
                                            </button>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* ── Add Course Modal Popup ───────────────────── */}
            {isAddModalOpen && (
                <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center p-4 z-50">
                    <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-xl border border-gray-100 relative">

                        <div className="flex justify-between items-center mb-5">
                            <h2 className="text-xl font-bold text-[#0d1f18]">Add New Course</h2>
                            <button
                                onClick={() => setIsAddModalOpen(false)}
                                className="text-gray-400 hover:text-gray-600 cursor-pointer"
                            >
                                <span className="material-symbols-outlined">close</span>
                            </button>
                        </div>

                        {error && (
                            <div className="bg-red-50 text-red-600 text-xs p-3 rounded-lg mb-4">
                                {error}
                            </div>
                        )}
                        {success && (
                            <div className="bg-green-50 text-green-600 text-xs p-3 rounded-lg mb-4">
                                {success}
                            </div>
                        )}

                        <form onSubmit={handleCreateCourse} className="space-y-4">
                            <div>
                                <label className="block text-xs font-semibold text-gray-600 mb-1">
                                    Course Code
                                </label>
                                <input
                                    type="text"
                                    placeholder="e.g. CSC 301"
                                    value={formData.courseCode}
                                    onChange={(e) => setFormData({ ...formData, courseCode: e.target.value })}
                                    className="w-full border border-gray-300 rounded-lg p-2.5 text-sm outline-none focus:border-[#0a643a]"
                                    required
                                />
                            </div>

                            <div>
                                <label className="block text-xs font-semibold text-gray-600 mb-1">
                                    Course Title
                                </label>
                                <input
                                    type="text"
                                    placeholder="e.g. Database Management Systems"
                                    value={formData.courseTitle}
                                    onChange={(e) => setFormData({ ...formData, courseTitle: e.target.value })}
                                    className="w-full border border-gray-300 rounded-lg p-2.5 text-sm outline-none focus:border-[#0a643a]"
                                    required
                                />
                            </div>

                            <div className="grid grid-cols-2 gap-3">
                                <div>
                                    <label className="block text-xs font-semibold text-gray-600 mb-1">
                                        Units
                                    </label>
                                    <input
                                        type="number"
                                        min="1"
                                        max="6"
                                        value={formData.unit}
                                        onChange={(e) => setFormData({ ...formData, unit: e.target.value })}
                                        className="w-full border border-gray-300 rounded-lg p-2.5 text-sm outline-none focus:border-[#0a643a]"
                                        required
                                    />
                                </div>

                                <div>
                                    <label className="block text-xs font-semibold text-gray-600 mb-1">
                                        Semester
                                    </label>
                                    <select
                                        value={formData.semester}
                                        onChange={(e) => setFormData({ ...formData, semester: e.target.value })}
                                        className="w-full border border-gray-300 rounded-lg p-2.5 text-sm outline-none focus:border-[#0a643a]"
                                    >
                                        <option value="2025/2026 First Semester">First Semester</option>
                                        <option value="2025/2026 Second Semester">Second Semester</option>
                                    </select>
                                </div>
                            </div>

                            <button
                                type="submit"
                                disabled={formLoading}
                                className="w-full bg-[#0a643a] hover:bg-[#08522f] text-white py-3 rounded-xl font-semibold text-sm transition-colors cursor-pointer disabled:opacity-50 mt-2"
                            >
                                {formLoading ? 'Saving...' : 'Save Course'}
                            </button>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default CourseManagement;