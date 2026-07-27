import  { useState } from 'react'
import { Link } from 'react-router-dom'
import { useNavigate } from 'react-router-dom'

const Navbar = () => {
    const [activeBtn, setActiveBtn] = useState('')
    const navigate = useNavigate();

    const dashboardBtn = () => {
        setActiveBtn('dashboard')
        navigate('/student/dashboard')
    }
    const coursesBtn = () => {
        setActiveBtn('enrol-courses')
        navigate('/enrol-courses')
    }
    const eligibilityBtn = () => {
        setActiveBtn('student-eligibility')
        navigate('/student-eligibility')
    }
    const profileBtn = () => {
        setActiveBtn('profile')
        navigate('/student-profile-settings')
    }
    const spanDashboardBtn = () => {
        return {
            fontVariationSettings: activeBtn === 'student/dashboard' ? "'FILL' 1" : "'FILL' 0"
        }
    }
    const spanCoursesBtn = () => {
        return {
            fontVariationSettings: activeBtn === 'enrol-courses' ? "'FILL' 1" : "'FILL' 0"
        }
    }
    const spanEligibilityBtn = () => {
        return {
            fontVariationSettings: activeBtn === 'student-eligibility' ? "'FILL' 1" : "'FILL' 0"
        }
    }
    const spanProfileBtn = () => {
        return {
            fontVariationSettings: activeBtn === 'profile' ? "'FILL' 1" : "'FILL' 0"
        }
    }
    return (
        <>
            <div className='bg-[#f2f8fb] p-4 w-[100%] shadow-sm fixed bottom-0 border-t-2 border-[#e4ebed]'>
                <div className='flex items-center justify-between px-[6rem]'>
                    <Link to="/student/dashboard">
                        <button onClick={dashboardBtn}  className={`flex flex-col items-center ${activeBtn === 'dashboard' ? 'text-[#0a643a] bg-[#baeed9] p-1 font-medium rounded-lg' : 'text-gray-500'}`}>
                            <span style={spanDashboardBtn()} className="material-symbols-outlined">
                                dashboard
                            </span>
                            Dashboard
                        </button>
                    </Link>
                    <button onClick={coursesBtn} className={`flex flex-col items-center ${activeBtn === 'enrol-courses' ? 'text-[#0a643a] bg-[#baeed9] p-1 font-medium rounded-lg' : 'text-gray-500'}`}>
                        <span style={spanCoursesBtn()} className="material-symbols-outlined">
                            menu_book
                        </span>
                        Courses
                    </button>
                    <button onClick={eligibilityBtn} className={`flex flex-col items-center ${activeBtn === 'student-eligibility' ? 'text-[#0a643a] bg-[#baeed9] p-1 font-medium rounded-lg' : 'text-gray-500'}`}>
                        <span style={spanEligibilityBtn()} className="material-symbols-outlined">
                            verified
                        </span>
                        Eligibility
                    </button>
                    <button onClick={profileBtn} className={` flex flex-col items-center ${activeBtn === 'profile' ? 'text-[#0a643a] bg-[#baeed9] p-1 font-medium rounded-lg' : 'text-gray-500'}`}>
                        <span style={spanProfileBtn()} className="material-symbols-outlined">
                            person
                        </span>
                        Profile
                    </button>

                </div>
            </div>
        </>
    )
}

export default Navbar
