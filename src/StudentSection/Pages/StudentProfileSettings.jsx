import axios from 'axios';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button, Modal, ModalBody, ModalHeader } from "flowbite-react";
import { HiOutlineExclamationCircle } from "react-icons/hi";


export default function StudentProfileSettings() {
    const [notifications, setNotifications] = useState({
        push: true,
        email: true,
        sms: false,
        courseAlerts: true,
    });

    const toggleNotification = (key) => {
        setNotifications((prev) => ({ ...prev, [key]: !prev[key] }));
    };

    const fallbackProfileImg = 'https://imgs.search.brave.com/Jopvk0MWzfaYi1h8ZX8btE8nIJgelXumRnIDVQKFXI8/rs:fit:860:0:0:0/g:ce/aHR0cHM6Ly9pLnBp/bmltZy5jb20vb3Jp/Z2luYWxzL2M2LzU2/L2VkL2M2NTZlZDAy/MDdjMDViZTc5ZGI2/ZDdkYTQxZDdhNmZk/LmpwZw'
    const displayProfileImg = fallbackProfileImg
    // const [profileImg, setProfileImg] = useState(displayProfileImg);
    const [profileImg, setProfileImg] = useState(() => {
        return localStorage.getItem('profilePicture') || displayProfileImg
    })
    const [uploading, setUploading] = useState(false);


    const handleImageChange = async (e) => {
        const token = localStorage.getItem('token')
        if (!token) {
            console.log('invalid or expired token')
            return
        }
        const file = e.target.files[0]
        if (!file) return;

        const reader = new FileReader()
        reader.onload = async () => {
            const base64Image = reader.result
            console.log(base64Image)

            setProfileImg(base64Image)
            setUploading(true)
            try {
                const response = await axios.post('https://smart-backend-1-q3fb.onrender.com/upload-profile-picture', { image: base64Image }, {
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${token}`, // Your JWT Token
                    }
                });
                console.log(response.data)
                const data = response.data
                if (data.success) {
                    setUploading(false)
                    localStorage.setItem("profilePicture", data.profilePictureUrl);
                } else {
                    setUploading(false)
                    console.error('Upload failed:', data.message);
                }
            } catch (error) {
                setUploading(false)
                console.error('Network or server error:', error);
            }
        }
        reader.onerror = (error) => {
            console.log(error)
            setUploading(false)
        }
        reader.readAsDataURL(file)
    }
    const navigate = useNavigate()
    const handleLogout = () => {

        localStorage.removeItem('token')
        localStorage.removeItem('profilePicture')
        localStorage.removeItem('course')
        localStorage.removeItem('courseCode')
        localStorage.removeItem('courseName')
        localStorage.removeItem('courseCode')
        localStorage.removeItem('courseCode')
        localStorage.removeItem('courseCode')
        navigate('/signin')
    }
    

    "use client";

    
    const [openModal, setOpenModal] = useState(false);

    


    return (
        <div className="min-h-screen bg-[#f3f7f8] pt-24 pb-12 px-4 flex justify-center text-[#1c2a2b] font-sans">
            <div className="w-full max-w-2xl space-y-6">

                {/* ── 1. USER PROFILE HEADER CARD ─────────────────────────────────── */}
                <div className="bg-white rounded-2xl p-5 border border-gray-200/80 shadow-sm flex items-center justify-between">
                    <div className="flex items-center gap-4">
                        <div className="relative">
                            <img
                                src={profileImg}
                                alt="Alex Rivers"
                                className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl object-cover border border-gray-200"
                            />
                            <input
                                type='file'
                                id="avatarInput"
                                accept="image/*"
                                onChange={handleImageChange}
                                aria-label="Change Profile Picture"
                                className="hidden"
                            />
                            <label
                                htmlFor="avatarInput"
                                className="absolute -bottom-1 -right-1 w-7 h-7 bg-[#0b6238] hover:bg-[#084b2a] text-white rounded-lg flex items-center justify-center cursor-pointer shadow-md border-2 border-white transition-colors"
                            >
                                {uploading ? (
                                    <span className="animate-spin text-xs material-symbols-outlined">circle </span>
                                ) : (
                                    <svg className="w-3.5 h-3.5 fill-current" viewBox="0 0 24 24">
                                        <path d="M3 17.25V21h3.75L17.81 9.94l-3.75-3.75L3 17.25zM20.71 7.04c.39-.39.39-1.02 0-1.41l-2.34-2.34c-.39-.39-1.02-.39-1.41 0l-1.83 1.83 3.75 3.75 1.83-1.83z" />
                                    </svg>
                                )}
                            </label>
                        </div>

                        <div className="space-y-0.5">
                            <h2 className="text-xl font-extrabold text-[#11221c] tracking-tight">
                                Alex Rivers
                            </h2>
                            <p className="text-xs font-semibold text-gray-500">
                                Student ID: <span className="text-gray-700">2024-8832</span>
                            </p>
                            <p className="text-[11px] font-bold text-[#0b6238] uppercase tracking-wider">
                                Computer Science Department
                            </p>
                        </div>
                    </div>

                    <button className="px-4 py-2 border border-[#0b6238] text-[#0b6238] hover:bg-emerald-50 rounded-xl text-xs font-bold transition-colors cursor-pointer border-dashed sm:border-solid">
                        Edit Profile
                    </button>
                </div>

                {/* ── 2. ACCOUNT MANAGEMENT ────────────────────────────────────────── */}
                <div className="space-y-2">
                    <h3 className="text-xs font-bold text-[#0b6238] uppercase tracking-wider px-1">
                        Account Management
                    </h3>
                    <div className="bg-white rounded-2xl border border-gray-200/80 shadow-sm divide-y divide-gray-100 overflow-hidden">
                        <button className="w-full px-5 py-4 flex items-center justify-between hover:bg-gray-50/80 transition-colors text-left cursor-pointer">
                            <div className="flex items-center gap-3">
                                <span className="text-gray-500 text-lg material-symbols-outlined">person</span>
                                <span className="text-xs sm:text-sm font-semibold text-gray-800">Personal Information</span>
                            </div>
                            <span className="text-gray-400 font-bold text-sm">&rsaquo;</span>
                        </button>

                        <button className="w-full px-5 py-4 flex items-center justify-between hover:bg-gray-50/80 transition-colors text-left cursor-pointer">
                            <div className="flex items-center gap-3">
                                <span className="text-gray-500 text-lg material-symbols-outlined">language</span>
                                <div>
                                    <div className="text-xs sm:text-sm font-semibold text-gray-800">Language Selection</div>
                                    <div className="text-[11px] text-gray-400">English (United States)</div>
                                </div>
                            </div>
                            <span className="text-gray-400 font-bold text-sm">&rsaquo;</span>
                        </button>
                    </div>
                </div>

                {/* ── 3. NEW: ACADEMIC & COURSES ──────────────────────────────────── */}
                <div className="space-y-2">
                    <h3 className="text-xs font-bold text-[#0b6238] uppercase tracking-wider px-1">
                        Academic & Courses
                    </h3>
                    <div className="bg-white rounded-2xl border border-gray-200/80 shadow-sm divide-y divide-gray-100 overflow-hidden">

                        {/* Course Registration History */}
                        <button className="w-full px-5 py-4 flex items-center justify-between hover:bg-gray-50/80 transition-colors text-left cursor-pointer">
                            <div className="flex items-center gap-3">
                                <span className="text-gray-500 text-lg material-symbols-outlined">menu_book</span>
                                <div>
                                    <div className="text-xs sm:text-sm font-semibold text-gray-800">Course Registration Records</div>
                                    <div className="text-[11px] text-gray-400">View registered units & print slips</div>
                                </div>
                            </div>
                            <span className="text-gray-400 font-bold text-sm">&rsaquo;</span>
                        </button>

                        {/* Timetable & Class Schedules */}
                        <button className="w-full px-5 py-4 flex items-center justify-between hover:bg-gray-50/80 transition-colors text-left cursor-pointer">
                            <div className="flex items-center gap-3">
                                <span className="text-gray-500 text-lg material-symbols-outlined">schedule</span>
                                <span className="text-xs sm:text-sm font-semibold text-gray-800">Lecture Timetable & Venues</span>
                            </div>
                            <span className="text-gray-400 font-bold text-sm">&rsaquo;</span>
                        </button>

                        {/* Download Syllabus */}
                        <button className="w-full px-5 py-4 flex items-center justify-between hover:bg-gray-50/80 transition-colors text-left cursor-pointer">
                            <div className="flex items-center gap-3">
                                <span className="text-gray-500 text-lg material-symbols-outlined">download</span>
                                <span className="text-xs sm:text-sm font-semibold text-gray-800">Download Course Outlines</span>
                            </div>
                            <span className="text-gray-400 font-bold text-sm">&rsaquo;</span>
                        </button>

                    </div>
                </div>

                {/* ── 4. NOTIFICATION PREFERENCES ──────────────────────────────────── */}
                <div className="space-y-2">
                    <h3 className="text-xs font-bold text-[#0b6238] uppercase tracking-wider px-1">
                        Notification Preferences
                    </h3>
                    <div className="bg-white rounded-2xl border border-gray-200/80 shadow-sm divide-y divide-gray-100 overflow-hidden">

                        <div className="px-5 py-4 flex items-center justify-between">
                            <div className="flex items-center gap-3">
                                <span className="text-gray-500 text-lg material-symbols-outlined">notifications</span>
                                <span className="text-xs sm:text-sm font-semibold text-gray-800">Course & Class Updates</span>
                            </div>
                            <button
                                onClick={() => toggleNotification('courseAlerts')}
                                className={`w-12 h-6 flex items-center rounded-full p-1 cursor-pointer transition-colors duration-200 ${notifications.courseAlerts ? 'bg-[#0b6238]' : 'bg-gray-300'
                                    }`}
                            >
                                <div className={`bg-white w-4 h-4 rounded-full shadow-md transform transition-transform duration-200 ${notifications.courseAlerts ? 'translate-x-6' : 'translate-x-0'
                                    }`} />
                            </button>
                        </div>

                        <div className="px-5 py-4 flex items-center justify-between">
                            <div className="flex items-center gap-3">
                                <span className="text-gray-500 text-lg material-symbols-outlined">mail</span>
                                <span className="text-xs sm:text-sm font-semibold text-gray-800">Email Alerts</span>
                            </div>
                            <button
                                onClick={() => toggleNotification('email')}
                                className={`w-12 h-6 flex items-center rounded-full p-1 cursor-pointer transition-colors duration-200 ${notifications.email ? 'bg-[#0b6238]' : 'bg-gray-300'
                                    }`}
                            >
                                <div className={`bg-white w-4 h-4 rounded-full shadow-md transform transition-transform duration-200 ${notifications.email ? 'translate-x-6' : 'translate-x-0'
                                    }`} />
                            </button>
                        </div>

                    </div>
                </div>

                {/* ── 5. SECURITY ─────────────────────────────────────────────────── */}
                <div className="space-y-2">
                    <h3 className="text-xs font-bold text-[#0b6238] uppercase tracking-wider px-1">
                        Security
                    </h3>
                    <div className="bg-white rounded-2xl border border-gray-200/80 shadow-sm divide-y divide-gray-100 overflow-hidden">
                        <button className="w-full px-5 py-4 flex items-center justify-between hover:bg-gray-50/80 transition-colors text-left cursor-pointer">
                            <div className="flex items-center gap-3">
                                <span className="text-gray-500 text-lg material-symbols-outlined">lock</span>
                                <span className="text-xs sm:text-sm font-semibold text-gray-800">Change Password</span>
                            </div>
                            <span className="text-gray-400 font-bold text-sm">&rsaquo;</span>
                        </button>

                        <div className="px-5 py-4 flex items-center justify-between">
                            <div className="flex items-center gap-3">
                                <span className="text-gray-500 text-lg material-symbols-outlined">shield</span>
                                <div>
                                    <div className="text-xs sm:text-sm font-semibold text-gray-800">Two-Factor Authentication</div>
                                    <div className="text-[11px] font-bold text-[#0b6238]">Enabled</div>
                                </div>
                            </div>
                            <button className="px-3.5 py-1.5 bg-emerald-50 hover:bg-emerald-100/80 text-[#0b6238] rounded-xl text-xs font-bold transition-colors cursor-pointer">
                                Manage
                            </button>
                        </div>
                    </div>
                </div>

                {/* ── 6. LOG OUT ──────────────────────────────────────────────────── */}
                <div className="pt-2">
                    <button onClick={() => setOpenModal(true)} className="w-full py-3.5 bg-[#b91c1c] hover:bg-[#991b1b] text-white rounded-2xl text-sm font-bold flex items-center justify-center gap-2 transition-colors shadow-md cursor-pointer">
                        <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                            <path d="M17 7l-1.41 1.41L18.17 11H8v2h10.17l-2.58 2.58L17 17l5-5zM4 5h8V3H4c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h8v-2H4V5z" />
                        </svg>
                        Log Out
                    </button>
                </div>

                <div className="text-center pb-6">
                    <p className="text-[11px] font-medium text-gray-400">Version 2.4.0 (Build 8832)</p>
                </div>

            </div>


                <Modal show={openModal}  size="md" onClose={() => setOpenModal(false)} popup>
                    <ModalHeader className="bg-[#ffffff] border-0" />
                    <ModalBody className="bg-[#ffffff] border-0 ">
                        <div className="text-center">
                            <HiOutlineExclamationCircle className="mx-auto mb-4 h-14 w-14 text-[#0a643a]" />
                            <h3 className="mb-5 text-lg font-bold text-black">
                                Are you sure you want to Logout?
                            </h3>
                            <div className="flex justify-center gap-4">
                                <Button color="red" onClick={() => handleLogout()}>
                                    Yes, I'm sure
                                </Button>
                                <Button color="green" onClick={() => setOpenModal(false)}>
                                    No, cancel
                                </Button>
                            </div>
                        </div>
                    </ModalBody>
                </Modal>

        </div>
    );
}