import React from 'react'
import { Link } from 'react-router-dom'

const NavBarTop = () => {
    return (
        <nav className='bg-[#f2f8fb] fixed top-0 right-0 left-0 z-10 text-[#0a643a] p-4 w-[100%] shadow-sm'>
            <div className='flex items-center justify-between px-2'>
                <Link to="/student/dashboard" ><div className='flex items-center gap-4 font-bold text-[20px]'>
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
    )
}

export default NavBarTop
