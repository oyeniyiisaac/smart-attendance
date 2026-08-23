import api from '../../Utils/api';
import { useFormik } from 'formik';
import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import * as yup from 'yup';

const SignUp = () => {
    const navigate = useNavigate();
    const [activeForm, setActiveForm] = useState('student');
    const [error, setError] = useState('');
    const [showPassword, setShowPassword] = useState(false);

    const facultyDepartments = {
        FET: [
            "Computer Engineering",
            "Electrical Engineering",
            "Mechanical Engineering",
            "Civil Engineering",
            "Chemical Engineering",
            "Agricultural Engineering",
            "Food Engineering"
        ],
        FCI: [
            "Computer Science",
            "Information Systems",
            "Cyber Security",
        ],
        FPAS: [
            "Pure and Applied Physics",
            "Pure and Applied Chemistry",
            "Pure and Applied Mathematics",
            "Pure and Applied Biology",
            "Statistics",
            "Science Laboratory Technology",
            "Earth Sciences"
        ],
        FAG: [
            "Agricultural Economics",
            "Animal Nutrition and Biotechnology",
            "Crop and Environmental Production",
            "Crop Production and Soil Science",
            "Animal Production and Health",
            "Agricultural Extension and Rural Development"
        ],
        FRNR: [
            "Forest Resource Management",
            "Fisheries and Aquaculture",
            "Wildlife and Ecotourism Management"
        ],
        FMS: [
            "Accounting",
            "Business Management",
            "Economics",
            "Marketing",
            "Transport Management"
        ],
        FES: [
            "Architecture",
            "Urban and Regional Planning",
            "Estate Management",
            "Surveying and Geoinformatics",
            "Fine and Applied Arts",
            "Building"
        ],
        FEC: [
            "Food Science",
            "Consumer Science/Home Economics",
            "Nutrition and Dietetics"
        ],
        FASS: [
            "Sociology",
            "Economics",
            "Political Science",
            "English and Literary Studies",
            "Philosophy",
            "History",
            "Linguistics and Yoruba Studies",
            "Theatre Arts",
            "Psychology"
        ],
        FBMS: [
            "Anatomy",
            "Biochemistry",
            "Medical Laboratory Science",
            "Physiology",
        ],
        FCS: [
            "Medicine",
            "Surgery",
            "Ophthalmology",
            "Obstetrics and Gynaecology",
            "Radiology",
            "Paediatrics",
            "Anaesthesia"
        ],
        FBCS: [
            "Chemical Pathology",
            "Haematology/Blood Transfusion",
            "Medical Microbiology/Parasitology",
            "Morbid Anatomy and Histopathology",
        ],
        FCNS: [
            "Nursing"
        ]
    };

    const formik = useFormik({
        initialValues: {
            firstname: "",
            lastname: "",
            email: "",
            matricno: "",
            faculty: "",
            department: "",
            level: "100L",
            password: "",
            confirmpassword: "",
        },
        onSubmit: async (values, { setSubmitting, setFieldError }) => {
            setError('');
            try {
                const response = await api.post('/register', values);
                if (response.status === 200 || response.status === 201) {
                    navigate('/signin');
                }
            } catch (err) {
                console.error("Student Registration Error:", err);
                const msg = err.response?.data?.message || 'Registration failed. Please try again.';
                setError(msg);
                if (msg.toLowerCase().includes('email')) {
                    setFieldError('email', msg);
                } else if (msg.toLowerCase().includes('matric')) {
                    setFieldError('matricno', msg);
                }
            } finally {
                setSubmitting(false);
            }
        },
        validationSchema: yup.object({
            firstname: yup.string().required("First name is required"),
            lastname: yup.string().required("Last name is required"),
            email: yup.string().required("Email is required").email("Enter a valid email"),
            matricno: yup.string().required("Matric number is required").matches(/^\d+$/, "Matric number must be numeric").matches(/^\d{10}$/, "Matric number must be exactly 10 digits"),
            faculty: yup.string().required("Faculty selection is required"),
            department: yup.string().required("Department is required"),
            level: yup.string().required("Level is required"),
            password: yup.string().required("Password is required").min(6, "Minimum 6 characters"),
            confirmpassword: yup.string().required("Confirm your password").min(6, "Minimum 6 characters").oneOf([yup.ref('password'), null], "Passwords must match"),
        })
    });

    const adminformik = useFormik({
        initialValues: {
            fullName: "",
            email: "",
            role: "admin",
            faculty: "",
            department: "",
            level: "100L",
            password: "",
            confirmPassword: "",
            verifyToken: "",
        },
        onSubmit: async (values, { setSubmitting, setFieldError }) => {
            setError('');
            try {
                const response = await api.post('/admin/create', values);
                if (response.status === 200 || response.status === 201) {
                    alert(response.data?.message || 'Admin account created successfully! Please sign in.');
                    navigate('/signin');
                }
            } catch (err) {
                console.error("Admin Registration Error:", err);
                const msg = err.response?.data?.message || 'Registration failed. Check your token and credentials.';
                setError(msg);
                if (msg.toLowerCase().includes('email')) {
                    setFieldError('email', msg);
                } else if (msg.toLowerCase().includes('token')) {
                    setFieldError('verifyToken', msg);
                }
            } finally {
                setSubmitting(false);
            }
        },
        validationSchema: yup.object({
            fullName: yup.string().required('Full name is required').trim(),
            email: yup.string().required('Institutional email is required').email('Enter a valid email').trim(),
            role: yup.string().required('Role is required'),
            faculty: yup.string().required('Faculty is required').trim(),
            department: yup.string().nullable(),
            password: yup.string().required('Password is required').min(6, 'Minimum 6 characters'),
            confirmPassword: yup.string().required('Confirm your password').min(6, 'Minimum 6 characters').oneOf([yup.ref('password'), null], 'Passwords must match'),
            verifyToken: yup.string().required('Single-use invite verification token is required'),
        })
    });

    return (
        <div className="min-h-screen w-full flex bg-[#f8faf9] font-sans antialiased text-[#1a2e26]">
            
            {/* ── LEFT SIDE: BRANDED PRESENTATION PANEL (Side View) ─── */}
            <div className="hidden lg:flex lg:w-5/12 bg-gradient-to-br from-[#062617] via-[#093521] to-[#04190f] text-white p-12 flex-col justify-between relative overflow-hidden select-none">
                
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
                            Higher Education System
                        </span>
                    </div>
                </div>

                {/* Center Hero Banner */}
                <div className="relative z-10 max-w-md mx-auto text-center space-y-6">
                    
                    {/* Institution Logo Card */}
                    <div className="inline-flex flex-col items-center justify-center bg-white p-4 rounded-3xl shadow-2xl mx-auto">
                        <div className="w-14 h-14 rounded-2xl bg-[#0a643a] flex items-center justify-center text-white shadow-inner">
                            <span className="material-symbols-outlined text-3xl text-emerald-100">
                                how_to_reg
                            </span>
                        </div>
                    </div>

                    <div className="space-y-3">
                        <span className="text-xs font-bold uppercase tracking-widest text-emerald-300 block">
                            Join The Institutional System
                        </span>
                        <h1 className="text-3xl sm:text-4xl font-black tracking-tight leading-tight text-white">
                            Create Your Attendance Account
                        </h1>
                        <div className="w-20 h-1.5 bg-emerald-400 rounded-full mx-auto"></div>
                    </div>

                    <p className="text-xs sm:text-sm text-emerald-100/80 leading-relaxed font-normal">
                        Enroll in automated, fraud-proof lecture sessions, track your exam clearance scores, and manage course registrations seamlessly.
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

            {/* ── RIGHT SIDE: REGISTRATION FORM CANVAS ─────────────── */}
            <div className="w-full lg:w-7/12 flex flex-col justify-between p-6 sm:p-10 lg:p-12 bg-white overflow-y-auto min-h-screen">
                
                {/* Mobile Header (Shown on small screens only) */}
                <div className="lg:hidden flex items-center gap-3 mb-6 pb-4 border-b border-gray-100">
                    <div className="w-9 h-9 rounded-xl bg-[#0a643a] flex items-center justify-center text-white font-bold shadow-sm">
                        <span className="material-symbols-outlined text-xl">school</span>
                    </div>
                    <div>
                        <span className="font-extrabold text-base text-[#0a643a] tracking-tight block leading-tight">
                            Smart Attendance
                        </span>
                        <span className="text-[10px] text-gray-500 font-semibold tracking-wider uppercase">
                            Account Registration
                        </span>
                    </div>
                </div>

                {/* Form Container */}
                <div className="max-w-xl w-full mx-auto my-auto space-y-6 py-4">
                    
                    {/* Header Copy */}
                    <div className="text-left space-y-1">
                        <h2 className="text-2xl sm:text-3xl font-black text-[#0d2319] tracking-tight">
                            Create Account
                        </h2>
                        <p className="text-xs sm:text-sm text-gray-500 font-normal">
                            Select your institutional role and enter your details
                        </p>
                    </div>

                    {/* Role Switcher Tabs */}
                    <div className="bg-[#f0f4f1] p-1.5 rounded-2xl flex gap-1.5 border border-gray-200/80">
                        <button
                            type="button"
                            onClick={() => {
                                setActiveForm('student');
                                setError('');
                            }}
                            className={`flex-1 py-2.5 px-4 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center justify-center gap-1.5 ${
                                activeForm === 'student'
                                    ? 'bg-[#0a643a] text-white shadow-md'
                                    : 'text-gray-600 hover:text-gray-900'
                            }`}
                        >
                            <span className="material-symbols-outlined text-[16px]">person</span>
                            <span>Student Account</span>
                        </button>

                        <button
                            type="button"
                            onClick={() => {
                                setActiveForm('lecturer');
                                setError('');
                            }}
                            className={`flex-1 py-2.5 px-4 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center justify-center gap-1.5 ${
                                activeForm === 'lecturer'
                                    ? 'bg-[#0a643a] text-white shadow-md'
                                    : 'text-gray-600 hover:text-gray-900'
                            }`}
                        >
                            <span className="material-symbols-outlined text-[16px]">shield_person</span>
                            <span>Lecturer / Staff / Rep</span>
                        </button>
                    </div>

                    {error && (
                        <div className="flex items-center gap-2.5 bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-xl text-xs font-medium animate-pulse">
                            <span className="material-symbols-outlined text-base">error</span>
                            <span>{error}</span>
                        </div>
                    )}

                    {/* ── Student Sign Up Form ── */}
                    {activeForm === 'student' && (
                        <form onSubmit={formik.handleSubmit} className="space-y-4">
                            
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                                <div>
                                    <label className="block text-xs font-bold text-gray-700 mb-1 uppercase tracking-wider">
                                        First Name *
                                    </label>
                                    <input
                                        type="text"
                                        name="firstname"
                                        placeholder="e.g. John"
                                        value={formik.values.firstname}
                                        onChange={formik.handleChange}
                                        onBlur={formik.handleBlur}
                                        className="w-full bg-[#f8faf9] border border-gray-300 rounded-xl px-3.5 py-2.5 text-xs outline-none focus:border-[#0a643a] focus:bg-white text-slate-800 transition-all font-medium"
                                    />
                                    {formik.touched.firstname && formik.errors.firstname && (
                                        <span className="text-[11px] text-red-600 font-semibold mt-1 block">{formik.errors.firstname}</span>
                                    )}
                                </div>

                                <div>
                                    <label className="block text-xs font-bold text-gray-700 mb-1 uppercase tracking-wider">
                                        Last Name *
                                    </label>
                                    <input
                                        type="text"
                                        name="lastname"
                                        placeholder="e.g. Doe"
                                        value={formik.values.lastname}
                                        onChange={formik.handleChange}
                                        onBlur={formik.handleBlur}
                                        className="w-full bg-[#f8faf9] border border-gray-300 rounded-xl px-3.5 py-2.5 text-xs outline-none focus:border-[#0a643a] focus:bg-white text-slate-800 transition-all font-medium"
                                    />
                                    {formik.touched.lastname && formik.errors.lastname && (
                                        <span className="text-[11px] text-red-600 font-semibold mt-1 block">{formik.errors.lastname}</span>
                                    )}
                                </div>
                            </div>

                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                                <div>
                                    <label className="block text-xs font-bold text-gray-700 mb-1 uppercase tracking-wider">
                                        Email Address *
                                    </label>
                                    <input
                                        type="email"
                                        name="email"
                                        placeholder="john.doe@email.com"
                                        value={formik.values.email}
                                        onChange={formik.handleChange}
                                        onBlur={formik.handleBlur}
                                        className="w-full bg-[#f8faf9] border border-gray-300 rounded-xl px-3.5 py-2.5 text-xs outline-none focus:border-[#0a643a] focus:bg-white text-slate-800 transition-all font-medium"
                                    />
                                    {formik.touched.email && formik.errors.email && (
                                        <span className="text-[11px] text-red-600 font-semibold mt-1 block">{formik.errors.email}</span>
                                    )}
                                </div>

                                <div>
                                    <label className="block text-xs font-bold text-gray-700 mb-1 uppercase tracking-wider">
                                        Matric Number (10 Digits) *
                                    </label>
                                    <input
                                        type="text"
                                        name="matricno"
                                        placeholder="e.g. 2022001234"
                                        value={formik.values.matricno}
                                        onChange={formik.handleChange}
                                        onBlur={formik.handleBlur}
                                        className="w-full bg-[#f8faf9] border border-gray-300 rounded-xl px-3.5 py-2.5 text-xs outline-none focus:border-[#0a643a] focus:bg-white text-slate-800 transition-all font-medium"
                                    />
                                    {formik.touched.matricno && formik.errors.matricno && (
                                        <span className="text-[11px] text-red-600 font-semibold mt-1 block">{formik.errors.matricno}</span>
                                    )}
                                </div>
                            </div>

                            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3.5">
                                <div>
                                    <label className="block text-xs font-bold text-gray-700 mb-1 uppercase tracking-wider">
                                        Faculty *
                                    </label>
                                    <select
                                        name="faculty"
                                        value={formik.values.faculty}
                                        onChange={formik.handleChange}
                                        onBlur={formik.handleBlur}
                                        className="w-full bg-[#f8faf9] border border-gray-300 rounded-xl px-3 py-2.5 text-xs outline-none focus:border-[#0a643a] focus:bg-white text-slate-800 transition-all font-medium"
                                    >
                                        <option value="" disabled>Select Faculty</option>
                                        <option value="FET">Engineering & Tech (FET)</option>
                                        <option value="FCI">Computing & Informatics (FCI)</option>
                                        <option value="FPAS">Pure & Applied Sci (FPAS)</option>
                                        <option value="FAG">Agricultural Sciences (FAG)</option>
                                        <option value="FRNR">Renewable Resources (FRNR)</option>
                                        <option value="FMS">Management Sciences (FMS)</option>
                                        <option value="FES">Environmental Sci (FES)</option>
                                        <option value="FEC">Food & Consumer Sci (FEC)</option>
                                        <option value="FASS">Arts & Social Sci (FASS)</option>
                                        <option value="FBMS">Basic Medical Sci (FBMS)</option>
                                        <option value="FCS">Clinical Sciences (FCS)</option>
                                        <option value="FBCS">Basic Clinical Sci (FBCS)</option>
                                        <option value="FCNS">Nursing Sciences (FCNS)</option>
                                    </select>
                                    {formik.touched.faculty && formik.errors.faculty && (
                                        <span className="text-[11px] text-red-600 font-semibold mt-1 block">{formik.errors.faculty}</span>
                                    )}
                                </div>

                                <div>
                                    <label className="block text-xs font-bold text-gray-700 mb-1 uppercase tracking-wider">
                                        Department *
                                    </label>
                                    <select
                                        name="department"
                                        disabled={!formik.values.faculty}
                                        value={formik.values.department}
                                        onChange={formik.handleChange}
                                        onBlur={formik.handleBlur}
                                        className="w-full bg-[#f8faf9] disabled:opacity-60 border border-gray-300 rounded-xl px-3 py-2.5 text-xs outline-none focus:border-[#0a643a] focus:bg-white text-slate-800 transition-all font-medium"
                                    >
                                        <option value="" disabled>Select Dept</option>
                                        {formik.values.faculty && facultyDepartments[formik.values.faculty]?.map((dept) => (
                                            <option key={dept} value={dept}>{dept}</option>
                                        ))}
                                    </select>
                                    {formik.touched.department && formik.errors.department && (
                                        <span className="text-[11px] text-red-600 font-semibold mt-1 block">{formik.errors.department}</span>
                                    )}
                                </div>

                                <div>
                                    <label className="block text-xs font-bold text-gray-700 mb-1 uppercase tracking-wider">
                                        Level *
                                    </label>
                                    <select
                                        name="level"
                                        value={formik.values.level}
                                        onChange={formik.handleChange}
                                        onBlur={formik.handleBlur}
                                        className="w-full bg-[#f8faf9] border border-gray-300 rounded-xl px-3 py-2.5 text-xs outline-none focus:border-[#0a643a] focus:bg-white text-slate-800 transition-all font-medium"
                                    >
                                        <option value="100L">100 Level</option>
                                        <option value="200L">200 Level</option>
                                        <option value="300L">300 Level</option>
                                        <option value="400L">400 Level</option>
                                        <option value="500L">500 Level</option>
                                    </select>
                                    {formik.touched.level && formik.errors.level && (
                                        <span className="text-[11px] text-red-600 font-semibold mt-1 block">{formik.errors.level}</span>
                                    )}
                                </div>
                            </div>

                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                                <div>
                                    <label className="block text-xs font-bold text-gray-700 mb-1 uppercase tracking-wider">
                                        Password *
                                    </label>
                                    <div className="relative">
                                        <input
                                            type={showPassword ? "text" : "password"}
                                            name="password"
                                            placeholder="••••••••"
                                            value={formik.values.password}
                                            onChange={formik.handleChange}
                                            onBlur={formik.handleBlur}
                                            className="w-full bg-[#f8faf9] border border-gray-300 rounded-xl px-3.5 py-2.5 text-xs outline-none focus:border-[#0a643a] focus:bg-white text-slate-800 transition-all font-medium"
                                        />
                                        <button
                                            type="button"
                                            onClick={() => setShowPassword(!showPassword)}
                                            className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 cursor-pointer"
                                        >
                                            <span className="material-symbols-outlined text-base">
                                                {showPassword ? "visibility_off" : "visibility"}
                                            </span>
                                        </button>
                                    </div>
                                    {formik.touched.password && formik.errors.password && (
                                        <span className="text-[11px] text-red-600 font-semibold mt-1 block">{formik.errors.password}</span>
                                    )}
                                </div>

                                <div>
                                    <label className="block text-xs font-bold text-gray-700 mb-1 uppercase tracking-wider">
                                        Confirm Password *
                                    </label>
                                    <input
                                        type={showPassword ? "text" : "password"}
                                        name="confirmpassword"
                                        placeholder="••••••••"
                                        value={formik.values.confirmpassword}
                                        onChange={formik.handleChange}
                                        onBlur={formik.handleBlur}
                                        className="w-full bg-[#f8faf9] border border-gray-300 rounded-xl px-3.5 py-2.5 text-xs outline-none focus:border-[#0a643a] focus:bg-white text-slate-800 transition-all font-medium"
                                    />
                                    {formik.touched.confirmpassword && formik.errors.confirmpassword && (
                                        <span className="text-[11px] text-red-600 font-semibold mt-1 block">{formik.errors.confirmpassword}</span>
                                    )}
                                </div>
                            </div>

                            <button
                                type="submit"
                                disabled={formik.isSubmitting}
                                className="w-full py-3.5 bg-[#0a643a] hover:bg-[#08522f] disabled:opacity-60 text-white font-bold text-xs rounded-xl transition-all shadow-md hover:shadow-lg cursor-pointer flex items-center justify-center gap-2 mt-2"
                            >
                                <span>{formik.isSubmitting ? "Creating Account..." : "Create Student Account"}</span>
                                <span>&rarr;</span>
                            </button>
                        </form>
                    )}

                    {/* ── Lecturer / Staff / Rep Sign Up Form ── */}
                    {activeForm === 'lecturer' && (
                        <form onSubmit={adminformik.handleSubmit} className="space-y-4">
                            
                            <div>
                                <label className="block text-xs font-bold text-gray-700 mb-1 uppercase tracking-wider">
                                    Full Name & Title *
                                </label>
                                <input
                                    type="text"
                                    name="fullName"
                                    placeholder="Prof. / Dr. / Mr. Jane Doe"
                                    value={adminformik.values.fullName}
                                    onChange={adminformik.handleChange}
                                    onBlur={adminformik.handleBlur}
                                    className="w-full bg-[#f8faf9] border border-gray-300 rounded-xl px-3.5 py-2.5 text-xs outline-none focus:border-[#0a643a] focus:bg-white text-slate-800 transition-all font-medium"
                                />
                                {adminformik.touched.fullName && adminformik.errors.fullName && (
                                    <span className="text-[11px] text-red-600 font-semibold mt-1 block">{adminformik.errors.fullName}</span>
                                )}
                            </div>

                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                                <div>
                                    <label className="block text-xs font-bold text-gray-700 mb-1 uppercase tracking-wider">
                                        Institutional Role *
                                    </label>
                                    <select
                                        name="role"
                                        value={adminformik.values.role}
                                        onChange={adminformik.handleChange}
                                        onBlur={adminformik.handleBlur}
                                        className="w-full bg-[#f8faf9] border border-gray-300 rounded-xl px-3 py-2.5 text-xs outline-none focus:border-[#0a643a] focus:bg-white text-slate-800 transition-all font-medium"
                                    >
                                        <option value="admin">Lecturer / Dept Admin</option>
                                        <option value="super_admin">Faculty Super Admin (Dean)</option>
                                        <option value="course_rep">Course Representative</option>
                                    </select>
                                </div>

                                <div>
                                    <label className="block text-xs font-bold text-gray-700 mb-1 uppercase tracking-wider">
                                        Institutional Email *
                                    </label>
                                    <input
                                        type="email"
                                        name="email"
                                        placeholder="lecturer@university.edu"
                                        value={adminformik.values.email}
                                        onChange={adminformik.handleChange}
                                        onBlur={adminformik.handleBlur}
                                        className="w-full bg-[#f8faf9] border border-gray-300 rounded-xl px-3.5 py-2.5 text-xs outline-none focus:border-[#0a643a] focus:bg-white text-slate-800 transition-all font-medium"
                                    />
                                    {adminformik.touched.email && adminformik.errors.email && (
                                        <span className="text-[11px] text-red-600 font-semibold mt-1 block">{adminformik.errors.email}</span>
                                    )}
                                </div>
                            </div>

                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                                <div>
                                    <label className="block text-xs font-bold text-gray-700 mb-1 uppercase tracking-wider">
                                        Faculty *
                                    </label>
                                    <select
                                        name="faculty"
                                        value={adminformik.values.faculty}
                                        onChange={adminformik.handleChange}
                                        onBlur={adminformik.handleBlur}
                                        className="w-full bg-[#f8faf9] border border-gray-300 rounded-xl px-3 py-2.5 text-xs outline-none focus:border-[#0a643a] focus:bg-white text-slate-800 transition-all font-medium"
                                    >
                                        <option value="" disabled>Select Faculty</option>
                                        <option value="FET">Engineering & Tech (FET)</option>
                                        <option value="FCI">Computing & Informatics (FCI)</option>
                                        <option value="FPAS">Pure & Applied Sci (FPAS)</option>
                                        <option value="FAG">Agricultural Sciences (FAG)</option>
                                        <option value="FRNR">Renewable Resources (FRNR)</option>
                                        <option value="FMS">Management Sciences (FMS)</option>
                                        <option value="FES">Environmental Sci (FES)</option>
                                        <option value="FEC">Food & Consumer Sci (FEC)</option>
                                        <option value="FASS">Arts & Social Sci (FASS)</option>
                                        <option value="FBMS">Basic Medical Sci (FBMS)</option>
                                        <option value="FCS">Clinical Sciences (FCS)</option>
                                        <option value="FBCS">Basic Clinical Sci (FBCS)</option>
                                        <option value="FCNS">Nursing Sciences (FCNS)</option>
                                    </select>
                                </div>

                                <div>
                                    <label className="block text-xs font-bold text-gray-700 mb-1 uppercase tracking-wider">
                                        Department
                                    </label>
                                    <select
                                        name="department"
                                        disabled={!adminformik.values.faculty}
                                        value={adminformik.values.department}
                                        onChange={adminformik.handleChange}
                                        onBlur={adminformik.handleBlur}
                                        className="w-full bg-[#f8faf9] disabled:opacity-60 border border-gray-300 rounded-xl px-3 py-2.5 text-xs outline-none focus:border-[#0a643a] focus:bg-white text-slate-800 transition-all font-medium"
                                    >
                                        <option value="" disabled>Select Dept</option>
                                        {adminformik.values.faculty && facultyDepartments[adminformik.values.faculty]?.map((dept) => (
                                            <option key={dept} value={dept}>{dept}</option>
                                        ))}
                                    </select>
                                </div>
                            </div>

                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                                <div>
                                    <label className="block text-xs font-bold text-gray-700 mb-1 uppercase tracking-wider">
                                        Password *
                                    </label>
                                    <input
                                        type={showPassword ? "text" : "password"}
                                        name="password"
                                        placeholder="••••••••"
                                        value={adminformik.values.password}
                                        onChange={adminformik.handleChange}
                                        onBlur={adminformik.handleBlur}
                                        className="w-full bg-[#f8faf9] border border-gray-300 rounded-xl px-3.5 py-2.5 text-xs outline-none focus:border-[#0a643a] focus:bg-white text-slate-800 transition-all font-medium"
                                    />
                                    {adminformik.touched.password && adminformik.errors.password && (
                                        <span className="text-[11px] text-red-600 font-semibold mt-1 block">{adminformik.errors.password}</span>
                                    )}
                                </div>

                                <div>
                                    <label className="block text-xs font-bold text-gray-700 mb-1 uppercase tracking-wider">
                                        Confirm Password *
                                    </label>
                                    <input
                                        type={showPassword ? "text" : "password"}
                                        name="confirmPassword"
                                        placeholder="••••••••"
                                        value={adminformik.values.confirmPassword}
                                        onChange={adminformik.handleChange}
                                        onBlur={adminformik.handleBlur}
                                        className="w-full bg-[#f8faf9] border border-gray-300 rounded-xl px-3.5 py-2.5 text-xs outline-none focus:border-[#0a643a] focus:bg-white text-slate-800 transition-all font-medium"
                                    />
                                    {adminformik.touched.confirmPassword && adminformik.errors.confirmPassword && (
                                        <span className="text-[11px] text-red-600 font-semibold mt-1 block">{adminformik.errors.confirmPassword}</span>
                                    )}
                                </div>
                            </div>

                            <div>
                                <label className="block text-xs font-bold text-[#0a643a] mb-1 uppercase tracking-wider">
                                    Single-Use Invite Verification Token *
                                </label>
                                <input
                                    type="text"
                                    name="verifyToken"
                                    placeholder="Enter invite token generated by Dept / Deanery"
                                    value={adminformik.values.verifyToken}
                                    onChange={adminformik.handleChange}
                                    onBlur={adminformik.handleBlur}
                                    className="w-full bg-emerald-50/50 border border-emerald-300 rounded-xl px-3.5 py-2.5 text-xs outline-none focus:border-[#0a643a] focus:bg-white text-slate-800 transition-all font-mono font-bold"
                                />
                                {adminformik.touched.verifyToken && adminformik.errors.verifyToken && (
                                    <span className="text-[11px] text-red-600 font-semibold mt-1 block">{adminformik.errors.verifyToken}</span>
                                )}
                            </div>

                            <button
                                type="submit"
                                disabled={adminformik.isSubmitting}
                                className="w-full py-3.5 bg-[#0a643a] hover:bg-[#08522f] disabled:opacity-60 text-white font-bold text-xs rounded-xl transition-all shadow-md hover:shadow-lg cursor-pointer flex items-center justify-center gap-2 mt-2"
                            >
                                <span>{adminformik.isSubmitting ? "Verifying & Creating..." : "Create Staff Account"}</span>
                                <span>&rarr;</span>
                            </button>
                        </form>
                    )}

                    {/* Switch Link to SignIn */}
                    <div className="pt-2 text-center text-xs text-gray-600 font-medium">
                        Already have an account?{" "}
                        <Link to="/signin" className="text-[#0a643a] font-bold hover:underline">
                            Log in here &rarr;
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

export default SignUp;
