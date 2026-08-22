import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../../Utils/api';
import { Modal, ModalBody, ModalHeader } from "flowbite-react";
import { HiOutlineExclamationCircle } from "react-icons/hi";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import BackButton from '../../Components/BackButton';

const getAdminProfile = () => {
    try {
        const stored = localStorage.getItem('adminUser');
        if (stored) {
            const parsed = JSON.parse(stored);
            if (parsed?.fullName) return parsed;
        }
        const token = localStorage.getItem('adminToken');
        if (token) {
            const payload = JSON.parse(atob(token.split('.')[1]));
            return {
                fullName: payload.fullName || payload.name || 'Deanery Admin',
                email: payload.email || 'admin@smartattendance.edu',
                role: payload.role || 'super_admin',
                faculty: payload.faculty || 'Faculty of Computing and Informatics',
                department: payload.department || 'Computer Science'
            };
        }
        return {
            fullName: 'Deanery Admin',
            email: 'admin@smartattendance.edu',
            role: 'super_admin',
            faculty: 'Faculty of Computing and Informatics',
            department: 'Computer Science'
        };
    } catch {
        return {
            fullName: 'Deanery Admin',
            email: 'admin@smartattendance.edu',
            role: 'super_admin',
            faculty: 'Faculty of Computing and Informatics',
            department: 'Computer Science'
        };
    }
};

export default function AdminSettings() {
    const navigate = useNavigate();
    const [adminProfile] = useState(getAdminProfile());

    // System Attendance Thresholds & Geofence Policy State
    const [settings, setSettings] = useState({
        examThreshold: 75,
        geofenceRadius: 100, // in meters
        qrRotationInterval: 20, // in seconds
        autoCloseSessionHours: 1, // in hours
        allowDynamicQR: true,
        allowGPS: true,
        allowBiometrics: false
    });

    // Invite Generator State (Super Admin feature)
    const [inviteHours, setInviteHours] = useState(24);
    const [generatedToken, setGeneratedToken] = useState('');
    const [generatingInvite, setGeneratingInvite] = useState(false);
    const [openLogoutModal, setOpenLogoutModal] = useState(false);

    const isSuperAdmin = adminProfile.role === 'super_admin';

    const handleSaveSettings = (e) => {
        e.preventDefault();
        localStorage.setItem('adminSystemSettings', JSON.stringify(settings));
        toast.success("Attendance and policy settings saved successfully!");
    };

    const handleGenerateInvite = async () => {
        setGeneratingInvite(true);
        try {
            const res = await api.post('/admin/generate-invite', { hours: inviteHours });
            if (res.data && res.data.token) {
                setGeneratedToken(res.data.token);
                toast.success("Faculty invite token generated!");
            }
        } catch (err) {
            console.error("Invite token generation error:", err);
            toast.error(err.response?.data?.message || "Failed to generate invite token.");
        } finally {
            setGeneratingInvite(false);
        }
    };

    const copyToClipboard = (text) => {
        navigator.clipboard.writeText(text);
        toast.info("Invite token copied to clipboard!");
    };

    const handleLogout = () => {
        localStorage.removeItem("adminToken");
        localStorage.removeItem("adminUser");
        navigate('/signin');
    };

    return (
        <div className="min-h-screen bg-[#f3f7f8] pt-3 pb-24 px-4 sm:px-6 max-w-5xl mx-auto font-sans text-slate-800">
            <ToastContainer position="top-right" autoClose={3000} />

            <div className="mb-3">
                <BackButton to="/admin/lecturer-dashboard" label="Back to Admin Dashboard" />
            </div>

            <div className="mb-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                    <h1 className="text-2xl font-extrabold text-[#0d1f18] tracking-tight flex items-center gap-2">
                        <span className="material-symbols-outlined text-[#0a643a] text-2xl">tune</span>
                        <span>Admin & System Settings</span>
                    </h1>
                    <p className="text-xs text-slate-500 mt-0.5">
                        Manage faculty credentials, staff invitations, and attendance regulations.
                    </p>
                </div>

                <button
                    onClick={() => setOpenLogoutModal(true)}
                    className="px-4 py-2 border border-red-200 text-red-600 hover:bg-red-50 rounded-xl text-xs font-bold transition-colors cursor-pointer flex items-center gap-1.5 self-start sm:self-auto shadow-sm"
                >
                    <span className="material-symbols-outlined text-base">logout</span>
                    <span>Sign Out</span>
                </button>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

                {/* ── LEFT COLUMN: Admin Identity & Faculty Staff Invite Generator ── */}
                <div className="space-y-6 lg:col-span-1">
                    
                    {/* Admin Profile Card */}
                    <div className="bg-white rounded-3xl p-6 border border-gray-200/80 shadow-sm space-y-4">
                        <div className="flex items-center gap-3.5">
                            <div className="w-14 h-14 rounded-2xl bg-[#0a643a] text-white flex items-center justify-center font-bold text-xl shadow-inner shrink-0">
                                {adminProfile.fullName?.charAt(0) || 'A'}
                            </div>
                            <div className="space-y-0.5">
                                <h3 className="text-base font-black text-slate-900 leading-tight">
                                    {adminProfile.fullName}
                                </h3>
                                <p className="text-xs text-slate-500 font-medium truncate max-w-[180px]">
                                    {adminProfile.email}
                                </p>
                                <span className="inline-block px-2 py-0.5 rounded-full bg-emerald-50 text-[#0a643a] font-black text-[10px] uppercase tracking-wider border border-emerald-200">
                                    {isSuperAdmin ? 'Faculty Super Admin' : 'Lecturer / Dept Admin'}
                                </span>
                            </div>
                        </div>

                        <div className="pt-3 border-t border-gray-100 space-y-2 text-xs">
                            <div className="flex justify-between">
                                <span className="text-slate-400 font-semibold">Faculty:</span>
                                <span className="font-bold text-slate-700 text-right truncate max-w-[160px]">{adminProfile.faculty}</span>
                            </div>
                            <div className="flex justify-between">
                                <span className="text-slate-400 font-semibold">Department:</span>
                                <span className="font-bold text-slate-700">{adminProfile.department || 'Deanery'}</span>
                            </div>
                        </div>
                    </div>

                    {/* Staff Invite Generator (Super Admin Only) */}
                    <div className="bg-white rounded-3xl p-6 border border-gray-200/80 shadow-sm space-y-4">
                        <div className="flex items-center gap-2">
                            <span className="material-symbols-outlined text-[#0a643a] text-xl">person_add</span>
                            <h3 className="text-sm font-bold text-slate-900">Generate Staff Invite</h3>
                        </div>
                        <p className="text-xs text-slate-500 leading-relaxed">
                            Create a single-use token to invite a new Lecturer or Department Admin into your faculty.
                        </p>

                        <div className="space-y-3 pt-1">
                            <div>
                                <label className="block text-[11px] font-bold text-slate-600 mb-1">Token Validity Duration</label>
                                <select
                                    value={inviteHours}
                                    onChange={(e) => setInviteHours(Number(e.target.value))}
                                    className="w-full bg-slate-50 border border-gray-200 rounded-xl px-3 py-2 text-xs font-semibold outline-none focus:border-[#0a643a]"
                                >
                                    <option value={12}>12 Hours</option>
                                    <option value={24}>24 Hours (1 Day)</option>
                                    <option value={72}>72 Hours (3 Days)</option>
                                    <option value={168}>7 Days</option>
                                </select>
                            </div>

                            <button
                                onClick={handleGenerateInvite}
                                disabled={generatingInvite}
                                className="w-full py-2.5 bg-[#0a643a] hover:bg-[#084f2e] text-white text-xs font-bold rounded-xl transition-colors shadow-sm flex items-center justify-center gap-1.5 cursor-pointer disabled:opacity-60"
                            >
                                <span className="material-symbols-outlined text-sm">key</span>
                                <span>{generatingInvite ? 'Generating...' : 'Generate Invite Token'}</span>
                            </button>

                            {generatedToken && (
                                <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-2xl space-y-2">
                                    <span className="text-[10px] font-bold text-emerald-800 uppercase tracking-wider block">Generated Token:</span>
                                    <div className="flex items-center justify-between gap-2 bg-white px-3 py-2 rounded-xl border border-emerald-200 font-mono text-xs font-bold text-slate-800 break-all">
                                        <span>{generatedToken}</span>
                                        <button
                                            onClick={() => copyToClipboard(generatedToken)}
                                            className="p-1 hover:bg-slate-100 rounded text-[#0a643a] cursor-pointer"
                                            title="Copy Token"
                                        >
                                            <span className="material-symbols-outlined text-sm">content_copy</span>
                                        </button>
                                    </div>
                                    <p className="text-[10px] text-emerald-700">Share this code with the lecturer to register on the Admin Portal.</p>
                                </div>
                            )}
                        </div>
                    </div>

                </div>

                {/* ── RIGHT COLUMN: Attendance System Policies & Geofencing ─────────── */}
                <div className="lg:col-span-2 space-y-6">

                    <form onSubmit={handleSaveSettings} className="bg-white rounded-3xl p-6 sm:p-7 border border-gray-200/80 shadow-sm space-y-6">
                        <div>
                            <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
                                <span className="material-symbols-outlined text-[#0a643a] text-xl">policy</span>
                                <span>University Attendance Regulations</span>
                            </h3>
                            <p className="text-xs text-slate-500 mt-0.5">
                                Set institution-wide thresholds for examination clearance and automated absentee generation.
                            </p>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            {/* Exam Clearance Threshold */}
                            <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200/70 space-y-1.5">
                                <label className="block text-xs font-bold text-slate-800">
                                    Examination Clearance Threshold (%)
                                </label>
                                <p className="text-[11px] text-slate-500">Minimum attendance required for exam entry (Standard: 75%).</p>
                                <input
                                    type="number"
                                    min="50"
                                    max="100"
                                    value={settings.examThreshold}
                                    onChange={(e) => setSettings({ ...settings, examThreshold: Number(e.target.value) })}
                                    className="w-full bg-white border border-gray-200 rounded-xl px-3 py-2 text-xs font-bold outline-none focus:border-[#0a643a]"
                                    required
                                />
                            </div>

                            {/* GPS Geofence Radius */}
                            <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200/70 space-y-1.5">
                                <label className="block text-xs font-bold text-slate-800">
                                    GPS Geofence Radius (Meters)
                                </label>
                                <p className="text-[11px] text-slate-500">Maximum distance tolerance from classroom venue (Standard: 100m).</p>
                                <input
                                    type="number"
                                    min="20"
                                    max="500"
                                    value={settings.geofenceRadius}
                                    onChange={(e) => setSettings({ ...settings, geofenceRadius: Number(e.target.value) })}
                                    className="w-full bg-white border border-gray-200 rounded-xl px-3 py-2 text-xs font-bold outline-none focus:border-[#0a643a]"
                                    required
                                />
                            </div>

                            {/* Anti-Proxy QR Rotation Timer */}
                            <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200/70 space-y-1.5">
                                <label className="block text-xs font-bold text-slate-800">
                                    Rotating QR Refresh Timer (Seconds)
                                </label>
                                <p className="text-[11px] text-slate-500">Interval before dynamic token expires & refreshes (Anti-Proxy).</p>
                                <select
                                    value={settings.qrRotationInterval}
                                    onChange={(e) => setSettings({ ...settings, qrRotationInterval: Number(e.target.value) })}
                                    className="w-full bg-white border border-gray-200 rounded-xl px-3 py-2 text-xs font-bold outline-none focus:border-[#0a643a]"
                                >
                                    <option value={15}>15 Seconds (High Security)</option>
                                    <option value={20}>20 Seconds (Recommended)</option>
                                    <option value={30}>30 Seconds</option>
                                </select>
                            </div>

                            {/* Auto Session Expiry */}
                            <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200/70 space-y-1.5">
                                <label className="block text-xs font-bold text-slate-800">
                                    Auto-Expire Class Sessions (Hours)
                                </label>
                                <p className="text-[11px] text-slate-500">Automatically closes open classes and marks absentees.</p>
                                <select
                                    value={settings.autoCloseSessionHours}
                                    onChange={(e) => setSettings({ ...settings, autoCloseSessionHours: Number(e.target.value) })}
                                    className="w-full bg-white border border-gray-200 rounded-xl px-3 py-2 text-xs font-bold outline-none focus:border-[#0a643a]"
                                >
                                    <option value={1}>1 Hour</option>
                                    <option value={2}>2 Hours</option>
                                    <option value={3}>3 Hours</option>
                                </select>
                            </div>
                        </div>

                        {/* Allowed Verification Modalities */}
                        <div className="pt-2 border-t border-gray-100 space-y-3">
                            <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider">
                                Supported Verification Modalities
                            </h4>
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                                <label className="flex items-center gap-3 p-3 bg-slate-50 border border-slate-200 rounded-xl cursor-pointer">
                                    <input
                                        type="checkbox"
                                        checked={settings.allowDynamicQR}
                                        onChange={(e) => setSettings({ ...settings, allowDynamicQR: e.target.checked })}
                                        className="rounded text-[#0a643a] focus:ring-[#0a643a]"
                                    />
                                    <div>
                                        <span className="text-xs font-bold text-slate-800 block">Dynamic Rotating QR Code</span>
                                        <span className="text-[10px] text-slate-400">Classroom screen projection</span>
                                    </div>
                                </label>

                                <label className="flex items-center gap-3 p-3 bg-slate-50 border border-slate-200 rounded-xl cursor-pointer">
                                    <input
                                        type="checkbox"
                                        checked={settings.allowGPS}
                                        onChange={(e) => setSettings({ ...settings, allowGPS: e.target.checked })}
                                        className="rounded text-[#0a643a] focus:ring-[#0a643a]"
                                    />
                                    <div>
                                        <span className="text-xs font-bold text-slate-800 block">GPS Geofence Validation</span>
                                        <span className="text-[10px] text-slate-400">Mobile location coordinates</span>
                                    </div>
                                </label>
                            </div>
                        </div>

                        <div className="flex justify-end pt-2">
                            <button
                                type="submit"
                                className="px-6 py-2.5 bg-[#0a643a] hover:bg-[#084f2e] text-white text-xs font-bold rounded-xl transition-colors shadow-sm cursor-pointer"
                            >
                                Save Policy Changes
                            </button>
                        </div>
                    </form>

                    {/* Quick Access to Other Management Portals */}
                    <div className="bg-white rounded-3xl p-6 border border-gray-200/80 shadow-sm space-y-3">
                        <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider">
                            Direct Admin Portals
                        </h4>
                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                            <button
                                onClick={() => navigate('/admin/student-management')}
                                className="p-3.5 bg-slate-50 hover:bg-emerald-50/60 border border-slate-200 rounded-2xl text-left transition-colors cursor-pointer group"
                            >
                                <span className="material-symbols-outlined text-slate-600 group-hover:text-[#0a643a] text-lg block mb-1">group</span>
                                <span className="text-xs font-bold text-slate-800 block">Student Directory</span>
                                <span className="text-[10px] text-slate-400">Manage enrollments</span>
                            </button>

                            <button
                                onClick={() => navigate('/admin/course-management')}
                                className="p-3.5 bg-slate-50 hover:bg-emerald-50/60 border border-slate-200 rounded-2xl text-left transition-colors cursor-pointer group"
                            >
                                <span className="material-symbols-outlined text-slate-600 group-hover:text-[#0a643a] text-lg block mb-1">menu_book</span>
                                <span className="text-xs font-bold text-slate-800 block">Course Catalog</span>
                                <span className="text-[10px] text-slate-400">Add & edit courses</span>
                            </button>

                            <button
                                onClick={() => navigate('/admin/reports')}
                                className="p-3.5 bg-slate-50 hover:bg-emerald-50/60 border border-slate-200 rounded-2xl text-left transition-colors cursor-pointer group"
                            >
                                <span className="material-symbols-outlined text-slate-600 group-hover:text-[#0a643a] text-lg block mb-1">analytics</span>
                                <span className="text-xs font-bold text-slate-800 block">Attendance Reports</span>
                                <span className="text-[10px] text-slate-400">Export semester analytics</span>
                            </button>
                        </div>
                    </div>

                </div>

            </div>

            {/* Logout Modal */}
            <Modal show={openLogoutModal} size="md" onClose={() => setOpenLogoutModal(false)} popup>
                <ModalHeader className="bg-white border-0" />
                <ModalBody className="bg-white border-0 pb-6">
                    <div className="text-center">
                        <HiOutlineExclamationCircle className="mx-auto mb-4 h-12 w-12 text-red-600" />
                        <h3 className="mb-2 text-base font-bold text-slate-900">
                            Confirm Admin Sign Out
                        </h3>
                        <p className="text-xs text-slate-500 mb-6">
                            Are you sure you want to log out of your administrative portal?
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

        </div>
    );
}
