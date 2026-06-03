import { useState } from 'react';

const SignUp = () => {
    const [activeForm, setActiveForm] = useState('student');

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
                        <form id='studentForm' style={{ display: activeForm === 'student' ? 'block' : 'none' }}>
                            <label className='text-[#3f4941] text-lg'>Full Name</label>
                            <input className="w-full border border-outline p-3 my-3 rounded-lg focus:ring-0.5 focus:ring-[#0a643a] focus:ring-opacity-10 focus:border-[#0a643a] outline-none transition-all font-body-md text-body-md" id="fullName" placeholder="John Doe" required="" type="text" />

                            <label className='text-[#3f4941] text-lg'>Email</label>
                            <input className="w-full border border-outline p-3 mt-2 rounded-lg focus:ring-0.5 focus:ring-[#0a643a] focus:ring-opacity-10 focus:border-[#0a643a] outline-none transition-all font-body-md text-body-md" id="Email" placeholder="john.doe@email.com" required="" type="email" />
                            <div className='flex gap-4 mt-3'>
                                <div>
                                    <label className='text-[#3f4941] text-lg'>Password</label>
                                    <input className="w-full border border-outline p-3 mt-2 rounded-lg focus:ring-0.5 focus:ring-[#0a643a] focus:ring-opacity-10 focus:border-[#0a643a] outline-none transition-all font-body-md text-body-md" id="password" placeholder="********" required="" type="password" />
                                </div>
                                <div>
                                    <label htmlFor="confirmPassword">Confirm Password</label>
                                    <input className="w-full border border-outline p-3 mt-2 rounded-lg focus:ring-0.5 focus:ring-[#0a643a] focus:ring-opacity-10 focus:border-[#0a643a] outline-none transition-all font-body-md text-body-md" id="confirmPassword" placeholder="********" required="" type="password" />
                                </div>
                            </div>
                            <div className='flex items-center justify-between mt-6'>
                                <button className='bg-[#0a643a] text-white py-2 px-4 rounded-sm w-full'>Create Account</button>
                            </div>
                            <p className='text-[#3f4941] text-sm mt-4 text-center'>Already have an account? <a href="/signin" className='text-[#0a643a] hover:underline'><strong>Log in</strong></a></p>
                        </form>
                        <form id='lecturerForm' style={{ display: activeForm === 'lecturer' ? 'block' : 'none' }}>
                            <label className='text-[#3f4941] text-lg'>Full Name</label>
                            <input className="w-full border border-outline p-3 my-3 rounded-lg focus:ring-0.5 focus:ring-[#0a643a] focus:ring-opacity-10 focus:border-[#0a643a] outline-none transition-all font-body-md text-body-md" id="fullName" placeholder="John Doe" required="" type="text" />

                            <label className='text-[#3f4941] text-lg'>Institution Email</label>
                            <input className="w-full border border-outline p-3 mt-2 rounded-lg focus:ring-0.5 focus:ring-[#0a643a] focus:ring-opacity-10 focus:border-[#0a643a] outline-none transition-all font-body-md text-body-md" id="institutionEmail" placeholder="john.doe@university.edu" required="" type="email" />
                            <div className='flex gap-4 mt-3'>
                                <div>
                                    <label className='text-[#3f4941] text-lg'>Password</label>
                                    <input className="w-full border border-outline p-3 mt-2 rounded-lg focus:ring-0.5 focus:ring-[#0a643a] focus:ring-opacity-10 focus:border-[#0a643a] outline-none transition-all font-body-md text-body-md" id="password" placeholder="********" required="" type="password" />
                                </div>
                                <div>
                                    <label htmlFor="confirmPassword">Confirm Password</label>
                                    <input className="w-full border border-outline p-3 mt-2 rounded-lg focus:ring-0.5 focus:ring-[#0a643a] focus:ring-opacity-10 focus:border-[#0a643a] outline-none transition-all font-body-md text-body-md" id="confirmPassword" placeholder="********" required="" type="password" />
                                </div>
                            </div>
                            <div className='flex items-center justify-between mt-6'>
                                <button className='bg-[#0a643a] text-white py-2 px-4 rounded-sm w-full'>Create Account</button>
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
