import React, { useState } from 'react'

const StudentDashboard = () => {
    const [activeBtn, setActiveBtn] = useState('dashboard')

    const dashboardBtn = () => {
        setActiveBtn('dashboard')
    }
    const historyBtn = () => {
        setActiveBtn('history')
    }
    const eligibilityBtn = () => {
        setActiveBtn('eligibility')
    }
    const classesBtn = () => {
        setActiveBtn('classes')
    }
    const iconStyle = {
        fontVariationSettings: '"FILL" 1, "wght" 400, "GRAD" 0, "opsz" 24',
    }

    return (
        <>
            <div className='bg-[#f4fafd] flex'>
                <div className="bg-[#eef5f7] w-[300px] h-[100vh] p-4 border-r-1 border-[#bfc9bf]">
                    <h2 className="text-xl font-bold text-[#0a643a] mb-6 ">Smart Attendance</h2>
                    <div className='flex flex-col'>
                        <img src="" alt="" className='w-[80px] rounded-full' />
                        <span>Student ID : 123456789</span>
                        <span>Computer Science</span>
                    </div>
                    <div className='flex flex-col gap-6 mt-6 text-lg text-[#3f4941]'>
                        <a className={`bg-[#baeed9] flex items-center gap-2 p-2 rounded-xl cursor-pointer ${activeBtn === 'dashboard' ? 'bg-[#baeed9]' : 'bg-transparent'}`} onClick={() => setActiveBtn('dashboard')}><span className="material-symbols-rounded" style={iconStyle}>
                            dashboard
                        </span>Dashboard</a>
                        <a className={`flex items-center gap-2 p-2 rounded-xl cursor-pointer ${activeBtn === 'history' ? 'bg-[#baeed9]' : 'bg-transparent'}`} onClick={() => setActiveBtn('history')}><span className="material-symbols-outlined">
                            history
                        </span>Attendance History</a>
                        <a className={`flex items-center gap-2 p-2 rounded-xl cursor-pointer ${activeBtn === 'eligibility' ? 'bg-[#baeed9]' : 'bg-transparent'}`} onClick={() => setActiveBtn('eligibility')}><span className="material-symbols-outlined">fact_check</span>Eligibility</a>
                        <a className={`flex items-center gap-2 p-2 rounded-xl cursor-pointer ${activeBtn === 'classes' ? 'bg-[#baeed9]' : 'bg-transparent'}`} onClick={() => setActiveBtn('classes')}><span className="material-symbols-outlined">
                            video_camera_front
                        </span>Online Classes</a>
                    </div>
                </div>
                <div className='py-6 px-20 w-full'>
                    <div className='flex items-center justify-between'>
                        <div>
                            <h1 className='text-[30px] font-bold'>Welcome back, Alex!</h1>
                            <span className='text-[16px] text-[#3f4941] font-medium'>MATRIC : 1234567890</span>
                        </div>
                        <div className='flex bg-[#ffffff] border-1 border-[#bfc9bf] p-3 rounded-lg items-center gap-4 mt-6'>
                            <span className="material-symbols-rounded bg-[#baeed9] text-[#3d6d5d] p-2 rounded-lg" style={iconStyle}>
                                calendar_today
                            </span>
                            <div className='flex flex-col '>
                                <span className='text-[12px] font-medium text-[#3f4941]'>Current Session</span>
                                <span className='text-[14px] font-bold'>Monday, Oct 14, 2023</span>
                            </div>
                        </div>
                    </div>
                    <div className='mt-6 p-4 flex gap-2 items-center'>
                        <div className='p-2 bg-[#0a643a] rounded-full w-[2px] h-[2px] blink-colors'></div>
                        <h2 className='text-md text-[14px] font-semibold'>Active Lecture Sessions</h2>
                    </div>
                    <div className='grid grid-cols-3 '>
                        <div className='bg-[#ffffff] w-[250px] rounded-lg border-1 border-[#bfc9bf]'>
                            < div className='bg-[#e2e9ec] flex justify-between p-2 rounded-tl-lg rounded-tr-lg'>
                                <span className='text-[14px] text-[#3f4941] font-semibold'>COURSE ID : CSC405</span>
                                <span className='bg-[#0a643a] py-1 px-2 rounded-xl text-[10px] font-bold text-white'>LIVE</span>
                            </div>
                            <div className='flex flex-col justify-center p-4'>
                                <h1 className='text-[18px] font-bold p-2'>Advanced Algorithms</h1>
                                <p className='flex items-center gap-1 text-sm text-[#3f4941] mb-2'><span class="material-symbols-outlined">
                                    location_on
                                </span>Hall A12</p>
                                <p className='flex items-center gap-1 text-sm text-[#3f4941] mb-4'><span class="material-symbols-outlined">
                                    schedule
                                </span>09:00AM - 11:00AM</p>
                                <button className='bg-[#0a643a] flex items-center justify-center text-white py-2 px-4 rounded-sm hover:bg-[#084d2c]'>
                                    <span className="material-symbols-outlined">
                                        fingerprint
                                    </span>
                                    Mark Attendance
                                </button>
                            </div>

                        </div>
                        <div className='bg-[#ffffff] w-[250px] rounded-lg border-1 border-[#bfc9bf]'>
                            < div className='bg-[#e2e9ec] flex justify-between p-2 rounded-tl-lg rounded-tr-lg'>
                                <span className='text-[14px] text-[#3f4941] font-semibold'>COURSE ID : CSC405</span>
                                <span className='bg-[#0a643a] py-1 px-2 rounded-xl text-[10px] font-bold text-white'>LIVE</span>
                            </div>
                            <div className='flex flex-col justify-center p-4'>
                                <h1 className='text-[18px] font-bold p-2'>Advanced Algorithms</h1>
                                <p className='flex items-center gap-1 text-sm text-[#3f4941] mb-2'><span class="material-symbols-outlined">
                                    location_on
                                </span>Hall A12</p>
                                <p className='flex items-center gap-1 text-sm text-[#3f4941] mb-4'><span class="material-symbols-outlined">
                                    schedule
                                </span>09:00AM - 11:00AM</p>
                                <button className='bg-[#0a643a] flex items-center justify-center text-white py-2 px-4 rounded-sm hover:bg-[#084d2c]'>
                                    <span className="material-symbols-outlined">
                                        fingerprint
                                    </span>
                                    Mark Attendance
                                </button>
                            </div>

                        </div>
                        <div className='bg-[#0a643a] w-[250px] relative text-start p-4 rounded-lg border-1 border-[#bfc9bf]'>
                            <span className='text-[14px] font-bold text-[#b5cfc3]'>WEEKLY ATTENDANCE</span>
                            <h1 className='text-[32px] leading-[0.6] font-bold p-2 text-white'>95%</h1>
                            <p className=' flex absolute items-center bottom-[10px] text-[12px] text-[#a4f4bf]'><span class="material-symbols-outlined">
                                trending_up
                            </span>Exceeded benchmark</p>
                        </div>
                    </div>
                </div>
            </div>
        </>
    )
}


export default StudentDashboard
