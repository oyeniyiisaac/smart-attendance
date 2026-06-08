import SideBar from '../Components/SideBar'

const AttendanceHistroy = () => {
    const iconStyle = {
        fontVariationSettings: '"FILL" 1, "wght" 400, "GRAD" 0, "opsz" 24',
    }
    return (
        <>
            <div className='bg-[#fafdf4] flex'>
                <SideBar profileImg="https://imgs.search.brave.com/Y20_Qf09jZ8KyraFayP-Bh7mXPopmU4Pc6JBLcB4CBY/rs:fit:860:0:0:0/g:ce/aHR0cHM6Ly9zdGF0/aWMudmVjdGVlenku/Y29tL3N5c3RlbS9y/ZXNvdXJjZXMvdGh1/bWJuYWlscy8wMjcv/OTUxLzEzMC9zbWFs/bC9hZnJpY2EtZ3V5/LTNkLWF2YXRhci1j/aGFyYWN0ZXItaWxs/dXN0cmF0aW9ucy1w/bmcucG5n" profileName="MercyTech" courses="Information system" />
                <div className='py-4 px-10 w-full'>
                    <div className='flex items-center justify-between'>
                        <div>
                            <h1 className='text-[30px] font-bold'>Attendance History</h1>
                            <span className='text-[16px] text-[#3f4941] font-medium'>Review your presence across all enrolled courses.</span>
                        </div>
                        <div className='flex items-center'>
                            <div className='flex bg-[#ffffff] p-3 rounded-lg items-center gap-4 mt-6'>
                                {/* <span className="material-symbols-rounded bg-[#baeed9] text-[#3d6d5d] p-2 rounded-lg" style={iconStyle}>
                                    calendar_today
                                </span>
                                <div className='flex flex-col '>
                                    <span className='text-[12px] font-medium text-[#3f4941]'>Current Session</span>
                                    <span className='text-[14px] font-bold'>Monday, Oct 14, 2023</span>
                                </div> */}
                                <div className='flex flex-col'>
                                    <span className='font-medium'>Course</span>
                                    <select name="" id="" className='border-1 border-[#bfc9bf] rounded-md outline-none py-2 px-3'>
                                        <option value="">All Courses</option>
                                    </select>
                                </div>
                                <div className='flex flex-col'>
                                    <span className='font-medium'>Semester</span>
                                    <select name="" id="" className='border-1 border-[#bfc9bf] outline-none rounded-md py-2 px-3'>
                                        <option value="">Rain 2025/2026</option>
                                    </select>
                                </div>
                            </div>
                            <div className='bg-[#0a643a] text-[#ffffff] mt-[3rem] rounded-md  p-1 cursor-pointer'>
                                <span className="text-[20px] text-center material-symbols-outlined">
                                    filter_list
                                </span>
                            </div>
                        </div>
                        <div className=''>
                            <div className=' '>
                                <div>
                                    <h2>Overall Attendance</h2>
                                    <span>Requirement: 75% for eligibility</span>
                                </div>
                                <div>
                                    92% Total
                                </div>
                            </div>
                        </div>
                            {/* <div>
                        <div className="w-full bg-neutral-quaternary rounded-full h-2">
                            <div className="bg-brand h-2 rounded-full" style="width: 45%"></div>
                        </div>
                        <div className="flex justify-between mb-1">
                            <span className="text-sm font-medium text-body">Flowbite</span>
                            <span className="text-sm font-medium text-body">45%</span>
                        </div>
                    </div> */}

                        
                    </div>
                </div>
            </div>
        </>
    )
}

export default AttendanceHistroy
