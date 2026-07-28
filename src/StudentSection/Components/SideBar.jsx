import { useState, useEffect } from 'react'
import { Outlet, useNavigate } from 'react-router-dom'
import axios from 'axios'
import UserProfile from './UserProfile'

const SideBar = () => {
    const [localActiveBtn, setLocalActiveBtn] = useState('dashboard')
    const currentPath = window.location.pathname
    const navigate = useNavigate()
    const [studentData, setStudentData] = useState({
        firstname: '',
        lastname: '',
        matricno: '',
        department: '',
        faculty: '',
        profilePicture: ''
    })

    const token = localStorage.getItem('token')
    const endpoint = import.meta.env.VITE_ENDPOINT

    useEffect(() => {
        if (!token) return

        axios.get(endpoint, {
            headers: {
                Authorization: `Bearer ${token}`,
                "Content-Type": "application/json",
                "Accept": "application/json",
            },
        })
        .then((response) => {
            if (response.status === 200 || response.status === 201) {
                console.log('🔍 SideBar profile data from API:', response.data.result)
                setStudentData(response.data.result)
                localStorage.setItem('profilePicture', response.data.result.profilePicture)
            }
        })
        .catch((err) => {
            console.error("SideBar Profile error:", err)
        })
    }, [token, endpoint])

    const routeActiveMap = {
        '/student-dashboard': 'dashboard',
        '/attendance-history': 'history',
        '/profile-settings': 'profile'
    }

    const activeBtn = routeActiveMap[currentPath] ?? localActiveBtn

    const dashboardBtn = () => {
        setLocalActiveBtn('dashboard')
        navigate('/student/dashboard')
    }
    const historyBtn = () => {
        setLocalActiveBtn('history')
        navigate('/student/history')
    }
    const eligibilityBtn = () => {
        setLocalActiveBtn('eligibility')
        navigate('/student/eligibility')
    }
    const classesBtn = () => {
        setLocalActiveBtn('classes')
    }
    const profileBtn = () => {
        setLocalActiveBtn('profile')
        navigate('/student/profile-settings')
    }
    const logoutBtn = () => {
        setLocalActiveBtn('logout')
        localStorage.removeItem('token')
        localStorage.removeItem('profilePicture')
        localStorage.removeItem('course')
        localStorage.removeItem('courseCode')
        localStorage.removeItem('courseName')
        localStorage.removeItem('courseCode')
        localStorage.removeItem('courseCode')
        localStorage.removeItem('courseCode')
        navigate('/signin')
    }
    const iconStyle = {
        fontVariationSettings: '"FILL" 1, "wght" 400, "GRAD" 0, "opsz" 24',
    }
    return (
        <>
            <div className="hidden sm:hidden md:hidden lg:block bg-[#eef5f7] fixed w-[300px] h-screen overflow-y-auto p-4 border-r-1 border-[#bfc9bf] font-sans">
                <h2 className="text-lg font-bold text-[#0a643a] mb-6 ">Smart Attendance</h2>
                {/* <div className='flex items-center gap-2 mb-2'>
                    <img src={displayProfileImg} alt="profile" className="w-[60px] rounded-xl border-2 border-[#2e7d52] object-cover" />
                    <div >
                        <h3 className='text-[20px] leading-[0.9] font-bold'>{profileName}</h3>
                        <span className='text-[12.5px] text-[#3f4941] leading-[0.5]'>Student ID : {ID}</span>
                    </div>
                </div>
                <div className='bg-[#e3efee] flex flex-col p-2 border-1 border-[#bfc9bf] rounded-md'>
                    <span className='text-[#0a643a] text-[14px] font-semibold'>CURRENT DEPARTMENT</span>
                    <span className='font-medium'>{courses}</span>
                </div> */}
                <UserProfile
                    profileName={studentData.firstname || studentData.lastname ? `${studentData.firstname} ${studentData.lastname}` : ''}
                    studentId={studentData.matricno}
                    faculty={studentData.faculty || ''}
                    department={studentData.department || ''}
                    profileImg={studentData.profilePicture}
                />

                <div className='flex flex-col gap-6 mt-6 text-md text-[#3f4941]'>
                    <button className={`flex items-center gap-2 p-2 rounded-xl cursor-pointer font-semibold text-left ${activeBtn === 'dashboard' ? 'bg-[#baeed9]' : 'bg-transparent'}`} onClick={dashboardBtn}><span className="material-symbols-rounded" style={iconStyle}>
                        dashboard
                    </span>Dashboard</button>
                    <button className={`flex items-center gap-2 p-2 rounded-xl cursor-pointer font-semibold text-left ${activeBtn === 'history' ? 'bg-[#baeed9]' : 'bg-transparent'}`} onClick={historyBtn}><span className="material-symbols-outlined">
                        history
                    </span>Attendance History</button>
                    <button type="button" className={`flex items-center gap-2 p-2 rounded-xl cursor-pointer font-semibold text-left ${activeBtn === 'eligibility' ? 'bg-[#baeed9]' : 'bg-transparent'}`} onClick={eligibilityBtn}><span className="material-symbols-outlined">fact_check</span>Eligibility</button>
                    <button type="button" className={`flex items-center gap-2 p-2 rounded-xl cursor-pointer font-semibold text-left ${activeBtn === 'classes' ? 'bg-[#baeed9]' : 'bg-transparent'}`} onClick={classesBtn}><span className="material-symbols-outlined">
                        video_camera_front
                    </span>Online Classes</button>
                    <button type="button" className={`flex items-center gap-2 p-2 rounded-xl cursor-pointer font-semibold text-left ${activeBtn === 'profile' ? 'bg-[#baeed9]' : 'bg-transparent'}`} onClick={profileBtn}><span className="material-symbols-outlined">
                        account_circle
                    </span>Profile Settings</button>
                    <button type="button" className={`flex items-center gap-2 p-2 rounded-xl cursor-pointer font-semibold text-left ${activeBtn === 'logout' ? 'bg-[#baeed9]' : 'bg-transparent'}`} onClick={logoutBtn}><span className="material-symbols-outlined">
                        logout
                    </span>Logout</button>
                </div>
            </div>
            <div className="lg:ml-[300px] min-h-screen">
                <Outlet />
            </div>
        </>
    )
}

export default SideBar
