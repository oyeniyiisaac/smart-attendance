import { useState, useEffect } from 'react';
import api from '../../Utils/api';
import { useNavigate } from 'react-router-dom';
import BackButton from '../../Components/BackButton';

const departments = [
    'All Departments',
    'Computer Science',
    'Mathematics',
    'Engineering',
    'Business Administration',
    'Humanities',
];

export default function StudentCourseRegistration() {
    const navigate = useNavigate();

    const [courses, setCourses] = useState([]);
    const [registeredStatusMap, setRegisteredStatusMap] = useState({}); // { courseId: 'Approved' | 'Pending' }
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    const [selectedDept, setSelectedDept] = useState('All Departments');
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedCourseIds, setSelectedCourseIds] = useState([]);

    // ── Fetch Courses and Student's Existing Registrations ─────────────────
    const fetchCoursesAndStatus = async () => {
        setLoading(true);
        setError('');
        try {
            const token = localStorage.getItem('studentToken') || localStorage.getItem('token');

            if (!token) {
                setError('Authentication error: Please log in again.');
                setLoading(false);
                return;
            }

            // 1. Fetch available courses and existing user registrations concurrently
            const [coursesRes, myRegsRes] = await Promise.all([
                api.get('/courses'),
                api.get('/my-courses').catch(() => ({ data: { data: [] } })) // Fallback if no registrations exist yet
            ]);

            const courseData = coursesRes.data.courses || coursesRes.data || [];
            const myRegistrations = myRegsRes.data.data || [];

            // 2. Build a map of courseId -> registration status
            const statusMap = {};
            myRegistrations.forEach((reg) => {
                const status = reg.status || 'Pending';
                reg.courses?.forEach((c) => {
                    const id = c.courseId || c._id;
                    if (id) statusMap[id] = status;
                });
            });

            setCourses(courseData);
            setRegisteredStatusMap(statusMap);
        } catch (err) {
            console.error('Failed to fetch courses:', err);
            setError(err.response?.data?.message || 'Failed to load courses from database.');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchCoursesAndStatus();
    }, []);

    // ── Selection Logic ───────────────────────────────────────────────────
    const [isCartModalOpen, setIsCartModalOpen] = useState(false);
    const [submitting, setSubmitting] = useState(false);

    const toggleCourseSelect = (courseId) => {
        // Prevent selection if already registered or pending
        if (registeredStatusMap[courseId]) return;

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

    // ── Handle Submit Registration ────────────────────────────────────────
    const handleRegister = async () => {
        try {
            setSubmitting(true);
            const token = localStorage.getItem('studentToken') || localStorage.getItem('token');

            if (!token) {
                alert('Authentication error: Please log in again.');
                return;
            }

            const selectedCoursesData = courses.filter((c) => selectedCourseIds.includes(c._id));

            if (selectedCoursesData.length === 0) {
                alert('Please select at least one course to register.');
                return;
            }

            const payload = {
                academicSession: '2025/2026',
                semester: 'First Semester',
                courses: selectedCoursesData.map((course) => ({
                    courseId: course._id,
                    courseCode: course.courseCode,
                    courseTitle: course.courseTitle,
                    unit: Number(course.unit) || Number(course.units) || 3,
                })),
            };

            const response = await api.post(
                '/submit-course-registration',
                payload
            );

            console.log('Registration Success:', response.data);
            setIsCartModalOpen(false);
            navigate('/registration-success', { state: { registration: response.data.data } });

        } catch (err) {
            console.error('Failed to register courses:', err);
            const errorMessage = err.response?.data?.message || 'Failed to register courses';
            alert(errorMessage);
        } finally {
            setSubmitting(false);
        }
    };

    const selectedCoursesList = courses.filter((c) => selectedCourseIds.includes(c._id));
    const totalUnits = selectedCoursesList.reduce((sum, c) => sum + (Number(c.unit) || Number(c.units) || 0), 0);

    return (
        <div className="min-h-screen bg-[#f3f7f5] font-sans text-[#2d3748] relative flex flex-col">
            
            {/* Main Content Area */}
            <main className="max-w-7xl mx-auto w-full px-6 pt-6 pb-48 md:pb-40 space-y-6 flex-grow">

                <div className="flex justify-between items-center">
                    <BackButton to="/student/dashboard" label="Back to Student Dashboard" />
                </div>

                {/* Search Bar */}
                <div className="relative max-w-2xl" data-aos="fade-down" data-aos-duration="500">
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
                <div className="flex flex-wrap gap-2.5 items-center" data-aos="fade-down" data-aos-delay="100">
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
                    <div className="bg-red-50 text-red-600 p-4 rounded-xl text-sm border border-red-200" data-aos="shake">
                        {error}
                    </div>
                )}

                {/* Course Grid */}
                {loading ? (
                    <div className="text-center py-20 text-gray-500 font-medium">
                        Loading courses from database...
                    </div>
                ) : filteredCourses.length === 0 ? (
                    <div className="text-center py-20 text-gray-400 font-medium" data-aos="fade-up">
                        No courses found matching your criteria.
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 pt-2">
                        {filteredCourses.map((course, cIdx) => {
                            const courseId = course._id;
                            const isSelected = selectedCourseIds.includes(courseId);
                            const registrationStatus = registeredStatusMap[courseId]; // "Approved", "Pending", or undefined

                            const enrolled = course.enrolled ?? 0;
                            const capacity = course.capacity ?? 60;
                            const isFull = enrolled >= capacity;
                            const percentFilled = Math.min(100, (enrolled / capacity) * 100);
                            const units = course.unit || course.units || 3;

                            return (
                                <div
                                    key={courseId}
                                    data-aos="fade-up"
                                    data-aos-delay={(cIdx % 6) * 70}
                                    className={`bg-white rounded-2xl border transition-all flex flex-col justify-between overflow-hidden shadow-sm ${
                                        isSelected
                                            ? 'border-[#0a643a] ring-2 ring-[#0a643a]/20'
                                            : registrationStatus === 'Approved'
                                            ? 'border-emerald-200 bg-emerald-50/20'
                                            : registrationStatus === 'Pending'
                                            ? 'border-amber-200 bg-amber-50/20'
                                            : 'border-gray-200'
                                    }`}
                                >
                                    <div className="p-5 space-y-4">
                                        <div className="flex justify-between items-center">
                                            <span className="text-xs font-bold text-gray-400 tracking-wider">
                                                {course.courseCode}
                                            </span>
                                            
                                            {/* Top Status Badge */}
                                            {isSelected && (
                                                <span className="bg-[#0a643a] text-white text-[10px] font-extrabold px-2.5 py-0.5 rounded-full tracking-wider uppercase">
                                                    SELECTED
                                                </span>
                                            )}
                                            {registrationStatus === 'Approved' && (
                                                <span className="bg-emerald-100 text-emerald-800 border border-emerald-300 text-[10px] font-extrabold px-2.5 py-0.5 rounded-full tracking-wider uppercase">
                                                    REGISTERED
                                                </span>
                                            )}
                                            {registrationStatus === 'Pending' && (
                                                <span className="bg-amber-100 text-amber-800 border border-amber-300 text-[10px] font-extrabold px-2.5 py-0.5 rounded-full tracking-wider uppercase">
                                                    PENDING
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

                                    {/* Action Buttons */}
                                    <div>
                                        {registrationStatus === 'Approved' ? (
                                            <button
                                                disabled
                                                className="w-full bg-emerald-50 text-emerald-800 border-t border-emerald-200 py-3 text-xs font-bold flex items-center justify-center gap-1.5 cursor-default"
                                            >
                                                <span className="material-symbols-outlined text-base text-emerald-600">
                                                    check_circle
                                                </span>
                                                Course Registered
                                            </button>
                                        ) : registrationStatus === 'Pending' ? (
                                            <button
                                                disabled
                                                className="w-full bg-amber-500 text-white py-3 text-xs font-bold flex items-center justify-center gap-1.5 cursor-not-allowed"
                                            >
                                                <span className="material-symbols-outlined text-base">
                                                    schedule
                                                </span>
                                                Registration Pending
                                            </button>
                                        ) : isFull ? (
                                            <button
                                                disabled
                                                className="w-full bg-gray-100 text-gray-400 py-3 text-xs font-semibold flex items-center justify-center gap-2 cursor-not-allowed border-t border-gray-100"
                                            >
                                                <span className="material-symbols-outlined text-sm">
                                                    hourglass_empty
                                                </span>
                                                Class Full
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

            {/* Floating Summary Bar (Only shown when courses are selected) */}
            {selectedCourseIds.length > 0 && (
                <div className="fixed bottom-6 left-1/2 -translate-x-1/2 w-[92%] max-w-2xl bg-[#1e2925] text-white rounded-2xl p-3.5 shadow-2xl flex flex-col sm:flex-row items-center justify-between border border-emerald-900/60 z-40 gap-3 backdrop-blur-md animate-fade-in">
                    <div className="flex items-center gap-3 w-full sm:w-auto">
                        <div className="bg-[#0a643a] p-2.5 rounded-xl flex items-center justify-center shrink-0">
                            <span className="material-symbols-outlined text-white text-lg">
                                shopping_bag
                            </span>
                        </div>

                        <div>
                            <p className="text-[11px] text-emerald-300 font-medium">
                                Registration Cart
                            </p>
                            <p className="text-sm font-bold text-white tracking-wide">
                                {totalUnits} Units Selected{' '}
                                <span className="text-gray-400 font-normal mx-1">•</span>{' '}
                                {selectedCourseIds.length}{' '}
                                {selectedCourseIds.length === 1 ? 'Course' : 'Courses'}
                            </p>
                        </div>
                    </div>

                    <div className="flex items-center gap-2.5 w-full sm:w-auto justify-end">
                        <button 
                            onClick={() => setIsCartModalOpen(true)}
                            className="flex-1 sm:flex-none px-4 py-2.5 rounded-xl text-xs font-semibold bg-white/10 hover:bg-white/20 border border-white/20 text-gray-100 transition-colors flex items-center justify-center gap-1.5 cursor-pointer"
                        >
                            <span className="material-symbols-outlined text-base">visibility</span>
                            <span>View Cart</span>
                        </button>

                        <button 
                            onClick={handleRegister} 
                            disabled={submitting}
                            className="flex-1 sm:flex-none px-5 py-2.5 rounded-xl text-xs font-bold bg-[#6ee7b7] hover:bg-[#5ee0ad] disabled:opacity-50 text-[#0d1f18] transition-colors cursor-pointer shadow-sm flex items-center justify-center gap-1.5"
                        >
                            <span className="material-symbols-outlined text-base">how_to_reg</span>
                            <span>{submitting ? 'Registering...' : 'Finalize Registration'}</span>
                        </button>
                    </div>
                </div>
            )}

            {/* View Cart Modal */}
            {isCartModalOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4 animate-fade-in">
                    <div className="bg-white rounded-2xl w-full max-w-lg shadow-2xl overflow-hidden flex flex-col max-h-[85vh] border border-gray-100">
                        {/* Modal Header */}
                        <div className="bg-[#0a643a] text-white p-5 flex items-center justify-between">
                            <div className="flex items-center gap-2.5">
                                <span className="material-symbols-outlined text-2xl">shopping_cart</span>
                                <div>
                                    <h3 className="font-bold text-base">Selected Courses ({selectedCourseIds.length})</h3>
                                    <p className="text-xs text-emerald-100">{totalUnits} Total Credit Units</p>
                                </div>
                            </div>
                            <button 
                                onClick={() => setIsCartModalOpen(false)}
                                className="p-1 rounded-lg hover:bg-white/20 text-white transition-colors cursor-pointer"
                            >
                                <span className="material-symbols-outlined text-xl">close</span>
                            </button>
                        </div>

                        {/* Modal Course List */}
                        <div className="p-5 overflow-y-auto space-y-3 flex-grow divide-y divide-gray-100">
                            {selectedCoursesList.map((course) => (
                                <div key={course._id} className="pt-3 first:pt-0 flex items-center justify-between gap-3">
                                    <div>
                                        <div className="flex items-center gap-2 mb-0.5">
                                            <span className="text-xs font-black font-mono px-2 py-0.5 rounded bg-emerald-50 text-[#0a643a] border border-emerald-200">
                                                {course.courseCode}
                                            </span>
                                            <span className="text-xs text-slate-500 font-medium">
                                                {course.unit || course.units || 3} Units
                                            </span>
                                        </div>
                                        <h4 className="text-sm font-bold text-slate-800 line-clamp-1">{course.courseTitle}</h4>
                                        <p className="text-xs text-slate-400">{course.department}</p>
                                    </div>

                                    <button
                                        onClick={() => toggleCourseSelect(course._id)}
                                        className="text-red-500 hover:bg-red-50 p-2 rounded-xl transition-colors cursor-pointer shrink-0"
                                        title="Remove from cart"
                                    >
                                        <span className="material-symbols-outlined text-lg">delete</span>
                                    </button>
                                </div>
                            ))}
                        </div>

                        {/* Modal Footer */}
                        <div className="p-4 bg-slate-50 border-t border-slate-100 flex items-center justify-between gap-3">
                            <button
                                onClick={() => setSelectedCourseIds([])}
                                className="px-4 py-2.5 text-xs font-bold text-slate-600 hover:bg-slate-200 rounded-xl transition-colors cursor-pointer"
                            >
                                Clear All
                            </button>

                            <div className="flex items-center gap-2">
                                <button
                                    onClick={() => setIsCartModalOpen(false)}
                                    className="px-4 py-2.5 text-xs font-bold text-slate-700 bg-white border border-slate-200 hover:bg-slate-50 rounded-xl transition-colors cursor-pointer"
                                >
                                    Add More
                                </button>

                                <button
                                    onClick={handleRegister}
                                    disabled={submitting}
                                    className="px-5 py-2.5 text-xs font-bold text-white bg-[#0a643a] hover:bg-[#084f2e] disabled:opacity-50 rounded-xl transition-colors shadow-sm cursor-pointer flex items-center gap-1.5"
                                >
                                    <span className="material-symbols-outlined text-base">how_to_reg</span>
                                    <span>{submitting ? 'Registering...' : 'Finalize Registration'}</span>
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}