import React from 'react'

const EligibleCardError = () => {
    const iconStyle = {
        fontVariationSettings: '"FILL" 1, "wght" 400, "GRAD" 0, "opsz" 24',
    }
    return (
        <>
            <div className='border-1 border-[#ebbdbd] rounded-md'>
                <div className='bg-[#fff7f7] text-[14px] font-semibold p-3 rounded-tr-lg rounded-tl-lg text-[#930011] flex justify-between items-center '>
                    <span >CSC405: Algorithms</span>
                    <span className=" material-symbols-outlined">account_tree</span>
                </div>
                <hr className='text-[#bfc9bf]' />
                <div className='m-5'>
                    <div className='flex items-center justify-between p-2'>
                        <span className='text-[#535865]'>Attendance</span>
                        <span className='text-[30px] font-bold text-[#930011]' >68%</span>
                    </div>
                    <div>
                        <div className='w-full bg-[#e2e9ec] p1 h-3 rounded-full'>
                            <div className='w-[67%] bg-[#ba1a1a] h-3 rounded-full'></div>
                        </div>
                    </div>
                    <div className='bg-[#ffdad6] text-[#930011] font-semibold rounded-md flex items-center mt-3'>
                        <span className=" p-2 material-symbols-outlined" style={iconStyle}>
                            cancel
                        </span>Not Eligible -- Below 70%
                    </div>
                </div>

            </div>
        </>
    )
}

export default EligibleCardError
