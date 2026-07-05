import React from 'react'

const AttendanceTable = () => {
    return (
        <>
            <div className="relative overflow-x-auto bg-neutral-primary-soft shadow-xs rounded-lg border border-[#bfc9bf] text-[#535856] mt-4">
                <nav className="bg-[#f5f6f6] flex items-center flex-column flex-wrap md:flex-row justify-between p-2" aria-label="Table navigation">
                    <div className='text-[20px] font-semibold '><h2>Attendance Logs</h2></div>
                    <div className='text-[16px] font-semibold text-[#0a643a] cursor-pointer'><h3 className='flex items-center'><span class="material-symbols-outlined">
                        download
                    </span >Exports PDF</h3></div>
                </nav>
                <hr className='text-[#bfc9bf] ' />
                <table className="w-full text-sm text-left rtl:text-right text-body">
                    <thead className="text-sm text-body bg-[#eef5f7] border-b border-[#bfc9bf]">

                        <tr className='text-[#535856]'>
                            <th scope="col" className="p-4">
                                <div className="flex items-center">

                                </div>
                            </th>
                            <th scope="col" className="px-6 py-3">
                                Date
                            </th>
                            <th scope="col" className="px-6 py-3">
                                Course
                            </th>
                            <th scope="col" className="px-6 py-3">
                                Hall
                            </th>
                            <th scope="col" className="px-6 py-3">
                                Time
                            </th>
                            <th scope="col" className="px-6 py-3">
                                Status
                            </th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr className="bg-neutral-primary-soft border-b border-[#bfc9bf] hover:bg-neutral-secondary-medium">
                            <td className="w-4 p-4">
                                <div className="flex items-center">

                                </div>
                            </td>
                            <th scope="row" className="px-6 py-4 font-medium text-heading whitespace-nowrap">
                                Oct,14 2024
                            </th>
                            <td className="flex flex-col px-6 py-4">
                                <span className='font-semibold'>CSC 402</span>
                                <span className='text-[10px] '>Operating System</span>
                            </td>
                            <td className="font-semibold px-6 py-4">
                                Hall A12
                            </td>
                            <td className="font-semibold px-6 py-4">
                                09:00AM
                            </td>
                            <td className="px-6 py-4">
                                <div className='flex justify-center items-center py-1 rounded-full gap-2 bg-[#baeed9] text-[#0a643a] font-bold'>
                                    <div className='h-2 p-1  rounded-full  bg-[#0a643a]'></div>
                                    <span>Present</span>
                                </div>

                            </td>
                        </tr>


                        <tr className="bg-neutral-primary-soft border-b border-[#bfc9bf] hover:bg-neutral-secondary-medium">
                            <td className="w-4 p-4">
                                <div className="flex items-center">

                                </div>
                            </td>
                            <th scope="row" className="px-6 py-4 font-medium text-heading whitespace-nowrap">
                                Oct,12 2024
                            </th>
                            <td className="flex flex-col px-6 py-4">
                                <span className='font-semibold'>CSC 405</span>
                                <span className='text-[10px] '>Algorithm</span>
                            </td>
                            <td className="font-semibold px-6 py-4">
                                Lab 4
                            </td>
                            <td className="font-semibold px-6 py-4">
                                11:00AM
                            </td>
                            <td className="px-6 py-4">
                                <div className='flex justify-center items-center py-1 rounded-full gap-2 bg-[#ffdad6] text-[#ba1a1a] font-bold'>
                                    <div className='h-2 p-1  rounded-full  bg-[#ba1a1a]'></div>
                                    <span>Present</span>
                                </div>

                            </td>
                        </tr>
                        <tr className="bg-neutral-primary-soft border-b border-[#bfc9bf] hover:bg-neutral-secondary-medium">
                            <td className="w-4 p-4">
                                <div className="flex items-center">

                                </div>
                            </td>
                            <th scope="row" className="px-6 py-4 font-medium text-heading whitespace-nowrap">
                                Oct,14 2024
                            </th>
                            <td className="flex flex-col px-6 py-4">
                                <span className='font-semibold'>MATH400</span>
                                <span className='text-[10px] '>Applied Math</span>
                            </td>
                            <td className="font-semibold px-6 py-4">
                                Lecture Hall 2
                            </td>
                            <td className="font-semibold px-6 py-4">
                                02:15PM
                            </td>
                            <td className="px-6 py-4">
                                <div className='flex justify-center items-center py-1 rounded-full gap-2 bg-[#baeed9] text-[#0a643a] font-bold'>
                                    <div className='h-2 p-1  rounded-full  bg-[#0a643a]'></div>
                                    <span>Present</span>
                                </div>

                            </td>
                        </tr>

                        <tr className="bg-neutral-primary-soft border-b border-[#bfc9bf] hover:bg-neutral-secondary-medium">
                            <td className="w-4 p-4">
                                <div className="flex items-center">

                                </div>
                            </td>
                            <th scope="row" className="px-6 py-4 font-medium text-heading whitespace-nowrap">
                                Oct,14 2024
                            </th>
                            <td className="flex flex-col px-6 py-4">
                                <span className='font-semibold'>CSC 402</span>
                                <span className='text-[10px] '>Operating System</span>
                            </td>
                            <td className="font-semibold px-6 py-4">
                                Hall A12
                            </td>
                            <td className="font-semibold px-6 py-4">
                                09:00AM
                            </td>
                            <td className="px-6 py-4">
                                <div className='flex justify-center items-center py-1 rounded-full gap-2 bg-[#baeed9] text-[#0a643a] font-bold'>
                                    <div className='h-2 p-1  rounded-full  bg-[#0a643a]'></div>
                                    <span>Present</span>
                                </div>

                            </td>
                        </tr>
                    </tbody>
                </table>
                <nav className="flex bg-[#e8eff1] items-center flex-column flex-wrap md:flex-row justify-between p-4" aria-label="Table navigation">
                    <span className="text-sm font-normal text-body mb-4 md:mb-0 block w-full md:inline md:w-auto">Showing <span className="font-semibold text-heading">1-5</span> of <span className="font-semibold text-heading">45</span></span>
                    <ul className="flex -space-x-px text-sm">
                        <li>
                            <a href="#" className="flex items-center justify-center text-body bg-neutral-secondary-medium box-border border border-[#bfc9bf] hover:bg-neutral-tertiary-medium hover:text-heading font-medium rounded-s-md text-sm px-3 h-9 focus:outline-none"><span class="material-symbols-outlined">
                                chevron_left
                            </span></a>
                        </li>
                        <li>
                            <a href="#" className="flex items-center justify-center text-body bg-neutral-secondary-medium box-border border border-[#bfc9bf] hover:bg-neutral-tertiary-medium hover:text-heading font-medium text-sm w-9 h-9 focus:outline-none">1</a>
                        </li>
                        <li>
                            <a href="#" className="flex items-center justify-center text-body bg-neutral-secondary-medium box-border border border-[#bfc9bf] hover:bg-neutral-tertiary-medium hover:text-heading font-medium text-sm w-9 h-9 focus:outline-none">2</a>
                        </li>

                        <li>
                            <a href="#" className="flex items-center justify-center text-body bg-neutral-secondary-medium box-border border border-[#bfc9bf] hover:bg-neutral-tertiary-medium hover:text-heading font-medium rounded-e-md text-sm px-3 h-9 focus:outline-none"><span class="material-symbols-outlined">
                                chevron_right
                            </span></a>
                        </li>
                    </ul>
                </nav>
            </div>
        </>
    )
}

export default AttendanceTable
