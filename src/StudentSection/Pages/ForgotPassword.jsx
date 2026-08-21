import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import api from '../../Utils/api';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const ForgotPassword = () => {
    const [userType, setUserType] = useState('student'); // 'student' | 'admin'
    const [step, setStep] = useState(1); // 1: Request OTP, 2: Enter OTP & New Password
    const [identifier, setIdentifier] = useState('');
    const [otp, setOtp] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const [demoOtp, setDemoOtp] = useState('');

    const navigate = useNavigate();

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
                // If not found in primary endpoint, auto-try the secondary endpoint (Admin <-> Student cross-lookup)
                if (firstErr.response?.status === 404 || firstErr.response?.status === 400) {
                    const fallbackEndpoint = userType === 'student' ? '/admin/forgot-password' : '/forgot-password';
                    const fallbackPayload = userType === 'student' ? { email: cleanIdentifier } : { identifier: cleanIdentifier };

                    try {
                        res = await api.post(fallbackEndpoint, fallbackPayload);
                        // Automatically switch tab to the account type that matched
                        setUserType(userType === 'student' ? 'admin' : 'student');
                    } catch (secondErr) {
                        throw firstErr;
                    }
                } else {
                    throw firstErr;
                }
            }

            if (res && res.data && res.data.success) {
                toast.success(res.data.message || 'OTP generated successfully!');
                if (res.data.otp) {
                    setDemoOtp(res.data.otp);
                    setOtp(res.data.otp); // Pre-fill for seamless recovery experience
                }
                setStep(2);
            }
        } catch (err) {
            console.error("Forgot password request error:", err);
            const serverMsg = typeof err.response?.data?.message === 'string'
                ? err.response.data.message
                : typeof err.response?.data === 'string' && !err.response.data.includes('<')
                ? err.response.data
                : null;

            const msg = serverMsg || `Account not found for "${cleanIdentifier}". Please check your email or ensure your latest backend code is pushed to Render.`;
            toast.error(msg);
        } finally {
            setLoading(false);
        }
    };

    const handleResetPassword = async (e) => {
        e.preventDefault();
        const cleanIdentifier = identifier.trim();
        if (!otp.trim() || !newPassword || !confirmPassword) {
            toast.error('Please fill in all fields.');
            return;
        }
        if (newPassword !== confirmPassword) {
            toast.error('Passwords do not match.');
            return;
        }
        if (newPassword.length < 6) {
            toast.error('Password must be at least 6 characters.');
            return;
        }

        setLoading(true);
        try {
            const endpoint = userType === 'student' ? '/reset-password' : '/admin/reset-password';
            const payload = userType === 'student'
                ? { identifier: cleanIdentifier, otp: otp.trim(), newPassword, confirmPassword }
                : { email: cleanIdentifier, otp: otp.trim(), newPassword, confirmPassword };

            let res;
            try {
                res = await api.post(endpoint, payload);
            } catch (firstErr) {
                const fallbackEndpoint = userType === 'student' ? '/admin/reset-password' : '/reset-password';
                const fallbackPayload = userType === 'student'
                    ? { email: cleanIdentifier, otp: otp.trim(), newPassword, confirmPassword }
                    : { identifier: cleanIdentifier, otp: otp.trim(), newPassword, confirmPassword };

                res = await api.post(fallbackEndpoint, fallbackPayload);
            }

            if (res && res.data && res.data.success) {
                alert(res.data.message || 'Password reset successfully! Please sign in with your new password.');
                navigate(userType === 'admin' ? '/admin/login' : '/signin');
            }
        } catch (err) {
            console.error("Reset password submission error:", err);
            const msg = err.response?.data?.message || 'Failed to reset password. Please verify your OTP code.';
            toast.error(msg);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-[#f0f4f1] flex flex-col justify-center items-center p-4 font-sans text-slate-800">
            <ToastContainer />

            <div className="w-full max-w-md bg-white rounded-2xl shadow-xl border border-gray-200 overflow-hidden">
                {/* Header */}
                <div className="bg-[#0a643a] p-6 text-white text-center">
                    <div className="w-12 h-12 rounded-full bg-white/10 flex items-center justify-center mx-auto mb-2">
                        <span className="material-symbols-outlined text-2xl">lock_reset</span>
                    </div>
                    <h1 className="text-xl font-bold">Reset Password</h1>
                    <p className="text-xs text-emerald-100 mt-1">
                        {step === 1 ? 'Enter your details to receive a 6-digit OTP code' : 'Enter OTP and set your new password'}
                    </p>
                </div>

                {/* Account Type Selector (Step 1 Only) */}
                {step === 1 && (
                    <div className="flex border-b border-gray-200 bg-slate-50">
                        <button
                            type="button"
                            onClick={() => setUserType('student')}
                            className={`flex-1 py-3 text-xs font-bold transition-all cursor-pointer ${
                                userType === 'student'
                                    ? 'border-b-2 border-[#0a643a] text-[#0a643a] bg-white'
                                    : 'text-slate-500 hover:text-slate-800'
                            }`}
                        >
                            Student Account
                        </button>
                        <button
                            type="button"
                            onClick={() => setUserType('admin')}
                            className={`flex-1 py-3 text-xs font-bold transition-all cursor-pointer ${
                                userType === 'admin'
                                    ? 'border-b-2 border-[#0a643a] text-[#0a643a] bg-white'
                                    : 'text-slate-500 hover:text-slate-800'
                            }`}
                        >
                            Lecturer / Admin
                        </button>
                    </div>
                )}

                <div className="p-6">
                    {step === 1 ? (
                        <form onSubmit={handleRequestOTP} className="space-y-4">
                            <div>
                                <label className="block text-xs font-bold text-slate-700 mb-1.5">
                                    {userType === 'student' ? 'Matric Number or Student Email' : 'Staff / Admin Email'}
                                </label>
                                <input
                                    type={userType === 'admin' ? 'email' : 'text'}
                                    value={identifier}
                                    onChange={(e) => setIdentifier(e.target.value)}
                                    placeholder={userType === 'student' ? 'e.g. 2021001234 or student@gmail.com' : 'e.g. admin@uni.edu or gmail.com'}
                                    className="w-full border border-gray-300 rounded-xl p-3 text-sm outline-none focus:border-[#0a643a] focus:ring-1 focus:ring-[#0a643a] transition-all"
                                    required
                                />
                            </div>

                            <button
                                type="submit"
                                disabled={loading}
                                className="w-full bg-[#0a643a] hover:bg-[#084f2e] disabled:opacity-60 text-white font-bold text-sm py-3 rounded-xl transition-colors shadow-sm cursor-pointer mt-2"
                            >
                                {loading ? 'Checking Account...' : 'Send Verification OTP'}
                            </button>

                            <div className="text-center pt-2">
                                <Link to="/signin" className="text-xs text-[#0a643a] font-bold hover:underline">
                                    Back to Sign In
                                </Link>
                            </div>
                        </form>
                    ) : (
                        <form onSubmit={handleResetPassword} className="space-y-4">
                            {demoOtp && (
                                <div className="bg-emerald-50 border border-emerald-200 p-3 rounded-xl text-xs text-emerald-800 flex items-center justify-between">
                                    <span>Verification Code: <strong className="font-mono text-sm">{demoOtp}</strong></span>
                                    <span className="text-[10px] bg-emerald-200 text-emerald-900 font-bold px-2 py-0.5 rounded">Valid 15m</span>
                                </div>
                            )}

                            <div>
                                <label className="block text-xs font-bold text-slate-700 mb-1.5">
                                    6-Digit Verification OTP
                                </label>
                                <input
                                    type="text"
                                    maxLength="6"
                                    value={otp}
                                    onChange={(e) => setOtp(e.target.value)}
                                    placeholder="Enter OTP (e.g. 481920)"
                                    className="w-full border border-gray-300 rounded-xl p-3 text-sm font-mono tracking-widest text-center outline-none focus:border-[#0a643a] focus:ring-1 focus:ring-[#0a643a]"
                                    required
                                />
                            </div>

                            <div>
                                <label className="block text-xs font-bold text-slate-700 mb-1.5">
                                    New Password
                                </label>
                                <input
                                    type="password"
                                    value={newPassword}
                                    onChange={(e) => setNewPassword(e.target.value)}
                                    placeholder="Minimum 6 characters"
                                    className="w-full border border-gray-300 rounded-xl p-3 text-sm outline-none focus:border-[#0a643a] focus:ring-1 focus:ring-[#0a643a]"
                                    required
                                />
                            </div>

                            <div>
                                <label className="block text-xs font-bold text-slate-700 mb-1.5">
                                    Confirm New Password
                                </label>
                                <input
                                    type="password"
                                    value={confirmPassword}
                                    onChange={(e) => setConfirmPassword(e.target.value)}
                                    placeholder="Re-enter new password"
                                    className="w-full border border-gray-300 rounded-xl p-3 text-sm outline-none focus:border-[#0a643a] focus:ring-1 focus:ring-[#0a643a]"
                                    required
                                />
                            </div>

                            <button
                                type="submit"
                                disabled={loading}
                                className="w-full bg-[#0a643a] hover:bg-[#084f2e] disabled:opacity-60 text-white font-bold text-sm py-3 rounded-xl transition-colors shadow-sm cursor-pointer mt-2"
                            >
                                {loading ? 'Resetting Password...' : 'Save New Password'}
                            </button>

                            <div className="flex justify-between items-center pt-2">
                                <button
                                    type="button"
                                    onClick={() => setStep(1)}
                                    className="text-xs text-slate-500 hover:text-slate-800 font-medium cursor-pointer"
                                >
                                    Change Email / Credential
                                </button>
                                <Link to="/signin" className="text-xs text-[#0a643a] font-bold hover:underline">
                                    Cancel & Sign In
                                </Link>
                            </div>
                        </form>
                    )}
                </div>
            </div>
        </div>
    );
};

export default ForgotPassword;
