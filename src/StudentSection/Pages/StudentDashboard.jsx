import api from '../../Utils/api'
import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { ToastContainer, toast } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'

const StudentDashboard = () => {
    const [activeBtn, setActiveBtn] = useState('dashboard')
    const [firstname, setFirstname] = useState('')
    const [matricNo, setMatricNo] = useState('')
    const [faculty, setFaculty] = useState('')
    const [department, setDepartment] = useState('')
    
    const [sessions, setSessions] = useState([]) 
    const [loading, setLoading] = useState(true)

    // Modal States for Student Selection
    const [isModalOpen, setIsModalOpen] = useState(false)
    const [selectedSession, setSelectedSession] = useState(null)
    const [chosenMethod, setChosenMethod] = useState('')
    const [verifying, setVerifying] = useState(false)

    const navigate = useNavigate()

    const fetchDashboardData = () => {
        setLoading(true)

        api.get('/dashboard')
            .then((response) => {
                if (response.status === 200 || response.status === 201) {
                    const data = response.data.result
                    setFirstname(data.firstname)
                    setMatricNo(data.matricno)
                    setFaculty(data.faculty || '')
                    setDepartment(data.department || '')

                    return api.get('/active-sessions')
                } else {
                    navigate('/signin')
                }
            })
            .then((res) => {
                if (res && res.data) {
                    setSessions(res.data.sessions || res.data.data || []);
                }
            })
            .catch((err) => {
                console.error("Dashboard error:", err)
                if (err.response?.status === 401 || err.response?.status === 403) {
                    navigate('/signin')
                } else {
                    toast.error("Could not load active lectures.")
                }
            })
            .finally(() => {
                setLoading(false)
            })
    }

    useEffect(() => {
        fetchDashboardData()
    }, [token, endpoint, navigate])

    const openVerificationModal = (sessionItem) => {
        setSelectedSession(sessionItem)
        setChosenMethod('')
        setIsModalOpen(true)
    }

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
            const response = await api.post('/verify-attendance', payloadData);

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
            <div className='bg-[#f4f2fd] min-h-screen font-sans'>
                <div className='pt-8 px-4 lg:px-8 w-full pb-20 max-w-7xl mx-auto'>
                    
                    {/* Header Welcome Section */}
                    <div className='flex flex-col md:flex-row md:items-center justify-between bg-white p-6 rounded-xl border border-[#bfc9bf] shadow-sm gap-4 mt-12 lg:mt-2'>
                        <div>
                            <div className='flex items-center gap-2 mb-1'>
                                <h1 className='text-2xl md:text-3xl font-bold text-slate-800'>Welcome back, {firstname || "Student"}! 👋</h1>
                            </div>
                            <p className='text-sm text-[#3f4941] font-medium'>
                                <span className='font-bold'>MATRIC:</span> {matricNo || "N/A"} 
                                {department && <span className='ml-2'>• <span className='font-bold'>Dept:</span> {department}</span>}
                            </p>
                        </div>

                        <button 
                            onClick={fetchDashboardData}
                            className='flex items-center gap-1.5 text-xs font-semibold text-[#0a643a] bg-[#e2e9ec] px-3.5 py-2 rounded-lg hover:bg-[#d0dbdf] transition-colors w-fit'
                        >
                            <span className="material-symbols-outlined text-[18px]">refresh</span>
                            Refresh Sessions
                        </button>
                    </div>

                    {/* Stats Overview Grid */}
                    <div className='grid grid-cols-1 sm:grid-cols-3 gap-4 mt-6'>
                        <div className='bg-white border border-[#bfc9bf] p-4 rounded-xl shadow-sm flex items-center justify-between'>
                            <div>
                                <span className='text-xs text-[#3f4941] font-semibold uppercase tracking-wider block mb-1'>Overall Attendance</span>
                                <span className='text-2xl font-bold text-slate-800'>88%</span>
                            </div>
                            <div className='w-10 h-10 rounded-full bg-[#e2e9ec] flex items-center justify-center text-[#0a643a]'>
                                <span className="material-symbols-outlined">analytics</span>
                            </div>
                        </div>

                        <div className='bg-white border border-[#bfc9bf] p-4 rounded-xl shadow-sm flex items-center justify-between'>
                            <div>
                                <span className='text-xs text-[#3f4941] font-semibold uppercase tracking-wider block mb-1'>Classes Attended</span>
                                <span className='text-2xl font-bold text-slate-800'>24 Sessions</span>
                            </div>
                            <div className='w-10 h-10 rounded-full bg-[#e2e9ec] flex items-center justify-center text-[#0a643a]'>
                                <span className="material-symbols-outlined">fact_check</span>
                            </div>
                        </div>

                        <div className='bg-white border border-[#bfc9bf] p-4 rounded-xl shadow-sm flex items-center justify-between'>
                            <div>
                                <span className='text-xs text-[#3f4941] font-semibold uppercase tracking-wider block mb-1'>Exam Eligibility</span>
                                <span className='text-2xl font-bold text-emerald-700 flex items-center gap-1'>
                                    Eligible <span className="material-symbols-outlined text-[18px]">verified</span>
                                </span>
                            </div>
                            <div className='w-10 h-10 rounded-full bg-[#e2e9ec] flex items-center justify-center text-[#0a643a]'>
                                <span className="material-symbols-outlined">school</span>
                            </div>
                        </div>
                    </div>

                    {/* Main Content Layout Grid */}
                    <div className='grid grid-cols-1 lg:grid-cols-3 gap-6 mt-8 items-start'>
                        
                        {/* Left Aspect: Active Sessions (Takes 2 Columns) */}
                        <div className='lg:col-span-2 flex flex-col justify-between space-y-4'>
                            <div className='flex items-center justify-between'>
                                <div className='flex items-center gap-2'>
                                    <div className='p-1 bg-[#0a643a] rounded-full w-[8px] h-[8px] animate-ping'></div>
                                    <h2 className='text-lg font-bold text-slate-800'>Active Lecture Sessions</h2>
                                </div>
                                <span className='text-xs font-semibold text-[#3f4941] bg-white px-2.5 py-1 rounded-full border border-[#bfc9bf]'>
                                    {sessions.length} Available
                                </span>
                            </div>

                            {loading ? (
                                <div className="bg-white border border-[#bfc9bf] rounded-xl p-12 text-center text-[#3f4941] font-medium animate-pulse shadow-sm">
                                    Loading ongoing lectures...
                                </div>
                            ) : sessions.length === 0 ? (
                                <div className="bg-white border border-[#bfc9bf] rounded-xl p-8 text-center shadow-sm flex flex-col items-center justify-center gap-3">
                                    <div className="w-12 h-12 rounded-full bg-[#e2e9ec] flex items-center justify-center text-[#3f4941]">
                                        <span className="material-symbols-outlined text-2xl">event_busy</span>
                                    </div>
                                    <div>
                                        <h3 className="text-base font-bold text-slate-800">No Active Lectures</h3>
                                        <p className="text-xs text-[#3f4941] mt-1 max-w-sm">
                                            There are no active check-in sessions running for your department at the moment.
                                        </p>
                                    </div>
                                    <button 
                                        onClick={fetchDashboardData}
                                        className="mt-2 text-xs font-semibold text-[#0a643a] bg-[#e2e9ec] hover:bg-[#d0dbdf] px-4 py-2 rounded-lg transition-colors"
                                    >
                                        Check Again
                                    </button>
                                </div>
                            ) : (
                                <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
                                    {sessions.map((sessionItem) => {
                                        const displayTimeFrom = sessionItem.dateTimeFrom
                                            ? new Date(sessionItem.dateTimeFrom).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
                                            : "N/A";

                                        const displayTimeTo = sessionItem.dateTimeTo
                                            ? new Date(sessionItem.dateTimeTo).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
                                            : "N/A";

                                        return (
                                            <div key={sessionItem._id} className='bg-white rounded-xl border border-[#bfc9bf] flex flex-col justify-between shadow-sm overflow-hidden hover:shadow-md transition-shadow'>
                                                <div className='bg-[#e2e9ec] flex justify-between p-3.5 items-center border-b border-[#bfc9bf]'>
                                                    <span className='text-xs text-[#3f4941] font-bold uppercase tracking-wider'>
                                                        {sessionItem.courseCode}
                                                    </span>
                                                    <span className='bg-[#0a643a] py-0.5 px-2.5 rounded-full text-[10px] font-extrabold text-white tracking-wider animate-pulse'>
                                                        LIVE
                                                    </span>
                                                </div>
                                                <div className='flex flex-col justify-between p-5 flex-grow gap-3'>
                                                    <div>
                                                        <h1 className='text-base font-bold text-slate-800 line-clamp-2 mb-2'>
                                                            {sessionItem.courseName}
                                                        </h1>
                                                        <p className='flex items-center gap-1.5 text-xs text-[#3f4941] mb-1.5'>
                                                            <span className="material-symbols-outlined text-[16px] text-[#0a643a]">location_on</span>
                                                            {sessionItem.venue}
                                                        </p>
                                                        <p className='flex items-center gap-1.5 text-xs text-[#3f4941] mb-2'>
                                                            <span className="material-symbols-outlined text-[16px] text-[#0a643a]">schedule</span>
                                                            {displayTimeFrom} - {displayTimeTo}
                                                        </p>
                                                        {sessionItem.mapUrl && (
                                                            <a href={sessionItem.mapUrl} target='_blank' rel='noopener noreferrer'
                                                                className='flex items-center gap-1 text-xs text-[#0a643a] hover:underline font-medium w-fit'>
                                                                <span className="material-symbols-outlined text-[16px]">map</span>
                                                                View on Google Maps
                                                            </a>
                                                        )}
                                                    </div>
                                                    <button
                                                        onClick={() => openVerificationModal(sessionItem)}
                                                        className='bg-[#0a643a] flex items-center justify-center text-white py-2.5 px-4 rounded-lg hover:bg-[#084d2c] gap-1 font-semibold transition-colors w-full text-sm mt-2 shadow-sm'
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

                        {/* Right Aspect: Quick Info & Notices (Takes 1 Column) */}
                        <div className='space-y-4'>
                            <h2 className='text-lg font-bold text-slate-800'>Class Announcements</h2>
                            
                            <div className='bg-white border border-[#bfc9bf] rounded-xl p-5 shadow-sm space-y-4 mb-6'>
                                <div className='border-b border-gray-100 pb-3'>
                                    <span className='text-[10px] font-bold text-[#0a643a] bg-[#e2e9ec] px-2 py-0.5 rounded uppercase tracking-wider'>Important</span>
                                    <h4 className='text-xs font-bold text-slate-800 mt-1.5'>Geofence Attendance Verification</h4>
                                    <p className='text-xs text-[#3f4941] mt-1 leading-relaxed'>
                                        Ensure location permissions are turned on in browser settings prior to verifying GPS coordinates.
                                    </p>
                                </div>

                                <div>
                                    <span className='text-[10px] font-bold text-slate-600 bg-gray-100 px-2 py-0.5 rounded uppercase tracking-wider'>Notice</span>
                                    <h4 className='text-xs font-bold text-slate-800 mt-1.5'>Minimum Attendance Requirement</h4>
                                    <p className='text-xs text-[#3f4941] mt-1 leading-relaxed'>
                                        Students must achieve a minimum of 75% total course attendance to sit for upcoming semester examinations.
                                    </p>
                                </div>
                            </div>
                        </div>

                    </div>
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
                            <label className={`flex items-center space-x-3 p-3 border rounded-lg cursor-pointer transition-all ${chosenMethod === 'gps' ? 'border-[#0a643a] bg-[#e2e9ec]/50 font-medium' : 'border-gray-200 hover:bg-slate-50'}`}>
                                <input
                                    type="radio"
                                    name="verificationChannel"
                                    value="gps"
                                    checked={chosenMethod === 'gps'}
                                    onChange={(e) => setChosenMethod(e.target.value)}
                                    className="h-4 w-4 text-[#0a643a] border-gray-300 focus:ring-[#0a643a]"
                                />
                                <div>
                                    <span className="block text-xs font-bold text-slate-800">GPS Geofencing Mapping</span>
                                    <span className="block text-[10px] text-slate-500">Matches current physical coordinates inside classroom footprint.</span>
                                </div>
                            </label>

                            <label className={`flex items-center space-x-3 p-3 border rounded-lg cursor-pointer transition-all ${chosenMethod === 'wifi' ? 'border-[#0a643a] bg-[#e2e9ec]/50 font-medium' : 'border-gray-200 hover:bg-slate-50'}`}>
                                <input
                                    type="radio"
                                    name="verificationChannel"
                                    value="wifi"
                                    checked={chosenMethod === 'wifi'}
                                    onChange={(e) => setChosenMethod(e.target.value)}
                                    className="h-4 w-4 text-[#0a643a] border-gray-300 focus:ring-[#0a643a]"
                                />
                                <div>
                                    <span className="block text-xs font-bold text-slate-800">Classroom Network Wi-Fi Link</span>
                                    <span className="block text-[10px] text-slate-500">Validates if you are connected to the specific hall router access point.</span>
                                </div>
                            </label>

                            <label className={`flex items-center space-x-3 p-3 border rounded-lg cursor-pointer transition-all ${chosenMethod === 'beacon' ? 'border-[#0a643a] bg-[#e2e9ec]/50 font-medium' : 'border-gray-200 hover:bg-slate-50'}`}>
                                <input
                                    type="radio"
                                    name="verificationChannel"
                                    value="beacon"
                                    checked={chosenMethod === 'beacon'}
                                    onChange={(e) => setChosenMethod(e.target.value)}
                                    className="h-4 w-4 text-[#0a643a] border-gray-300 focus:ring-[#0a643a]"
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
                                className="w-1/2 bg-gray-100 hover:bg-gray-200 text-slate-700 text-xs py-2.5 rounded-lg font-bold transition-colors"
                            >
                                Cancel
                            </button>
                            <button
                                type="button"
                                disabled={verifying}
                                onClick={handleVerificationSubmit}
                                className="w-1/2 bg-[#0a643a] hover:bg-[#084d2c] disabled:bg-gray-300 text-white text-xs py-2.5 rounded-lg font-bold transition-colors shadow-sm flex items-center justify-center gap-1"
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