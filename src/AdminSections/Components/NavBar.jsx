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
            {/* 2. Top Navigation Bar with exact h-14 height */}
            <nav className={`bg-[#f2f8fb] h-14 flex justify-between items-center px-4 shadow-xs fixed top-0 right-0 left-0 z-10 border-b border-[#e4ebed] transition-all duration-300 ${sidebarOpen ? 'lg:ml-[300px]' : 'lg:ml-[80px]'}`}>
                <div className='flex items-center gap-4 font-bold text-[20px] text-[#0a643a]'>
                    <button onClick={toggleSidebar} className="material-symbols-outlined cursor-pointer" >
                        {sidebarOpen ? 'close' : 'menu'}
                    </button>
                    <h1 className="text-lg font-bold">University Admin</h1>
                </div>
                <AdminProfile/>
            </nav>

            {/* 3. FIXED LINE: We ALWAYS render <SideBar />, but we pass the state as a prop */}
            <SideBar isOpen={sidebarOpen} />

            {/* 4. Adjusted content area margin so it fits flush right below the h-14 navbar */}
            <div className={`pt-14 transition-all duration-300 ${sidebarOpen ? 'lg:ml-[300px]' : 'lg:ml-[80px]'}`}>
                <Outlet />
            </div>
        </>
    )
}

export default NavBar
