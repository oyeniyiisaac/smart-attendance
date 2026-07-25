import { Link, useNavigate } from 'react-router-dom'

const NavbarTopDashboard = () => {
    const navigate = useNavigate();
    const fallbackProfileImg = 'https://imgs.search.brave.com/Jopvk0MWzfaYi1h8ZX8btE8nIJgelXumRnIDVQKFXI8/rs:fit:860:0:0:0/g:ce/aHR0cHM6Ly9pLnBp/bmltZy5jb20vb3Jp/Z2luYWxzL2M2LzU2/L2VkL2M2NTZlZDAy/MDdjMDViZTc5ZGI2/ZDdkYTQxZDdhNmZk/LmpwZw'
    const displayProfileImg = fallbackProfileImg
    return (
        <nav className='bg-[#f2f8fb] fixed top-0 right-0 mb-[100px] lg:mb-0 left-0 z-10 text-[#0a643a] p-4 w-[100%] shadow-sm lg:hidden'>
            <div className='flex items-center justify-between px-2'>
                <div className='flex items-center gap-4'>
                    <Link to="/student/dashboard" ><div className='flex items-center gap-4 font-bold text-[20px]'>
                        <span className="material-symbols-outlined">
                            School
                        </span>
                        </div>
                    </Link>
                    <div className='flex items-center gap-4 font-bold text-[20px]'>
                        Smart Attendance
                    </div>
                </div>
                <div onClick={() => navigate('/student-profile-settings')} className='w-[30px] h-[30px] rounded-full border-2 border-[#2e7d52] overflow-hidden flex items-center justify-center'>
                    <img src={displayProfileImg} alt="profile" className="w-full h-full object-cover" />
                </div>
            </div>
        </nav>
    )
}

export default NavbarTopDashboard
