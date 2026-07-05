import React from 'react'

const EligibleCard = ({icon, percent, courses, iconTwo}) => {
    const iconStyle = {
        fontVariationSettings: '"FILL" 1, "wght" 400, "GRAD" 0, "opsz" 24',
    }
    return (
        <>
            <div className='border-1 border-[#bfc9bf] rounded-md'>
                <div className='bg-[#f0f4f1] text-[14px] font-semibold p-3 rounded-tr-lg rounded-tl-lg text-[#1e4f40] flex justify-between items-center '>
                    <span >{courses}</span>
                    <span className=" material-symbols-outlined">{icon}</span>
                </div>
                <hr className='text-[#bfc9bf]' />
                <div className='m-5'>
                    <div className='flex items-center justify-between p-2'>
                        <span className='text-[#535865]'>Attendance</span>
                        <span className='text-[30px] font-bold text-[#1e4f40]' >{percent}</span>
                    </div>
                    <div>
                        <div className='w-full bg-[#e2e9ec] p1 h-3 rounded-full'>
                            <div className='w-[95%] bg-[#0a643a] h-3 rounded-full'></div>
                        </div>
                    </div>
                    <div className='bg-[#ebfaf3] rounded-md flex items-center mt-3'>
                        <span className="text-[#1e4f40] p-2 material-symbols-outlined" style={iconStyle}>
                            {iconTwo}
                        </span>Eligible to Write Exam
                    </div>
                </div>

            </div>
        </>
    )
}

export default EligibleCard
