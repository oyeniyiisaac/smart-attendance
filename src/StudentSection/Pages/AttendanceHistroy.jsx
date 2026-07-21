import React, { useState, useEffect } from 'react'
import axios from 'axios'
import AttendanceTable from '../Components/AttendanceTable'

const AttendanceHistory = () => {
    const iconStyle = {
        fontVariationSettings: '"FILL" 1, "wght" 400, "GRAD" 0, "opsz" 24',
    }

    // State for student attendance records
    const [records, setRecords] = useState([])
    const [loading, setLoading] = useState(true)
    const [selectedCourse, setSelectedCourse] = useState('')
    const [selectedSemester, setSelectedSemester] = useState('Rain 2025/2026')

    const token = localStorage.getItem('token')

    useEffect(() => {
        fetchStudentAttendance()
    }, [])

    const fetchStudentAttendance = async () => {
        if (!token) return
        setLoading(true)
        try {
            // Endpoint fetching ONLY records for the logged-in student (via JWT)
            const response = await axios.get("https://smart-backend-1-q3fb.onrender.com/my-attendance", {
                headers: { 
                    Authorization: `Bearer ${token}` 
                }
            })

            if (response.data && response.data.records) {
                setRecords(response.data.records)
            } else if (Array.isArray(response.data)) {
                setRecords(response.data)
            }
        } catch (error) {
            console.error("Error fetching student attendance history:", error)
        } finally {
            setLoading(false)
        }
    }

    // Filter logs based on selected dropdown course
    const filteredRecords = records.filter(item => {
        if (!selectedCourse) return true
        return item.courseCode === selectedCourse
    })

    // Dynamically get unique courses enrolled/attended by this student
    const studentCourses = Array.from(new Set(records.map(r => r.courseCode))).filter(Boolean)

    // Dynamic calculations for this student
    const totalLectures = filteredRecords.length
    const presentCount = filteredRecords.filter(r => r.status?.toLowerCase() === 'present').length
    const absentCount = totalLectures - presentCount
    const attendancePercentage = totalLectures > 0 ? Math.round((presentCount / totalLectures) * 100) : 0

    return (
        <>
            <div className='bg-[#fafdf4] min-h-screen'>
                <div className='py-4 px-6 lg:px-10 w-full pb-28'>
                    <div className='flex flex-col'>
                        
                        {/* Header & Controls */}
                        <div className='flex items-center justify-between'>
                            <div>
                                <h1 className='text-[30px] font-bold'>Attendance History</h1>
                                <span className='text-[16px] text-[#3f4941] font-medium'>Review your presence across all enrolled courses.</span>
                            </div>
                            <div className='flex items-center'>
                                <div className='flex p-3 rounded-lg items-center gap-4 mt-6'>

                                    {/* Course Select */}
                                    <div className='flex flex-col'>
                                        <span className='font-medium'>Course</span>
                                        <select 
                                            value={selectedCourse} 
                                            onChange={(e) => setSelectedCourse(e.target.value)} 
                                            className='border-1 border-[#bfc9bf] rounded-md outline-none py-2 px-3'
                                        >
                                            <option value="">All Courses</option>
                                            {studentCourses.map(code => (
                                                <option key={code} value={code}>{code}</option>
                                            ))}
                                        </select>
                                    </div>

                                    {/* Semester Select */}
                                    <div className='flex flex-col'>
                                        <span className='font-medium'>Semester</span>
                                        <select 
                                            value={selectedSemester} 
                                            onChange={(e) => setSelectedSemester(e.target.value)} 
                                            className='border-1 border-[#bfc9bf] outline-none rounded-md py-2 px-3'
                                        >
                                            <option value="Rain 2025/2026">Rain 2025/2026</option>
                                            <option value="Harmattan 2025/2026">Harmattan 2025/2026</option>
                                        </select>
                                    </div>
                                </div>

                                <div 
                                    onClick={fetchStudentAttendance} 
                                    className='bg-[#0a643a] text-[#ffffff] mt-[3rem] rounded-md p-1 cursor-pointer'
                                    title="Refresh Data"
                                >
                                    <span className="text-[20px] text-center material-symbols-outlined" style={iconStyle}>
                                        refresh
                                    </span>
                                </div>
                            </div>
                        </div>

                        {/* Summary Metrics */}
                        <div className='flex gap-[40px] mt-4'>
                            
                            {/* Overall Attendance Card */}
                            <div className='w-[65%] bg-[#ffffff] p-4 border-1 border-[#bfc9bf] rounded-md '>
                                <div className='flex justify-between mb-4'>
                                    <div>
                                        <h2 className='text-[20px] font-bold leading-[0.8]'>Overall Attendance</h2>
                                        <span className='text-[12px] text-[#3f4941] mb-4'>Requirement: 75% for eligibility</span>
                                    </div>
                                    <div className='bg-[#baeed9] text-[#0a643a] font-medium py-1 px-4 mb-2 rounded-xl'>
                                        {loading ? "..." : `${attendancePercentage}% Total`}
                                    </div>
                                </div>
                                <div>
                                    <div className='w-full bg-[#e2e9ec] h-3 rounded-full overflow-hidden'>
                                        <div 
                                            className='bg-[#0a643a] h-3 rounded-full transition-all duration-300'
                                            style={{ width: `${attendancePercentage}%` }}
                                        ></div>
                                    </div>
                                    <div className='flex justify-between mt-2 text-[#3f4941]'>
                                        <span>25%</span>
                                        <span>50%</span>
                                        <span>75% <small>(min)</small></span>
                                        <span>100%</span>
                                    </div>
                                </div>
                            </div>

                            {/* Total Lectures Card */}
                            <div className='bg-[#0a643a] w-[35%] p-3 rounded-xl '>
                                <span className='font-medium text-[#e2e9ec]'>Total Lectures</span>
                                <h1 className='text-[30px] font-bold text-[#ffffff]'>
                                    {loading ? "..." : totalLectures}
                                </h1>
                                <div className='text-left text-[#ffffff] gap-2 '>
                                    <table className="w-full text-left">
                                        <thead>
                                            <tr>
                                                <th className='px-2 text-[12px] font-normal'>Present</th>
                                                <th className='text-[12px] font-normal'>Absent</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            <tr>
                                                <td className='px-2 text-[16px] font-bold'>{loading ? "-" : presentCount}</td>
                                                <td className='text-[16px] font-bold text-red-200'>{loading ? "-" : absentCount}</td>
                                            </tr>
                                        </tbody>
                                    </table>
                                </div>
                            </div>

                        </div>

                        {/* Attendance Table Component (Passing filtered DB records as props) */}
                        <div className='mt-6'>
                            <AttendanceTable records={filteredRecords} loading={loading} />
                        </div>

                    </div>
                </div>
            </div>
        </>
    )
}

export default AttendanceHistory