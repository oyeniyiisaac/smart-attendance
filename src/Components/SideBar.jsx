import { useState } from 'react'

const SideBar = ({ ID, courses, profileName, profileImg }) => {
    const [localActiveBtn, setLocalActiveBtn] = useState('dashboard')
    const fallbackProfileImg = 'https://imgs.search.brave.com/Jopvk0MWzfaYi1h8ZX8btE8nIJgelXumRnIDVQKFXI8/rs:fit:860:0:0:0/g:ce/aHR0cHM6Ly9pLnBp/bmltZy5jb20vb3Jp/Z2luYWxzL2M2LzU2/L2VkL2M2NTZlZDAy/MDdjMDViZTc5ZGI2/ZDdkYTQxZDdhNmZk/LmpwZw'
    const displayProfileImg = profileImg || fallbackProfileImg
    const currentPath = window.location.pathname

    const routeActiveMap = {
        '/student-dashboard': 'dashboard',
        '/attendance-history': 'history',
    }

    const activeBtn = routeActiveMap[currentPath] ?? localActiveBtn

    const dashboardBtn = () => {
        setLocalActiveBtn('dashboard')
        window.location.href = '/student-dashboard'
    }
    const historyBtn = () => {
        setLocalActiveBtn('history')
        window.location.href = '/attendance-history'
    }
    const eligibilityBtn = () => {
        setLocalActiveBtn('eligibility')
    }
    const classesBtn = () => {
        setLocalActiveBtn('classes')
    }
    const iconStyle = {
        fontVariationSettings: '"FILL" 1, "wght" 400, "GRAD" 0, "opsz" 24',
    }
    return (
        <>
            <div className="bg-[#eef5f7] fixed w-[300px] h-[100vh] p-4 border-r-1 border-[#bfc9bf]">
                <h2 className="text-xl font-bold text-[#0a643a] mb-6 ">Smart Attendance</h2>
                <div className='flex items-center gap-2 mb-2'>
                    <img src={displayProfileImg} alt="profile" className="w-[60px] rounded-xl border-2 border-[#2e7d52] object-cover" />
                    <div >
                        <h3 className='text-[20px] leading-[0.9] font-bold'>{profileName}</h3>
                        <span className='text-[12.5px] text-[#3f4941] leading-[0.5]'>Student ID : {ID}</span>
                    </div>
                </div>
                <div className='bg-[#e3efee] flex flex-col p-2 border-1 border-[#bfc9bf] rounded-md'>
                    <span className='text-[#0a643a] text-[14px] font-semibold'>CURRENT DEPARTMENT</span>
                    <span className='font-medium'>{courses}</span>
                </div>

                <div className='flex flex-col gap-6 mt-6 text-lg text-[#3f4941]'>
                    <button className={`flex items-center gap-2 p-2 rounded-xl cursor-pointer text-left ${activeBtn === 'dashboard' ? 'bg-[#baeed9]' : 'bg-transparent'}`} onClick={dashboardBtn}><span className="material-symbols-rounded" style={iconStyle}>
                        dashboard
                    </span>Dashboard</button>
                    <button className={`flex items-center gap-2 p-2 rounded-xl cursor-pointer text-left ${activeBtn === 'history' ? 'bg-[#baeed9]' : 'bg-transparent'}`} onClick={historyBtn}><span className="material-symbols-outlined">
                        history
                    </span>Attendance History</button>
                    <button type="button" className={`flex items-center gap-2 p-2 rounded-xl cursor-pointer text-left ${activeBtn === 'eligibility' ? 'bg-[#baeed9]' : 'bg-transparent'}`} onClick={eligibilityBtn}><span className="material-symbols-outlined">fact_check</span>Eligibility</button>
                    <button type="button" className={`flex items-center gap-2 p-2 rounded-xl cursor-pointer text-left ${activeBtn === 'classes' ? 'bg-[#baeed9]' : 'bg-transparent'}`} onClick={classesBtn}><span className="material-symbols-outlined">
                        video_camera_front
                    </span>Online Classes</button>
                </div>
            </div>
        </>
    )
}

export default SideBar
