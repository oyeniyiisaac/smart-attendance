import { useState } from 'react'
import { Outlet } from 'react-router-dom'
import AdminProfile from './AdminProfile'
import SideBar from './AdminSideBar'

const NavBar = () => {
    // 1. Default this to true so the sidebar starts open, or keep false if you prefer
    const [sidebarOpen, setSidebarOpen] = useState(true)

    const toggleSidebar = () => {
        setSidebarOpen((currentOpen) => !currentOpen)
    }

    return (
        <>
            {/* 2. Adjusted margin-left (ml) so the navbar shifts nicely based on sidebar state */}
            <nav className={`bg-[#f2f8fb] flex justify-between items-center p-1 px-4 shadow-sm fixed top-0 right-0 left-0 z-10 border-b-2 border-[#e4ebed] transition-all duration-300 ${sidebarOpen ? 'lg:ml-[300px]' : 'lg:ml-[80px]'}`}>
                <div className='flex items-center gap-4 font-bold text-[24px] text-[#0a643a]'>
                    <button onClick={toggleSidebar} className="material-symbols-outlined cursor-pointer" >
                        {sidebarOpen ? 'close' : 'menu'}
                    </button>
                    <h1>University Admin</h1>
                </div>
                <AdminProfile/>
            </nav>

            {/* 3. FIXED LINE: We ALWAYS render <SideBar />, but we pass the state as a prop */}
            <SideBar isOpen={sidebarOpen} />

            {/* 4. Adjusted content area margin so it doesn't get covered by the sidebar */}
            <div className={`pt-[4.5rem] transition-all duration-300 ${sidebarOpen ? 'lg:ml-[300px]' : 'lg:ml-[80px]'}`}>
                <Outlet />
            </div>
        </>
    )
}

export default NavBar
