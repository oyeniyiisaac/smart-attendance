import api from '../../Utils/api';
import { useFormik } from 'formik';
import { useNavigate } from 'react-router-dom';
import * as yup from 'yup';

const AdminLogin = () => {
    const navigate = useNavigate();

    const formik = useFormik({
        initialValues: {
            email: '',
            password: '',
        },
        onSubmit: async (values, { setSubmitting, setStatus }) => {
            try {
                const response = await api.post('/admin/login', values);
                if (response.status === 200) {
                    // Save the JWT so future requests can use it
                    localStorage.setItem('adminToken', response.data.token);
                    // Save admin info so the navbar can show the admin's name
                    localStorage.setItem('adminUser', JSON.stringify(response.data.admin));
                    navigate('/admin/lecturer-dashboard');
                }
            } catch (err) {
                // Show the server's error message in the form
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
                .required('Email is required')
                .email('Enter a valid email'),
            password: yup
                .string()
                .required('Password is required')
                .min(6, 'Min 6 characters'),
        }),
    });

    return (
        <div className="bg-[#f5f5f5] min-h-screen flex items-center justify-center">
            <div className="w-[440px] border border-gray-300 rounded-xl overflow-hidden shadow-md">
                {/* Header */}
                <div className="bg-[#f0f4f1] p-8 flex flex-col items-center gap-3">
                    <div className="bg-[#0a643a] rounded-xl p-4 flex items-center justify-center">
                        <span
                            className="material-symbols-outlined text-[#ceffdb]"
                            style={{ fontSize: '2.5rem', lineHeight: 1 }}
                        >
                            admin_panel_settings
                        </span>
                    </div>
                    <h1 className="text-[#0a643a] text-2xl font-bold leading-tight">
                        Admin Portal
                    </h1>
                    <p className="text-[#3f4941] text-sm">
                        Smart Attendance System
                    </p>
                </div>

                <hr className="border-gray-300" />

                {/* Form */}
                <div className="bg-white p-8">
                    <h2 className="text-[#1a1c1a] font-semibold text-lg mb-1">
                        Sign in
                    </h2>
                    <p className="text-[#3f4941] text-sm mb-5">
                        Enter your admin credentials to continue.
                    </p>

                    {/* Server error banner */}
                    {formik.status && (
                        <div className="bg-[#fdecea] border border-[#ba1a1a] text-[#ba1a1a] rounded-lg px-4 py-3 text-sm mb-4">
                            {formik.status}
                        </div>
                    )}

                    <form onSubmit={formik.handleSubmit} noValidate>
                        <label className="text-[#3f4941] text-sm font-medium block mb-1">
                            Email Address
                        </label>
                        <input
                            className="w-full border border-gray-300 p-3 rounded-lg outline-none focus:border-[#0a643a] transition-colors"
                            type="email"
                            name="email"
                            placeholder="admin@university.edu"
                            onChange={formik.handleChange}
                            onBlur={formik.handleBlur}
                            value={formik.values.email}
                        />
                        <small className="block mb-4 text-[#ba1a1a] font-semibold text-xs">
                            {formik.touched.email && formik.errors.email}
                        </small>

                        <label className="text-[#3f4941] text-sm font-medium block mb-1">
                            Password
                        </label>
                        <input
                            className="w-full border border-gray-300 p-3 rounded-lg outline-none focus:border-[#0a643a] transition-colors"
                            type="password"
                            name="password"
                            placeholder="••••••••"
                            onChange={formik.handleChange}
                            onBlur={formik.handleBlur}
                            value={formik.values.password}
                        />
                        <small className="block mb-2 text-[#ba1a1a] font-semibold text-xs">
                            {formik.touched.password && formik.errors.password}
                        </small>

                        <div className="flex justify-between items-center mb-6">
                            <span />
                            <a href="/forgot-password" className="text-xs font-semibold text-[#0a643a] hover:underline">
                                Forgot Password?
                            </a>
                        </div>

                        <button
                            type="submit"
                            disabled={formik.isSubmitting}
                            className="w-full bg-[#0a643a] text-white py-3 rounded-lg font-semibold disabled:opacity-60 disabled:cursor-not-allowed transition-opacity"
                        >
                            {formik.isSubmitting ? 'Signing in...' : 'Sign In to Dashboard'}
                        </button>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default AdminLogin;
