import React, { useState, useEffect } from 'react';
import { useNavigate, useSearchParams, Link } from 'react-router-dom';
import api from '../../Utils/api';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const ForgotPassword = () => {
    const [searchParams] = useSearchParams();
    const [userType, setUserType] = useState('student'); // 'student' | 'admin'
    const [step, setStep] = useState(1); // 1: Request OTP, 2: Enter OTP & New Password
    const [identifier, setIdentifier] = useState('');
    const [otp, setOtp] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const [emailSentTo, setEmailSentTo] = useState('');

    const navigate = useNavigate();

    // ── Check if User Clicked Direct Reset Link from Email ──────────────────
    useEffect(() => {
        const urlEmail = searchParams.get('email');
        const urlOtp = searchParams.get('otp');
        const urlType = searchParams.get('type');

        if (urlEmail) {
            setIdentifier(urlEmail);
            setEmailSentTo(urlEmail);
        }
        if (urlOtp) {
            setOtp(urlOtp);
            setStep(2);
        }
        if (urlType === 'admin') {
            setUserType('admin');
        } else if (urlType === 'student') {
            setUserType('student');
        }
    }, [searchParams]);

    // ── STEP 1: REQUEST OTP VIA EMAIL ───────────────────────────────────────
    const handleRequestOTP = async (e) => {
        e.preventDefault();
        const cleanIdentifier = identifier.trim();
        if (!cleanIdentifier) {
            toast.error('Please enter your email or matric number.');
            return;
        }

        setLoading(true);
        try {
            const endpoint = userType === 'student' ? '/forgot-password' : '/admin/forgot-password';
            const payload = userType === 'student' ? { identifier: cleanIdentifier } : { email: cleanIdentifier };

            let res;
            try {
                res = await api.post(endpoint, payload);
            } catch (firstErr) {
                // Cross-lookup fallback
                if (firstErr.response?.status === 404 || firstErr.response?.status === 400) {
                    const fallbackEndpoint = userType === 'student' ? '/admin/forgot-password' : '/forgot-password';
                    const fallbackPayload = userType === 'student' ? { email: cleanIdentifier } : { identifier: cleanIdentifier };

                    try {
                        res = await api.post(fallbackEndpoint, fallbackPayload);
                        setUserType(userType === 'student' ? 'admin' : 'student');
                    } catch (secondErr) {
                        throw firstErr;
                    }
                } else {
                    throw firstErr;
                }
            }

            if (res && res.data && res.data.success) {
                setEmailSentTo(res.data.email || cleanIdentifier);
                toast.success(res.data.message || 'Verification OTP sent to your email!');
                setStep(2);
            }
        } catch (err) {
            console.error("Forgot password request error:", err);
            const serverMsg = typeof err.response?.data?.message === 'string'
                ? err.response.data.message
                : typeof err.response?.data === 'string' && !err.response.data.includes('<')
                ? err.response.data
                : null;

            const msg = serverMsg || `Account not found for "${cleanIdentifier}". Please check your email or matric number.`;
            toast.error(msg);
        } finally {
            setLoading(false);
        }
    };

    // ── STEP 2: VERIFY OTP & SET NEW PASSWORD ───────────────────────────────
    const handleResetPassword = async (e) => {
        e.preventDefault();
        const cleanIdentifier = identifier.trim();
        const cleanOtp = otp.trim();

        if (!cleanOtp || cleanOtp.length < 4) {
            toast.error('Please enter the verification code sent to your email.');
            return;
        }
        if (newPassword.length < 6) {
            toast.error('Password must be at least 6 characters.');
            return;
        }
        if (newPassword !== confirmPassword) {
            toast.error('Passwords do not match.');
            return;
        }

        setLoading(true);
        try {
            const endpoint = userType === 'student' ? '/reset-password' : '/admin/reset-password';
            const payload = {
                identifier: cleanIdentifier,
                email: cleanIdentifier,
                otp: cleanOtp,
                newPassword: newPassword.trim(),
            };

            const res = await api.post(endpoint, payload);
            if (res && res.data && res.data.success) {
                toast.success('Password reset successful! Redirecting to login...');
                setTimeout(() => {
                    navigate('/signin');
                }, 2000);
            } else {
                toast.error(res.data?.message || 'Failed to reset password. Check your OTP.');
            }
        } catch (err) {
            console.error("Password reset execution error:", err);
            const serverMsg = typeof err.response?.data?.message === 'string'
                ? err.response.data.message
                : typeof err.response?.data === 'string' && !err.response.data.includes('<')
                ? err.response.data
                : null;

            toast.error(serverMsg || 'Invalid or expired OTP. Please request a new code.');
        } finally {
            setLoading(false);
        }
    };

    const openGmail = () => {
        window.open('https://mail.google.com/mail/u/0/#search/from%3A(Smart+Attendance)+OR+subject%3A(OTP)', '_blank');
    };

    return (
        <div className="min-h-screen w-full flex bg-[#f8faf9] font-sans antialiased text-[#1a2e26]">
            <ToastContainer position="top-right" autoClose={4000} />

            {/* ── LEFT SIDE: BRANDED PRESENTATION PANEL (Side View) ─── */}
            <div className="hidden lg:flex lg:w-1/2 bg-gradient-to-br from-[#062617] via-[#093521] to-[#04190f] text-white p-12 flex-col justify-between relative overflow-hidden select-none">
                
                {/* Floating Geometric Elements */}
                <div className="absolute inset-0 pointer-events-none">
                    <div className="absolute top-10 left-10 w-24 h-24 bg-white/5 rounded-3xl border border-white/10 rotate-12"></div>
                    <div className="absolute top-1/4 right-12 w-32 h-32 bg-white/5 rounded-3xl border border-white/10 -rotate-6"></div>
                    <div className="absolute bottom-20 left-16 w-28 h-28 bg-white/5 rounded-3xl border border-white/10 rotate-45"></div>
                    <div className="absolute bottom-1/3 right-1/4 w-20 h-20 bg-white/5 rounded-2xl border border-white/10 -rotate-12"></div>
                    <div className="absolute top-1/2 left-1/3 w-16 h-16 bg-emerald-400/10 rounded-2xl border border-emerald-400/20 rotate-12"></div>
                </div>

                {/* Top Corner Header / Brand */}
                <div className="relative z-10 flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-white/10 border border-white/20 flex items-center justify-center backdrop-blur-md">
                        <span className="material-symbols-outlined text-2xl text-emerald-300">school</span>
                    </div>
                    <div>
                        <span className="font-extrabold text-sm tracking-wider uppercase text-emerald-200 block leading-tight">
                            Smart Attendance
                        </span>
                        <span className="text-[10px] text-gray-300 tracking-widest uppercase">
                            Account Recovery
                        </span>
                    </div>
                </div>

                {/* Center Hero Banner */}
                <div className="relative z-10 max-w-md mx-auto text-center space-y-6">
                    
                    <div className="inline-flex flex-col items-center justify-center bg-white p-4 rounded-3xl shadow-2xl mx-auto">
                        <div className="w-14 h-14 rounded-2xl bg-[#0a643a] flex items-center justify-center text-white shadow-inner">
                            <span className="material-symbols-outlined text-3xl text-emerald-100">
                                lock_reset
                            </span>
                        </div>
                    </div>

                    <div className="space-y-3">
                        <span className="text-xs font-bold uppercase tracking-widest text-emerald-300 block">
                            Secure Verification
                        </span>
                        <h1 className="text-3xl sm:text-4xl font-black tracking-tight leading-tight text-white">
                            Account Recovery & Password Reset
                        </h1>
                        <div className="w-20 h-1.5 bg-emerald-400 rounded-full mx-auto"></div>
                    </div>

                    <p className="text-xs sm:text-sm text-emerald-100/80 leading-relaxed font-normal">
                        Enter your institutional credentials to receive a verified 6-digit OTP code directly to your mailbox.
                    </p>
                </div>

                {/* Left Bottom Footer / Contact Support */}
                <div className="relative z-10 flex items-center justify-between text-xs text-emerald-200/70 border-t border-white/10 pt-6">
                    <span className="flex items-center gap-1.5">
                        <span className="material-symbols-outlined text-base text-emerald-300">support_agent</span>
                        <span>Need help? Contact ICT Support</span>
                    </span>
                    <span className="font-mono text-[11px]">📞 08106096112</span>
                </div>
            </div>

            {/* ── RIGHT SIDE: FORM CANVAS ─────────────── */}
            <div className="w-full lg:w-1/2 flex flex-col justify-between p-6 sm:p-12 lg:p-16 bg-white overflow-y-auto min-h-screen">
                
                {/* Mobile Header */}
                <div className="lg:hidden flex items-center gap-3 mb-6 pb-4 border-b border-gray-100">
                    <div className="w-9 h-9 rounded-xl bg-[#0a643a] flex items-center justify-center text-white font-bold shadow-sm">
                        <span className="material-symbols-outlined text-xl">lock_reset</span>
                    </div>
                    <div>
                        <span className="font-extrabold text-base text-[#0a643a] tracking-tight block leading-tight">
                            Smart Attendance
                        </span>
                        <span className="text-[10px] text-gray-500 font-semibold tracking-wider uppercase">
                            Password Recovery
                        </span>
                    </div>
                </div>

                {/* Form Container */}
                <div className="max-w-md w-full mx-auto my-auto space-y-6">
                    
                    {/* Header Copy */}
                    <div className="text-left space-y-1">
                        <h2 className="text-2xl sm:text-3xl font-black text-[#0d2319] tracking-tight">
                            {step === 1 ? 'Reset Password' : 'Enter Verification Code'}
                        </h2>
                        <p className="text-xs sm:text-sm text-gray-500 font-normal">
                            {step === 1
                                ? 'Choose your account type and enter your identifier to receive an OTP'
                                : `Enter the 6-digit code sent to ${emailSentTo || identifier}`}
                        </p>
                    </div>

                    {/* Role Switcher Tabs */}
                    {step === 1 && (
                        <div className="bg-[#f0f4f1] p-1.5 rounded-2xl flex gap-1.5 border border-gray-200/80">
                            <button
                                type="button"
                                onClick={() => setUserType('student')}
                                className={`flex-1 py-2.5 px-4 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center justify-center gap-1.5 ${
                                    userType === 'student'
                                        ? 'bg-[#0a643a] text-white shadow-md'
                                        : 'text-gray-600 hover:text-gray-900'
                                }`}
                            >
                                <span className="material-symbols-outlined text-[16px]">school</span>
                                <span>Student</span>
                            </button>

                            <button
                                type="button"
                                onClick={() => setUserType('admin')}
                                className={`flex-1 py-2.5 px-4 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center justify-center gap-1.5 ${
                                    userType === 'admin'
                                        ? 'bg-[#0a643a] text-white shadow-md'
                                        : 'text-gray-600 hover:text-gray-900'
                                }`}
                            >
                                <span className="material-symbols-outlined text-[16px]">shield_person</span>
                                <span>Staff / Lecturer</span>
                            </button>
                        </div>
                    )}

                    {/* Step 1 Form: Request OTP */}
                    {step === 1 ? (
                        <form onSubmit={handleRequestOTP} className="space-y-4">
                            <div>
                                <label className="block text-xs font-bold text-gray-700 mb-1.5 uppercase tracking-wider">
                                    {userType === 'student' ? 'Student Email or Matric Number' : 'Institutional Email'}
                                </label>
                                <div className="relative">
                                    <span className="material-symbols-outlined absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400 text-lg">
                                        {userType === 'student' ? 'badge' : 'mail'}
                                    </span>
                                    <input
                                        type={userType === 'admin' ? 'email' : 'text'}
                                        value={identifier}
                                        onChange={(e) => setIdentifier(e.target.value)}
                                        placeholder={userType === 'student' ? 'e.g. yourname@gmail.com or 2021001234' : 'e.g. lecturer@university.edu'}
                                        className="w-full bg-[#f8faf9] border border-gray-300 rounded-xl pl-10 pr-4 py-3 text-xs outline-none focus:border-[#0a643a] focus:bg-white text-slate-800 transition-all font-medium"
                                        required
                                    />
                                </div>
                            </div>

                            <button
                                type="submit"
                                disabled={loading}
                                className="w-full py-3.5 bg-[#0a643a] hover:bg-[#08522f] disabled:opacity-60 text-white font-bold text-xs rounded-xl transition-all shadow-md hover:shadow-lg cursor-pointer flex items-center justify-center gap-2 mt-2"
                            >
                                <span>{loading ? 'Sending OTP to Email...' : 'Send Verification OTP'}</span>
                                <span>&rarr;</span>
                            </button>

                            <div className="text-center pt-2">
                                <Link to="/signin" className="text-xs font-bold text-[#0a643a] hover:underline">
                                    &larr; Back to Sign In
                                </Link>
                            </div>
                        </form>
                    ) : (
                        /* Step 2 Form: Enter OTP & New Password */
                        <form onSubmit={handleResetPassword} className="space-y-4">
                            <div className="bg-emerald-50 border border-emerald-200 p-4 rounded-2xl text-center space-y-2.5">
                                <div className="flex items-center justify-center gap-1.5 text-xs font-bold text-[#0a643a]">
                                    <span className="material-symbols-outlined text-base">mark_email_read</span>
                                    <span>OTP Sent to Your Email!</span>
                                </div>
                                <p className="text-xs text-slate-600 leading-relaxed font-normal">
                                    We sent a 6-digit code to <strong>{emailSentTo || identifier}</strong>. Check your inbox or spam.
                                </p>
                                <button
                                    type="button"
                                    onClick={openGmail}
                                    className="inline-flex items-center gap-1.5 px-4 py-2 bg-[#0a643a] hover:bg-[#08522f] text-white text-xs font-bold rounded-xl transition-colors cursor-pointer shadow-sm"
                                >
                                    <span className="material-symbols-outlined text-sm">open_in_new</span>
                                    <span>Open Gmail Inbox</span>
                                </button>
                            </div>

                            <div>
                                <label className="block text-xs font-bold text-gray-700 mb-1.5 uppercase tracking-wider">
                                    Enter 6-Digit OTP From Email
                                </label>
                                <input
                                    type="text"
                                    maxLength="6"
                                    value={otp}
                                    onChange={(e) => setOtp(e.target.value)}
                                    placeholder="e.g. 504908"
                                    className="w-full bg-[#f8faf9] border border-gray-300 rounded-xl p-3 text-center text-sm font-mono tracking-widest outline-none focus:border-[#0a643a] focus:bg-white text-slate-800 font-bold"
                                    required
                                />
                            </div>

                            <div>
                                <label className="block text-xs font-bold text-gray-700 mb-1.5 uppercase tracking-wider">
                                    New Password
                                </label>
                                <input
                                    type="password"
                                    value={newPassword}
                                    onChange={(e) => setNewPassword(e.target.value)}
                                    placeholder="•••••••• (Min 6 characters)"
                                    className="w-full bg-[#f8faf9] border border-gray-300 rounded-xl px-3.5 py-2.5 text-xs outline-none focus:border-[#0a643a] focus:bg-white text-slate-800"
                                    required
                                />
                            </div>

                            <div>
                                <label className="block text-xs font-bold text-gray-700 mb-1.5 uppercase tracking-wider">
                                    Confirm New Password
                                </label>
                                <input
                                    type="password"
                                    value={confirmPassword}
                                    onChange={(e) => setConfirmPassword(e.target.value)}
                                    placeholder="••••••••"
                                    className="w-full bg-[#f8faf9] border border-gray-300 rounded-xl px-3.5 py-2.5 text-xs outline-none focus:border-[#0a643a] focus:bg-white text-slate-800"
                                    required
                                />
                            </div>

                            <button
                                type="submit"
                                disabled={loading}
                                className="w-full py-3.5 bg-[#0a643a] hover:bg-[#08522f] disabled:opacity-60 text-white font-bold text-xs rounded-xl transition-all shadow-md hover:shadow-lg cursor-pointer flex items-center justify-center gap-2 mt-2"
                            >
                                <span>{loading ? 'Saving Password...' : 'Save New Password & Log In'}</span>
                                <span>&rarr;</span>
                            </button>

                            <div className="flex justify-between items-center pt-2">
                                <button
                                    type="button"
                                    onClick={() => setStep(1)}
                                    className="text-xs text-slate-500 hover:text-slate-800 font-semibold cursor-pointer"
                                >
                                    &larr; Resend Code / Change Email
                                </button>
                                <Link to="/signin" className="text-xs text-[#0a643a] font-bold hover:underline">
                                    Cancel
                                </Link>
                            </div>
                        </form>
                    )}

                </div>

                {/* Right Bottom Footer */}
                <div className="text-center text-[11px] text-gray-400 font-medium pt-8 flex items-center justify-between border-t border-gray-100 mt-6">
                    <span>Smart Attendance | {new Date().getFullYear()}</span>
                    <span>Powered by <strong className="text-[#0a643a]">MercyTech</strong></span>
                </div>

            </div>

        </div>
    );
};

export default ForgotPassword;
