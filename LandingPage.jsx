import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

const LandingPage = () => {
    const navigate = useNavigate();

    // ── State for Demo Modal ───────────────────────────────────────────────
    const [isDemoModalOpen, setIsDemoModalOpen] = useState(false);
    const [demoForm, setDemoForm] = useState({
        name: "",
        email: "",
        institution: "",
        role: "University Administrator",
        message: ""
    });
    const [demoSubmitted, setDemoSubmitted] = useState(false);

    // ── State for FAQ Accordion ────────────────────────────────────────────
    const [openFaq, setOpenFaq] = useState(0);

    // ── Simulated Dynamic QR Code Timer for Hero Mockup ─────────────────────
    const [countdown, setCountdown] = useState(15);
    const [simulatedCode, setSimulatedCode] = useState("582914");
    const [alertDismissed, setAlertDismissed] = useState(false);
    const [analyzingAlert, setAnalyzingAlert] = useState(false);

    useEffect(() => {
        const timer = setInterval(() => {
            setCountdown((prev) => {
                if (prev <= 1) {
                    // Generate new 6-digit mock code
                    const newCode = Math.floor(100000 + Math.random() * 900000).toString();
                    setSimulatedCode(newCode);
                    return 15;
                }
                return prev - 1;
            });
        }, 1000);
        return () => clearInterval(timer);
    }, []);

    const handleDemoSubmit = (e) => {
        e.preventDefault();
        setDemoSubmitted(true);
        setTimeout(() => {
            // Keep confirmation visible
        }, 3000);
    };

    const resetDemoModal = () => {
        setIsDemoModalOpen(false);
        setDemoSubmitted(false);
        setDemoForm({
            name: "",
            email: "",
            institution: "",
            role: "University Administrator",
            message: ""
        });
    };

    const faqItems = [
        {
            q: "How does the rotating QR code prevent attendance proxy and fraud?",
            a: "Our cryptographic QR algorithm re-generates and salts the check-in token every 15 seconds on the lecture projector screen. Screenshots forwarded on WhatsApp or social media expire before absent students can scan them, ensuring only physically present students are logged."
        },
        {
            q: "What happens if a student does not meet the 75% attendance threshold?",
            a: "The system dynamically computes each student's attendance percentage per registered course. When a student falls below 75%, their status automatically updates to 'At Risk' (Ineligible), and automated warnings can be dispatched to both the student and their academic advisor before semester exams."
        },
        {
            q: "What if a student's camera has technical issues during class?",
            a: "Every live lecture session includes a synchronized 6-digit fallback passcode displayed directly on the screen alongside the QR code. Students can simply type this rotating code into their portal to confirm presence."
        },
        {
            q: "How do lecturers, staff, and course representatives obtain access?",
            a: "Department Administrators and Faculty Deans generate single-use, time-bound verification tokens directly from their command dashboard. New staff and course reps enter this token during signup to securely unlock their elevated role permissions."
        },
        {
            q: "Can lectures be validated in auditoriums with poor cellular reception?",
            a: "Yes! In addition to live QR scanning, the platform supports Campus Wi-Fi Hardware Locking (BSSID identification) and GPS Geofencing (200-meter classroom perimeter) to reliably verify attendance under various campus network conditions."
        }
    ];

    return (
        <div className="min-h-screen bg-[#f8faf9] text-[#1a2e26] font-sans antialiased selection:bg-emerald-100 selection:text-[#0a643a]">
            
            {/* ── 1. NAVBAR ───────────────────────────────────────────────────────── */}
            <header className="sticky top-0 z-40 bg-[#f8faf9]/95 backdrop-blur-md border-b border-gray-200/70 px-6 py-3.5 transition-all">
                <div className="max-w-7xl mx-auto flex items-center justify-between">
                    
                    {/* Brand Logo */}
                    <div 
                        onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
                        className="flex items-center gap-2.5 cursor-pointer group"
                    >
                        <div className="w-9 h-9 rounded-xl bg-[#0a643a] flex items-center justify-center text-white font-bold text-lg shadow-md group-hover:scale-105 transition-transform">
                            <span className="material-symbols-outlined text-[22px]">school</span>
                        </div>
                        <div>
                            <span className="font-black text-lg text-[#0a643a] tracking-tight block leading-none">
                                Smart Attendance
                            </span>
                            <span className="text-[10px] text-gray-500 font-semibold tracking-wider uppercase">
                                Institutional Platform
                            </span>
                        </div>
                    </div>

                    {/* Nav Links */}
                    <nav className="hidden lg:flex items-center gap-7 text-xs font-bold text-gray-600">
                        <a href="#how-it-works" className="hover:text-[#0a643a] transition-colors">How It Works</a>
                        <a href="#features" className="hover:text-[#0a643a] transition-colors">Features</a>
                        <a href="#admin-command" className="hover:text-[#0a643a] transition-colors">Faculty Deanery</a>
                        <a href="#metrics" className="hover:text-[#0a643a] transition-colors">Impact</a>
                        <a href="#faq" className="hover:text-[#0a643a] transition-colors">FAQ</a>
                    </nav>

                    {/* Header Action CTAs & Role Access */}
                    <div className="flex items-center gap-2.5">
                        <button 
                            onClick={() => setIsDemoModalOpen(true)}
                            className="hidden sm:inline-flex px-3.5 py-2 text-xs font-bold text-[#0a643a] bg-emerald-50 hover:bg-emerald-100/80 border border-emerald-200 rounded-xl transition-all cursor-pointer"
                        >
                            Request Demo
                        </button>
                        <button 
                            onClick={() => navigate('/signin')}
                            className="px-4 py-2 text-xs font-bold text-gray-700 bg-white border border-gray-300 hover:bg-gray-50 rounded-xl transition-all shadow-xs cursor-pointer flex items-center gap-1.5"
                        >
                            <span className="material-symbols-outlined text-[16px] text-[#0a643a]">login</span>
                            Sign In
                        </button>
                        <button 
                            onClick={() => navigate('/signup')} 
                            className="px-4 py-2 text-xs font-bold text-white bg-[#0a643a] hover:bg-[#08522f] rounded-xl transition-all shadow-md cursor-pointer flex items-center gap-1"
                        >
                            <span>Get Started</span>
                            <span className="material-symbols-outlined text-[14px]">arrow_forward</span>
                        </button>
                    </div>
                </div>
            </header>

            {/* ── 2. HERO SECTION ─────────────────────────────────────────────────── */}
            <section className="max-w-7xl mx-auto px-6 pt-10 pb-16">
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
                    
                    {/* Left Copy */}
                    <div className="lg:col-span-6 space-y-6" data-aos="fade-right" data-aos-duration="650">
                        
                        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 text-[11px] font-bold text-[#0a643a] bg-emerald-100/90 rounded-full border border-emerald-300/60 shadow-xs">
                            <span className="w-2 h-2 rounded-full bg-[#0a643a] animate-pulse"></span>
                            <span>Next-Gen Academic Integrity System</span>
                        </div>

                        <h1 className="text-4xl sm:text-5xl lg:text-[3.2rem] font-black text-[#0d2319] leading-[1.12] tracking-tight">
                            Institutional Attendance, <br className="hidden sm:inline" />
                            <span className="text-[#0a643a]">Automated & Fraud-Proof.</span>
                        </h1>

                        <p className="text-sm sm:text-base text-gray-600 leading-relaxed font-normal max-w-xl">
                            Eliminate fraudulent paper roll-calls. Our multi-factor verification ecosystem combines rotating encrypted QR codes, classroom GPS geofencing, and automated 75% exam clearance scores.
                        </p>

                        {/* Quick Role Portal Buttons */}
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1 max-w-lg">
                            <button 
                                onClick={() => navigate('/signin')}
                                className="p-3 bg-white border border-gray-200 hover:border-[#0a643a] hover:shadow-md rounded-2xl transition-all flex items-center gap-3 cursor-pointer group text-left"
                            >
                                <div className="w-10 h-10 rounded-xl bg-emerald-100/70 text-[#0a643a] flex items-center justify-center font-bold text-lg group-hover:scale-105 transition-transform">
                                    <span className="material-symbols-outlined">person</span>
                                </div>
                                <div>
                                    <div className="text-xs font-bold text-slate-800">Student Portal</div>
                                    <div className="text-[11px] text-gray-500">Scan QR & track clearance</div>
                                </div>
                            </button>

                            <button 
                                onClick={() => navigate('/admin/login')}
                                className="p-3 bg-white border border-gray-200 hover:border-[#0a643a] hover:shadow-md rounded-2xl transition-all flex items-center gap-3 cursor-pointer group text-left"
                            >
                                <div className="w-10 h-10 rounded-xl bg-[#0a643a] text-white flex items-center justify-center font-bold text-lg group-hover:scale-105 transition-transform">
                                    <span className="material-symbols-outlined">shield_person</span>
                                </div>
                                <div>
                                    <div className="text-xs font-bold text-slate-800">Lecturer & Deanery</div>
                                    <div className="text-[11px] text-gray-500">Launch classes & reports</div>
                                </div>
                            </button>
                        </div>

                        {/* Main CTA Actions */}
                        <div className="flex flex-wrap items-center gap-3.5 pt-2">
                            <button 
                                onClick={() => setIsDemoModalOpen(true)}
                                className="px-6 py-3.5 bg-[#0a643a] hover:bg-[#08522f] text-white rounded-xl text-xs font-bold flex items-center gap-2 transition-all shadow-md hover:shadow-lg cursor-pointer"
                            >
                                <span>Request Institutional Demo</span>
                                <span className="material-symbols-outlined text-[16px]">arrow_forward</span>
                            </button>
                            <a 
                                href="#how-it-works"
                                className="px-5 py-3.5 bg-white border border-gray-300 hover:bg-gray-50 text-gray-700 rounded-xl text-xs font-bold transition-all shadow-xs cursor-pointer"
                            >
                                How It Works
                            </a>
                        </div>
                    </div>

                    {/* Right Screen Display Frame: Interactive Live Rotating QR & Class Session Simulation */}
                    <div className="lg:col-span-6" data-aos="fade-left" data-aos-duration="650" data-aos-delay="100">
                        <div className="bg-white p-3 sm:p-4 rounded-3xl border border-gray-200/90 shadow-2xl relative">
                            
                            {/* Device Frame */}
                            <div className="bg-[#f0f4f2] rounded-2xl p-5 border border-gray-200/80 flex flex-col justify-between overflow-hidden shadow-inner space-y-4">
                                
                                {/* Mock Class Header Bar */}
                                <div className="flex items-center justify-between pb-3 border-b border-gray-200">
                                    <div className="flex items-center gap-2">
                                        <div className="w-3 h-3 rounded-full bg-red-400"></div>
                                        <div className="w-3 h-3 rounded-full bg-amber-400"></div>
                                        <div className="w-3 h-3 rounded-full bg-emerald-400"></div>
                                        <span className="text-xs font-bold text-slate-700 ml-2">CSC 401 • Lecture Hall B</span>
                                    </div>
                                    <div className="flex items-center gap-1.5 bg-emerald-100 text-[#0a643a] text-[10px] font-extrabold px-2.5 py-1 rounded-full animate-pulse">
                                        <span className="w-1.5 h-1.5 rounded-full bg-[#0a643a]"></span>
                                        SESSION LIVE
                                    </div>
                                </div>

                                {/* Interactive Rotating QR + Check-in Feed Grid */}
                                <div className="grid grid-cols-1 sm:grid-cols-12 gap-4 items-center">
                                    
                                    {/* Rotating QR Display */}
                                    <div className="sm:col-span-6 bg-white p-4 rounded-2xl border border-emerald-200/80 shadow-sm flex flex-col items-center justify-center text-center space-y-2">
                                        
                                        <div className="relative p-2.5 bg-emerald-50 rounded-xl border border-emerald-200">
                                            {/* Green High-Contrast QR Mock */}
                                            <svg className="w-32 h-32 text-[#0a643a]" viewBox="0 0 24 24" fill="currentColor">
                                                <path d="M2 2h8v8H2V2zm2 2v4h4V4H4zm10-2h8v8h-8V2zm2 2v4h4V4h-4zM2 14h8v8H2v-8zm2 2v4h4v-4H4zm14 0h4v4h-4v-4zm-4 4h2v2h-2v-2zm2-4h2v2h-2v-2zm-4-4h2v2h-2v-2zm4 0h4v2h-4v-2zm-2 2h2v2h-2v-2zm0-4h2v2h-2v-2z" />
                                            </svg>
                                            
                                            {/* Scanning Line Animation */}
                                            <div className="absolute inset-x-2 top-2 h-0.5 bg-emerald-500 shadow-[0_0_8px_#10b981] animate-pulse"></div>
                                        </div>

                                        <div className="flex items-center justify-between w-full px-2 pt-1 text-[11px]">
                                            <span className="text-gray-500 font-medium">Auto-refreshes in:</span>
                                            <span className="font-bold text-[#0a643a] font-mono bg-emerald-100/70 px-2 py-0.5 rounded">
                                                {countdown}s
                                            </span>
                                        </div>

                                        <div className="w-full bg-slate-50 border border-gray-200 rounded-lg p-1.5">
                                            <span className="text-[9px] uppercase tracking-wider text-gray-400 font-bold block">
                                                Manual Backup Code
                                            </span>
                                            <span className="text-sm font-mono font-black text-slate-800 tracking-widest">
                                                {simulatedCode.split('').join(' ')}
                                            </span>
                                        </div>
                                    </div>

                                    {/* Live Verified Student Activity Feed */}
                                    <div className="sm:col-span-6 space-y-2.5">
                                        <div className="text-[11px] font-bold text-gray-500 uppercase tracking-wider flex items-center justify-between">
                                            <span>Real-Time Check-ins</span>
                                            <span className="text-[#0a643a] font-bold">48 / 60</span>
                                        </div>

                                        <div className="space-y-2">
                                            <div className="bg-white p-2.5 rounded-xl border border-gray-100 shadow-xs flex items-center justify-between">
                                                <div className="flex items-center gap-2">
                                                    <div className="w-7 h-7 rounded-full bg-emerald-100 text-[#0a643a] font-bold text-xs flex items-center justify-center">
                                                        AE
                                                    </div>
                                                    <div>
                                                        <div className="text-xs font-bold text-slate-800">Ada Eze</div>
                                                        <div className="text-[10px] text-gray-400">MATRIC: 2021/4982</div>
                                                    </div>
                                                </div>
                                                <span className="text-[10px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded">
                                                    Verified ✓
                                                </span>
                                            </div>

                                            <div className="bg-white p-2.5 rounded-xl border border-gray-100 shadow-xs flex items-center justify-between">
                                                <div className="flex items-center gap-2">
                                                    <div className="w-7 h-7 rounded-full bg-emerald-100 text-[#0a643a] font-bold text-xs flex items-center justify-center">
                                                        JO
                                                    </div>
                                                    <div>
                                                        <div className="text-xs font-bold text-slate-800">John Okafor</div>
                                                        <div className="text-[10px] text-gray-400">GPS Geo-Fence Match</div>
                                                    </div>
                                                </div>
                                                <span className="text-[10px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded">
                                                    Verified ✓
                                                </span>
                                            </div>

                                            <div className="bg-white p-2.5 rounded-xl border border-gray-100 shadow-xs flex items-center justify-between">
                                                <div className="flex items-center gap-2">
                                                    <div className="w-7 h-7 rounded-full bg-blue-100 text-blue-800 font-bold text-xs flex items-center justify-center">
                                                        FA
                                                    </div>
                                                    <div>
                                                        <div className="text-xs font-bold text-slate-800">Fatima Aliyu</div>
                                                        <div className="text-[10px] text-gray-400">Campus Wi-Fi Lock</div>
                                                    </div>
                                                </div>
                                                <span className="text-[10px] font-bold text-blue-700 bg-blue-50 px-2 py-0.5 rounded">
                                                    Verified ✓
                                                </span>
                                            </div>
                                        </div>
                                    </div>

                                </div>

                            </div>
                        </div>
                    </div>

                </div>
            </section>

            {/* ── 3. HOW IT WORKS (3 SIMPLE STEPS) ─────────────────────────────────── */}
            <section id="how-it-works" className="max-w-7xl mx-auto px-6 py-16 border-t border-gray-200/70">
                <div className="text-center max-w-2xl mx-auto mb-12 space-y-2" data-aos="fade-up">
                    <span className="text-xs font-bold text-[#0a643a] uppercase tracking-wider bg-emerald-50 px-3 py-1 rounded-full border border-emerald-200">
                        Simple 3-Step Flow
                    </span>
                    <h2 className="text-3xl font-extrabold text-[#0d2319]">
                        How Institutional Attendance Works
                    </h2>
                    <p className="text-xs sm:text-sm text-gray-600">
                        Designed for zero learning curve. Lecturers start sessions with one click, while students verify presence in seconds.
                    </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    
                    {/* Step 1 */}
                    <div className="bg-white p-6 rounded-3xl border border-gray-200 shadow-sm space-y-4 hover:shadow-md transition-shadow relative" data-aos="fade-up" data-aos-delay="100">
                        <div className="w-12 h-12 rounded-2xl bg-emerald-100 text-[#0a643a] flex items-center justify-center font-black text-lg">
                            01
                        </div>
                        <h3 className="text-base font-bold text-slate-800">Lecturer Launches Session</h3>
                        <p className="text-xs text-gray-600 leading-relaxed">
                            Lecturer selects the course and projects the live encrypted rotating QR code with an active 200m classroom GPS boundary.
                        </p>
                        <div className="pt-2 text-[11px] font-bold text-[#0a643a] flex items-center gap-1">
                            <span>Dynamic Salt Cryptography</span>
                            <span className="material-symbols-outlined text-[14px]">lock</span>
                        </div>
                    </div>

                    {/* Step 2 */}
                    <div className="bg-white p-6 rounded-3xl border border-gray-200 shadow-sm space-y-4 hover:shadow-md transition-shadow relative" data-aos="fade-up" data-aos-delay="200">
                        <div className="w-12 h-12 rounded-2xl bg-emerald-100 text-[#0a643a] flex items-center justify-center font-black text-lg">
                            02
                        </div>
                        <h3 className="text-base font-bold text-slate-800">Student Scans on Mobile</h3>
                        <p className="text-xs text-gray-600 leading-relaxed">
                            Student points their smartphone camera at the projector screen. The app cross-checks GPS location and registered course enrollment.
                        </p>
                        <div className="pt-2 text-[11px] font-bold text-[#0a643a] flex items-center gap-1">
                            <span>Anti-Proxy Location Check</span>
                            <span className="material-symbols-outlined text-[14px]">pin_drop</span>
                        </div>
                    </div>

                    {/* Step 3 */}
                    <div className="bg-white p-6 rounded-3xl border border-gray-200 shadow-sm space-y-4 hover:shadow-md transition-shadow relative" data-aos="fade-up" data-aos-delay="300">
                        <div className="w-12 h-12 rounded-2xl bg-emerald-100 text-[#0a643a] flex items-center justify-center font-black text-lg">
                            03
                        </div>
                        <h3 className="text-base font-bold text-slate-800">Instant 75% Clearance</h3>
                        <p className="text-xs text-gray-600 leading-relaxed">
                            Attendance scores update immediately. Lecturers and Deanery staff get continuous analytics on exam eligibility and student retention.
                        </p>
                        <div className="pt-2 text-[11px] font-bold text-[#0a643a] flex items-center gap-1">
                            <span>Automated Exam Clearance</span>
                            <span className="material-symbols-outlined text-[14px]">verified</span>
                        </div>
                    </div>

                </div>
            </section>

            {/* ── 4. STUDENT JOURNEY & KEY FEATURES ─────────────────────────────────── */}
            <section id="features" className="max-w-7xl mx-auto px-6 py-16">
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
                    
                    {/* Left 4-Feature Cards */}
                    <div className="lg:col-span-6 grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div className="bg-white p-5 rounded-2xl border border-gray-200/80 shadow-sm space-y-2" data-aos="fade-up" data-aos-delay="50">
                            <div className="w-9 h-9 rounded-xl bg-emerald-100 text-[#0a643a] flex items-center justify-center font-bold text-base">
                                <span className="material-symbols-outlined">qr_code_scanner</span>
                            </div>
                            <h4 className="font-bold text-sm text-gray-900">Rotating QR Engine</h4>
                            <p className="text-xs text-gray-500 leading-relaxed">
                                15-second dynamic tokens prevent screenshot forwarding and off-site proxy scans.
                            </p>
                        </div>

                        <div className="bg-white p-5 rounded-2xl border border-gray-200/80 shadow-sm space-y-2" data-aos="fade-up" data-aos-delay="150">
                            <div className="w-9 h-9 rounded-xl bg-emerald-100 text-[#0a643a] flex items-center justify-center font-bold text-base">
                                <span className="material-symbols-outlined">verified</span>
                            </div>
                            <h4 className="font-bold text-sm text-gray-900">75% Exam Eligibility</h4>
                            <p className="text-xs text-gray-500 leading-relaxed">
                                Real-time clearance scores flag at-risk students before semester exam dockets close.
                            </p>
                        </div>

                        <div className="bg-white p-5 rounded-2xl border border-gray-200/80 shadow-sm space-y-2" data-aos="fade-up" data-aos-delay="250">
                            <div className="w-9 h-9 rounded-xl bg-emerald-100 text-[#0a643a] flex items-center justify-center font-bold text-base">
                                <span className="material-symbols-outlined">pin_drop</span>
                            </div>
                            <h4 className="font-bold text-sm text-gray-900">Geo-Fenced Perimeter</h4>
                            <p className="text-xs text-gray-500 leading-relaxed">
                                Validates student physical presence within 200m of designated lecture halls.
                            </p>
                        </div>

                        <div className="bg-white p-5 rounded-2xl border border-gray-200/80 shadow-sm space-y-2" data-aos="fade-up" data-aos-delay="350">
                            <div className="w-9 h-9 rounded-xl bg-emerald-100 text-[#0a643a] flex items-center justify-center font-bold text-base">
                                <span className="material-symbols-outlined">wifi_password</span>
                            </div>
                            <h4 className="font-bold text-sm text-gray-900">Wi-Fi & Fallback Passcodes</h4>
                            <p className="text-xs text-gray-500 leading-relaxed">
                                Hardware-locked Wi-Fi identification and 6-digit backup codes for low-light halls.
                            </p>
                        </div>
                    </div>

                    {/* Right Text Content */}
                    <div className="lg:col-span-6 space-y-5" data-aos="fade-left" data-aos-duration="650">
                        <span className="text-xs font-bold text-[#0a643a] uppercase tracking-wider bg-emerald-50 px-3 py-1 rounded-full border border-emerald-200">
                            Friction-less Experience
                        </span>
                        <h2 className="text-3xl font-extrabold text-[#0d2319]">
                            Empower Students with Complete Transparency
                        </h2>
                        <p className="text-xs sm:text-sm text-gray-600 leading-relaxed">
                            Give students complete ownership of their academic health. Our portal eliminates confusion around attendance dispute resolution with clear digital audit logs.
                        </p>

                        <ul className="space-y-3 text-xs font-semibold text-gray-700">
                            <li className="flex items-center gap-2.5">
                                <span className="w-5 h-5 rounded-full bg-emerald-100 text-[#0a643a] flex items-center justify-center text-xs font-bold">✓</span>
                                Instant check-in feedback with live session timetable indicators.
                            </li>
                            <li className="flex items-center gap-2.5">
                                <span className="w-5 h-5 rounded-full bg-emerald-100 text-[#0a643a] flex items-center justify-center text-xs font-bold">✓</span>
                                Automatic course-by-course breakdown of classes attended vs. required.
                            </li>
                            <li className="flex items-center gap-2.5">
                                <span className="w-5 h-5 rounded-full bg-emerald-100 text-[#0a643a] flex items-center justify-center text-xs font-bold">✓</span>
                                Direct course registration cart and enrollment validation.
                            </li>
                        </ul>

                        <div className="pt-2">
                            <button 
                                onClick={() => navigate('/signin')}
                                className="text-xs font-bold text-[#0a643a] hover:text-[#08522f] flex items-center gap-1.5 cursor-pointer group"
                            >
                                <span>Try Student Portal Now</span>
                                <span className="group-hover:translate-x-1 transition-transform">&rarr;</span>
                            </button>
                        </div>
                    </div>

                </div>
            </section>

            {/* ── 5. METRIC STAT BANNER ───────────────────────────────────────────── */}
            <section id="metrics" className="bg-[#0b5c36] text-white py-14" data-aos="fade-up">
                <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
                    <div className="space-y-1.5" data-aos="zoom-in" data-aos-delay="100">
                        <div className="text-4xl sm:text-5xl font-black tracking-tight">98%</div>
                        <div className="text-xs font-bold tracking-wider uppercase text-emerald-200">Reduction in Paperwork</div>
                        <p className="text-[11px] text-emerald-100/75 max-w-xs mx-auto">
                            Saving thousands of administrative lecturer man-hours each academic semester.
                        </p>
                    </div>

                    <div className="space-y-1.5 border-y md:border-y-0 md:border-x border-emerald-700/50 py-6 md:py-0" data-aos="zoom-in" data-aos-delay="200">
                        <div className="text-4xl sm:text-5xl font-black tracking-tight">100%</div>
                        <div className="text-xs font-bold tracking-wider uppercase text-emerald-200">Real-Time Exam Clearance</div>
                        <p className="text-[11px] text-emerald-100/75 max-w-xs mx-auto">
                            Instant automated verification of the 75% semester attendance threshold.
                        </p>
                    </div>

                    <div className="space-y-1.5" data-aos="zoom-in" data-aos-delay="300">
                        <div className="text-4xl sm:text-5xl font-black tracking-tight">0%</div>
                        <div className="text-xs font-bold tracking-wider uppercase text-emerald-200">Proxy Attendance Rate</div>
                        <p className="text-[11px] text-emerald-100/75 max-w-xs mx-auto">
                            Eliminated proxy roll-calls via cryptographic rotating QR and GPS validation.
                        </p>
                    </div>
                </div>
            </section>

            {/* ── 6. ADMINISTRATIVE EXCELLENCE & LIVE COMMAND CENTER ───────────────── */}
            <section id="admin-command" className="max-w-7xl mx-auto px-6 py-20">
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
                    
                    {/* Left Admin Copy */}
                    <div className="lg:col-span-5 space-y-6" data-aos="fade-right" data-aos-duration="650">
                        <span className="text-xs font-bold text-[#0a643a] uppercase tracking-wider bg-emerald-50 px-3 py-1 rounded-full border border-emerald-200">
                            Faculty Deanery & Administration
                        </span>
                        <h2 className="text-3xl font-extrabold text-[#0d2319]">
                            Administrative Precision at Campus Scale
                        </h2>
                        <p className="text-xs sm:text-sm text-gray-600 leading-relaxed">
                            Centralize institutional oversight with a dedicated command center. From departmental course audits to predictive student intervention, take control with real-time academic intelligence.
                        </p>

                        <div className="space-y-3.5 pt-1">
                            <div className="flex items-start gap-3">
                                <div className="p-2 rounded-xl bg-emerald-100 text-[#0a643a] text-xs font-bold">
                                    <span className="material-symbols-outlined text-[18px]">query_stats</span>
                                </div>
                                <div>
                                    <h4 className="text-xs font-bold text-gray-900">Live Campus-Wide Monitoring</h4>
                                    <p className="text-[11px] text-gray-500">View active lectures, student counts, and hall capacity in real time.</p>
                                </div>
                            </div>

                            <div className="flex items-start gap-3">
                                <div className="p-2 rounded-xl bg-emerald-100 text-[#0a643a] text-xs font-bold">
                                    <span className="material-symbols-outlined text-[18px]">vpn_key</span>
                                </div>
                                <div>
                                    <h4 className="text-xs font-bold text-gray-900">Single-Use Staff Invite Tokens</h4>
                                    <p className="text-[11px] text-gray-500">Secure onboarding of lecturers, faculty admins, and course representatives.</p>
                                </div>
                            </div>

                            <div className="flex items-start gap-3">
                                <div className="p-2 rounded-xl bg-emerald-100 text-[#0a643a] text-xs font-bold">
                                    <span className="material-symbols-outlined text-[18px]">print</span>
                                </div>
                                <div>
                                    <h4 className="text-xs font-bold text-gray-900">Automated Audit & Compliance Reports</h4>
                                    <p className="text-[11px] text-gray-500">One-click generation of NUC and faculty exam eligibility sheets.</p>
                                </div>
                            </div>
                        </div>

                        <div className="pt-2">
                            <button 
                                onClick={() => navigate('/admin/login')}
                                className="px-5 py-3 bg-[#0a643a] hover:bg-[#08522f] text-white rounded-xl text-xs font-bold transition-all shadow-sm cursor-pointer flex items-center gap-2"
                            >
                                <span>Access Deanery Command Center</span>
                                <span className="material-symbols-outlined text-[16px]">arrow_forward</span>
                            </button>
                        </div>
                    </div>

                    {/* Right High-Fidelity Interactive Admin Dashboard Mockup */}
                    <div className="lg:col-span-7" data-aos="fade-left" data-aos-delay="150">
                        <div className="bg-white rounded-3xl p-5 border border-gray-200/90 shadow-2xl relative space-y-4">
                            
                            {/* Command Center Top Bar */}
                            <div className="flex items-center justify-between border-b border-gray-100 pb-3">
                                <div className="flex items-center gap-2">
                                    <span className="text-xs font-extrabold text-slate-800">🏛️ Faculty Deanery Command Center</span>
                                    <span className="text-[10px] font-bold bg-amber-100 text-amber-900 px-2 py-0.5 rounded-full border border-amber-300">
                                        Super Admin
                                    </span>
                                </div>
                                <span className="text-[10px] text-gray-400 font-semibold">Live System Feed</span>
                            </div>

                            {/* 4 Mini Stat Boxes */}
                            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
                                <div className="bg-[#e8f0ec] p-2.5 rounded-xl border border-emerald-200/60">
                                    <div className="text-[10px] font-bold text-[#0a634a]">Total Enrolled</div>
                                    <div className="text-base font-black text-[#0a634a]">14,892</div>
                                </div>
                                <div className="bg-[#baeed9]/60 p-2.5 rounded-xl border border-emerald-300/60">
                                    <div className="text-[10px] font-bold text-[#0a634a]">Present Today</div>
                                    <div className="text-base font-black text-[#0a634a]">13,420</div>
                                </div>
                                <div className="bg-[#ffdad6]/60 p-2.5 rounded-xl border border-red-200">
                                    <div className="text-[10px] font-bold text-[#ba1a1a]">Absent</div>
                                    <div className="text-base font-black text-[#ba1a1a]">1,472</div>
                                </div>
                                <div className="bg-gray-100 p-2.5 rounded-xl border border-gray-200">
                                    <div className="text-[10px] font-bold text-gray-600">Flagged &lt; 75%</div>
                                    <div className="text-base font-black text-gray-800">12</div>
                                </div>
                            </div>

                            {/* Departmental Attendance Performance Bars */}
                            <div className="bg-slate-50 p-4 rounded-2xl border border-gray-200/80 space-y-3">
                                <div className="flex items-center justify-between text-xs font-bold text-slate-700">
                                    <span>Faculty Departmental Clearance Rates</span>
                                    <span className="text-[#0a643a]">92.8% Average</span>
                                </div>

                                <div className="space-y-2">
                                    <div>
                                        <div className="flex justify-between text-[11px] text-gray-600 mb-1 font-medium">
                                            <span>Computer Science (FCI)</span>
                                            <span className="font-bold text-slate-800">96.4%</span>
                                        </div>
                                        <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                                            <div className="h-full bg-[#0a643a] rounded-full w-[96%]"></div>
                                        </div>
                                    </div>

                                    <div>
                                        <div className="flex justify-between text-[11px] text-gray-600 mb-1 font-medium">
                                            <span>Electrical Engineering (FET)</span>
                                            <span className="font-bold text-slate-800">91.2%</span>
                                        </div>
                                        <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                                            <div className="h-full bg-emerald-500 rounded-full w-[91%]"></div>
                                        </div>
                                    </div>

                                    <div>
                                        <div className="flex justify-between text-[11px] text-gray-600 mb-1 font-medium">
                                            <span>Pure and Applied Physics (FPAS)</span>
                                            <span className="font-bold text-slate-800">85.0%</span>
                                        </div>
                                        <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                                            <div className="h-full bg-amber-500 rounded-full w-[85%]"></div>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Interactive Floating Alert Box */}
                            {!alertDismissed ? (
                                <div className="bg-red-50 border border-red-200 rounded-2xl p-3.5 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                                    <div className="space-y-0.5">
                                        <div className="flex items-center gap-1.5 text-red-700 font-bold text-xs">
                                            <span className="w-2 h-2 rounded-full bg-red-500 animate-ping"></span>
                                            Low Attendance Alert: MAT 201
                                        </div>
                                        <p className="text-[11px] text-red-600">
                                            Attendance dropped below 75% for 8 students this week. Trigger automated advisor notification?
                                        </p>
                                    </div>

                                    <div className="flex items-center gap-2 shrink-0">
                                        <button 
                                            onClick={() => {
                                                setAnalyzingAlert(true);
                                                setTimeout(() => {
                                                    setAnalyzingAlert(false);
                                                    setAlertDismissed(true);
                                                }, 1000);
                                            }}
                                            className="px-3 py-1.5 bg-[#0a643a] text-white text-[11px] font-bold rounded-lg hover:bg-[#084d2c] transition-colors cursor-pointer shadow-xs"
                                        >
                                            {analyzingAlert ? "Dispatched ✓" : "Outreach"}
                                        </button>
                                        <button 
                                            onClick={() => setAlertDismissed(true)}
                                            className="px-3 py-1.5 bg-white border border-gray-300 text-gray-600 text-[11px] font-bold rounded-lg hover:bg-gray-50 transition-colors cursor-pointer"
                                        >
                                            Dismiss
                                        </button>
                                    </div>
                                </div>
                            ) : (
                                <div className="bg-emerald-50 border border-emerald-200 rounded-xl p-3 text-center text-xs font-bold text-[#0a643a]">
                                    ✓ Alert handled. Notification sent to departmental advisors.
                                </div>
                            )}

                        </div>
                    </div>

                </div>
            </section>

            {/* ── 7. FREQUENTLY ASKED QUESTIONS (FAQ) ──────────────────────────────── */}
            <section id="faq" className="max-w-4xl mx-auto px-6 py-16 border-t border-gray-200/70">
                <div className="text-center space-y-2 mb-10" data-aos="fade-up">
                    <span className="text-xs font-bold text-[#0a643a] uppercase tracking-wider bg-emerald-50 px-3 py-1 rounded-full border border-emerald-200">
                        Got Questions?
                    </span>
                    <h2 className="text-3xl font-extrabold text-[#0d2319]">
                        Frequently Asked Questions
                    </h2>
                    <p className="text-xs sm:text-sm text-gray-600">
                        Everything you need to know about attendance security, institutional setup, and exam clearance.
                    </p>
                </div>

                <div className="space-y-3" data-aos="fade-up" data-aos-delay="100">
                    {faqItems.map((item, index) => {
                        const isOpen = openFaq === index;
                        return (
                            <div 
                                key={index}
                                className={`bg-white rounded-2xl border transition-all overflow-hidden ${
                                    isOpen ? 'border-[#0a643a] shadow-sm' : 'border-gray-200 hover:border-gray-300'
                                }`}
                            >
                                <button
                                    onClick={() => setOpenFaq(isOpen ? null : index)}
                                    className="w-full p-4 sm:p-5 flex items-center justify-between text-left gap-4 cursor-pointer"
                                >
                                    <span className="text-xs sm:text-sm font-bold text-slate-800">
                                        {item.q}
                                    </span>
                                    <span className={`material-symbols-outlined text-gray-400 transition-transform ${isOpen ? 'rotate-180 text-[#0a643a]' : ''}`}>
                                        expand_more
                                    </span>
                                </button>

                                {isOpen && (
                                    <div className="px-5 pb-5 pt-1 text-xs text-gray-600 leading-relaxed border-t border-gray-100">
                                        {item.a}
                                    </div>
                                )}
                            </div>
                        );
                    })}
                </div>
            </section>

            {/* ── 8. FINAL CALL TO ACTION ────────────────────────────────────────── */}
            <section className="bg-emerald-50/60 py-16 border-t border-gray-200/70 text-center" data-aos="fade-up">
                <div className="max-w-3xl mx-auto px-6 space-y-6">
                    <div className="w-12 h-12 rounded-2xl bg-[#0a643a] text-white flex items-center justify-center mx-auto shadow-md">
                        <span className="material-symbols-outlined text-2xl">verified_user</span>
                    </div>

                    <h2 className="text-3xl sm:text-4xl font-extrabold text-[#0d2319] tracking-tight">
                        Ready to Modernize Your Academic Institution?
                    </h2>
                    <p className="text-xs sm:text-sm text-gray-600 max-w-xl mx-auto leading-relaxed">
                        Join forward-thinking universities and faculties transforming campus accountability with our precision attendance infrastructure.
                    </p>
                    <div className="flex flex-wrap justify-center items-center gap-3 pt-2">
                        <button 
                            onClick={() => navigate('/signup')} 
                            className="px-6 py-3.5 bg-[#0a643a] hover:bg-[#08522f] text-white text-xs font-bold rounded-xl transition-all shadow-md hover:shadow-lg cursor-pointer"
                        >
                            Get Started Free
                        </button>
                        <button 
                            onClick={() => setIsDemoModalOpen(true)}
                            className="px-6 py-3.5 bg-white border border-gray-300 hover:bg-gray-50 text-gray-700 text-xs font-bold rounded-xl transition-all shadow-xs cursor-pointer"
                        >
                            Speak to an Institutional Expert
                        </button>
                    </div>
                </div>
            </section>

            {/* ── 9. FOOTER ──────────────────────────────────────────────────────── */}
            <footer className="bg-white border-t border-gray-200 py-12 px-6 text-xs text-gray-500">
                <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-12 gap-8">
                    
                    <div className="md:col-span-5 space-y-3">
                        <div className="flex items-center gap-2.5">
                            <div className="w-7 h-7 rounded-lg bg-[#0a643a] text-white font-bold flex items-center justify-center text-xs">
                                <span className="material-symbols-outlined text-base">school</span>
                            </div>
                            <span className="font-extrabold text-gray-900 text-sm">Smart Attendance System</span>
                        </div>
                        <p className="text-gray-500 max-w-sm text-[11px] leading-relaxed">
                            Created by <strong>MercyTech</strong>. Elevating institutional standards through precise digital presence validation, rotating QR tokens, and live analytics.
                        </p>
                        <div className="text-[10px] text-gray-400 pt-2">
                            © {new Date().getFullYear()} Smart Attendance System. All rights reserved.
                        </div>
                    </div>

                    <div className="md:col-span-2 space-y-2">
                        <h5 className="font-bold text-gray-900 uppercase tracking-wider text-[10px]">Portals</h5>
                        <ul className="space-y-1.5">
                            <li><button onClick={() => navigate('/signin')} className="hover:underline text-left cursor-pointer">Student Sign In</button></li>
                            <li><button onClick={() => navigate('/admin/login')} className="hover:underline text-left cursor-pointer">Lecturer & Deanery</button></li>
                            <li><button onClick={() => navigate('/signup')} className="hover:underline text-left cursor-pointer">Account Registration</button></li>
                        </ul>
                    </div>

                    <div className="md:col-span-2 space-y-2">
                        <h5 className="font-bold text-gray-900 uppercase tracking-wider text-[10px]">Features</h5>
                        <ul className="space-y-1.5">
                            <li><a href="#how-it-works" className="hover:underline">Rotating QR Codes</a></li>
                            <li><a href="#features" className="hover:underline">GPS Geofencing</a></li>
                            <li><a href="#admin-command" className="hover:underline">75% Exam Eligibility</a></li>
                            <li><a href="#faq" className="hover:underline">Security Protocols</a></li>
                        </ul>
                    </div>

                    <div className="md:col-span-3 space-y-2">
                        <h5 className="font-bold text-gray-900 uppercase tracking-wider text-[10px]">Institutional Inquiries</h5>
                        <p className="text-[11px] text-gray-500">
                            Need a custom on-premises deployment or faculty briefing?
                        </p>
                        <button 
                            onClick={() => setIsDemoModalOpen(true)}
                            className="mt-1 text-xs font-bold text-[#0a643a] hover:underline cursor-pointer"
                        >
                            Schedule a Deanery Briefing &rarr;
                        </button>
                    </div>

                </div>
            </footer>

            {/* ── 10. INTERACTIVE DEMO / CONTACT MODAL ────────────────────────────── */}
            {isDemoModalOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-fade-in">
                    <div 
                        className="bg-white rounded-3xl max-w-lg w-full p-6 sm:p-8 shadow-2xl border border-gray-200 relative animate-scale-up"
                        data-aos="zoom-in"
                    >
                        {/* Close button */}
                        <button
                            onClick={resetDemoModal}
                            className="absolute top-5 right-5 p-1.5 rounded-xl bg-gray-100 hover:bg-gray-200 text-gray-500 transition-colors cursor-pointer"
                        >
                            <span className="material-symbols-outlined text-lg block">close</span>
                        </button>

                        {!demoSubmitted ? (
                            <div>
                                <div className="flex items-center gap-2 mb-2">
                                    <div className="w-8 h-8 rounded-xl bg-emerald-100 text-[#0a643a] flex items-center justify-center">
                                        <span className="material-symbols-outlined text-lg">calendar_month</span>
                                    </div>
                                    <h3 className="text-lg font-bold text-slate-800">Request Institutional Demo</h3>
                                </div>
                                <p className="text-xs text-gray-500 mb-6">
                                    Experience how our anti-proxy attendance ecosystem fits your university or faculty.
                                </p>

                                <form onSubmit={handleDemoSubmit} className="space-y-4">
                                    <div>
                                        <label className="block text-[11px] font-bold text-gray-700 uppercase tracking-wider mb-1">
                                            Full Name *
                                        </label>
                                        <input
                                            type="text"
                                            required
                                            placeholder="Prof. / Dr. / Mr. John Doe"
                                            value={demoForm.name}
                                            onChange={(e) => setDemoForm({ ...demoForm, name: e.target.value })}
                                            className="w-full bg-slate-50 border border-gray-300 rounded-xl px-3.5 py-2.5 text-xs outline-none focus:border-[#0a643a] focus:bg-white text-slate-800 transition-all"
                                        />
                                    </div>

                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                                        <div>
                                            <label className="block text-[11px] font-bold text-gray-700 uppercase tracking-wider mb-1">
                                                Official Email *
                                            </label>
                                            <input
                                                type="email"
                                                required
                                                placeholder="dean@university.edu"
                                                value={demoForm.email}
                                                onChange={(e) => setDemoForm({ ...demoForm, email: e.target.value })}
                                                className="w-full bg-slate-50 border border-gray-300 rounded-xl px-3.5 py-2.5 text-xs outline-none focus:border-[#0a643a] focus:bg-white text-slate-800 transition-all"
                                            />
                                        </div>

                                        <div>
                                            <label className="block text-[11px] font-bold text-gray-700 uppercase tracking-wider mb-1">
                                                Institution Name *
                                            </label>
                                            <input
                                                type="text"
                                                required
                                                placeholder="e.g. University of Lagos"
                                                value={demoForm.institution}
                                                onChange={(e) => setDemoForm({ ...demoForm, institution: e.target.value })}
                                                className="w-full bg-slate-50 border border-gray-300 rounded-xl px-3.5 py-2.5 text-xs outline-none focus:border-[#0a643a] focus:bg-white text-slate-800 transition-all"
                                            />
                                        </div>
                                    </div>

                                    <div>
                                        <label className="block text-[11px] font-bold text-gray-700 uppercase tracking-wider mb-1">
                                            Institutional Role
                                        </label>
                                        <select
                                            value={demoForm.role}
                                            onChange={(e) => setDemoForm({ ...demoForm, role: e.target.value })}
                                            className="w-full bg-slate-50 border border-gray-300 rounded-xl px-3.5 py-2.5 text-xs outline-none focus:border-[#0a643a] focus:bg-white text-slate-800 transition-all font-medium"
                                        >
                                            <option value="University Administrator">University Administrator / Registrar</option>
                                            <option value="Faculty Dean">Faculty Dean / HOD</option>
                                            <option value="Lecturer / Professor">Lecturer / Professor</option>
                                            <option value="ICT Director">ICT Director / Systems Admin</option>
                                            <option value="Student Representative">Student Representative</option>
                                        </select>
                                    </div>

                                    <div>
                                        <label className="block text-[11px] font-bold text-gray-700 uppercase tracking-wider mb-1">
                                            Specific Requirements (Optional)
                                        </label>
                                        <textarea
                                            rows={2}
                                            placeholder="Tell us about your campus size or specific questions..."
                                            value={demoForm.message}
                                            onChange={(e) => setDemoForm({ ...demoForm, message: e.target.value })}
                                            className="w-full bg-slate-50 border border-gray-300 rounded-xl px-3.5 py-2 text-xs outline-none focus:border-[#0a643a] focus:bg-white text-slate-800 transition-all resize-none"
                                        ></textarea>
                                    </div>

                                    <button
                                        type="submit"
                                        className="w-full py-3 bg-[#0a643a] hover:bg-[#08522f] text-white font-bold text-xs rounded-xl transition-all shadow-md cursor-pointer flex items-center justify-center gap-2"
                                    >
                                        <span>Submit Demo Request</span>
                                        <span className="material-symbols-outlined text-[16px]">send</span>
                                    </button>
                                </form>
                            </div>
                        ) : (
                            <div className="text-center py-6 space-y-4">
                                <div className="w-16 h-16 rounded-full bg-emerald-100 text-[#0a643a] flex items-center justify-center mx-auto text-2xl font-bold">
                                    ✓
                                </div>
                                <h3 className="text-xl font-extrabold text-[#0d2319]">Demo Request Received!</h3>
                                <p className="text-xs text-gray-600 max-w-sm mx-auto leading-relaxed">
                                    Thank you, <strong>{demoForm.name}</strong>. Our institutional implementation specialist will reach out to <strong>{demoForm.email}</strong> within 24 hours.
                                </p>
                                <button
                                    onClick={resetDemoModal}
                                    className="px-6 py-2.5 bg-[#0a643a] text-white text-xs font-bold rounded-xl transition-all shadow-sm cursor-pointer"
                                >
                                    Done
                                </button>
                            </div>
                        )}
                    </div>
                </div>
            )}

        </div>
    );
};

export default LandingPage;