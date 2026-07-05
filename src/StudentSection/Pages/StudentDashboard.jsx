import axios from 'axios'
import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { ToastContainer, toast } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'

const StudentDashboard = () => {
    const [activeBtn, setActiveBtn] = useState('dashboard')
    const [firstname, setFirstname] = useState('')
    const [matricNo, setMatricNo] = useState('')
    const [sessions, setSessions] = useState([]) // 👈 Store active database classes
    const [loading, setLoading] = useState(true)

    const token = localStorage.getItem('token')
    const endpoint = import.meta.env.VITE_ENDPOINT
    const sessionURL = import.meta.env.VITE_SESSIONALL_URL // Matches your router base path
    const verifyLocationURL = import.meta.env.VITE_VERIFYLOCATION_URL
    const navigate = useNavigate()

    useEffect(() => {
        if (!token) {
            navigate('/signin')
            return
        }

        // 1. Fetch Student Profile Information
        axios.get(endpoint, {
            headers: {
                Authorization: `Bearer ${token}`,
                "Content-Type": "application/json",
                "Accept": "application/json",
            },
        })
            .then((response) => {
                if (response.status === 200 || response.status === 201) {
                    toast.success(`Welcome back, ${response.data.result.firstname}! 👋`, {
                        position: 'bottom-right',
                        autoClose: 3000,
                    })
                    const data = response.data.result
                    setFirstname(data.firstname)
                    setMatricNo(data.matricno)
                }
            })
            .catch((err) => console.error("Profile error:", err))

        // 2. Fetch Active Lecture Sessions from your router
        axios.get(sessionURL, {
            headers: {
                Authorization: `Bearer ${token}`,
                "Content-Type": "application/json",
                "Accept": "application/json",
            }
        })
            .then((response) => {
                // Adjust this path if your response payload structure varies (e.g., response.data)
                setSessions(response.data.data || [])
            })
            .catch((err) => {
                console.error("Failed to fetch sessions:", err)
                toast.error("Could not load active lectures.")
            })
            .finally(() => {
                setLoading(false)
            })
    }, [token, endpoint, sessionURL, navigate])

    // Triggers browser prompt to turn on location and gets coordinates
    const verifyLocation = (courseCode) => {
        if (!navigator.geolocation) {
            toast.error('Geolocation is not supported by your browser.')
            return
        }

        toast.info('Retrieving your current location...')

        navigator.geolocation.getCurrentPosition(
            (position) => {
                const { latitude, longitude } = position.coords

                // Pass the coordinates along with the explicit course code string
                sendToServer(latitude, longitude, courseCode)
            },
            (error) => {
                console.error(error)
                toast.error('Unable to retrieve location. Please check device location permissions.')
            },
            { enableHighAccuracy: true, timeout: 10000 }
        )
    }

    const sendToServer = async (latitude, longitude, courseCode) => {
        try {
            // Hits the endpoint created in your routing configuration file
            const response = await axios.post(verifyLocationURL, {
                courseCode: courseCode, // 👈 FIXED: Changed to courseCode to align with backend controller body lookup
                studentLat: latitude,
                studentLng: longitude
            }, {
                headers: {
                    Authorization: `Bearer ${token}`,
                    'Content-Type': 'application/json',
                    "Accept": "application/json",
                }
            })

            if (response.data.success) {
                toast.success(response.data.message || 'Attendance marked successfully! 🎉')
            } else {
                toast.error(response.data.message || 'Verification failed.')
            }
        } catch (error) {
            console.error(error)
            const errorMsg = error.response?.data?.message || 'Error connecting to verification server.'
            toast.error(errorMsg)
        }
    }

    const iconStyle = { fontVariationSettings: '"FILL" 1, "wght" 400, "GRAD" 0, "opsz" 24' }



    return (
        <>
            <ToastContainer />
            <div className='bg-[#f4fafd] flex min-h-screen'>
                <div className='py-6 px-20 w-[78%] absolute right-0'>
                    <div className='flex items-center justify-between'>
                        <div>
                            <h1 className='text-[30px] font-bold'>Welcome back, {firstname || "Student"}!</h1>
                            <span className='text-[16px] text-[#3f4941] font-medium'>MATRIC : {matricNo || "N/A"}</span>
                        </div>
                    </div>

                    <div className='mt-6 p-4 flex gap-2 items-center'>
                        <div className='p-2 bg-[#0a643a] rounded-full w-[2px] h-[2px] blink-colors'></div>
                        <h2 className='text-md text-[14px] font-semibold'>Active Lecture Sessions</h2>
                    </div>

                    {loading ? (
                        <div className="text-[#3f4941] text-center font-medium mt-6 animate-pulse">
                            Loading ongoing lectures...
                        </div>
                    ) : sessions.length === 0 ? (
                        <div className="text-gray-500 border border-dashed border-gray-300 rounded-lg p-6 text-center mt-4 bg-white max-w-sm">
                            No active classes found at the moment.
                        </div>
                    ) : (
                                <div className='grid grid-cols-3 gap-4'>
                                    {/* 👈 Dynamic Mapping over sessions array */}
                                    {sessions.map((sessionItem) => {
                                        const displayTimeFrom = sessionItem.dateTimeFrom
                                            ? new Date(sessionItem.dateTimeFrom).toLocaleTimeString(undefined, { hour: '2-digit', minute: '2-digit' })
                                            : "N/A";

                                        const displayTimeTo = sessionItem.dateTimeTo
                                            ? new Date(sessionItem.dateTimeTo).toLocaleTimeString(undefined, { hour: '2-digit', minute: '2-digit' })
                                            : "N/A";

                                        // 👈 FIXED: Brought the opening parenthesis up to the return line!
                                        return (
                                            <div key={sessionItem._id} className='bg-[#ffffff] w-[250px] rounded-lg border border-[#bfc9bf] flex flex-col justify-between shadow-sm'>
                                                <div className='bg-[#e2e9ec] flex justify-between p-2 rounded-tl-lg rounded-tr-lg items-center'>
                                                    <span className='text-[12px] text-[#3f4941] font-bold uppercase'>
                                                        {sessionItem.courseCode}
                                                    </span>
                                                    <span className='bg-[#0a643a] py-0.5 px-2 rounded-full text-[9px] font-extrabold text-white uppercase tracking-wider animate-pulse'>
                                                        {displayTimeFrom && displayTimeFrom ? "LIVE" : "CLOSED"}
                                                    </span>
                                                </div>
                                                <div className='flex flex-col justify-center p-4 flex-grow'>
                                                    <h1 className='text-[16px] font-bold mb-2 line-clamp-2 min-h-[48px]'>
                                                        {sessionItem.courseName}
                                                    </h1>
                                                    <p className='flex items-center gap-1 text-xs text-[#3f4941] mb-2'>
                                                        <span className="material-symbols-outlined text-[16px]">location_on</span>
                                                        {sessionItem.venue}
                                                    </p>
                                                    <p className='flex items-center gap-1 text-xs text-[#3f4941] mb-4'>
                                                        <span className="material-symbols-outlined text-[16px]">schedule</span>
                                                        {displayTimeFrom} - {displayTimeTo}
                                                    </p>
                                                    <button
                                                        onClick={() => verifyLocation(sessionItem.courseCode)}
                                                        className='bg-[#0a643a] flex items-center justify-center text-white py-2 px-4 rounded-sm hover:bg-[#084d2c] gap-1 font-semibold transition-colors mt-auto w-full text-sm'
                                                    >
                                                        <span className="material-symbols-outlined text-[18px]">fingerprint</span>
                                                        Mark Attendance
                                                    </button>
                                                </div>
                                            </div>
                                        ); // 👈 Closed return block safely
                                    })}
                                </div>
                    )}
                </div>
            </div>
        </>
    )
}

export default StudentDashboard
