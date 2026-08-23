import api from '../../Utils/api';
import { useFormik } from 'formik';
import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import * as yup from 'yup';

const AdminLogin = () => {
    const navigate = useNavigate();
    const [showPassword, setShowPassword] = useState(false);

    const formik = useFormik({
        initialValues: {
            email: '',
            password: '',
        },
        onSubmit: async (values, { setSubmitting, setStatus }) => {
            try {
                const response = await api.post('/admin/login', values);
                if (response.status === 200) {
                    localStorage.setItem('adminToken', response.data.token);
                    localStorage.setItem('adminUser', JSON.stringify(response.data.admin));
                    navigate('/admin/lecturer-dashboard');
                }
            } catch (err) {
                const message =
                    err.response?.data?.message || 'Login failed. Check your credentials.';
                setStatus(message);
            } finally {
                setSubmitting(false);
            }
        },
        validationSchema: yup.object({
            email: yup
                .string()
                .required('Institutional email is required')
                .email('Enter a valid email address'),
            password: yup
                .string()
                .required('Password is required')
                .min(6, 'Minimum 6 characters'),
        }),
    });

    return (
        <div className="min-h-screen w-full flex bg-[#f8faf9] font-sans antialiased text-[#1a2e26]">
            
            {/* ── LEFT SIDE: BRANDED PRESENTATION PANEL (Side View) ─── */}
            <div className="hidden lg:flex lg:w-1/2 bg-gradient-to-br from-[#062617] via-[#093521] to-[#04190f] text-white p-12 flex-col justify-between relative overflow-hidden select-none">
                
                {/* Floating Geometric Decorative Elements */}
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
                            Faculty Deanery & Lecturer Portal
                        </span>
                    </div>
                </div>

                {/* Center Hero Banner */}
                <div className="relative z-10 max-w-md mx-auto text-center space-y-6">
                    
                    {/* Institution Logo Card */}
                    <div className="inline-flex flex-col items-center justify-center bg-white p-4 rounded-3xl shadow-2xl mx-auto">
                        <div className="w-14 h-14 rounded-2xl bg-[#0a643a] flex items-center justify-center text-white shadow-inner">
                            <span className="material-symbols-outlined text-3xl text-emerald-100">
                                shield_person
                            </span>
                        </div>
                    </div>

                    <div className="space-y-3">
                        <span className="text-xs font-bold uppercase tracking-widest text-emerald-300 block">
                            Faculty Command Center
                        </span>
                        <h1 className="text-3xl sm:text-4xl font-black tracking-tight leading-tight text-white">
                            Faculty Deanery & Administration
                        </h1>
                        <div className="w-20 h-1.5 bg-emerald-400 rounded-full mx-auto"></div>
                    </div>

                    <p className="text-xs sm:text-sm text-emerald-100/80 leading-relaxed font-normal">
                        Launch lecture sessions with encrypted rotating QR codes, manage student enrollments, generate single-use invite tokens, and audit 75% exam clearance reports.
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

            {/* ── RIGHT SIDE: ADMIN LOGIN FORM CANVAS ─────────────── */}
            <div className="w-full lg:w-1/2 flex flex-col justify-between p-6 sm:p-12 lg:p-16 bg-white overflow-y-auto">
                
                {/* Mobile Header (Shown on small screens only) */}
                <div className="lg:hidden flex items-center gap-3 mb-6 pb-4 border-b border-gray-100">
                    <div className="w-9 h-9 rounded-xl bg-[#0a643a] flex items-center justify-center text-white font-bold shadow-sm">
                        <span className="material-symbols-outlined text-xl">shield_person</span>
                    </div>
                    <div>
                        <span className="font-extrabold text-base text-[#0a643a] tracking-tight block leading-tight">
                            Faculty Command Center
                        </span>
                        <span className="text-[10px] text-gray-500 font-semibold tracking-wider uppercase">
                            Lecturer & Staff Access
                        </span>
                    </div>
                </div>

                {/* Form Container */}
                <div className="max-w-md w-full mx-auto my-auto space-y-6">
                    
                    {/* Header Copy */}
                    <div className="text-left space-y-1">
                        <div className="inline-block px-3 py-1 bg-emerald-50 border border-emerald-200 text-[#0a643a] text-[11px] font-bold rounded-full uppercase tracking-wider mb-1">
                            Staff & Deanery
                        </div>
                        <h2 className="text-2xl sm:text-3xl font-black text-[#0d2319] tracking-tight">
                            Faculty Login
                        </h2>
                        <p className="text-xs sm:text-sm text-gray-500 font-normal">
                            Enter your institutional credentials to access the command center
                        </p>
                    </div>

                    {formik.status && (
                        <div className="flex items-center gap-2.5 bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-xl text-xs font-medium animate-pulse">
                            <span className="material-symbols-outlined text-base">error</span>
                            <span>{formik.status}</span>
                        </div>
                    )}

                    <form onSubmit={formik.handleSubmit} className="space-y-4">
                        <div>
                            <label className="block text-xs font-bold text-gray-700 mb-1.5 uppercase tracking-wider">
                                Institutional Email
                            </label>
                            <div className="relative">
                                <span className="material-symbols-outlined absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400 text-lg">
                                    mail
                                </span>
                                <input
                                    type="email"
                                    name="email"
                                    placeholder="lecturer@university.edu"
                                    value={formik.values.email}
                                    onChange={formik.handleChange}
                                    onBlur={formik.handleBlur}
                                    className="w-full bg-[#f8faf9] border border-gray-300 rounded-xl pl-10 pr-4 py-3 text-xs outline-none focus:border-[#0a643a] focus:bg-white text-slate-800 transition-all font-medium"
                                />
                            </div>
                            {formik.touched.email && formik.errors.email && (
                                <span className="text-[11px] text-red-600 font-semibold mt-1 block">
                                    {formik.errors.email}
                                </span>
                            )}
                        </div>

                        <div>
                            <label className="block text-xs font-bold text-gray-700 mb-1.5 uppercase tracking-wider">
                                Password
                            </label>
                            <div className="relative">
                                <span className="material-symbols-outlined absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400 text-lg">
                                    lock
                                </span>
                                <input
                                    type={showPassword ? "text" : "password"}
                                    name="password"
                                    placeholder="••••••••"
                                    value={formik.values.password}
                                    onChange={formik.handleChange}
                                    onBlur={formik.handleBlur}
                                    className="w-full bg-[#f8faf9] border border-gray-300 rounded-xl pl-10 pr-10 py-3 text-xs outline-none focus:border-[#0a643a] focus:bg-white text-slate-800 transition-all font-medium"
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowPassword(!showPassword)}
                                    className="absolute right-3.5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 cursor-pointer"
                                >
                                    <span className="material-symbols-outlined text-lg">
                                        {showPassword ? "visibility_off" : "visibility"}
                                    </span>
                                </button>
                            </div>
                            {formik.touched.password && formik.errors.password && (
                                <span className="text-[11px] text-red-600 font-semibold mt-1 block">
                                    {formik.errors.password}
                                </span>
                            )}
                        </div>

                        <div className="flex justify-between items-center pt-0.5">
                            <Link to="/signin" className="text-xs font-bold text-gray-500 hover:text-gray-800">
                                &larr; Switch to Student Login
                            </Link>
                            <Link to="/forgot-password" className="text-xs font-bold text-[#0a643a] hover:underline">
                                Forgot password?
                            </Link>
                        </div>

                        <button
                            type="submit"
                            disabled={formik.isSubmitting}
                            className="w-full py-3.5 bg-[#0a643a] hover:bg-[#08522f] disabled:opacity-60 text-white font-bold text-xs rounded-xl transition-all shadow-md hover:shadow-lg cursor-pointer flex items-center justify-center gap-2"
                        >
                            <span>{formik.isSubmitting ? "Authenticating..." : "Sign In to Command Center"}</span>
                            <span>&rarr;</span>
                        </button>
                    </form>

                    {/* Switch Link */}
                    <div className="pt-2 text-center text-xs text-gray-600 font-medium">
                        Need a Staff Account?{" "}
                        <Link to="/signup" className="text-[#0a643a] font-bold hover:underline">
                            Register with Invite Token &rarr;
                        </Link>
                    </div>

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

export default AdminLogin;
