import axios from 'axios';
import { useFormik } from 'formik';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import * as yup from 'yup';


const SignUp = () => {
    const navigate = useNavigate();
    const [activeForm, setActiveForm] = useState('student');
    const [error, setError] = useState('');
    const registerUrl = import.meta.env.VITE_REGISTER_URL;
    const adminRegisterUrl = import.meta.env.VITE_ADMIN_REGISTER_URL;

    const formik = useFormik({
        initialValues: {
            firstname: "",
            lastname: "",
            email: "",
            matricno: "",
            faculty: "",
            department: "",
            password: "",
            confirmpassword: "",
        },

        onSubmit: async (values, { setSubmitting, setFieldError }) => {
            setError('');
            try {
                const response = await axios.post(registerUrl, values);
                console.log(response);
                if (response.status === 200 || response.status === 201) {
                    navigate('/signin');
                }
            } catch (err) {
                console.log(err);
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
            firstname: yup.string().required("This field is required"),
            lastname: yup.string().required("This field is required"),
            email: yup.string().required("This field is required").email("This is not valid email"),
            matricno: yup.string().required("This field is required").matches(/^\d+$/, "Matric number must be numeric").matches(/^\d{10}$/, "Matric number must be exactly 10 digits"),
            faculty: yup.string().required("This field is required"),
            department: yup.string().required("This field is required"),
            password: yup.string().required("This field is required").min(6, "min of 6 characters"),
            confirmpassword: yup.string().required("This field is required").min(6, "min of 6 characters").oneOf([yup.ref('password'), null], "Passwords must match"),
        })
    })

    const adminformik = useFormik({
        initialValues: {
            fullName: "",
            email: "",
            password: "",
            faculty: "",
            department: "",
            confirmPassword: "",
            verifyToken: "",
        },
        onSubmit: async (values, { setSubmitting, setFieldError }) => {
            setError('');
            try {
                const response = await axios.post(adminRegisterUrl, values);
                console.log(response);
                if (response.status === 200 || response.status === 201) {
                    navigate('/signin');
                }
            } catch (err) {
                console.log(err);
                const msg = err.response?.data?.message || 'Registration failed. Please try again.';
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
            fullName: yup.string().required('This field is required').trim(),
            email: yup.string().required('This field is required').email('Invalid email').trim(),
            faculty: yup.string().required('This field is required').trim(),
            department: yup.string().required('This field is required').trim(),
            password: yup.string().required('This field is required').min(6, 'Min of 6 characters'),
            confirmPassword: yup.string().required('This field is required').min(6, 'Min of 6 characters').oneOf([yup.ref('password'), null], 'Passwords must match'),
            verifyToken: yup.string().required('Verify token is required'),
        })
    })

    const studentHandler = () => {
        setActiveForm('student');
        setError('');
    };

    const lecturerHandler = () => {
        setActiveForm('lecturer');
        setError('');
    };
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
                            {error && (
                                <div className="flex items-center gap-2 bg-[#fdecea] border border-[#ba1a1a] text-[#ba1a1a] rounded-lg px-4 py-3 text-sm mb-4 animate-pulse">
                                    <span className="material-symbols-outlined text-base">error</span>
                                    <span className="font-semibold">{error}</span>
                                </div>
                            )}
                            <div className='flex gap-2'>
                                <div>
                                    <label className='text-[#3f4941] text-lg'>First Name</label>
                                    <input className="w-full border border-outline p-3  rounded-lg focus:ring-0.5 focus:ring-[#0a643a] focus:ring-opacity-10 focus:border-[#0a643a] outline-none transition-all font-body-md text-body-md" name="firstname" placeholder="John" required="" type="text" onChange={formik.handleChange} value={formik.values.firstname} onBlur={formik.handleBlur} />
                                    <small className='block mb-3 text-[#ba1a1a] font-semibold'>{formik.touched.firstname && formik.errors.firstname}</small>
                                </div>
                                <div>
                                    <label className='text-[#3f4941] text-lg'>Last Name</label>
                                    <input className="w-full border border-outline p-3  rounded-lg focus:ring-0.5 focus:ring-[#0a643a] focus:ring-opacity-10 focus:border-[#0a643a] outline-none transition-all font-body-md text-body-md" name="lastname" placeholder="Doe" required="" type="text" onChange={formik.handleChange} value={formik.values.lastname} onBlur={formik.handleBlur} />
                                    <small className='block mb-3 text-[#ba1a1a] font-semibold'>{formik.touched.lastname && formik.errors.lastname}</small>
                                </div>
                            </div>
                            <div>
                                <div>
                                    <label className='text-[#3f4941] text-lg'>Faculty</label>
                                    <select name="faculty" className='w-full border border-outline p-3 bg-[#f0f4f1] rounded-lg focus:ring-0.5 focus:ring-[#0a643a] focus:ring-opacity-10 focus:border-[#0a643a] outline-none transition-all font-body-md text-body-md' onChange={formik.handleChange} value={formik.values.faculty} onBlur={formik.handleBlur}>
                                        <option value="" disabled>Select Faculty</option>
                                        <option value="FET">Faculty of Engineering and Technology (FET)</option>
                                        <option value="FCI">Faculty of Computing and Informatics (FCI)</option>
                                        <option value="FPAS">Faculty of Pure and Applied Sciences (FPAS)</option>
                                        <option value="FAG">Faculty of Agriculture Sciences (FAG)</option>
                                        <option value="FRNR">Faculty of Renewable Natural Resources (FRNR)</option>
                                        <option value="FMS">Faculty of Management Sciences (FMS)</option>
                                        <option value="FES">Faculty of Environmental Sciences (FES)</option>
                                        <option value="FEC">Faculty of Food and Consumer Sciences (FEC)</option>
                                        <option value="FASS">Faculty of Arts and Social Sciences (FASS)</option>
                                        <option value="FBMS">Faculty of Basic Medical Sciences (FBMS)</option>
                                        <option value="FCS">Faculty of Clinical Sciences (FCS)</option>
                                        <option value="FBCS">Faculty of Basic Clinical Sciences (FBCS)</option>
                                        <option value="FCNS">Faculty of Clinical Nursing Sciences (FCNS)</option>
                                    </select>
                                    <small className='block mb-3 text-[#ba1a1a] font-semibold'>{formik.touched.faculty && formik.errors.faculty}</small>
                                </div>
                            </div>

                            {formik.values.faculty && facultyDepartments[formik.values.faculty] && (
                                <div className="mb-3">
                                    <label className='text-[#3f4941] text-lg'>Department</label>
                                    <select name="department" className='w-full border border-outline p-3 bg-[#f0f4f1] rounded-lg focus:ring-0.5 focus:ring-[#0a643a] focus:ring-opacity-10 focus:border-[#0a643a] outline-none transition-all font-body-md text-body-md' onChange={formik.handleChange} value={formik.values.department} onBlur={formik.handleBlur}>
                                        <option value="" disabled>Select Department</option>
                                        {facultyDepartments[formik.values.faculty].map((dept) => (
                                            <option key={dept} value={dept}>{dept}</option>
                                        ))}
                                    </select>
                                    <small className='block mb-3 text-[#ba1a1a] font-semibold'>{formik.touched.department && formik.errors.department}</small>
                                </div>
                            )}
                            <div className='flex gap-2'>
                                <div>
                                    <label className='text-[#3f4941] text-lg'>Email</label>
                                    <input className="w-full border border-outline p-3  rounded-lg focus:ring-0.5 focus:ring-[#0a643a] focus:ring-opacity-10 focus:border-[#0a643a] outline-none transition-all font-body-md text-body-md" name="email" placeholder="john.doe@email.com" required="" type="email" onChange={formik.handleChange} value={formik.values.email} onBlur={formik.handleBlur} />
                                    <small className='block mb-3 text-[#ba1a1a] font-semibold'>{formik.touched.email && formik.errors.email}</small>
                                </div>
                                <div>
                                    <label className='text-[#3f4941] text-lg'>Matric No:</label>
                                    <input className="w-full border border-outline p-3 rounded-lg focus:ring-0.5 focus:ring-[#0a643a] focus:ring-opacity-10 focus:border-[#0a643a] outline-none transition-all font-body-md text-body-md" name="matricno" placeholder="matric no" required="" type="text" onChange={formik.handleChange} value={formik.values.matricno} onBlur={formik.handleBlur} />
                                    <small className='text-[#ba1a1a] font-semibold'>{formik.touched.matricno && formik.errors.matricno}</small>
                                </div>
                            </div>
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
                            {error && (
                                <div className="flex items-center gap-2 bg-[#fdecea] border border-[#ba1a1a] text-[#ba1a1a] rounded-lg px-4 py-3 text-sm mb-4 animate-pulse">
                                    <span className="material-symbols-outlined text-base">error</span>
                                    <span className="font-semibold">{error}</span>
                                </div>
                            )}
                            <label className='text-[#3f4941] text-lg'>Full Name</label>
                            <input className="w-full border border-outline p-3 my-3 rounded-lg focus:ring-0.5 focus:ring-[#0a643a] focus:ring-opacity-10 focus:border-[#0a643a] outline-none transition-all font-body-md text-body-md" name="fullName" placeholder="John Doe" type="text" onChange={adminformik.handleChange} value={adminformik.values.fullName} onBlur={adminformik.handleBlur} />
                            <small className='block mb-3 text-[#ba1a1a] font-semibold'>{adminformik.touched.fullName && adminformik.errors.fullName}</small>

                            <label className='text-[#3f4941] text-lg'>Institution Email</label>
                            <input className="w-full border border-outline p-3 mt-2 rounded-lg focus:ring-0.5 focus:ring-[#0a643a] focus:ring-opacity-10 focus:border-[#0a643a] outline-none transition-all font-body-md text-body-md" name="email" placeholder="john.doe@university.edu" type="email" onChange={adminformik.handleChange} value={adminformik.values.email} onBlur={adminformik.handleBlur} />
                            <small className='block mb-3 text-[#ba1a1a] font-semibold'>{adminformik.touched.email && adminformik.errors.email}</small>
                            <div>
                                <div>
                                    <label className='text-[#3f4941] text-lg'>Faculty</label>
                                    <select name="faculty" className='w-full border border-outline p-3 bg-[#f0f4f1] rounded-lg focus:ring-0.5 focus:ring-[#0a643a] focus:ring-opacity-10 focus:border-[#0a643a] outline-none transition-all font-body-md text-body-md' onChange={formik.handleChange} value={formik.values.faculty} onBlur={formik.handleBlur}>
                                        <option value="" disabled>Select Faculty</option>
                                        <option value="FET">Faculty of Engineering and Technology (FET)</option>
                                        <option value="FCI">Faculty of Computing and Informatics (FCI)</option>
                                        <option value="FPAS">Faculty of Pure and Applied Sciences (FPAS)</option>
                                        <option value="FAG">Faculty of Agriculture Sciences (FAG)</option>
                                        <option value="FRNR">Faculty of Renewable Natural Resources (FRNR)</option>
                                        <option value="FMS">Faculty of Management Sciences (FMS)</option>
                                        <option value="FES">Faculty of Environmental Sciences (FES)</option>
                                        <option value="FEC">Faculty of Food and Consumer Sciences (FEC)</option>
                                        <option value="FASS">Faculty of Arts and Social Sciences (FASS)</option>
                                        <option value="FBMS">Faculty of Basic Medical Sciences (FBMS)</option>
                                        <option value="FCS">Faculty of Clinical Sciences (FCS)</option>
                                        <option value="FBCS">Faculty of Basic Clinical Sciences (FBCS)</option>
                                        <option value="FCNS">Faculty of Clinical Nursing Sciences (FCNS)</option>
                                    </select>
                                    <small className='block mb-3 text-[#ba1a1a] font-semibold'>{formik.touched.faculty && formik.errors.faculty}</small>
                                </div>
                            </div>

                            {formik.values.faculty && facultyDepartments[formik.values.faculty] && (
                                <div className="mb-3">
                                    <label className='text-[#3f4941] text-lg'>Department</label>
                                    <select name="department" className='w-full border border-outline p-3 bg-[#f0f4f1] rounded-lg focus:ring-0.5 focus:ring-[#0a643a] focus:ring-opacity-10 focus:border-[#0a643a] outline-none transition-all font-body-md text-body-md' onChange={formik.handleChange} value={formik.values.department} onBlur={formik.handleBlur}>
                                        <option value="" disabled>Select Department</option>
                                        {facultyDepartments[formik.values.faculty].map((dept) => (
                                            <option key={dept} value={dept}>{dept}</option>
                                        ))}
                                    </select>
                                    <small className='block mb-3 text-[#ba1a1a] font-semibold'>{formik.touched.department && formik.errors.department}</small>
                                </div>
                            )}
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
