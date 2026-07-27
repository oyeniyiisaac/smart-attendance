import React from 'react'

const AttendanceTable = ({ 
    records = [], 
    loading = false, 
    totalPages = 1, 
    page = 1, 
    onPageChange 
}) => {

    const getParsedDate = (log) => {
        const rawDate = log.createdAt || log.updatedAt || log.date || log.timestamp
        if (rawDate) {
            const parsed = new Date(rawDate)
            if (!isNaN(parsed.getTime())) return parsed
        }

        if (log._id && typeof log._id === 'string' && log._id.length === 24) {
            const timestamp = parseInt(log._id.substring(0, 8), 16) * 1000
            const parsedFromId = new Date(timestamp)
            if (!isNaN(parsedFromId.getTime())) return parsedFromId
        }

        return null
    }

    const formatDate = (log) => {
        const dateObj = getParsedDate(log)
        if (!dateObj) return '-'
        return dateObj.toLocaleDateString('en-US', {
            month: 'short',
            day: 'numeric',
            year: 'numeric'
        })
    }

    const formatTime = (log) => {
        const dateObj = getParsedDate(log)
        if (!dateObj) return '-'
        return dateObj.toLocaleTimeString('en-US', {
            hour: '2-digit',
            minute: '2-digit'
        }).replace(/\s+/g, '')
    }

    const handleExportPDF = () => {
        window.print()
    }

    const handlePrev = (e) => {
        e.preventDefault()
        if (page > 1 && !loading && onPageChange) {
            onPageChange(page - 1)
        }
    }

    const handleNext = (e) => {
        e.preventDefault()
        if (page < totalPages && !loading && onPageChange) {
            onPageChange(page + 1)
        }
    }

    return (
        <div className="bg-neutral-primary-soft shadow-xs rounded-lg border border-[#bfc9bf] text-[#535856] mt-4 w-full overflow-hidden">

            {/* Header Navigation Bar */}
            <nav className="bg-[#f5f6f6] flex flex-col sm:flex-row items-start sm:items-center justify-between p-3 sm:p-4 gap-2" aria-label="Table navigation">
                <div className='text-[18px] sm:text-[20px] font-semibold'>
                    <h2>Attendance Logs</h2>
                </div>
                <div onClick={handleExportPDF} className='text-[14px] sm:text-[16px] font-semibold text-[#0a643a] cursor-pointer self-end sm:self-auto'>
                    <h3 className='flex items-center gap-1'>
                        <span className="material-symbols-outlined text-[18px] sm:text-[24px]">download</span>
                        Export PDF
                    </h3>
                </div>
            </nav>

            <hr className='text-[#bfc9bf]' />

            {/* Responsive Table Container */}
            <div className="overflow-x-auto w-full">
                <table className="w-full text-xs sm:text-sm text-left rtl:text-right text-body min-w-[600px]">
                    <thead className="text-xs sm:text-sm text-body bg-[#eef5f7] border-b border-[#bfc9bf]">
                        <tr className='text-[#535856]'>
                            <th scope="col" className="p-3 sm:p-4 w-4"></th>
                            <th scope="col" className="px-3 sm:px-6 py-3">Date</th>
                            <th scope="col" className="px-3 sm:px-6 py-3">Course</th>
                            <th scope="col" className="px-3 sm:px-6 py-3">Hall</th>
                            <th scope="col" className="px-3 sm:px-6 py-3">Time</th>
                            <th scope="col" className="px-3 sm:px-6 py-3 text-center">Status</th>
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
                                const courseSubTitle = log.displayCourseTitle || log.session?.courseTitle || log.session?.courseName || log.courseName || ''
                                const hallVenue = log.displayHall || log.session?.venue || log.session?.hall || log.session?.location || log.venue || log.hall || '-'

                                return (
                                    <tr key={log._id || index} className="bg-neutral-primary-soft border-b border-[#bfc9bf] hover:bg-neutral-secondary-medium">
                                        <td className="w-4 p-3 sm:p-4"></td>
                                        <th scope="row" className="px-3 sm:px-6 py-4 font-medium text-heading whitespace-nowrap">
                                            {formatDate(log)}
                                        </th>
                                        <td className="flex flex-col px-3 sm:px-6 py-4">
                                            <span className='font-semibold'>{log.courseCode}</span>
                                            {courseSubTitle && <span className='text-[10px] sm:text-[11px] text-gray-500 truncate max-w-[150px] sm:max-w-none'>{courseSubTitle}</span>}
                                        </td>
                                        <td className="font-semibold px-3 sm:px-6 py-4 whitespace-nowrap">{hallVenue}</td>
                                        <td className="font-semibold px-3 sm:px-6 py-4 whitespace-nowrap">{formatTime(log)}</td>
                                        <td className="px-3 sm:px-6 py-4">
                                            {isPresent ? (
                                                <div className='flex justify-center items-center py-1 px-2 sm:px-3 rounded-full gap-1.5 sm:gap-2 bg-[#baeed9] text-[#0a643a] font-bold text-[11px] sm:text-xs mx-auto w-fit'>
                                                    <div className='h-1.5 sm:h-2 w-1.5 sm:w-2 rounded-full bg-[#0a643a]'></div>
                                                    <span>Present</span>
                                                </div>
                                            ) : (
                                                <div className='flex justify-center items-center py-1 px-2 sm:px-3 rounded-full gap-1.5 sm:gap-2 bg-[#ffdad6] text-[#ba1a1a] font-bold text-[11px] sm:text-xs mx-auto w-fit'>
                                                    <div className='h-1.5 sm:h-2 w-1.5 sm:w-2 rounded-full bg-[#ba1a1a]'></div>
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
            </div>

            {/* Table Footer Navigation */}
            <nav className="flex flex-col sm:flex-row bg-[#e8eff1] items-center justify-between p-3 sm:p-4 gap-3" aria-label="Table navigation">
                <span className="text-xs sm:text-sm font-normal text-body text-center sm:text-left">
                    Page <span className="font-semibold text-heading">{page}</span> of <span className="font-semibold text-heading">{totalPages}</span>
                </span>
                <ul className="flex -space-x-px text-sm justify-center">
                    <li>
                        <button 
                            type="button"
                            onClick={handlePrev} 
                            disabled={page === 1 || loading} 
                            className="flex items-center justify-center text-body bg-neutral-secondary-medium border border-[#bfc9bf] hover:bg-neutral-tertiary-medium rounded-s-md px-3 h-8 sm:h-9 focus:outline-none disabled:opacity-40 disabled:cursor-not-allowed"
                        >
                            <span className="material-symbols-outlined text-[18px] sm:text-[24px]">chevron_left</span>
                        </button>
                    </li>
                    <li>
                        <span className="flex items-center justify-center text-body bg-neutral-secondary-medium border border-[#bfc9bf] font-medium text-xs sm:text-sm w-8 sm:w-9 h-8 sm:h-9">
                            {page}
                        </span>
                    </li>
                    <li>
                        <button 
                            type="button"
                            onClick={handleNext} 
                            disabled={page === totalPages || loading} 
                            className="flex items-center justify-center text-body bg-neutral-secondary-medium border border-[#bfc9bf] hover:bg-neutral-tertiary-medium rounded-e-md px-3 h-8 sm:h-9 focus:outline-none disabled:opacity-40 disabled:cursor-not-allowed"
                        >
                            <span className="material-symbols-outlined text-[18px] sm:text-[24px]">chevron_right</span>
                        </button>
                    </li>
                </ul>
            </nav>
        </div>
    )
}

export default AttendanceTable