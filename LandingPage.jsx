import { useNavigate } from "react-router-dom";

const LandingPage = () => {
    const navigate = useNavigate();
    return (
        <div className="min-h-screen bg-[#f8faf9] text-[#1a2e26] font-sans">
            
            {/* ── 1. NAVBAR ───────────────────────────────────────────────────────── */}
            <header className="sticky top-0 z-50 bg-[#f8faf9]/90 backdrop-blur-md border-b border-gray-200/60 px-6 py-4">
                <div className="max-w-7xl mx-auto flex items-center justify-between">
                    
                    {/* Brand Logo */}
                    <div className="flex items-center gap-2.5">
                        <div className="w-8 h-8 rounded-lg bg-[#0a643a] flex items-center justify-center text-white font-bold text-lg shadow-sm">
                            <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24">
                                <path d="M12 3L1 9l11 6 9-4.91V17h2V9L12 3zm0 13.11L4.2 12 12 7.79 19.8 12 12 16.11z"/>
                            </svg>
                        </div>
                        <span className="font-extrabold text-lg text-[#0a643a] tracking-tight">
                            Smart Attendance System
                        </span>
                    </div>

                    {/* Nav Links */}
                    <nav className="hidden md:flex items-center gap-8 text-sm font-semibold text-gray-600">
                        <a href="#solutions" className="text-[#0a643a] border-b-2 border-[#0a643a] pb-0.5">Solutions</a>
                        <a href="#features" className="hover:text-[#0a643a] transition-colors">Features</a>
                        <a href="#institutions" className="hover:text-[#0a643a] transition-colors">Institutions</a>
                        <a href="#pricing" className="hover:text-[#0a643a] transition-colors">Pricing</a>
                        <a href="#contact" className="hover:text-[#0a643a] transition-colors">Contact</a>
                    </nav>

                    {/* Header Action CTAs */}
                    <div className="flex items-center gap-3">
                        <button className="hidden sm:inline-flex px-4 py-2 text-xs font-bold text-[#0a643a] border border-[#0a643a] rounded-lg hover:bg-emerald-50 transition-colors cursor-pointer">
                            Schedule Demo
                        </button>
                        <button onClick={() => navigate('/signup')} className="px-4 py-2 text-xs font-bold text-white bg-[#0a643a] rounded-lg hover:bg-[#08522f] transition-colors cursor-pointer shadow-sm">
                            Get Started
                        </button>
                    </div>
                </div>
            </header>

            {/* ── 2. HERO SECTION ─────────────────────────────────────────────────── */}
            <section className="max-w-7xl mx-auto px-6 pt-12 pb-16">
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
                    
                    {/* Left Copy */}
                    <div className="lg:col-span-5 space-y-6">
                        <span className="inline-block px-3 py-1 text-[11px] font-bold text-[#0a643a] bg-emerald-100/80 rounded-full uppercase tracking-wider">
                            Institutional Excellence
                        </span>

                        <h1 className="text-4xl sm:text-5xl font-black text-[#0d2319] leading-[1.15] tracking-tight">
                            Institutional Accountability, Modernized.
                        </h1>

                        <p className="text-sm sm:text-base text-gray-600 leading-relaxed font-normal">
                            The complete attendance and engagement ecosystem for universities and colleges. Secure, automated, and insights-driven for the modern academic landscape.
                        </p>

                        <div className="flex flex-wrap items-center gap-4 pt-2">
                            <button className="px-6 py-3.5 bg-[#0a643a] hover:bg-[#08522f] text-white rounded-xl text-xs font-bold flex items-center gap-2 transition-all shadow-md cursor-pointer">
                                Request a Demo
                                <span>&rarr;</span>
                            </button>
                            <button className="px-6 py-3.5 bg-white border border-gray-300 hover:bg-gray-50 text-gray-700 rounded-xl text-xs font-bold transition-all shadow-sm cursor-pointer">
                                View Case Studies
                            </button>
                        </div>
                    </div>

                    {/* Right Screen Display Frame */}
                    <div className="lg:col-span-7">
                        <div className="bg-white p-3 sm:p-4 rounded-3xl border border-gray-200/80 shadow-2xl relative">
                            {/* Computer Mockup Container */}
                            <div className="bg-[#f0f4f2] rounded-2xl p-4 border border-gray-200 aspect-[16/10] flex flex-col justify-between overflow-hidden shadow-inner">
                                
                                {/* Mock Dashboard Header Bar */}
                                <div className="flex items-center justify-between pb-3 border-b border-gray-200">
                                    <div className="flex items-center gap-2">
                                        <div className="w-2.5 h-2.5 rounded-full bg-red-400"></div>
                                        <div className="w-2.5 h-2.5 rounded-full bg-amber-400"></div>
                                        <div className="w-2.5 h-2.5 rounded-full bg-emerald-400"></div>
                                    </div>
                                    <div className="h-4 bg-gray-200 rounded-md w-32"></div>
                                </div>

                                {/* Mock Analytics Dashboard Content */}
                                <div className="grid grid-cols-12 gap-3 py-3 flex-grow">
                                    {/* Sidebar */}
                                    <div className="col-span-3 bg-white/60 rounded-lg p-2 space-y-2">
                                        <div className="h-3 bg-emerald-200 rounded w-3/4"></div>
                                        <div className="h-2 bg-gray-200 rounded w-full"></div>
                                        <div className="h-2 bg-gray-200 rounded w-5/6"></div>
                                        <div className="h-2 bg-gray-200 rounded w-2/3"></div>
                                    </div>

                                    {/* Main Panel */}
                                    <div className="col-span-9 space-y-3">
                                        <div className="grid grid-cols-3 gap-2">
                                            <div className="bg-white p-2 rounded-lg border border-gray-100">
                                                <div className="text-[9px] text-gray-400">Total Enrolled</div>
                                                <div className="text-xs font-bold text-[#0a643a]">14,892</div>
                                            </div>
                                            <div className="bg-white p-2 rounded-lg border border-gray-100">
                                                <div className="text-[9px] text-gray-400">Avg Attendance</div>
                                                <div className="text-xs font-bold text-gray-800">90.2%</div>
                                            </div>
                                            <div className="bg-white p-2 rounded-lg border border-gray-100">
                                                <div className="text-[9px] text-gray-400">Unresolved Alerts</div>
                                                <div className="text-xs font-bold text-red-500">12</div>
                                            </div>
                                        </div>

                                        {/* Mock Graph Bar */}
                                        <div className="bg-white p-2.5 rounded-lg border border-gray-100 h-24 flex items-end gap-1.5 justify-between">
                                            <div className="bg-emerald-300 w-full h-[40%] rounded-t-sm"></div>
                                            <div className="bg-emerald-400 w-full h-[65%] rounded-t-sm"></div>
                                            <div className="bg-emerald-500 w-full h-[50%] rounded-t-sm"></div>
                                            <div className="bg-[#0a643a] w-full h-[85%] rounded-t-sm"></div>
                                            <div className="bg-emerald-400 w-full h-[70%] rounded-t-sm"></div>
                                            <div className="bg-emerald-300 w-full h-[60%] rounded-t-sm"></div>
                                        </div>
                                    </div>
                                </div>

                            </div>
                        </div>
                    </div>

                </div>
            </section>

            

            {/* ── 4. STUDENT JOURNEY & FEATURES ──────────────────────────────────── */}
            <section id="features" className="max-w-7xl mx-auto px-6 py-20">
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
                    
                    {/* Left 4-Feature Cards */}
                    <div className="lg:col-span-6 grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div className="bg-white p-5 rounded-2xl border border-gray-200/80 shadow-sm space-y-2">
                            <div className="w-8 h-8 rounded-lg bg-emerald-100 text-[#0a643a] flex items-center justify-center font-bold text-sm">📱</div>
                            <h4 className="font-bold text-sm text-gray-900">Geo-Fenced Check-in</h4>
                            <p className="text-xs text-gray-500 leading-relaxed">
                                Validated student presence using secure location signals.
                            </p>
                        </div>

                        <div className="bg-white p-5 rounded-2xl border border-gray-200/80 shadow-sm space-y-2">
                            <div className="w-8 h-8 rounded-lg bg-emerald-100 text-[#0a643a] flex items-center justify-center font-bold text-sm">🛡️</div>
                            <h4 className="font-bold text-sm text-gray-900">Eligibility Score</h4>
                            <p className="text-xs text-gray-500 leading-relaxed">
                                Live tracking of attendance against exam clearance requirements.
                            </p>
                        </div>

                        <div className="bg-white p-5 rounded-2xl border border-gray-200/80 shadow-sm space-y-2">
                            <div className="w-8 h-8 rounded-lg bg-emerald-100 text-[#0a643a] flex items-center justify-center font-bold text-sm">⏱️</div>
                            <h4 className="font-bold text-sm text-gray-900">Real-time Timetable</h4>
                            <p className="text-xs text-gray-500 leading-relaxed">
                                Instant access to schedules and automated venue changes.
                            </p>
                        </div>

                        <div className="bg-white p-5 rounded-2xl border border-gray-200/80 shadow-sm space-y-2">
                            <div className="w-8 h-8 rounded-lg bg-emerald-100 text-[#0a643a] flex items-center justify-center font-bold text-sm">💻</div>
                            <h4 className="font-bold text-sm text-gray-900">Virtual Linkage</h4>
                            <p className="text-xs text-gray-500 leading-relaxed">
                                Seamless attendance capture for remote and hybrid sessions.
                            </p>
                        </div>
                    </div>

                    {/* Right Text Content */}
                    <div className="lg:col-span-6 space-y-5">
                        <h2 className="text-3xl font-extrabold text-[#0d2319]">
                            The Student Journey
                        </h2>
                        <p className="text-xs sm:text-sm text-gray-600 leading-relaxed">
                            Empower students with a friction-less mobile experience that turns compliance into a habit. Our intuitive app removes barriers while providing critical insights into academic health.
                        </p>

                        <ul className="space-y-2.5 text-xs font-semibold text-gray-700">
                            <li className="flex items-center gap-2">
                                <span className="text-[#0a643a] font-bold">✓</span>
                                One-tap mobile check-ins with biometric validation.
                            </li>
                            <li className="flex items-center gap-2">
                                <span className="text-[#0a643a] font-bold">✓</span>
                                Integrated notifications for upcoming classes and low attendance alerts.
                            </li>
                            <li className="flex items-center gap-2">
                                <span className="text-[#0a643a] font-bold">✓</span>
                                Digital record of engagement for internships and career support.
                            </li>
                        </ul>

                        <a href="#mobile" className="inline-block text-xs font-bold text-[#0a643a] hover:underline pt-2">
                            Explore the mobile experience &rarr;
                        </a>
                    </div>

                </div>
            </section>

            {/* ── 5. METRIC STAT BANNER ───────────────────────────────────────────── */}
            <section className="bg-[#0b5c36] text-white py-12">
                <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
                    <div className="space-y-1">
                        <div className="text-4xl font-black tracking-tight">98%</div>
                        <div className="text-xs font-bold tracking-wider uppercase text-emerald-200">Reduction in Paperwork</div>
                        <p className="text-[11px] text-emerald-100/70 max-w-xs mx-auto">
                            Streamlining thousands of administrative man-hours annually.
                        </p>
                    </div>

                    <div className="space-y-1 border-y md:border-y-0 md:border-x border-emerald-700/50 py-6 md:py-0">
                        <div className="text-4xl font-black tracking-tight">24/7</div>
                        <div className="text-xs font-bold tracking-wider uppercase text-emerald-200">Real-Time Eligibility Tracking</div>
                        <p className="text-[11px] text-emerald-100/70 max-w-xs mx-auto">
                            Instant data availability for lecturers and academic advisors.
                        </p>
                    </div>

                    <div className="space-y-1">
                        <div className="text-4xl font-black tracking-tight">100%</div>
                        <div className="text-xs font-bold tracking-wider uppercase text-emerald-200">Secure Institutional Data</div>
                        <p className="text-[11px] text-emerald-100/70 max-w-xs mx-auto">
                            GDPR-compliant, encrypted, and strictly managed access.
                        </p>
                    </div>
                </div>
            </section>

            {/* ── 6. ADMINISTRATIVE EXCELLENCE ────────────────────────────────────── */}
            <section className="max-w-7xl mx-auto px-6 py-20">
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
                    
                    {/* Left Admin Copy */}
                    <div className="lg:col-span-6 space-y-6">
                        <h2 className="text-3xl font-extrabold text-[#0d2319]">
                            Administrative Excellence
                        </h2>
                        <p className="text-xs sm:text-sm text-gray-600 leading-relaxed">
                            Centralize your institution's oversight with a command center designed for precision. From departmental reporting to predictive student support, we provide the tools to foster accountability at scale.
                        </p>

                        <div className="space-y-4 pt-2">
                            <div className="flex items-start gap-3">
                                <div className="p-2 rounded-lg bg-emerald-100 text-[#0a643a] text-xs font-bold">📊</div>
                                <div>
                                    <h4 className="text-xs font-bold text-gray-900">Live Engagement Monitoring</h4>
                                    <p className="text-[11px] text-gray-500">Track class attendance as it happens across your entire campus.</p>
                                </div>
                            </div>

                            <div className="flex items-start gap-3">
                                <div className="p-2 rounded-lg bg-emerald-100 text-[#0a643a] text-xs font-bold">📈</div>
                                <div>
                                    <h4 className="text-xs font-bold text-gray-900">Predictive Student Analytics</h4>
                                    <p className="text-[11px] text-gray-500">Identify at-risk students before they disengage using smart models.</p>
                                </div>
                            </div>

                            <div className="flex items-start gap-3">
                                <div className="p-2 rounded-lg bg-emerald-100 text-[#0a643a] text-xs font-bold">🖨️</div>
                                <div>
                                    <h4 className="text-xs font-bold text-gray-900">Automated Compliance Reporting</h4>
                                    <p className="text-[11px] text-gray-500">One-click generation of regulatory and visa compliance documents.</p>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Right Mock Image + Floating Alert Card */}
                    <div className="lg:col-span-6 relative">
                        <div className="bg-gray-200 rounded-3xl overflow-hidden shadow-lg border border-gray-300/60 aspect-[4/3] relative flex items-center justify-center">
                            {/* Stock Photo Container / Placeholder */}
                            <div className="w-full h-full bg-slate-700 flex items-center justify-center text-gray-300 font-bold text-sm">
                                [ Administrator Command Dashboard Image ]
                            </div>

                            {/* Overlay Floating Alert Card */}
                            <div className="absolute bottom-6 right-6 bg-white rounded-2xl p-4 shadow-2xl border border-gray-200 max-w-xs space-y-2">
                                <div className="flex items-center gap-2 text-red-600 font-bold text-xs">
                                    <span className="w-2 h-2 rounded-full bg-red-500 animate-pulse"></span>
                                    Low Attendance Alert
                                </div>
                                <p className="text-[11px] text-gray-600">
                                    Engagement in CS101 dropped by 15% this week. Initiate outreach?
                                </p>
                                <div className="flex items-center gap-2 pt-1">
                                    <button className="px-3 py-1 bg-[#0a643a] text-white text-[10px] font-bold rounded-lg cursor-pointer">
                                        Analyze
                                    </button>
                                    <button className="px-3 py-1 bg-gray-100 text-gray-600 text-[10px] font-bold rounded-lg cursor-pointer">
                                        Dismiss
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>

                </div>
            </section>

            {/* ── 7. FINAL CALL TO ACTION ────────────────────────────────────────── */}
            <section className="bg-emerald-50/50 py-16 border-t border-gray-200/60 text-center">
                <div className="max-w-3xl mx-auto px-6 space-y-6">
                    <h2 className="text-3xl font-extrabold text-[#0d2319]">
                        Ready to transform your institution?
                    </h2>
                    <p className="text-xs sm:text-sm text-gray-600">
                        Join the leading universities worldwide that have modernized their administrative operations with our precision attendance ecosystem.
                    </p>
                    <div className="flex flex-wrap justify-center items-center gap-3 pt-2">
                        <button onClick={() => navigate('/signup')} className="px-6 py-3 bg-[#0a643a] hover:bg-[#08522f] text-white text-xs font-bold rounded-xl transition-all shadow-md cursor-pointer">
                            Get Started Today
                        </button>
                        <button className="px-6 py-3 bg-white border border-gray-300 hover:bg-gray-50 text-gray-700 text-xs font-bold rounded-xl transition-all shadow-sm cursor-pointer">
                            Speak to an Expert
                        </button>
                    </div>
                </div>
            </section>

            {/* ── 8. FOOTER ──────────────────────────────────────────────────────── */}
            <footer className="bg-white border-t border-gray-200 py-12 px-6 text-xs text-gray-500">
                <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-12 gap-8">
                    
                    <div className="md:col-span-6 space-y-3">
                        <div className="flex items-center gap-2">
                            <div className="w-6 h-6 rounded bg-[#0a643a] text-white font-bold flex items-center justify-center text-xs">
                                S
                            </div>
                            <span className="font-bold text-gray-900 text-sm">Smart Attendance System</span>
                        </div>
                        <p className="text-gray-500 max-w-sm text-[11px]">
                            Elevating institutional standards through precise digital administration and student engagement analytics.
                        </p>
                    </div>

                    <div className="md:col-span-2 space-y-2">
                        <h5 className="font-bold text-gray-900 uppercase tracking-wider text-[10px]">Product</h5>
                        <ul className="space-y-1.5">
                            <li><a href="#solutions" className="hover:underline">Solutions</a></li>
                            <li><a href="#features" className="hover:underline">Features</a></li>
                            <li><a href="#pricing" className="hover:underline">Pricing</a></li>
                        </ul>
                    </div>

                    <div className="md:col-span-2 space-y-2">
                        <h5 className="font-bold text-gray-900 uppercase tracking-wider text-[10px]">Resources</h5>
                        <ul className="space-y-1.5">
                            <li><a href="#security" className="hover:underline">Security</a></li>
                            <li><a href="#accessibility" className="hover:underline">Accessibility</a></li>
                            <li><a href="#support" className="hover:underline">Support</a></li>
                        </ul>
                    </div>

                    <div className="md:col-span-2 space-y-2">
                        <h5 className="font-bold text-gray-900 uppercase tracking-wider text-[10px]">Legal</h5>
                        <ul className="space-y-1.5">
                            <li><a href="#privacy" className="hover:underline">Privacy Policy</a></li>
                            <li><a href="#terms" className="hover:underline">Terms of Service</a></li>
                        </ul>
                    </div>

                </div>
            </footer>

        </div>
    );
}

export default LandingPage;