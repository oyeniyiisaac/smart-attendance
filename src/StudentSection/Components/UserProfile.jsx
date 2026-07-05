import React from 'react'
import { useParams } from 'react-router-dom'

const profile = ({courses, profileImg, profileName}) => {
    const fallbackProfileImg = 'https://imgs.search.brave.com/Jopvk0MWzfaYi1h8ZX8btE8nIJgelXumRnIDVQKFXI8/rs:fit:860:0:0:0/g:ce/aHR0cHM6Ly9pLnBp/bmltZy5jb20vb3Jp/Z2luYWxzL2M2LzU2/L2VkL2M2NTZlZDAy/MDdjMDViZTc5ZGI2/ZDdkYTQxZDdhNmZk/LmpwZw'
    const displayProfileImg = profileImg || fallbackProfileImg
    const {ID } = useParams()

    return (
        <>
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
        </>
    )
}

export default profile
