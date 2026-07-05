import axios from 'axios';
import { useFormik } from 'formik';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import * as yup from 'yup';


const SignUp = () => {
    const navigate = useNavigate();
    const [activeForm, setActiveForm] = useState('student');
    const registerUrl = import.meta.env.VITE_REGISTER_URL;
    const adminRegisterUrl = import.meta.env.VITE_ADMIN_REGISTER_URL
    const formik = useFormik({
        initialValues: {
            firstname: "",
            lastname: "",
            email: "",
            matricno: "",
            password: "",
            confirmpassword: "",
        },

        onSubmit: async (values, { setSubmitting }) => {
            try {
                const response = await axios.post(registerUrl, values);
                
                console.log(response);
                if (response.status === 200 || response.status === 201) {
                    navigate('/signin');
                }
            } catch (err) {
                console.log(err);
            } finally {
                setSubmitting(false);
            }
        },
        validationSchema: yup.object({
            firstname: yup.string().required("This field is required"),
            lastname: yup.string().required("This field is required"),
            email: yup.string().required("This field is required").email("This is not valid email"),
            matricno: yup.string().required("This field is required").matches(/^\d+$/, "Matric number must be numeric").matches(/^\d{10}$/, "Matric number must be exactly 10 digits"),
            password: yup.string().required("This field is required").min(6, "min of 6 characters"),
            confirmpassword: yup.string().required("This field is required").min(6, "min of 6 characters").oneOf([yup.ref('password'), null], "Passwords must match"),
        })
    })

    const adminformik = useFormik({
        initialValues: {
            fullName: "",
            email: "",
            password: "",
            confirmPassword: "",
            verifyToken: "",
        },
        onSubmit: async (values, { setSubmitting }) => {
            try {
                const response = await axios.post(adminRegisterUrl, values);
                console.log(response);
                if (response.status === 200 || response.status === 201) {
                    navigate('/signin');
                }
            } catch (err) {
                console.log(err);
            } finally {
                setSubmitting(false);
            }
        },
        validationSchema: yup.object({
            fullName: yup.string().required('This field is required').trim(),
            email: yup.string().required('This field is required').email('Invalid email').trim(),
            password: yup.string().required('This field is required').min(6, 'Min of 6 characters'),
            confirmPassword: yup.string().required('This field is required').min(6, 'Min of 6 characters').oneOf([yup.ref('password'), null], 'Passwords must match'),
            verifyToken: yup.string().required('Verify token is required'),
        })
    })

    const signup = () => {
        axios.post(registerUrl, formik.values)
            .then((response) => {
                console.log(response);
                if (response.status === 200 || response.status === 201) {
                    navigate('/signin');
                }
            })
            .catch((err) => {
                console.log(err)
            })
        console.log(formik.values)
    }

    const studentHandler = () => {
        setActiveForm('student');
    };

    const lecturerHandler = () => {
        setActiveForm('lecturer');
    };
    return (
        <>
            <div className='bg-[#f5f5f5] h-screen flex items-center justify-center'>
                <div className='container mx-auto py-0 w-[450px] border-1 border-gray-300 rounded-lg'>
                    <div className='bg-[#f0f4f1] p-6 rounded-lg'>
                        <h4 className='text-[#0a643a] mb-2'>Create Account</h4>
                        <p className='text-[#3f4941]'>Join the Institutional Smart Attendance System</p>
                    </div>
                    <hr className='text-gray-300' />
                    <div className='bg-white p-6'>
                        <span>I am a... </span>
                        <div className='bg-[#e2e9ec] w-full flex justify-between rounded-md space-x-4 mt-2 mb-3 p-1'>
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
                        <form id='studentForm' onSubmit={formik.handleSubmit} style={{ display: activeForm === 'student' ? 'block' : 'none' }}>
                            <label className='text-[#3f4941] text-lg'>First Name</label>
                            <input className="w-full border border-outline p-3  rounded-lg focus:ring-0.5 focus:ring-[#0a643a] focus:ring-opacity-10 focus:border-[#0a643a] outline-none transition-all font-body-md text-body-md" name="firstname" placeholder="John" required="" type="text" onChange={formik.handleChange} value={formik.values.firstname} onBlur={formik.handleBlur} />
                            <small className='block mb-3 text-[#ba1a1a] font-semibold'>{formik.touched.firstname && formik.errors.firstname}</small>

                            <label className='text-[#3f4941] text-lg'>Last Name</label>
                            <input className="w-full border border-outline p-3  rounded-lg focus:ring-0.5 focus:ring-[#0a643a] focus:ring-opacity-10 focus:border-[#0a643a] outline-none transition-all font-body-md text-body-md" name="lastname" placeholder="Doe" required="" type="text" onChange={formik.handleChange} value={formik.values.lastname} onBlur={formik.handleBlur} />
                            <small className='block mb-3 text-[#ba1a1a] font-semibold'>{formik.touched.lastname && formik.errors.lastname}</small>

                            <label className='text-[#3f4941] text-lg'>Email</label>
                            <input className="w-full border border-outline p-3  rounded-lg focus:ring-0.5 focus:ring-[#0a643a] focus:ring-opacity-10 focus:border-[#0a643a] outline-none transition-all font-body-md text-body-md" name="email" placeholder="john.doe@email.com" required="" type="email" onChange={formik.handleChange} value={formik.values.email} onBlur={formik.handleBlur} />
                            <small className='block mb-3 text-[#ba1a1a] font-semibold'>{formik.touched.email && formik.errors.email}</small>

                            <label className='text-[#3f4941] text-lg'>Matric No:</label>
                            <input className="w-full border border-outline p-3 rounded-lg focus:ring-0.5 focus:ring-[#0a643a] focus:ring-opacity-10 focus:border-[#0a643a] outline-none transition-all font-body-md text-body-md" name="matricno" placeholder="matric no" required="" type="text" onChange={formik.handleChange} value={formik.values.matricno} onBlur={formik.handleBlur} />
                            <small className='text-[#ba1a1a] font-semibold'>{formik.touched.matricno && formik.errors.matricno}</small>

                            <div className='flex gap-4 mt-3'>
                                <div>
                                    <label className='text-[#3f4941] text-lg'>Password</label>
                                    <input className="w-full border border-outline p-3 mt-2 rounded-lg focus:ring-0.5 focus:ring-[#0a643a] focus:ring-opacity-10 focus:border-[#0a643a] outline-none transition-all font-body-md text-body-md" name="password" placeholder="********" type="password" onChange={formik.handleChange} value={formik.values.password} onBlur={formik.handleBlur} />
                                    <small className='text-[#ba1a1a] font-semibold'>{formik.touched.password && formik.errors.password}</small>
                                </div>
                                <div>
                                    <label htmlFor="confirmPassword">Confirm Password</label>
                                    <input className="w-full border border-outline p-3 mt-2 rounded-lg focus:ring-0.5 focus:ring-[#0a643a] focus:ring-opacity-10 focus:border-[#0a643a] outline-none transition-all font-body-md text-body-md" name="confirmpassword" placeholder="********" required="" type="password" onChange={formik.handleChange} value={formik.values.confirmpassword} onBlur={formik.handleBlur} />
                                    <small className='text-[#ba1a1a] font-semibold'>{formik.touched.confirmpassword && formik.errors.confirmpassword}</small>
                                </div>
                            </div>
                            <div className='flex items-center justify-between mt-6'>
                                <button
                                    className='bg-[#0a643a] text-white py-2 px-4 rounded-sm w-full disabled:opacity-60 disabled:cursor-not-allowed'
                                    type='submit'
                                    disabled={formik.isSubmitting}
                                >
                                    {formik.isSubmitting ? 'Creating...' : 'Create Account'}
                                </button>
                            </div>
                            <p className='text-[#3f4941] text-sm mt-4 text-center'>Already have an account? <a href="/signin" className='text-[#0a643a] hover:underline'><strong>Log in</strong></a></p>
                        </form>
                        <form id='lecturerForm' onSubmit={adminformik.handleSubmit} style={{ display: activeForm === 'lecturer' ? 'block' : 'none' }}>
                            <label className='text-[#3f4941] text-lg'>Full Name</label>
                            <input className="w-full border border-outline p-3 my-3 rounded-lg focus:ring-0.5 focus:ring-[#0a643a] focus:ring-opacity-10 focus:border-[#0a643a] outline-none transition-all font-body-md text-body-md" name="fullName" placeholder="John Doe" type="text" onChange={adminformik.handleChange} value={adminformik.values.fullName} onBlur={adminformik.handleBlur} />
                            <small className='block mb-3 text-[#ba1a1a] font-semibold'>{adminformik.touched.fullName && adminformik.errors.fullName}</small>

                            <label className='text-[#3f4941] text-lg'>Institution Email</label>
                            <input className="w-full border border-outline p-3 mt-2 rounded-lg focus:ring-0.5 focus:ring-[#0a643a] focus:ring-opacity-10 focus:border-[#0a643a] outline-none transition-all font-body-md text-body-md" name="email" placeholder="john.doe@university.edu" type="email" onChange={adminformik.handleChange} value={adminformik.values.email} onBlur={adminformik.handleBlur} />
                            <small className='block mb-3 text-[#ba1a1a] font-semibold'>{adminformik.touched.email && adminformik.errors.email}</small>
                            <div className='flex gap-4 mt-3'>
                                <div>
                                    <label className='text-[#3f4941] text-lg'>Password</label>
                                    <input className="w-full border border-outline p-3 mt-2 rounded-lg focus:ring-0.5 focus:ring-[#0a643a] focus:ring-opacity-10 focus:border-[#0a643a] outline-none transition-all font-body-md text-body-md" name="password" placeholder="********" type="password" onChange={adminformik.handleChange} value={adminformik.values.password} onBlur={adminformik.handleBlur} />
                                    <small className='block mb-3 text-[#ba1a1a] font-semibold'>{adminformik.touched.password && adminformik.errors.password}</small>
                                </div>
                                <div>
                                    <label htmlFor="confirmPassword">Confirm Password</label>
                                    <input className="w-full border border-outline p-3 mt-2 rounded-lg focus:ring-0.5 focus:ring-[#0a643a] focus:ring-opacity-10 focus:border-[#0a643a] outline-none transition-all font-body-md text-body-md" name="confirmPassword" placeholder="********" type="password" onChange={adminformik.handleChange} value={adminformik.values.confirmPassword} onBlur={adminformik.handleBlur} />
                                    <small className='block mb-3 text-[#ba1a1a] font-semibold'>{adminformik.touched.confirmPassword && adminformik.errors.confirmPassword}</small>
                                </div>
                            </div>
                            <label className='text-[#3f4941] text-lg mt-3 block'>Admin Verify Token</label>
                            <input className="w-full border border-outline p-3 mt-2 rounded-lg focus:ring-0.5 focus:ring-[#0a643a] focus:ring-opacity-10 focus:border-[#0a643a] outline-none transition-all font-body-md text-body-md" name="verifyToken" placeholder="Enter token provided by admin" type="text" onChange={adminformik.handleChange} value={adminformik.values.verifyToken} onBlur={adminformik.handleBlur} />
                            <small className='block mb-3 text-[#ba1a1a] font-semibold'>{adminformik.touched.verifyToken && adminformik.errors.verifyToken}</small>
                            <div className='flex items-center justify-between mt-6'>
                                <button
                                    className='bg-[#0a643a] text-white py-2 px-4 rounded-sm w-full disabled:opacity-60 disabled:cursor-not-allowed'
                                    type='submit'
                                    disabled={adminformik.isSubmitting}
                                >
                                    {adminformik.isSubmitting ? 'Creating...' : 'Create Account'}
                                </button>
                            </div>
                            <p className='text-[#3f4941] text-sm mt-4 text-center'>Already have an account? <a href="/signin" className='text-[#0a643a] hover:underline'><strong>Log in</strong></a></p>
                        </form>
                    </div>
                </div>
            </div>
        </>
    )
}

export default SignUp
