import EligibleCardError from '../Components/EligibleCardError';
import EligibleCard from '../Components/EligibleCardGood';
import NavBarTop from '../Components/NavBarTop';
import Navbar from '../Components/Navbar';

const EligibilitySummary = () => {
    const iconStyle = {
        fontVariationSettings: '"FILL" 1, "wght" 400, "GRAD" 0, "opsz" 24',
    }
    return (
        <>
            <div className='mb-[10rem] mt-[5rem]'>
                <NavBarTop />
                <div className='my-4 mx-6'>
                    <div className='bg-[#ffdad6] p-3 rounded-md border-1 border-[#f7cac7] '>
                        <span className='pl-8 text-[16px] flex items-center gap-4 text-[#ba1a1a] font-semibold'><span class="material-symbols-outlined" style={iconStyle}>
                            warning
                        </span> Attention: You are currently ineligible for exams in 1 course(s) due to low attendance.</span>
                    </div>
                    <div className='flex justify-between mt-6'>
                        <div>
                            <h1 signinclassName='text-[20px] font-bold leading-[0.8] '>Alex Rivers</h1>
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
                        <EligibleCard icon="functions" courses="MATH201:Applied Stats" percent="92%" iconTwo="check_circle" />
                        <EligibleCard icon="language_chinese_dayi" courses="ENG404: Communication Skills" percent="76%" iconTwo="check_circle" />
                    </div>
                    <div className='flex bg-[#eef5f7] gap-4 border-1 border-[#bfc9bf] rounded-md py-4 px-[10rem] mt-6 items-center justify-between w-[100%]'>
                        <div className='w-[60%]'>
                            <h1 className='text-[20px] font-bold'>Need to appeal?</h1>
                            <p className="font-medium text-[#3f4941] ">Submit attendance correction requests before the cutoff date.</p>
                        </div>
                        <div className="w-[40%]">
                            <button type="button" className='bg-[#0a643a] text-white py-2 px-4 rounded-sm w-full mt-4 cursor-pointer'>Request Attendance Correction</button></div>
                    </div>
                </div>
                <Navbar />
            </div>
        </>
    )
}

export default EligibilitySummary
