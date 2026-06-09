import React from 'react'
import { Link } from 'react-router-dom'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEnvelope, faUser, faTriangleExclamation } from '@fortawesome/free-solid-svg-icons';
import { faGithub } from '@fortawesome/free-brands-svg-icons';
import EligibleCard from '../Components/EligibleCardGood';
import EligibleCardError from '../Components/EligibleCardError';

const EligibilitySummary = () => {
    const iconStyle = {
        fontVariationSettings: '"FILL" 1, "wght" 400, "GRAD" 0, "opsz" 24',
    }
    return (
        <>
            <div className=''>
                <nav className='bg-[#f2f8fb] text-[#0a643a] p-4 w-[100%] shadow-sm'>
                    <div className='flex items-center justify-between px-2'>
                        <Link to="/student-dashboard" ><div className='flex items-center gap-4 font-bold text-[20px]'>
                            <span className="material-symbols-outlined">
                                arrow_back
                            </span>Exam Eligibility
                        </div></Link>
                        <div>
                            <span className="material-symbols-outlined">
                                account_circle
                            </span>
                        </div>
                    </div>
                </nav>
                <div className='my-4 mx-6'>
                    <div className='bg-[#ffdad6] p-3 rounded-md border-1 border-[#f7cac7] '>
                        <span className='pl-8 text-[16px] flex items-center gap-4 text-[#ba1a1a] font-semibold'><span class="material-symbols-outlined" style={iconStyle}>
                            warning
                        </span> Attention: You are currently ineligible for exams in 1 course(s) due to low attendance.</span>
                    </div>
                    <div className='flex justify-between mt-6'>
                        <div>
                            <h1 className='text-[20px] font-bold leading-[0.8] '>Alex Rivers</h1>
                            <span className='text-[12px] text-[#535856] font-medium '>Computer Science • ID: 2024-8892</span>
                        </div>
                        <div className='bg-[#e8eff1] flex gap-2 p-3 border-1 border-[#e4ebed] font-semibold text-[#535856] rounded-xl items-center shadow-md '>
                            <span className="text-[#0a643a] material-symbols-outlined">
                                verified
                            </span>Overall Eligibility:<span className='text-[#ba1a1a]'>Review Required</span>
                        </div>
                    </div>
                    <div className='grid grid-cols-2 gap-10 mt-6'>
                        <EligibleCard icon="memory" courses="CSC402: Operating System" percent="85%" iconTwo="check_circle" />
                        <EligibleCardError />
                        <EligibleCard icon="functions" courses="MATH201:Applied Stats" percent="92%"/>
                        <EligibleCard icon="language_chinese_dayi" courses="ENG404: Communication Skills" percent="76%" iconTwo="check_circle"/>
                    </div>
                </div>
            </div>
        </>
    )
}

export default EligibilitySummary
