import AttendanceTable from '../Components/AttendanceTable'

const AttendanceHistroy = () => {
    const iconStyle = {
        fontVariationSettings: '"FILL" 1, "wght" 400, "GRAD" 0, "opsz" 24',
    }
    return (
        <>
            <div className='bg-[#fafdf4] flex'>
                {/* <SideBar profileImg="https://imgs.search.brave.com/Y20_Qf09jZ8KyraFayP-Bh7mXPopmU4Pc6JBLcB4CBY/rs:fit:860:0:0:0/g:ce/aHR0cHM6Ly9zdGF0/aWMudmVjdGVlenku/Y29tL3N5c3RlbS9y/ZXNvdXJjZXMvdGh1/bWJuYWlscy8wMjcv/OTUxLzEzMC9zbWFs/bC9hZnJpY2EtZ3V5/LTNkLWF2YXRhci1j/aGFyYWN0ZXItaWxs/dXN0cmF0aW9ucy1w/bmcucG5n" profileName="MercyTech" courses="Information system" /> */}
                <div className='py-4 px-10 w-[78%] absolute right-0'>
                    <div className='flex flex-col  '>
                        <div className='flex items-center justify-between'>
                            <div>
                                <h1 className='text-[30px] font-bold'>Attendance History</h1>
                                <span className='text-[16px] text-[#3f4941] font-medium'>Review your presence across all enrolled courses.</span>
                            </div>
                            <div className='flex items-center'>
                                <div className='flex p-3 rounded-lg items-center gap-4 mt-6'>

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
                        </div>
                        <div className='flex gap-[40px] mt-4'>
                            <div className='w-[65%] bg-[#ffffff] p-4 border-1 border-[#bfc9bf] rounded-md '>
                                <div className='flex justify-between mb-4'>
                                    <div>
                                        <h2 className='text-[20px] font-bold leading-[0.8]'>Overall Attendance</h2>
                                        <span className='text-[12px] text-[#3f4941] mb-4'>Requirement: 75% for eligibility</span>
                                    </div>
                                    <div className='bg-[#baeed9] text-[#0a643a] font-medium py-1 px-4 mb-2 rounded-xl'>
                                        92% Total
                                    </div>
                                </div>
                                <div>
                                    <div className='w-full bg-[#e2e9ec] p1 h-3 rounded-full'>
                                        <div className='w-[95%] bg-[#0a643a] h-3 rounded-full'></div>
                                    </div>
                                    <div className='flex justify-between mt-2 text-[#3f4941]'>
                                        <span>25%</span>
                                        <span>50%</span>
                                        <span>75% <small>(min)</small></span>
                                        <span>100%</span>
                                    </div>
                                </div>
                            </div>
                            <div className='bg-[#0a643a] w-[35%] p-3 rounded-xl '>
                                <span className='font-medium text-[#e2e9ec]'>Total Lectures</span>
                                <h1 className='text-[30px] font-bold text-[#ffffff]'>128</h1>
                                <div className='text-left text-[#ffffff] gap-2 '>
                                    <tr className='p-2'>
                                        <th className='px-2 text-[12px]'>Present</th>
                                        <th className='text-[12px]'>Absent</th>
                                    </tr>
                                    <tr className='p-2'>
                                        <td className='px-2 text-[16px] font-bold'>118</td>
                                        <td className=' text-[16px] font-bold'>10</td>
                                    </tr>
                                </div>
                            </div>
                        </div>
                        <div>
                            <AttendanceTable />
                        </div>

                    </div>


                </div>
            </div>
        </>
    )
}

export default AttendanceHistroy
