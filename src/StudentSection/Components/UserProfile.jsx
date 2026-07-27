import { useState } from "react"

const Profile = ({ department, profileImg, profileName, studentId}) => {
    const fallbackProfileImg = 'https://imgs.search.brave.com/Jopvk0MWzfaYi1h8ZX8btE8nIJgelXumRnIDVQKFXI8/rs:fit:860:0:0:0/g:ce/aHR0cHM6Ly9pLnBp/bmltZy5jb20vb3Jp/Z2luYWxzL2M2LzU2/L2VkL2M2NTZlZDAy/MDdjMDViZTc5ZGI2/ZDdkYTQxZDdhNmZk/LmpwZw'
    const [profileImga, setProfileImga] = useState(() => {
        return localStorage.getItem('profilePicture') || fallbackProfileImg
    })

    const displayProfileImg = profileImga

    return (
        <>
            <div className='flex items-center gap-2 mb-3'>
                <img src={displayProfileImg} alt="profile" className="w-[55px] h-[55px] rounded-xl border-2 border-[#2e7d52] object-cover" />
                <div>
                    <h3 className='text-[18px] leading-tight font-bold'>{profileName || 'Loading...'}</h3>
                    <span className='text-[12px] text-[#3f4941]'> Student ID: {studentId || '—'}</span>
                </div>
            </div>
            <div className='bg-[#e3efee] flex flex-col gap-1 p-2 border border-[#bfc9bf] rounded-md text-sm'>
                <span className='text-[#0a643a] text-[14px] font-semibold'>CURRENT DEPARTMENT</span>
                <span className='font-medium'>{department || 'Loading...'}</span>
            </div>
        </>
    )
}

export default Profile
