import { useLocation, useNavigate } from 'react-router-dom';

export default function RegistrationSuccess() {
    const navigate = useNavigate();
    const location = useLocation();
    const reg = location.state?.registration;

    const handlePrint = () => {
        window.print();
    };
    if (!reg) {
        return (
            <div className="min-h-screen bg-[#f3f7f5] flex items-center justify-center p-6 text-center font-sans">
                <div className="bg-white p-8 rounded-2xl shadow-sm max-w-md w-full border border-gray-200">
                    <h2 className="text-xl font-bold text-gray-800 mb-2">No Registration Data Found</h2>
                    <p className="text-sm text-gray-500 mb-6">
                        It looks like you arrived at this page directly or refreshed the browser.
                    </p>
                    <button
                        onClick={() => navigate('/dashboard')}
                        className="bg-[#0a643a] text-white px-6 py-2.5 rounded-xl text-xs font-bold w-full"
                    >
                        Go to Dashboard
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-[#f3f7f5] flex items-center justify-center p-6 relative overflow-hidden font-sans text-[#2d3748]">

            {/* ── Background Confetti Dots (Decorative Elements) ──────────── */}
            <div className="absolute inset-0 pointer-events-none opacity-40">
                <div className="absolute top-12 left-10 w-2 h-2 bg-[#0a643a] rotate-45"></div>
                <div className="absolute top-24 left-1/4 w-1.5 h-1.5 bg-[#6ee7b7] rounded-full"></div>
                <div className="absolute top-1/3 left-12 w-2.5 h-2.5 bg-[#0a643a] rotate-12"></div>
                <div className="absolute bottom-20 left-1/6 w-2 h-2 bg-[#10b981] rotate-45"></div>
                <div className="absolute top-16 right-16 w-2 h-2 bg-[#0a643a] rotate-45"></div>
                <div className="absolute top-1/4 right-1/3 w-2.5 h-2.5 bg-[#6ee7b7] rotate-12"></div>
                <div className="absolute bottom-32 right-12 w-2 h-2 bg-[#0a643a] rotate-45"></div>
                <div className="absolute bottom-12 right-1/4 w-1.5 h-1.5 bg-[#10b981]"></div>
            </div>

            {/* ── Main Confirmation Card ─────────────────────────────────── */}
            <div className="max-w-xl w-full flex flex-col items-center text-center z-10 relative">

                {/* Checkmark Icon Container */}
                <div className="w-20 h-20 bg-[#d1fae5] rounded-2xl flex items-center justify-center mb-6 shadow-sm border border-[#a7f3d0]">
                    <div className="w-14 h-14 bg-[#0a643a] rounded-xl flex items-center justify-center shadow-md">
                        <span className="material-symbols-outlined text-white text-3xl font-bold">
                            check
                        </span>
                    </div>
                </div>

                {/* Main Heading */}
                <h1 className="text-3xl font-extrabold text-[#0a643a] tracking-tight mb-2">
                    Registration Confirmed!
                </h1>

                <p className="text-sm text-gray-500 font-medium mb-8">
                    You have successfully enrolled in your selected courses for the{' '}
                    <span className="font-bold text-gray-700">{reg.semester}</span> semester.
                </p>

                {/* Enrolled Courses Box */}
                <div className="w-full bg-white rounded-2xl border border-gray-200 shadow-sm p-6 text-left mb-8">

                    {/* Header bar inside card */}
                    <div className="flex items-center justify-between pb-4 border-b border-gray-100 mb-5">
                        <span className="text-xs font-bold text-gray-400 tracking-wider uppercase">
                            ENROLLED COURSES
                        </span>
                        <span className={`text-xs font-bold px-3 py-1 rounded-full flex items-center gap-1 ${reg?.status === 'Approved'
                                ? 'bg-emerald-100 text-emerald-800'
                                : reg?.status === 'Pending'
                                    ? 'bg-amber-100 text-amber-800'
                                    : 'bg-rose-100 text-rose-800'
                            }`}>
                            <span className="material-symbols-outlined text-sm">
                                {reg?.status === 'Approved' ? 'check_circle' : reg?.status === 'Pending' ? 'schedule' : 'cancel'}
                            </span>
                            {reg?.status || 'Pending'}
                        </span>
                    </div>

                    {/* Course Items */}
                    <div className="space-y-4 mb-6">
                        {reg.courses.map((course, idx) => (
                            <div key={idx} className="flex items-start gap-3.5">
                                <div className="bg-[#a7f3d0]/40 text-[#0a643a] p-2.5 rounded-xl flex items-center justify-center border border-[#a7f3d0]/60">
                                    <span className="material-symbols-outlined text-lg">
                                        terminal
                                    </span>
                                </div>
                                <div>
                                    <h4 className="text-base font-bold text-gray-800 leading-snug">
                                        {course.courseCode}: {course.courseTitle}
                                    </h4>
                                    <p className="text-xs text-gray-400 font-medium">
                                        Instructor: {course.instructor || 'Department Faculty'}
                                    </p>
                                </div>
                            </div>
                        ))}
                    </div>

                    <hr className="border-gray-100 my-4" />

                    {/* Registration Meta Grid */}
                    <div className="grid grid-cols-2 gap-y-4 pt-1">
                        <div>
                            <p className="text-[11px] text-gray-400 font-semibold tracking-wide uppercase">
                                Total Units
                            </p>
                            <p className="text-base font-extrabold text-gray-800">
                                {reg.totalUnits} Units
                            </p>
                        </div>

                        <div>
                            <p className="text-[11px] text-gray-400 font-semibold tracking-wide uppercase">
                                Semester
                            </p>
                            <p className="text-base font-extrabold text-[#0a643a]">
                                {reg.semester}
                            </p>
                        </div>

                        <div>
                            <p className="text-[11px] text-gray-400 font-semibold tracking-wide uppercase">
                                Enrollment ID
                            </p>
                            <p className="text-xs font-bold text-gray-600 font-mono tracking-tight mt-0.5">
                                {reg._id}
                            </p>
                        </div>

                        <div>
                            <p className="text-[11px] text-gray-400 font-semibold tracking-wide uppercase">
                                Status
                            </p>
                            <p className="text-xs font-bold text-gray-700 mt-0.5">
                                {reg.status}
                            </p>
                        </div>
                    </div>
                </div>

                {/* Action Buttons */}
                <div className="flex flex-col sm:flex-row items-center gap-3 w-full mb-6">
                    <button
                        onClick={() => navigate('/dashboard')}
                        className="w-full sm:w-1/2 bg-[#0a643a] hover:bg-[#08522f] text-white py-3 px-4 rounded-xl font-bold text-xs flex items-center justify-center gap-2 transition-all shadow-sm cursor-pointer"
                    >
                        <span className="material-symbols-outlined text-base">dashboard</span>
                        Go to Dashboard
                    </button>

                    <button
                        onClick={() => navigate('/schedule')}
                        className="w-full sm:w-1/2 bg-white hover:bg-gray-50 text-[#0a643a] border border-[#0a643a] py-3 px-4 rounded-xl font-bold text-xs flex items-center justify-center gap-2 transition-all shadow-sm cursor-pointer"
                    >
                        <span className="material-symbols-outlined text-base">calendar_today</span>
                        View My Schedule
                    </button>
                </div>

                {/* Footer Print Instruction */}
                <button
                    onClick={handlePrint}
                    className="flex items-center gap-1.5 text-xs text-gray-400 hover:text-gray-600 transition-colors cursor-pointer"
                >
                    <span className="material-symbols-outlined text-base">print</span>
                    <span>Please print this confirmation or save the PDF for your academic records.</span>
                </button>
            </div>
        </div>
    );
}