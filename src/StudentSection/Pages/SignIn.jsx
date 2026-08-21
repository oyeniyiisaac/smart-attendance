import api from '../../Utils/api';
import { useFormik } from 'formik';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import * as yup from 'yup';

const SignIn = () => {
    const navigate = useNavigate();
    const [activeForm, setActiveForm] = useState('student');
    const [studentAlert, setStudentAlert] = useState(false);

    const formik = useFormik({
        initialValues: {
            matricno: "",
            password: ""
        },

        onSubmit: async (values, { setSubmitting }) => {
            try {
                const response = await api.post('/login', values);
                console.log(response);
                if (response.status === 200 || response.status === 201) {
                    localStorage.token = response.data.token
                    navigate('/student/dashboard');
                }
            } catch (err) {
                console.log(err);
                if (err.response?.status === 401) {
                    setStudentAlert(true);
                }
            } finally {
                setSubmitting(false);
            }
        },
        validationSchema: yup.object({
            matricno: yup.string().required("This field is required").matches(/^\d+$/, "Matric number must be numeric").matches(/^\d{10}$/, "Matric number must be exactly 10 digits"),
            password: yup.string().required("This field is required").min(6, "min of 6 characters")
        })
    })

    const adminformik = useFormik({
        initialValues: {
            email: "",        // ✅ must match what the backend reads: req.body.email
            password: "",     // ✅ must match what the backend reads: req.body.password
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
                const msg = err.response?.data?.message || 'Login failed. Check your credentials.';
                setStatus(msg);
            } finally {
                setSubmitting(false);
            }
        },
        validationSchema: yup.object({
            email: yup.string().required('Email is required').email('Enter a valid email'),
            password: yup.string().required('Password is required').min(6, 'Min 6 characters'),
        })
    })
    // console.log(adminformik.values)

    // const signin = () => {
    //     axios.post(loginUrl, formik.values)
    //         .then((response) => {
    //             console.log(response);
    //             if (response.status === 200 || response.status === 201) {
    //                 navigate('/student-dashboard');
    //             }
    //         })
    //         .catch((err) => {
    //             console.log(err)
    //         })
    //     console.log(formik.values)
    // }
    const studentHandler = () => {
        setActiveForm('student');
    };

    const lecturerHandler = () => {
        setActiveForm('lecturer');
    };
    // const studentDashboard = () => {
    //     console.log('open to student dashboard');
    //     window.location.href = '/student-dashboard';
    // }
    // const lecturerDashboard = () => {
    //     console.log('open to dashboard');
    //     window.location.href = '/admin/lecturer-dashboard';
    // }
    return (
        <>
            <div className='bg-[#f5f5f5] h-screen flex items-center justify-center font-sans'>
                <div className='container mx-auto py-0 w-[450px] border-1 border-gray-300 rounded-lg'>
                    <div className='bg-[#f0f4f1] p-6 rounded-lg flex flex-col items-center justify-center gap-2'>
                        <div className="bg-[#0a643a] rounded-xl p-4 my-4 w-[20%] text-center flex items-center justify-center"><span className="material-symbols-outlined block text-[#ceffdb]" style={{ fontSize: '3rem', lineHeight: 1 }}>
                            school
                        </span></div>
                        <h1 className="text-[#0a643a] text-[2rem] font-bold leading-[0.5]">Smart Attendance</h1>
                        <span className='text-[#3f4941] text-md'>Institutional Access Portal</span>
                    </div>
                    <hr className='text-gray-300' />
                    <div className='bg-white p-6'>
                        <span className='text-[#3f4941] font-bold text-md m-3'>User Role </span>
                        <div className='bg-[#e2e9ec] w-full flex justify-between border-2 border-[#bfc9bf] rounded-md space-x-4 mt-2 mb-3 p-1'>
                            <button
                                type='button'
                                className={`text-black py-2 px-4 rounded-sm w-[48%] ${activeForm === 'student' ? 'bg-[#0a643a] text-white' : 'bg-transparent text-black'}`}
                                onClick={studentHandler}
                                id='studentBtn'
                            >
                                Student
                            </button>
                            <button
                                type='button'
                                className={`text-black py-2 px-4 rounded-sm w-[48%] ${activeForm === 'lecturer' ? 'bg-[#0a643a] text-white' : 'bg-transparent text-black'}`}
                                onClick={lecturerHandler}
                                id='lecturerBtn'
                            >
                                Lecturer
                            </button>
                        </div>
                        <div className={`p-4 mb-4 text-md text-[#ba1a1a] rounded-md bg-[#fcebeb]     ${studentAlert ? 'block' : 'hidden'}`} role="alert">
                            <span className="font-medium">Invalid Credentials!</span> Please check your credentials and try again.
                        </div>
                        <form id='studentForm' onSubmit={formik.handleSubmit} style={{ display: activeForm === 'student' ? 'block' : 'none' }}>
                            <label className='text-[#3f4941] text-lg'>Matric No</label>
                            <input className="w-full border border-outline p-3 mt-2 rounded-lg focus:ring-0.5 focus:ring-[#0a643a] focus:ring-opacity-10 focus:border-[#0a643a] outline-none transition-all font-body-md text-body-md" placeholder="john.doe@email.com" required="" type="string" id='studentEmail' name="matricno" onChange={formik.handleChange} onBlur={formik.handleBlur} value={formik.values.matricno} />
                            <small className='block mb-3 text-[#ba1a1a] font-semibold'>{formik.touched.matricno && formik.errors.matricno}</small>

                            <label className='text-[#3f4941] text-lg mt-4 block'>Password</label>
                            <input className="w-full border border-outline p-3 mt-2 rounded-lg focus:ring-0.5 focus:ring-[#0a643a] focus:ring-opacity-10 focus:border-[#0a643a] outline-none transition-all font-body-md text-body-md" placeholder="********" required="" type="password" id='studentPassword' name="password" onChange={formik.handleChange} onBlur={formik.handleBlur} value={formik.values.password} />
                            <div className="flex justify-between items-center mt-1 mb-4">
                                <span />
                                <a href="/forgot-password" className="text-xs font-semibold text-[#0a643a] hover:underline">
                                    Forgot Password?
                                </a>
                            </div>

                            <div className='flex items-center justify-between mt-2'>
                                <button
                                    type='submit'
                                    disabled={formik.isSubmitting}
                                    className='bg-[#0a643a] text-white py-2 px-4 rounded-sm w-full disabled:opacity-60 disabled:cursor-not-allowed'
                                >
                                    {formik.isSubmitting ? 'Signing in...' : 'Sign In to Dashboard'}
                                </button>
                            </div>
                        </form>
                        <form id='lecturerForm' onSubmit={adminformik.handleSubmit} style={{ display: activeForm === 'lecturer' ? 'block' : 'none' }}>
                            {/* Server error banner */}
                            {adminformik.status && (
                                <div className='bg-[#fdecea] border border-[#ba1a1a] text-[#ba1a1a] rounded-lg px-4 py-2 text-sm mb-3'>
                                    {adminformik.status}
                                </div>
                            )}

                            <label className='text-[#3f4941] text-lg'>Institutional Email</label>
                            {/* name="email" matches adminformik.initialValues.email */}
                            <input className="w-full border border-outline p-3 mt-2 rounded-lg focus:ring-0.5 focus:ring-[#0a643a] focus:ring-opacity-10 focus:border-[#0a643a] outline-none transition-all font-body-md text-body-md" placeholder="john.doe@university.edu" type="email" name="email" onChange={adminformik.handleChange} onBlur={adminformik.handleBlur} value={adminformik.values.email} />
                            <small className='block mb-3 text-[#ba1a1a] font-semibold'>{adminformik.touched.email && adminformik.errors.email}</small>

                            <label className='text-[#3f4941] text-lg mt-4 block'>Password</label>
                            {/* name="password" matches adminformik.initialValues.password */}
                            <input className="w-full border border-outline p-3 mt-2 rounded-lg focus:ring-0.5 focus:ring-[#0a643a] focus:ring-opacity-10 focus:border-[#0a643a] outline-none transition-all font-body-md text-body-md" placeholder="********" type="password" name="password" onChange={adminformik.handleChange} onBlur={adminformik.handleBlur} value={adminformik.values.password} />
                            <small className='block mb-3 text-[#ba1a1a] font-semibold'>{adminformik.touched.password && adminformik.errors.password}</small>

                            <div className="flex justify-between items-center mt-1 mb-4">
                                <span />
                                <a href="/forgot-password" className="text-xs font-semibold text-[#0a643a] hover:underline">
                                    Forgot Password?
                                </a>
                            </div>

                            <div className='flex items-center justify-between mt-2'>
                                <button
                                    type='submit'
                                    disabled={adminformik.isSubmitting}
                                    className='bg-[#0a643a] text-white py-2 px-4 rounded-sm w-full disabled:opacity-60 disabled:cursor-not-allowed'
                                >
                                    {adminformik.isSubmitting ? 'Signing in...' : 'Sign In to Dashboard'}
                                </button>
                            </div>
                        </form>
                        <p className='text-[#3f4941] text-sm mt-4 text-center'>Don't have an account? <a href="/" className='text-[#0a643a] hover:underline'><strong>Sign up</strong></a></p>
                    </div>
                </div>
            </div>
        </>
    )
}

export default SignIn
