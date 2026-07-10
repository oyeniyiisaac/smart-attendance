import React from "react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";

const AdminSideBar = ({ isOpen }) => {
  const [localActiveBtn, setLocalActiveBtn] = useState("dashboard");
  const currentPath = window.location.pathname;
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("adminToken");
    localStorage.removeItem("adminUser");
    navigate("/signin");
  };

  const routeActiveMap = {
    "/admin-dashboard": "dashboard",
    "/reports": "reports",
  };

  const activeBtn = routeActiveMap[currentPath] ?? localActiveBtn;

  const dashboardBtn = () => {
    setLocalActiveBtn("dashboard");
    navigate("/admin/lecturer-dashboard");
  };
  const sessionBtn = () => {
    setLocalActiveBtn("session");
    navigate("/admin/session");
  };
  const reportsBtn = () => {
    setLocalActiveBtn("reports");
    navigate("/admin/reports");
  };
  const studentmanagementBtn = () => {
    setLocalActiveBtn("classes");
    // navigate('/student-management')
  };
  const iconStyle = {
    fontVariationSettings: '"FILL" 1, "wght" 400, "GRAD" 0, "opsz" 24',
  };

  return (
    /* Added flex flex-col justify-between to force children items to opposite poles */
    <>
      <aside
        className={`bg-[#eef5f7] hidden lg:block fixed top-0 left-0 h-[100vh] p-4 border-r border-[#bfc9bf] flex flex-col justify-between transition-all duration-300 z-20 ${isOpen ? "w-[300px]" : "w-[80px]"}`}
      >
        {/* TOP GROUP: Logo Header + Navigation Menus */}
        <div className="flex flex-col w-full">
          <h2
            className={`text-xl font-bold text-[#0a643a] mb-6 whitespace-nowrap overflow-hidden transition-all duration-300 ${isOpen ? "opacity-100" : "opacity-0"}`}
          >
            {isOpen ? "Attendance Admin" : "AA"}
          </h2>

          <div className="flex flex-col gap-6 mt-6 text-lg text-[#3f4941] w-full">
            <button
              className={`flex items-center gap-2 p-2 rounded-xl cursor-pointer text-left whitespace-nowrap transition-all duration-300 ${isOpen ? "" : "justify-center"} ${activeBtn === "dashboard" ? "bg-[#baeed9]" : "bg-transparent"}`}
              onClick={dashboardBtn}
            >
              <span className="material-symbols-rounded" style={iconStyle}>
                dashboard
              </span>
              {isOpen && <span>Dashboard</span>}
            </button>

            <button
              className={`flex items-center gap-2 p-2 rounded-xl cursor-pointer text-left whitespace-nowrap transition-all duration-300 ${isOpen ? "" : "justify-center"} ${activeBtn === "session" ? "bg-[#baeed9]" : "bg-transparent"}`}
              onClick={sessionBtn}
            >
              <span className="material-symbols-outlined">calendar_add_on</span>
              {isOpen && <span>Create Session</span>}
            </button>

            <button
              type="button"
              className={`flex items-center gap-2 p-2 rounded-xl cursor-pointer text-left whitespace-nowrap transition-all duration-300 ${isOpen ? "" : "justify-center"} ${activeBtn === "eligibility" ? "bg-[#baeed9]" : "bg-transparent"}`}
              onClick={reportsBtn}
            >
              <span className="material-symbols-outlined">analytics</span>
              {isOpen && <span>Reports</span>}
            </button>

            <button
              type="button"
              className={`flex items-center gap-2 p-2 rounded-xl cursor-pointer text-left whitespace-nowrap transition-all duration-300 ${isOpen ? "" : "justify-center"} ${activeBtn === "classes" ? "bg-[#baeed9]" : "bg-transparent"}`}
              onClick={studentmanagementBtn}
            >
              <span className="material-symbols-outlined">group</span>
              {isOpen && <span>Students Management</span>}
            </button>
          </div>
        </div>

        {/* BOTTOM GROUP: Standalone Logout Action Button wrapper */}
        <div className="w-full pt-4 border-t border-gray-200/60">
          <button
            onClick={handleLogout}
            title="Logout"
            className={`flex items-center gap-2 text-sm text-[#ba1a1a] font-semibold px-3 py-2 rounded-lg hover:bg-[#fdecea] transition-all duration-300 w-full ${isOpen ? "" : "justify-center"}`}
          >
            <span className="material-symbols-outlined text-base">logout</span>
            {isOpen && <span>Logout</span>}
          </button>
        </div>
      </aside>
      <div className="">
        <div className="bg-[#eef5f7] fixed bottom-0 w-[100%] sm:w-[100%] md:w-[100%] z-50 lg:hidden px-6 py-3 border-r-1 border-[#bfc9bf]">
                    

                    <div className='flex justify-between gap-2 mt-1 text-xs text-[#3f4941]'>
                        <button className={`flex flex-col items-center gap-1 p-1 rounded-xl cursor-pointer text-center ${activeBtn === 'dashboard' ? 'bg-[#baeed9]' : 'bg-transparent'}`} onClick={dashboardBtn}><span className="material-symbols-rounded" style={iconStyle}>
                            dashboard
                        </span>Dashboard</button>
                        <button className={`flex flex-col items-center gap-1 p-1 rounded-xl cursor-pointer text-center ${activeBtn === 'session' ? 'bg-[#baeed9]' : 'bg-transparent'}`} onClick={sessionBtn}><span className="material-symbols-outlined">
                            calendar_add_on
                        </span>Create Session</button>
                        <button type="button" className={`flex flex-col items-center gap-1 p-1 rounded-xl cursor-pointer text-center ${activeBtn === 'eligibility' ? 'bg-[#baeed9]' : 'bg-transparent'}`} onClick={reportsBtn}><span className="material-symbols-outlined">analytics</span>Eligibility</button>
                        <button type="button" className={`flex flex-col items-center gap-1 p-1 rounded-xl cursor-pointer text-center ${activeBtn === 'classes' ? 'bg-[#baeed9]' : 'bg-transparent'}`} onClick={studentmanagementBtn}><span className="material-symbols-outlined">
                            group
                        </span>Students Management</button>
                    </div>
                </div>
      </div>
    </>

  );
};

export default AdminSideBar;
