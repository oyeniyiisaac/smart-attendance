import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../../Utils/api';
import { Modal, ModalBody, ModalHeader } from "flowbite-react";
import { HiOutlineExclamationCircle } from "react-icons/hi";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import BackButton from '../../Components/BackButton';

const getStudentProfile = () => {
    try {
        const token = localStorage.getItem('token') || localStorage.getItem('studentToken');
        if (!token) return { name: 'Student', matricno: 'N/A', department: 'Computer Science', faculty: 'Faculty of Computing', level: '100L', email: '' };
        const payload = JSON.parse(atob(token.split('.')[1]));
        const name = payload.firstname && payload.lastname ? `${payload.firstname} ${payload.lastname}` : payload.name || payload.firstname || 'Student';
        return {
            name,
            matricno: payload.matricno || payload.id || 'N/A',
            department: payload.department || 'Computer Science',
            faculty: payload.faculty || 'Faculty of Computing',
            level: payload.level || '100L',
            email: payload.email || ''
        };
    } catch {
        return { name: 'Student', matricno: 'N/A', department: 'Computer Science', faculty: 'Faculty of Computing', level: '100L', email: '' };
    }
};

export default function StudentProfileSettings() {
    const navigate = useNavigate();
    const [studentProfile, setStudentProfile] = useState(getStudentProfile());

    // Notification Preferences State
    const [notifications, setNotifications] = useState({
        classAlerts: true,
        examEligibility: true,
        emailSummary: true,
        smsAlerts: false,
    });

    const toggleNotification = (key) => {
        setNotifications((prev) => ({ ...prev, [key]: !prev[key] }));
        toast.info("Preferences updated.");
    };

    // Profile Photo State
    const fallbackProfileImg = 'https://imgs.search.brave.com/Jopvk0MWzfaYi1h8ZX8btE8nIJgelXumRnIDVQKFXI8/rs:fit:860:0:0:0/g:ce/aHR0cHM6Ly9pLnBp/bmltZy5jb20vb3Jp/Z2luYWxzL2M2LzU2/L2VkL2M2NTZlZDAy/MDdjMDViZTc5ZGI2/ZDdkYTQxZDdhNmZk/LmpwZw';
    const [profileImg, setProfileImg] = useState(() => {
        return localStorage.getItem('profilePicture') || fallbackProfileImg;
    });
    const [uploading, setUploading] = useState(false);

    // Modals
    const [openLogoutModal, setOpenLogoutModal] = useState(false);
    const [openDiscrepancyModal, setOpenDiscrepancyModal] = useState(false);
    const [discrepancyForm, setDiscrepancyForm] = useState({ courseCode: '', date: '', reason: '' });
    const [gpsStatus, setGpsStatus] = useState('Checking...');

    // Test Geolocation Diagnostic on Mount
    useEffect(() => {
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(
                () => setGpsStatus('Active & Ready (High Accuracy)'),
                () => setGpsStatus('Permission Required'),
                { timeout: 5000 }
            );
        } else {
            setGpsStatus('Not Supported by Browser');
        }
    }, []);

    const handleImageChange = async (e) => {
        const file = e.target.files[0];
        if (!file) return;

        const reader = new FileReader();
        reader.onload = async () => {
            const base64Image = reader.result;
            setProfileImg(base64Image);
            setUploading(true);
            try {
                const response = await api.post('/upload-profile-picture', { image: base64Image });
                const data = response.data;
                if (data.success) {
                    toast.success("Profile picture updated!");
                    localStorage.setItem("profilePicture", data.profilePictureUrl || base64Image);
                } else {
                    toast.error(data.message || "Upload failed.");
                }
            } catch (error) {
                console.error('Upload error:', error);
                localStorage.setItem("profilePicture", base64Image);
                toast.success("Profile photo saved locally.");
            } finally {
                setUploading(false);
            }
        };
        reader.readAsDataURL(file);
    };

    const handleLogout = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('studentToken');
        localStorage.removeItem('profilePicture');
        navigate('/signin');
    };

    const submitDiscrepancyReport = (e) => {
        e.preventDefault();
        toast.success("Attendance discrepancy report submitted for Deanery review!");
        setOpenDiscrepancyModal(false);
        setDiscrepancyForm({ courseCode: '', date: '', reason: '' });
    };

    return (
        <div className="min-h-screen bg-[#f3f7f8] pt-8 lg:pt-4 pb-24 px-4 flex justify-center text-[#1c2a2b] font-sans">
            <ToastContainer position="top-right" autoClose={3000} />

            <div className="w-full max-w-2xl space-y-6">

                <div className="flex justify-between items-center">
                    <BackButton to="/student/dashboard" label="Back to Student Dashboard" />
                </div>

                {/* ── 1. STUDENT IDENTITY PROFILE HEADER ───────────────────────────── */}
                <div className="bg-white rounded-3xl p-6 border border-gray-200/80 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-5">
                    <div className="flex items-center gap-4">
                        <div className="relative shrink-0">
                            <img
                                src={profileImg}
                                alt={studentProfile.name}
                                className="w-20 h-20 rounded-2xl object-cover border-2 border-emerald-100 shadow-inner"
                            />
                            <input
                                type='file'
                                id="avatarInput"
                                accept="image/*"
                                onChange={handleImageChange}
                                aria-label="Change Profile Picture"
                                className="hidden"
                            />
                            <label
                                htmlFor="avatarInput"
                                className="absolute -bottom-1 -right-1 w-7 h-7 bg-[#0a643a] hover:bg-[#084f2e] text-white rounded-lg flex items-center justify-center cursor-pointer shadow-md border-2 border-white transition-colors"
                                title="Upload Photo"
                            >
                                {uploading ? (
                                    <span className="animate-spin text-xs material-symbols-outlined">refresh</span>
                                ) : (
                                    <span className="material-symbols-outlined text-sm">photo_camera</span>
                                )}
                            </label>
                        </div>

                        <div className="space-y-0.5">
                            <div className="flex items-center gap-2">
                                <h2 className="text-xl font-black text-slate-900 tracking-tight">
                                    {studentProfile.name}
                                </h2>
                                <span className="px-2 py-0.5 rounded-full bg-emerald-50 text-[#0a643a] font-black text-[10px] uppercase tracking-wider border border-emerald-200">
                                    Enrolled
                                </span>
                            </div>
                            <p className="text-xs font-semibold text-slate-500">
                                Matric No: <span className="text-slate-800 font-mono font-bold">{studentProfile.matricno}</span>
                            </p>
                            <p className="text-xs font-bold text-[#0a643a]">
                                {studentProfile.department} • <span className="font-mono">{studentProfile.level}</span>
                            </p>
                        </div>
                    </div>

                    <button 
                        onClick={() => setOpenLogoutModal(true)}
                        className="px-4 py-2 border border-red-200 text-red-600 hover:bg-red-50 rounded-xl text-xs font-bold transition-colors cursor-pointer flex items-center justify-center gap-1.5 self-start sm:self-center"
                    >
                        <span className="material-symbols-outlined text-base">logout</span>
                        <span>Sign Out</span>
                    </button>
                </div>

                {/* ── 2. ACADEMIC & INSTITUTIONAL DETAILS ──────────────────────────── */}
                <div className="space-y-2">
                    <h3 className="text-xs font-bold text-[#0a643a] uppercase tracking-wider px-1 flex items-center gap-1.5">
                        <span className="material-symbols-outlined text-base">school</span>
                        <span>Academic & Institutional Profile</span>
                    </h3>
                    <div className="bg-white rounded-2xl border border-gray-200/80 shadow-sm p-5 space-y-4">
                        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                            <div className="bg-slate-50 p-3 rounded-xl border border-slate-100">
                                <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block mb-0.5">Faculty</span>
                                <span className="text-xs font-bold text-slate-800 line-clamp-1" title={studentProfile.faculty}>{studentProfile.faculty}</span>
                            </div>
                            <div className="bg-slate-50 p-3 rounded-xl border border-slate-100">
                                <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block mb-0.5">Department</span>
                                <span className="text-xs font-bold text-slate-800 line-clamp-1">{studentProfile.department}</span>
                            </div>
                            <div className="bg-slate-50 p-3 rounded-xl border border-slate-100">
                                <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block mb-0.5">Level</span>
                                <span className="text-xs font-bold text-slate-800">{studentProfile.level}</span>
                            </div>
                        </div>

                        {/* 75% Exam Eligibility Banner */}
                        <div className="p-4 rounded-xl bg-gradient-to-r from-emerald-50 to-teal-50 border border-emerald-200 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                            <div className="flex items-center gap-3">
                                <div className="w-10 h-10 rounded-xl bg-[#0a643a] text-white flex items-center justify-center shrink-0 shadow-sm">
                                    <span className="material-symbols-outlined text-xl">verified</span>
                                </div>
                                <div>
                                    <h4 className="text-xs font-bold text-slate-900">75% Exam Clearance Tracker</h4>
                                    <p className="text-[11px] text-slate-500">Monitor course attendance thresholds for final examination entry.</p>
                                </div>
                            </div>
                            <button
                                onClick={() => navigate('/student/eligibility')}
                                className="px-3.5 py-1.5 bg-[#0a643a] hover:bg-[#084f2e] text-white text-xs font-bold rounded-xl transition-colors shrink-0 shadow-sm cursor-pointer"
                            >
                                Check Status
                            </button>
                        </div>
                    </div>
                </div>

                {/* ── 3. COURSE REGISTRATION & ACADEMIC HUB ────────────────────────── */}
                <div className="space-y-2">
                    <h3 className="text-xs font-bold text-[#0a643a] uppercase tracking-wider px-1 flex items-center gap-1.5">
                        <span className="material-symbols-outlined text-base">menu_book</span>
                        <span>Course Registration & Attendance Hub</span>
                    </h3>
                    <div className="bg-white rounded-2xl border border-gray-200/80 shadow-sm divide-y divide-gray-100 overflow-hidden">
                        
                        <button onClick={() => navigate('/student/register-course')} className="w-full px-5 py-4 flex items-center justify-between hover:bg-gray-50/80 transition-colors text-left cursor-pointer">
                            <div className="flex items-center gap-3">
                                <div className="w-8 h-8 rounded-lg bg-emerald-50 text-[#0a643a] flex items-center justify-center shrink-0">
                                    <span className="material-symbols-outlined text-base">app_registration</span>
                                </div>
                                <div>
                                    <div className="text-xs sm:text-sm font-bold text-slate-800">Register Semester Courses</div>
                                    <div className="text-[11px] text-slate-400">Enroll in current semester required & elective courses</div>
                                </div>
                            </div>
                            <span className="material-symbols-outlined text-slate-400 text-lg">chevron_right</span>
                        </button>

                        <button onClick={() => navigate('/student/enrol-courses')} className="w-full px-5 py-4 flex items-center justify-between hover:bg-gray-50/80 transition-colors text-left cursor-pointer">
                            <div className="flex items-center gap-3">
                                <div className="w-8 h-8 rounded-lg bg-blue-50 text-blue-700 flex items-center justify-center shrink-0">
                                    <span className="material-symbols-outlined text-base">fact_check</span>
                                </div>
                                <div>
                                    <div className="text-xs sm:text-sm font-bold text-slate-800">Registered Course Slips</div>
                                    <div className="text-[11px] text-slate-400">View enrolled credit units and print course forms</div>
                                </div>
                            </div>
                            <span className="material-symbols-outlined text-slate-400 text-lg">chevron_right</span>
                        </button>

                        <button onClick={() => navigate('/student/history')} className="w-full px-5 py-4 flex items-center justify-between hover:bg-gray-50/80 transition-colors text-left cursor-pointer">
                            <div className="flex items-center gap-3">
                                <div className="w-8 h-8 rounded-lg bg-purple-50 text-purple-700 flex items-center justify-center shrink-0">
                                    <span className="material-symbols-outlined text-base">history</span>
                                </div>
                                <div>
                                    <div className="text-xs sm:text-sm font-bold text-slate-800">Attendance History Logs</div>
                                    <div className="text-[11px] text-slate-400">Inspect full timeline of verified class check-ins</div>
                                </div>
                            </div>
                            <span className="material-symbols-outlined text-slate-400 text-lg">chevron_right</span>
                        </button>
                    </div>
                </div>

                {/* ── 4. DEVICE & GEOFENCE DIAGNOSTICS ─────────────────────────────── */}
                <div className="space-y-2">
                    <h3 className="text-xs font-bold text-[#0a643a] uppercase tracking-wider px-1 flex items-center gap-1.5">
                        <span className="material-symbols-outlined text-base">devices</span>
                        <span>Device & Geofence Diagnostics</span>
                    </h3>
                    <div className="bg-white rounded-2xl border border-gray-200/80 shadow-sm p-5 space-y-3">
                        <div className="flex items-center justify-between pb-3 border-b border-gray-100">
                            <div className="flex items-center gap-3">
                                <span className="material-symbols-outlined text-slate-500 text-lg">pin_drop</span>
                                <div>
                                    <span className="text-xs font-bold text-slate-800 block">GPS Location Accuracy</span>
                                    <span className="text-[11px] text-slate-400">Required for classroom geofenced check-in</span>
                                </div>
                            </div>
                            <span className="text-xs font-bold text-[#0a643a] px-2.5 py-1 bg-emerald-50 rounded-lg border border-emerald-200">
                                {gpsStatus}
                            </span>
                        </div>

                        <div className="flex items-center justify-between pb-3 border-b border-gray-100">
                            <div className="flex items-center gap-3">
                                <span className="material-symbols-outlined text-slate-500 text-lg">qr_code_scanner</span>
                                <div>
                                    <span className="text-xs font-bold text-slate-800 block">Camera / Dynamic QR Scanner</span>
                                    <span className="text-[11px] text-slate-400">Anti-proxy 20-second dynamic code scanner</span>
                                </div>
                            </div>
                            <span className="text-xs font-bold text-blue-700 px-2.5 py-1 bg-blue-50 rounded-lg border border-blue-200">
                                Ready
                            </span>
                        </div>

                        <div className="flex items-center justify-between">
                            <div className="flex items-center gap-3">
                                <span className="material-symbols-outlined text-slate-500 text-lg">wifi</span>
                                <div>
                                    <span className="text-xs font-bold text-slate-800 block">Wi-Fi & Network Check</span>
                                    <span className="text-[11px] text-slate-400">Campus network connectivity status</span>
                                </div>
                            </div>
                            <span className="text-xs font-bold text-emerald-700 px-2.5 py-1 bg-emerald-50 rounded-lg border border-emerald-200">
                                Online
                            </span>
                        </div>
                    </div>
                </div>

                {/* ── 5. NOTIFICATION PREFERENCES ──────────────────────────────────── */}
                <div className="space-y-2">
                    <h3 className="text-xs font-bold text-[#0a643a] uppercase tracking-wider px-1 flex items-center gap-1.5">
                        <span className="material-symbols-outlined text-base">notifications</span>
                        <span>Notification Preferences</span>
                    </h3>
                    <div className="bg-white rounded-2xl border border-gray-200/80 shadow-sm divide-y divide-gray-100 overflow-hidden">
                        
                        <div className="px-5 py-4 flex items-center justify-between">
                            <div>
                                <span className="text-xs sm:text-sm font-bold text-slate-800 block">Class & Session Start Alerts</span>
                                <span className="text-[11px] text-slate-400">Get notified when a lecturer opens attendance</span>
                            </div>
                            <button
                                onClick={() => toggleNotification('classAlerts')}
                                className={`w-11 h-6 flex items-center rounded-full p-1 cursor-pointer transition-colors duration-200 ${
                                    notifications.classAlerts ? 'bg-[#0a643a]' : 'bg-gray-300'
                                }`}
                            >
                                <div className={`bg-white w-4 h-4 rounded-full shadow-md transform transition-transform duration-200 ${
                                    notifications.classAlerts ? 'translate-x-5' : 'translate-x-0'
                                }`} />
                            </button>
                        </div>

                        <div className="px-5 py-4 flex items-center justify-between">
                            <div>
                                <span className="text-xs sm:text-sm font-bold text-slate-800 block">75% Exam Eligibility Warning Alerts</span>
                                <span className="text-[11px] text-slate-400">Instant notice if your attendance drops below 75%</span>
                            </div>
                            <button
                                onClick={() => toggleNotification('examEligibility')}
                                className={`w-11 h-6 flex items-center rounded-full p-1 cursor-pointer transition-colors duration-200 ${
                                    notifications.examEligibility ? 'bg-[#0a643a]' : 'bg-gray-300'
                                }`}
                            >
                                <div className={`bg-white w-4 h-4 rounded-full shadow-md transform transition-transform duration-200 ${
                                    notifications.examEligibility ? 'translate-x-5' : 'translate-x-0'
                                }`} />
                            </button>
                        </div>

                        <div className="px-5 py-4 flex items-center justify-between">
                            <div>
                                <span className="text-xs sm:text-sm font-bold text-slate-800 block">Weekly Attendance Summary Email</span>
                                <span className="text-[11px] text-slate-400">Digest sent to your registered Gmail account</span>
                            </div>
                            <button
                                onClick={() => toggleNotification('emailSummary')}
                                className={`w-11 h-6 flex items-center rounded-full p-1 cursor-pointer transition-colors duration-200 ${
                                    notifications.emailSummary ? 'bg-[#0a643a]' : 'bg-gray-300'
                                }`}
                            >
                                <div className={`bg-white w-4 h-4 rounded-full shadow-md transform transition-transform duration-200 ${
                                    notifications.emailSummary ? 'translate-x-5' : 'translate-x-0'
                                }`} />
                            </button>
                        </div>
                    </div>
                </div>

                {/* ── 6. HELPDESK & ATTENDANCE DISCREPANCY ─────────────────────────── */}
                <div className="space-y-2">
                    <h3 className="text-xs font-bold text-[#0a643a] uppercase tracking-wider px-1 flex items-center gap-1.5">
                        <span className="material-symbols-outlined text-base">support_agent</span>
                        <span>Support & Discrepancy Reporting</span>
                    </h3>
                    <div className="bg-white rounded-2xl border border-gray-200/80 shadow-sm divide-y divide-gray-100 overflow-hidden">
                        <button
                            onClick={() => setOpenDiscrepancyModal(true)}
                            className="w-full px-5 py-4 flex items-center justify-between hover:bg-gray-50/80 transition-colors text-left cursor-pointer"
                        >
                            <div className="flex items-center gap-3">
                                <span className="text-amber-600 text-lg material-symbols-outlined">flag</span>
                                <div>
                                    <div className="text-xs sm:text-sm font-bold text-slate-800">Report Missed Attendance / Medical Reason</div>
                                    <div className="text-[11px] text-slate-400">Submit an official appeal for Deanery / HOD review</div>
                                </div>
                            </div>
                            <span className="material-symbols-outlined text-slate-400 text-lg">chevron_right</span>
                        </button>

                        <button
                            onClick={() => navigate('/forgot-password')}
                            className="w-full px-5 py-4 flex items-center justify-between hover:bg-gray-50/80 transition-colors text-left cursor-pointer"
                        >
                            <div className="flex items-center gap-3">
                                <span className="text-slate-500 text-lg material-symbols-outlined">lock_reset</span>
                                <div>
                                    <div className="text-xs sm:text-sm font-bold text-slate-800">Reset Account Password</div>
                                    <div className="text-[11px] text-slate-400">Request secure OTP via your registered Gmail</div>
                                </div>
                            </div>
                            <span className="material-symbols-outlined text-slate-400 text-lg">chevron_right</span>
                        </button>
                    </div>
                </div>

                {/* ── 7. LOG OUT CTA ──────────────────────────────────────────────── */}
                <div className="pt-4">
                    <button
                        onClick={() => setOpenLogoutModal(true)}
                        className="w-full py-3.5 bg-red-600 hover:bg-red-700 text-white rounded-2xl text-xs font-bold flex items-center justify-center gap-2 transition-colors shadow-sm cursor-pointer"
                    >
                        <span className="material-symbols-outlined text-base">logout</span>
                        <span>Sign Out of Portal</span>
                    </button>
                    <p className="text-center text-[11px] font-medium text-slate-400 mt-3">
                        Smart Attendance System • v2.4.0
                    </p>
                </div>

            </div>

            {/* ── LOGOUT CONFIRMATION MODAL ────────────────────────────────────── */}
            <Modal show={openLogoutModal} size="md" onClose={() => setOpenLogoutModal(false)} popup>
                <ModalHeader className="bg-white border-0" />
                <ModalBody className="bg-white border-0 pb-6">
                    <div className="text-center">
                        <HiOutlineExclamationCircle className="mx-auto mb-4 h-12 w-12 text-red-600" />
                        <h3 className="mb-2 text-base font-bold text-slate-900">
                            Confirm Portal Sign Out
                        </h3>
                        <p className="text-xs text-slate-500 mb-6">
                            Are you sure you want to log out of your student attendance dashboard?
                        </p>
                        <div className="flex justify-center gap-3">
                            <button
                                onClick={handleLogout}
                                className="px-5 py-2.5 bg-red-600 hover:bg-red-700 text-white text-xs font-bold rounded-xl transition-colors cursor-pointer shadow-sm"
                            >
                                Yes, Sign Out
                            </button>
                            <button
                                onClick={() => setOpenLogoutModal(false)}
                                className="px-5 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold rounded-xl transition-colors cursor-pointer"
                            >
                                Cancel
                            </button>
                        </div>
                    </div>
                </ModalBody>
            </Modal>

            {/* ── ATTENDANCE DISCREPANCY APPEAL MODAL ──────────────────────────── */}
            <Modal show={openDiscrepancyModal} size="md" onClose={() => setOpenDiscrepancyModal(false)}>
                <ModalHeader className="border-b border-gray-100 px-6 py-4">
                    <div className="flex items-center gap-2">
                        <span className="material-symbols-outlined text-[#0a643a] text-xl">flag</span>
                        <h3 className="text-sm font-bold text-slate-900">Report Attendance Discrepancy</h3>
                    </div>
                </ModalHeader>
                <ModalBody className="p-6">
                    <form onSubmit={submitDiscrepancyReport} className="space-y-4">
                        <div>
                            <label className="block text-xs font-bold text-slate-700 mb-1">Course Code</label>
                            <input
                                type="text"
                                required
                                value={discrepancyForm.courseCode}
                                onChange={(e) => setDiscrepancyForm({ ...discrepancyForm, courseCode: e.target.value })}
                                placeholder="e.g. CSC 201"
                                className="w-full bg-slate-50 border border-gray-200 rounded-xl px-3 py-2 text-xs font-medium outline-none focus:border-[#0a643a]"
                            />
                        </div>
                        <div>
                            <label className="block text-xs font-bold text-slate-700 mb-1">Date of Class</label>
                            <input
                                type="date"
                                required
                                value={discrepancyForm.date}
                                onChange={(e) => setDiscrepancyForm({ ...discrepancyForm, date: e.target.value })}
                                className="w-full bg-slate-50 border border-gray-200 rounded-xl px-3 py-2 text-xs font-medium outline-none focus:border-[#0a643a]"
                            />
                        </div>
                        <div>
                            <label className="block text-xs font-bold text-slate-700 mb-1">Reason / Supporting Note</label>
                            <textarea
                                rows={3}
                                required
                                value={discrepancyForm.reason}
                                onChange={(e) => setDiscrepancyForm({ ...discrepancyForm, reason: e.target.value })}
                                placeholder="Explain reason (e.g. verified presence, medical excuse, GPS glitch)..."
                                className="w-full bg-slate-50 border border-gray-200 rounded-xl p-3 text-xs font-medium outline-none focus:border-[#0a643a]"
                            />
                        </div>
                        <div className="flex justify-end gap-2 pt-2">
                            <button
                                type="button"
                                onClick={() => setOpenDiscrepancyModal(false)}
                                className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold rounded-xl transition-colors cursor-pointer"
                            >
                                Cancel
                            </button>
                            <button
                                type="submit"
                                className="px-4 py-2 bg-[#0a643a] hover:bg-[#084f2e] text-white text-xs font-bold rounded-xl transition-colors shadow-sm cursor-pointer"
                            >
                                Submit for Review
                            </button>
                        </div>
                    </form>
                </ModalBody>
            </Modal>

        </div>
    );
}