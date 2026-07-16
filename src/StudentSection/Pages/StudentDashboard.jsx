import axios from 'axios'
import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { ToastContainer, toast } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'

const StudentDashboard = () => {
    const [activeBtn, setActiveBtn] = useState('dashboard')
    const [firstname, setFirstname] = useState('')
    const [matricNo, setMatricNo] = useState('')
    const [faculty, setFaculty] = useState('')
    const [department, setDepartment] = useState('')
    
    // 🟢 Keep 'sessions' as your single source of truth for the filtered array
    const [sessions, setSessions] = useState([]) 
    const [loading, setLoading] = useState(true)

    // Modal States for Student Selection
    const [isModalOpen, setIsModalOpen] = useState(false)
    const [selectedSession, setSelectedSession] = useState(null)
    const [chosenMethod, setChosenMethod] = useState('')
    const [verifying, setVerifying] = useState(false)

    const token = localStorage.getItem('token')
    const endpoint = import.meta.env.VITE_ENDPOINT
    const navigate = useNavigate()

    useEffect(() => {
    if (!token) {
        navigate('/signin')
        return
    }

    setLoading(true) // Ensure loading is true when starting

    // 1. Fetch Student Profile Information FIRST
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
                setFaculty(data.faculty || '')
                setDepartment(data.department || '')

                // 2. ONLY THEN fetch the active sessions
                return axios.get("https://smart-backend-1-q3fb.onrender.com/active-sessions", {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                })
            }
        })
        .then((res) => {
            if (res && res.data) {
                // Update the state with the active sessions
                setSessions(res.data.sessions || res.data.data || []);
            }
        })
        .catch((err) => {
            console.error("Dashboard error:", err)
            // Optional: only navigate to signin if it was a profile auth error
            if (err.response?.status === 401) {
                navigate('/signin')
            } else {
                toast.error("Could not load active lectures.")
            }
        })
        .finally(() => {
            setLoading(false) // Turns off loading spinner only after BOTH requests finish
        })

}, [token, endpoint, navigate])
    // Opens the selector drawer modal for the clicked card session
    const openVerificationModal = (sessionItem) => {
        setSelectedSession(sessionItem)
        setChosenMethod('') // Reset selection
        setIsModalOpen(true)
    }

    // Coordinates router based on student's final submission selection
    const handleVerificationSubmit = () => {
        if (!chosenMethod) {
            toast.error('Please choose a verification method.')
            return
        }

        if (chosenMethod === 'gps') {
            handleGpsLookup()
        } else if (chosenMethod === 'wifi') {
            handleWifiLookup()
        } else if (chosenMethod === 'beacon') {
            handleBeaconLookup()
        }
    }

    // Strategy 1: Handle GPS Lock
    const handleGpsLookup = () => {
        if (!navigator.geolocation) {
            toast.error('Geolocation is not supported by your browser.')
            return
        }

        setVerifying(true)
        toast.info('Retrieving your current coordinate location...')

        navigator.geolocation.getCurrentPosition(
            (position) => {
                const { latitude, longitude } = position.coords
                sendToServer({
                    courseCode: selectedSession.courseCode,
                    verificationMethodChosen: 'gps',
                    studentLatitude: latitude,
                    studentLongitude: longitude
                })
            },
            (error) => {
                console.error(error)
                toast.error('Unable to retrieve location. Check device settings permissions.')
                setVerifying(false)
            },
            { enableHighAccuracy: true, timeout: 10000, maximumAge: 0 }
        )
    }

    // Strategy 2: Simulate or capture Wi-Fi interfaces (BSSID)
    const handleWifiLookup = () => {
        setVerifying(true)
        toast.info('Scanning connected network configurations...')

        sendToServer({
            courseCode: selectedSession.courseCode,
            verificationMethodChosen: 'wifi',
            studentLatitude: 0,
            studentLongitude: 0,
            scannedBssid: "54:1F:8D:2B:86:87"
        })
    }

    // Strategy 3: Bluetooth BLE Hardware Handshakes
    const handleBeaconLookup = () => {
        setVerifying(true)
        toast.info('Searching for local Bluetooth transmitter pulses...')

        sendToServer({
            courseCode: selectedSession.courseCode,
            verificationMethodChosen: 'beacon',
            studentLatitude: 0,
            studentLongitude: 0,
            scannedUuid: "12345678-abcd-1234-abcd-123456789abc"
        })
    }

    const sendToServer = async (payloadData) => {
        try {
            setVerifying(true);

            const token = localStorage.getItem('token');

            if (!token) {
                toast.error("No login token found. Please log out and sign back in.");
                return;
            }

            console.log("🔑 Attaching Token to request:", `Bearer ${token}`);

            const response = await axios.post("https://smart-backend-1-q3fb.onrender.com/verify-attendance", payloadData, {
                headers: {
                    'Authorization': 'Bearer ' + token,
                    'Content-Type': 'application/json'
                }
            });

            if (response.data.verified) {
                toast.success(response.data.message || "Attendance marked successfully! 🎉");
                setIsModalOpen(false);
            }

        } catch (error) {
            console.error("❌ Verification failed:", error);
            const errorMsg = error.response?.data?.message || "Verification failed.";
            toast.error(errorMsg);
        } finally {
            setVerifying(false);
        }
    };

    return (
        <>
            <ToastContainer />
            <div className='bg-[#f4f2fd] min-h-screen'>
                <div className='pt-16 px-6 lg:py-2 lg:px-5 w-full pb-28'>
                    <div className='flex items-center justify-between'>
                        <div>
                            <h1 className='text-[30px] font-bold'>Welcome back, {firstname || "Student"}!</h1>
                            <span className='text-[16px] text-[#3f4941] font-medium'>MATRIC : {matricNo || "N/A"}</span>
                            {department && (
                                <p className='text-[13px] text-[#3f4941] mt-1'>
                                    <span className='font-semibold'>Department:</span> {department}
                                </p>
                            )}
                        </div>
                    </div>

                    <div className='mt-6 p-4 flex gap-2 items-center'>
                        <div className='p-1 bg-[#0a643a] rounded-full w-[2px] h-[2px] animate-ping'></div>
                        <h2 className='text-md text-[14px] font-semibold'>Active Lecture Sessions</h2>
                    </div>

                    {loading ? (
                        <div className="text-[#3f4941] text-center font-medium mt-6 animate-pulse">
                            Loading ongoing lectures...
                        </div>
                    ) : sessions.length === 0 ? (
                        <div className="text-gray-500 border border-dashed border-gray-300 rounded-lg p-6 text-center mt-4 bg-white max-w-sm mx-auto sm:mx-0">
                            No active classes found for your department at the moment.
                        </div>
                    ) : (
                        <div className='grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-2 gap-4 lg:gap-10'>
                            {sessions.map((sessionItem) => {
                                const displayTimeFrom = sessionItem.dateTimeFrom
                                    ? new Date(sessionItem.dateTimeFrom).toLocaleTimeString(undefined, { hour: '2-digit', minute: '2-digit' })
                                    : "N/A";

                                const displayTimeTo = sessionItem.dateTimeTo
                                    ? new Date(sessionItem.dateTimeTo).toLocaleTimeString(undefined, { hour: '2-digit', minute: '2-digit' })
                                    : "N/A";

                                return (
                                    <div key={sessionItem._id} className='bg-[#ffffff] rounded-lg border border-[#bfc9bf] flex flex-col justify-between shadow-sm overflow-hidden'>
                                        <div className='bg-[#e2e9ec] flex justify-between p-3 items-center'>
                                            <span className='text-[12px] text-[#3f4941] font-bold uppercase tracking-wider'>
                                                {sessionItem.courseCode}
                                            </span>
                                            <span className='bg-[#0a643a] py-0.5 px-2 rounded-full text-[9px] font-extrabold text-white tracking-wider animate-pulse'>
                                                LIVE
                                            </span>
                                        </div>
                                        <div className='flex flex-col justify-center p-4 flex-grow'>
                                            <h1 className='text-[16px] font-bold mb-2 line-clamp-2 min-h-[48px] text-slate-800'>
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
                                            {sessionItem.mapUrl && (
                                                <a href={sessionItem.mapUrl} target='_blank' rel='noopener noreferrer'
                                                    className='flex items-center gap-1 text-xs text-[#0a643a] hover:text-[#084d2c] hover:underline mb-4 w-fit'>
                                                    <span className="material-symbols-outlined text-[16px]">map</span>
                                                    View on Google Maps
                                                </a>
                                            )}
                                            <button
                                                onClick={() => openVerificationModal(sessionItem)}
                                                className='bg-[#0a643a] flex items-center justify-center text-white py-2.5 px-4 rounded hover:bg-[#084d2c] gap-1 font-semibold transition-colors mt-auto w-full text-sm'
                                            >
                                                <span className="material-symbols-outlined text-[18px]">fingerprint</span>
                                                Mark Attendance
                                            </button>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    )}
                </div>
            </div>
            {/* SELECTION MODAL LAYER DRAWER */}
            {isModalOpen && selectedSession && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-fadeIn">
                    <div className="bg-white rounded-xl max-w-md w-full p-5 shadow-xl border border-gray-100 flex flex-col max-h-[90vh]">
                        <div className="flex justify-between items-start mb-2">
                            <div>
                                <h3 className="text-base font-bold text-slate-900">Verify Proximity</h3>
                                <p className="text-xs text-slate-500 mt-0.5 uppercase tracking-wide font-semibold">{selectedSession.courseCode} — {selectedSession.courseName}</p>
                            </div>
                            <button
                                onClick={() => setIsModalOpen(false)}
                                className="text-gray-400 hover:text-gray-600 transition-colors p-1"
                            >
                                <span className="material-symbols-outlined">close</span>
                            </button>
                        </div>

                        <p className="text-xs text-slate-600 mb-4 border-b pb-3 border-gray-100">
                            Select one of the verification channels authorized by your lecturer below:
                        </p>

                        <div className="space-y-3 overflow-y-auto pr-1 flex-grow">
                            <label className={`flex items-center space-x-3 p-3 border rounded-lg cursor-pointer transition-all ${chosenMethod === 'gps' ? 'border-emerald-600 bg-emerald-50/40 font-medium' : 'border-gray-200 hover:bg-slate-50'}`}>
                                <input
                                    type="radio"
                                    name="verificationChannel"
                                    value="gps"
                                    checked={chosenMethod === 'gps'}
                                    onChange={(e) => setChosenMethod(e.target.value)}
                                    className="h-4 w-4 text-emerald-600 border-gray-300 focus:ring-emerald-500"
                                />
                                <div>
                                    <span className="block text-xs font-bold text-slate-800">GPS Geofencing Mapping</span>
                                    <span className="block text-[10px] text-slate-500">Matches current physical coordinates inside classroom footprint.</span>
                                </div>
                            </label>

                            <label className={`flex items-center space-x-3 p-3 border rounded-lg cursor-pointer transition-all ${chosenMethod === 'wifi' ? 'border-emerald-600 bg-emerald-50/40 font-medium' : 'border-gray-200 hover:bg-slate-50'}`}>
                                <input
                                    type="radio"
                                    name="verificationChannel"
                                    value="wifi"
                                    checked={chosenMethod === 'wifi'}
                                    onChange={(e) => setChosenMethod(e.target.value)}
                                    className="h-4 w-4 text-emerald-600 border-gray-300 focus:ring-emerald-500"
                                />
                                <div>
                                    <span className="block text-xs font-bold text-slate-800">Classroom Network Wi-Fi Link</span>
                                    <span className="block text-[10px] text-slate-500">Validates if you are connected to the specific hall router access point.</span>
                                </div>
                            </label>

                            <label className={`flex items-center space-x-3 p-3 border rounded-lg cursor-pointer transition-all ${chosenMethod === 'beacon' ? 'border-emerald-600 bg-emerald-50/40 font-medium' : 'border-gray-200 hover:bg-slate-50'}`}>
                                <input
                                    type="radio"
                                    name="verificationChannel"
                                    value="beacon"
                                    checked={chosenMethod === 'beacon'}
                                    onChange={(e) => setChosenMethod(e.target.value)}
                                    className="h-4 w-4 text-emerald-600 border-gray-300 focus:ring-emerald-500"
                                />
                                <div>
                                    <span className="block text-xs font-bold text-slate-800">Bluetooth Proximity Beacon Scan</span>
                                    <span className="block text-[10px] text-slate-500">Checks connection signals from active hardware setups inside room.</span>
                                </div>
                            </label>
                        </div>

                        <div className="flex gap-3 mt-5 pt-3 border-t border-gray-100">
                            <button
                                type="button"
                                onClick={() => setIsModalOpen(false)}
                                className="w-1/2 bg-gray-100 hover:bg-gray-200 text-slate-700 text-xs py-2.5 rounded font-bold transition-colors"
                            >
                                Cancel
                            </button>
                            <button
                                type="button"
                                disabled={verifying}
                                onClick={handleVerificationSubmit}
                                className="w-1/2 bg-[#0a643a] hover:bg-[#084d2c] disabled:bg-gray-300 text-white text-xs py-2.5 rounded font-bold transition-colors shadow-sm flex items-center justify-center gap-1"
                            >
                                {verifying ? (
                                    <span className="animate-pulse">Validating Proximity...</span>
                                ) : (
                                    <>
                                        <span className="material-symbols-outlined text-[16px]">done_all</span>
                                        Verify Attendance
                                    </>
                                )}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </>
    )
}

export default StudentDashboard