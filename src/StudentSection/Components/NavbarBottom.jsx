import { useState } from 'react'
import { useNavigate } from 'react-router-dom'

const NavbarBottom = () => {
    const [localActiveBtn, setLocalActiveBtn] = useState('dashboard')
    const currentPath = window.location.pathname
    const navigate = useNavigate()
    // const

    const routeActiveMap = {
        '/student-dashboard': 'dashboard',
            '/attendance-history': 'history',
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
            navigate('/student-eligibility')
        }
        const classesBtn = () => {
            setLocalActiveBtn('classes')
        }
        const iconStyle = {
            fontVariationSettings: '"FILL" 1, "wght" 400, "GRAD" 0, "opsz" 24',
        }
    return (
        <>
            <div className="bg-[#eef5f7] fixed bottom-0 w-[100%] sm:w-[100%] md:w-[100%] lg:hidden px-6 py-3 border-r-1 border-[#bfc9bf]">
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
                {/* <UserProfile /> */}

                <div className='flex justify-between gap-2 mt-2 text-xs text-[#3f4941]'>
                    <button className={`flex flex-col items-center gap-1 p-1 rounded-xl cursor-pointer text-center ${activeBtn === 'dashboard' ? 'bg-[#baeed9]' : 'bg-transparent'}`} onClick={dashboardBtn}><span className="material-symbols-rounded" style={iconStyle}>
                        dashboard
                    </span>Dashboard</button>
                    <button className={`flex flex-col items-center gap-1 p-1 rounded-xl cursor-pointer text-center ${activeBtn === 'history' ? 'bg-[#baeed9]' : 'bg-transparent'}`} onClick={historyBtn}><span className="material-symbols-outlined">
                        history
                    </span>Attendance History</button>
                    <button type="button" className={`flex flex-col items-center gap-1 p-1 rounded-xl cursor-pointer text-center ${activeBtn === 'eligibility' ? 'bg-[#baeed9]' : 'bg-transparent'}`} onClick={eligibilityBtn}><span className="material-symbols-outlined">fact_check</span>Eligibility</button>
                    <button type="button" className={`flex flex-col items-center gap-1 p-1 rounded-xl cursor-pointer text-center ${activeBtn === 'classes' ? 'bg-[#baeed9]' : 'bg-transparent'}`} onClick={classesBtn}><span className="material-symbols-outlined">
                        video_camera_front
                    </span>Online Classes</button>
                </div>
            </div>
        </>
    )
}

export default NavbarBottom
