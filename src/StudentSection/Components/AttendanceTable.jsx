import React from 'react'

const AttendanceTable = ({ records = [], loading = false }) => {
    
    // Safely parse a Date object from createdAt, date, or Mongo ObjectId (_id)
    const getParsedDate = (log) => {
        const rawDate = log.createdAt || log.updatedAt || log.date || log.timestamp
        if (rawDate) {
            const parsed = new Date(rawDate)
            if (!isNaN(parsed.getTime())) return parsed
        }

        // Fallback: Extract timestamp directly from Mongo ObjectId (_id)
        if (log._id && typeof log._id === 'string' && log._id.length === 24) {
            const timestamp = parseInt(log._id.substring(0, 8), 16) * 1000
            const parsedFromId = new Date(timestamp)
            if (!isNaN(parsedFromId.getTime())) return parsedFromId
        }

        return null
    }

    // Helper to format ISO DB dates or ObjectId into "Jul 20, 2026"
    const formatDate = (log) => {
        const dateObj = getParsedDate(log)
        if (!dateObj) return '-'
        return dateObj.toLocaleDateString('en-US', {
            month: 'short',
            day: 'numeric',
            year: 'numeric'
        })
    }

    // Helper to format times into "09:00AM"
    const formatTime = (log) => {
        const dateObj = getParsedDate(log)
        if (!dateObj) return '-'
        return dateObj.toLocaleTimeString('en-US', {
            hour: '2-digit',
            minute: '2-digit'
        }).replace(/\s+/g, '') // removes space before AM/PM
    }

    return (
        <>
            <div className="relative overflow-x-auto bg-neutral-primary-soft shadow-xs rounded-lg border border-[#bfc9bf] text-[#535856] mt-4">
                
                {/* Header Navigation Bar */}
                <nav className="bg-[#f5f6f6] flex items-center flex-column flex-wrap md:flex-row justify-between p-2" aria-label="Table navigation">
                    <div className='text-[20px] font-semibold '>
                        <h2>Attendance Logs</h2>
                    </div>
                    <div className='text-[16px] font-semibold text-[#0a643a] cursor-pointer'>
                        <h3 className='flex items-center gap-1'>
                            <span className="material-symbols-outlined">download</span>
                            Exports PDF
                        </h3>
                    </div>
                </nav>
                
                <hr className='text-[#bfc9bf]' />
                
                {/* Table */}
                <table className="w-full text-sm text-left rtl:text-right text-body">
                    <thead className="text-sm text-body bg-[#eef5f7] border-b border-[#bfc9bf]">
                        <tr className='text-[#535856]'>
                            <th scope="col" className="p-4">
                                <div className="flex items-center"></div>
                            </th>
                            <th scope="col" className="px-6 py-3">Date</th>
                            <th scope="col" className="px-6 py-3">Course</th>
                            <th scope="col" className="px-6 py-3">Hall</th>
                            <th scope="col" className="px-6 py-3">Time</th>
                            <th scope="col" className="px-6 py-3 text-center">Status</th>
                        </tr>
                    </thead>
                    <tbody>
                        {loading ? (
                            <tr className="bg-neutral-primary-soft border-b border-[#bfc9bf]">
                                <td colSpan="6" className="text-center py-6 font-medium text-[#535856]">
                                    Fetching attendance records...
                                </td>
                            </tr>
                        ) : records.length === 0 ? (
                            <tr className="bg-neutral-primary-soft border-b border-[#bfc9bf]">
                                <td colSpan="6" className="text-center py-6 font-medium text-[#535856]">
                                    No attendance records found for this student.
                                </td>
                            </tr>
                        ) : (
                            records.map((log, index) => {
                                const isPresent = log.status?.toLowerCase() === 'present'
                                
                                // Dynamic checks for populated session properties
                                const courseSubTitle = log.displayCourseTitle || log.session?.courseTitle || log.session?.courseName || log.courseName || ''
                                const hallVenue = log.displayHall || log.session?.venue || log.session?.hall || log.session?.location || log.venue || log.hall || '-'

                                return (
                                    <tr key={log._id || index} className="bg-neutral-primary-soft border-b border-[#bfc9bf] hover:bg-neutral-secondary-medium">
                                        <td className="w-4 p-4">
                                            <div className="flex items-center"></div>
                                        </td>
                                        
                                        {/* Date */}
                                        <th scope="row" className="px-6 py-4 font-medium text-heading whitespace-nowrap">
                                            {formatDate(log)}
                                        </th>

                                        {/* Course Code & Sub-Title */}
                                        <td className="flex flex-col px-6 py-4">
                                            <span className='font-semibold'>{log.courseCode}</span>
                                            {courseSubTitle ? (
                                                <span className='text-[11px] text-gray-500'>{courseSubTitle}</span>
                                            ) : null}
                                        </td>

                                        {/* Hall / Venue */}
                                        <td className="font-semibold px-6 py-4">
                                            {hallVenue}
                                        </td>

                                        {/* Time */}
                                        <td className="font-semibold px-6 py-4">
                                            {formatTime(log)}
                                        </td>

                                        {/* Status Badge */}
                                        <td className="px-6 py-4">
                                            {isPresent ? (
                                                <div className='flex justify-center items-center py-1 px-3 rounded-full gap-2 bg-[#baeed9] text-[#0a643a] font-bold text-xs'>
                                                    <div className='h-2 w-2 rounded-full bg-[#0a643a]'></div>
                                                    <span>Present</span>
                                                </div>
                                            ) : (
                                                <div className='flex justify-center items-center py-1 px-3 rounded-full gap-2 bg-[#ffdad6] text-[#ba1a1a] font-bold text-xs'>
                                                    <div className='h-2 w-2 rounded-full bg-[#ba1a1a]'></div>
                                                    <span>Absent</span>
                                                </div>
                                            )}
                                        </td>
                                    </tr>
                                )
                            })
                        )}
                    </tbody>
                </table>

                {/* Table Footer Navigation */}
                <nav className="flex bg-[#e8eff1] items-center flex-column flex-wrap md:flex-row justify-between p-4" aria-label="Table navigation">
                    <span className="text-sm font-normal text-body mb-4 md:mb-0 block w-full md:inline md:w-auto">
                        Showing <span className="font-semibold text-heading">{records.length > 0 ? 1 : 0}-{records.length}</span> of <span className="font-semibold text-heading">{records.length}</span>
                    </span>
                    <ul className="flex -space-x-px text-sm">
                        <li>
                            <a href="#" className="flex items-center justify-center text-body bg-neutral-secondary-medium box-border border border-[#bfc9bf] hover:bg-neutral-tertiary-medium hover:text-heading font-medium rounded-s-md text-sm px-3 h-9 focus:outline-none">
                                <span className="material-symbols-outlined">chevron_left</span>
                            </a>
                        </li>
                        <li>
                            <a href="#" className="flex items-center justify-center text-body bg-neutral-secondary-medium box-border border border-[#bfc9bf] hover:bg-neutral-tertiary-medium hover:text-heading font-medium text-sm w-9 h-9 focus:outline-none">1</a>
                        </li>
                        <li>
                            <a href="#" className="flex items-center justify-center text-body bg-neutral-secondary-medium box-border border border-[#bfc9bf] hover:bg-neutral-tertiary-medium hover:text-heading font-medium rounded-e-md text-sm px-3 h-9 focus:outline-none">
                                <span className="material-symbols-outlined">chevron_right</span>
                            </a>
                        </li>
                    </ul>
                </nav>
            </div>
        </>
    )
}

export default AttendanceTable