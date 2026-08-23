import React, { useEffect, useState, useRef } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

/**
 * Institutional Smart Attendance Chatbot (Botpress Integration & Intelligent Fallback)
 * - Injects Botpress Cloud Webchat script on mount
 * - If Botpress Bot ID / Config URL is provided in env (VITE_BOTPRESS_CONFIG_URL or VITE_BOTPRESS_BOT_ID),
 *   it boots the official Botpress Cloud Webchat widget.
 * - Otherwise, provides an instant institutional AI Attendance Assistant trained on all system features
 *   (QR Attendance, 75% Clearance, Course Registration, Timetables, Admin Invites).
 */

const QUICK_PROMPTS = [
    "How do I mark attendance?",
    "What is the 75% exam eligibility rule?",
    "How do I register my courses?",
    "Why is the QR code rotating?",
    "Who created this project?",
    "How does GPS verification work?",
    "How to generate staff invite tokens?"
];

const BOT_KNOWLEDGE_BASE = [
    {
        keywords: ["who is mercytech", "about mercytech", "mercytech", "who is oyeniyi", "who is isaac", "oyeniyi isaac", "creator profile", "developer profile", "founder"],
        answer: "**MercyTech (Oyeniyi Isaac)** is a passionate full-stack software engineer and the creator of this **Institutional Smart Attendance System**! 👨‍💻🚀\n\nHe specializes in designing modern, secure web architectures, real-time cryptography, anti-proxy academic solutions, and scalable cloud applications."
    },
    {
        keywords: ["owner", "creator", "developer", "who made", "who built", "who created", "who developed", "author", "maintainer", "who designed", "who is the owner", "know the owner"],
        answer: "Of course! 🚀\nThis Institutional Smart Attendance System was created and developed by **Oyeniyi Isaac (MercyTech)**.\n\nIt was engineered to modernize institutional academic accountability through automated QR check-ins, geo-fencing, and live analytics."
    },
    {
        keywords: ["what is this", "about this project", "smart attendance", "overview", "what does this app do", "purpose"],
        answer: "The **Smart Attendance System** is an enterprise academic platform that eliminates manual paper attendance sheets with:\n• Real-time rotating QR codes & dynamic passcodes\n• Geo-fenced GPS (200m radius) & Wi-Fi hardware locks\n• Automated 75% semester exam eligibility clearance\n• Faculty command centers & audit reports"
    },
    {
        keywords: ["tech stack", "technology", "technologies", "built with", "framework", "database", "backend"],
        answer: "Technical Architecture 🛠️:\n• Frontend: React 19, Vite, Tailwind CSS 4, Flowbite\n• Backend: Node.js, Express 5, MongoDB / Mongoose\n• Security: JWT token authentication, rotating QR salting, bcrypt encryption"
    },
    {
        keywords: ["mark attendance", "scan qr", "check in", "attendance", "qr code", "passcode", "how to scan"],
        answer: "To mark attendance:\n1. Go to your Student Dashboard.\n2. When your lecturer starts a live class session, click 'Scan Live QR'.\n3. Point your camera at the rotating green QR code on the projector screen.\n4. If your camera has issues, you can also enter the 6-digit dynamic passcode displayed on screen!"
    },
    {
        keywords: ["eligibility", "75%", "exam", "clearance", "at risk", "minimum attendance"],
        answer: "University Exam Clearance Policy:\n• Students are required to maintain at least 75% attendance in each registered course to be eligible for semester examinations.\n• You can check your live eligibility score and breakdown on the 'Eligibility Summary' page from your dashboard menu."
    },
    {
        keywords: ["register course", "course registration", "enrol", "cart", "courses"],
        answer: "Course Registration Steps:\n1. Open 'Course Registration' from your sidebar or click 'Register Courses Now' on your dashboard.\n2. Filter by department or search for your course codes.\n3. Click 'Register Course' to add to your cart.\n4. Click 'View Cart' to review and hit 'Finalize Registration' to submit!"
    },
    {
        keywords: ["gps", "location", "geofence", "radius", "wifi", "beacon"],
        answer: "Multi-Factor Verification:\n• In addition to Live QR, lectures can be verified via Geo-fenced GPS (within 200m radius of classroom coordinates) or Campus Wi-Fi Hardware Lock (BSSID verification)."
    },
    {
        keywords: ["invite token", "admin", "course rep", "super admin", "staff", "account"],
        answer: "Staff & Course Rep Account Creation:\n• Department Admins and Super Admins can generate single-use invite tokens directly from the Admin Dashboard.\n• New staff or course reps simply enter the verification token on the Sign Up page to unlock their administrative role."
    },
    {
        keywords: ["forgot password", "reset password", "password", "login issue"],
        answer: "Password Assistance:\n• Click 'Forgot Password?' on the login page, enter your registered institutional email, and you will receive a secure OTP reset link to create a new password."
    }
];

const BotpressChat = () => {
    const location = useLocation();
    const navigate = useNavigate();

    const [isExternalBotActive, setIsExternalBotActive] = useState(false);
    const [isOpen, setIsOpen] = useState(false);
    const [messages, setMessages] = useState([
        {
            id: 1,
            sender: 'bot',
            text: 'Hello! 👋 I am your Smart Attendance Assistant created by MercyTech. How can I assist you with class check-ins, eligibility, or courses today?',
            time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        }
    ]);
    const [input, setInput] = useState('');
    const [isTyping, setIsTyping] = useState(false);
    const messagesEndRef = useRef(null);

    // ── 1. Botpress Cloud Script Injection ──────────────────────────────────
    useEffect(() => {
        const botConfigUrl = import.meta.env.VITE_BOTPRESS_CONFIG_URL;
        const botId = import.meta.env.VITE_BOTPRESS_BOT_ID;

        if (botConfigUrl || botId) {
            // Load Botpress Inject Script
            const injectScript = document.createElement('script');
            injectScript.src = 'https://cdn.botpress.cloud/webchat/v2/inject.js';
            injectScript.async = true;
            injectScript.onload = () => {
                const configScript = document.createElement('script');
                configScript.src = botConfigUrl || `https://mediafiles.botpress.cloud/${botId}/webchat/v2/config.js`;
                configScript.async = true;
                configScript.onload = () => {
                    setIsExternalBotActive(true);
                };
                document.body.appendChild(configScript);
            };
            document.body.appendChild(injectScript);

            return () => {
                // Cleanup scripts on unmount if needed
                if (injectScript.parentNode) injectScript.parentNode.removeChild(injectScript);
            };
        }
    }, []);

    useEffect(() => {
        if (messagesEndRef.current) {
            messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
        }
    }, [messages, isTyping, isOpen]);

    const handleSendMessage = (textToSend) => {
        const userText = (textToSend || input).trim();
        if (!userText) return;

        const userMsg = {
            id: Date.now(),
            sender: 'user',
            text: userText,
            time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        };

        setMessages((prev) => [...prev, userMsg]);
        setInput('');
        setIsTyping(true);

        // Smart Knowledge Matching
        setTimeout(() => {
            const queryLower = userText.toLowerCase().trim();
            let matchedAnswer = null;

            // 1. Direct Knowledge Base Lookup
            for (const item of BOT_KNOWLEDGE_BASE) {
                if (item.keywords.some((kw) => queryLower.includes(kw))) {
                    matchedAnswer = item.answer;
                    break;
                }
            }

            // 2. Intelligent Natural Language Fallback
            if (!matchedAnswer) {
                const isGreetingOnly = /^(hi|hello|hey|good morning|good afternoon|good evening|yo)\b/i.test(queryLower) && queryLower.split(' ').length <= 3;
                
                if (isGreetingOnly) {
                    matchedAnswer = "Hello! 👋 I'm here to help you navigate class attendance, QR code scanning, eligibility tracking, and academic schedules. What would you like to know?";
                } else if (queryLower.includes('who are you') || queryLower.includes('what are you') || queryLower.includes('botpress')) {
                    matchedAnswer = "I am the Smart Attendance AI Assistant developed for **MercyTech's Smart Attendance Platform**, powered by Botpress conversational architecture.";
                } else {
                    matchedAnswer = "I'm your Smart Attendance Assistant! You can ask me about:\n• Who created/owns this project (MercyTech)\n• How to mark attendance with QR code or passcode\n• 75% exam clearance requirements\n• Course registration & student eligibility\n• Staff & Course Rep invite tokens";
                }
            }

            setMessages((prev) => [
                ...prev,
                {
                    id: Date.now() + 1,
                    sender: 'bot',
                    text: matchedAnswer,
                    time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
                }
            ]);
            setIsTyping(false);
        }, 500);
    };

    // If external Botpress webchat script initialized, Botpress renders its own UI
    if (isExternalBotActive) {
        return null;
    }

    return (
        <div className="fixed bottom-6 right-6 z-50 font-sans print:hidden">
            {/* Floating Trigger Button (Circular Icon Only, rounded-full) */}
            {!isOpen && (
                <button
                    onClick={() => setIsOpen(true)}
                    className="group w-14 h-14 flex items-center justify-center bg-[#0a643a] hover:bg-[#08522f] text-white rounded-full shadow-2xl transition-all duration-300 hover:scale-110 active:scale-95 cursor-pointer border-2 border-white/30"
                    title="Open Smart Attendance Assistant"
                    data-aos="zoom-in"
                >
                    <div className="relative flex items-center justify-center">
                        <span className="material-symbols-outlined text-[28px]">
                            smart_toy
                        </span>
                        <span className="absolute -top-1 -right-1 w-3 h-3 bg-emerald-300 border-2 border-[#0a643a] rounded-full animate-ping"></span>
                        <span className="absolute -top-1 -right-1 w-3 h-3 bg-emerald-400 border-2 border-[#0a643a] rounded-full"></span>
                    </div>
                </button>
            )}

            {/* Interactive Chat Window */}
            {isOpen && (
                <div 
                    className="w-[94vw] sm:w-[400px] h-[560px] max-h-[85vh] bg-white rounded-3xl shadow-2xl border border-gray-200/90 flex flex-col overflow-hidden animate-scale-up"
                    style={{
                        transformOrigin: 'bottom right',
                        boxShadow: '0 20px 40px -15px rgba(10, 100, 58, 0.3)'
                    }}
                >
                    {/* Header */}
                    <div className="bg-[#0a643a] text-white p-4 flex items-center justify-between shadow-md">
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-2xl bg-white/15 flex items-center justify-center border border-white/20 backdrop-blur-xs">
                                <span className="material-symbols-outlined text-2xl text-emerald-200">
                                    smart_toy
                                </span>
                            </div>
                            <div>
                                <div className="flex items-center gap-1.5">
                                    <h3 className="font-bold text-sm leading-tight">Smart Attendance Bot</h3>
                                    <span className="w-2 h-2 rounded-full bg-emerald-400"></span>
                                </div>
                                <p className="text-[11px] text-emerald-100/90 font-medium">Powered by Botpress AI</p>
                            </div>
                        </div>

                        <div className="flex items-center gap-1">
                            <button
                                onClick={() => setIsOpen(false)}
                                className="p-1.5 rounded-xl hover:bg-white/20 text-white/90 hover:text-white transition-colors cursor-pointer"
                                title="Close chat"
                            >
                                <span className="material-symbols-outlined text-xl flex items-center">
                                    close
                                </span>
                            </button>
                        </div>
                    </div>

                    {/* Messages Container */}
                    <div className="flex-1 p-4 overflow-y-auto space-y-3 bg-[#f8faf9]">
                        {messages.map((msg) => (
                            <div
                                key={msg.id}
                                className={`flex flex-col ${
                                    msg.sender === 'user' ? 'items-end' : 'items-start'
                                }`}
                            >
                                <div
                                    className={`max-w-[85%] rounded-2xl px-4 py-3 text-xs leading-relaxed whitespace-pre-line shadow-xs ${
                                        msg.sender === 'user'
                                            ? 'bg-[#0a643a] text-white rounded-br-none'
                                            : 'bg-white border border-gray-200 text-slate-800 rounded-bl-none'
                                    }`}
                                >
                                    {msg.text}
                                </div>
                                <span className="text-[10px] text-gray-400 mt-1 px-1 font-medium">
                                    {msg.time}
                                </span>
                            </div>
                        ))}

                        {isTyping && (
                            <div className="flex items-center gap-1.5 bg-white border border-gray-200 rounded-2xl px-3.5 py-2.5 w-fit shadow-xs">
                                <span className="w-1.5 h-1.5 bg-[#0a643a] rounded-full animate-bounce"></span>
                                <span className="w-1.5 h-1.5 bg-[#0a643a] rounded-full animate-bounce [animation-delay:0.2s]"></span>
                                <span className="w-1.5 h-1.5 bg-[#0a643a] rounded-full animate-bounce [animation-delay:0.4s]"></span>
                            </div>
                        )}

                        <div ref={messagesEndRef} />
                    </div>

                    {/* Quick Suggestion Pills */}
                    <div className="p-2.5 bg-white border-t border-gray-100 flex gap-1.5 overflow-x-auto no-scrollbar">
                        {QUICK_PROMPTS.map((prompt, idx) => (
                            <button
                                key={idx}
                                onClick={() => handleSendMessage(prompt)}
                                className="whitespace-nowrap px-3 py-1.5 bg-emerald-50 hover:bg-emerald-100 text-[#0a643a] text-[11px] font-semibold rounded-full border border-emerald-200 transition-colors cursor-pointer shrink-0"
                            >
                                {prompt}
                            </button>
                        ))}
                    </div>

                    {/* Input Bar */}
                    <form
                        onSubmit={(e) => {
                            e.preventDefault();
                            handleSendMessage();
                        }}
                        className="p-3 bg-white border-t border-gray-200 flex items-center gap-2"
                    >
                        <input
                            type="text"
                            placeholder="Ask a question..."
                            value={input}
                            onChange={(e) => setInput(e.target.value)}
                            className="flex-1 bg-slate-100 border border-gray-200 rounded-xl px-3.5 py-2 text-xs outline-none focus:border-[#0a643a] focus:bg-white text-slate-800 transition-all font-medium"
                        />
                        <button
                            type="submit"
                            disabled={!input.trim()}
                            className="w-9 h-9 rounded-xl bg-[#0a643a] hover:bg-[#08522f] disabled:opacity-40 disabled:hover:bg-[#0a643a] text-white flex items-center justify-center transition-colors cursor-pointer shrink-0 shadow-sm"
                        >
                            <span className="material-symbols-outlined text-lg">
                                send
                            </span>
                        </button>
                    </form>
                </div>
            )}
        </div>
    );
};

export default BotpressChat;
