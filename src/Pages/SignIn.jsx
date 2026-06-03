
import { useState } from 'react';

const SignIn = () => {
    const [activeForm, setActiveForm] = useState('student');

    const studentHandler = () => {
        setActiveForm('student');
    };

    const lecturerHandler = () => {
        setActiveForm('lecturer');
    };
    const handleSignIn = (e) => {
        e.preventDefault();
        const studentEmail = document.getElementById('studentEmail').value;
        const studentPassword = document.getElementById('studentPassword').value;
        const lecturerEmail = document.getElementById('lecturerEmail').value;
        const lecturerPassword = document.getElementById('lecturerPassword').value;
        // console.log('Sign in submitted for role:', activeForm);
        // TODO: replace with real auth + navigation
    }
    const studentDashboard = () => {
        console.log('open to student dashboard');
        window.location.href = '/student-dashboard';
    }
    const lecturerDashboard = () => {
        console.log('open to dashboard');
        window.location.href = '/lecturer-dashboard';
    }
    return (
        <>
            <div className='bg-[#f5f5f5] h-screen flex items-center justify-center'>
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
                        <form id='studentForm' onSubmit={handleSignIn} style={{ display: activeForm === 'student' ? 'block' : 'none' }}>
                            <label className='text-[#3f4941] text-lg'>Email</label>
                            <input className="w-full border border-outline p-3 mt-2 rounded-lg focus:ring-0.5 focus:ring-[#0a643a] focus:ring-opacity-10 focus:border-[#0a643a] outline-none transition-all font-body-md text-body-md" placeholder="john.doe@email.com" required="" type="email" id='studentEmail' />

                            <label className='text-[#3f4941] text-lg mt-4 block'>Password</label>
                            <input className="w-full border border-outline p-3 mt-2 rounded-lg focus:ring-0.5 focus:ring-[#0a643a] focus:ring-opacity-10 focus:border-[#0a643a] outline-none transition-all font-body-md text-body-md" placeholder="********" required="" type="password" id='studentPassword' />

                            <div className='flex items-center justify-between mt-6'>
                                <button type='button' onClick={studentDashboard} className='bg-[#0a643a] text-white py-2 px-4 rounded-sm w-full'>Sign In to Dashboard</button>
                            </div>
                        </form>
                        <form id='lecturerForm' onSubmit={handleSignIn} style={{ display: activeForm === 'lecturer' ? 'block' : 'none' }}>
                            <label className='text-[#3f4941] text-lg'>Institutional Email</label>
                            <input className="w-full border border-outline p-3 mt-2 rounded-lg focus:ring-0.5 focus:ring-[#0a643a] focus:ring-opacity-10 focus:border-[#0a643a] outline-none transition-all font-body-md text-body-md" placeholder="john.doe@university.edu" required="" type="email" id="lecturerEmail" />

                            <label className='text-[#3f4941] text-lg mt-4 block'>Password</label>
                            <input className="w-full border border-outline p-3 mt-2 rounded-lg focus:ring-0.5 focus:ring-[#0a643a] focus:ring-opacity-10 focus:border-[#0a643a] outline-none transition-all font-body-md text-body-md" placeholder="********" required="" type="password" id="lecturerPassword" />

                            <div className='flex items-center justify-between mt-6 cursor-pointer'>
                                <button type='button' onClick={lecturerDashboard} className='bg-[#0a643a] text-white py-2 px-4 rounded-sm w-full'>Sign In to Dashboard</button>
                            </div>
                        </form>
                        <p className='text-[#3f4941] text-sm mt-4 text-center'>Don't have an account? <a href="/signup" className='text-[#0a643a] hover:underline'><strong>Sign up</strong></a></p>
                    </div>
                </div>
            </div>
        </>
    )
}

export default SignIn
