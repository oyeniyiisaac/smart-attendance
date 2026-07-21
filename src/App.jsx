import { Route, Routes } from 'react-router-dom'
import SideBar from './StudentSection/Components/SideBar'
import AttendanceHistroy from './StudentSection/Pages/AttendanceHistroy'
import EligibilitySummary from './StudentSection/Pages/EligibilitySummary'
import NotFound from './StudentSection/Pages/NotFound'
import SignIn from './StudentSection/Pages/SignIn'
import SignUp from './StudentSection/Pages/SignUp'
import StudentDashboard from './StudentSection/Pages/StudentDashboard'
import NavBar from './AdminSections/Components/NavBar'
import AdminProfile from './AdminSections/Components/AdminProfile'
import AdminSideBar from './AdminSections/Components/AdminSideBar'
import AdminDashboard from './AdminSections/Pages/AdminDashboard'
import CreateSession from './AdminSections/Pages/CreateSession'
import AdminLogin from './AdminSections/Pages/AdminLogin'
import CreateSessionForm from './AdminSections/Pages/CreateSessionForm'
import SessionMonitor from './AdminSections/Pages/SessionMonitor'
import NavbarBottom from './StudentSection/Components/NavbarBottom'
import NavbarTopDashboard from './StudentSection/Components/NavbarTopDashboard'
import SetViewAll from './AdminSections/Pages/SetViewAll'
import AdminReport from './AdminSections/Pages/AdminReport'
// import Adminsidebar from './AdminSections/Components/Adminsidebar'


const App = () => {
  // const currentPath = window.location.pathname

  // const pages = {
  //   '/signin': <SignIn />,
  //   '/signup': <SignUp />,
  //   '/student-dashboard': <StudentDashboard />,
  //   '/attendance-history': <AttendanceHistroy />

  // }

  return (
    <>
      <Routes>
        <Route path='/' element={<SignUp />} />
        <Route path='/signin' element={<SignIn />} />
        <Route path='/navbarbottom' element={<NavbarBottom />} />
        <Route path='/student' element={<>
          <NavbarTopDashboard className="lg:hidden z-50 "/>
          <SideBar />
          <NavbarBottom />
        </>}>
          <Route path='dashboard' element={<StudentDashboard />} />
          <Route path='history' element={<AttendanceHistroy />} />
        </Route>
        <Route path='/admin/login' element={<AdminLogin />} />
        <Route path='/admin' element={<NavBar />} >
          <Route path='lecturer-dashboard' element={<AdminDashboard />} />
          <Route path='session' element={<CreateSessionForm/>} />
          <Route path='monitor' element={<SessionMonitor/>} />
          <Route path='viewall' element={<SetViewAll/>} />
          <Route path='reports' element={<AdminReport/>} />
          <Route path="/admin/monitor/:id" element={<SessionMonitor />} />
        </Route>
        <Route path='/adminsidebar' element={<AdminSideBar />} />
        {/* <Route path='/adminsidebar' element={<Adminsidebar/>} /> */}
        <Route path='student-eligibility' element={<EligibilitySummary />} />


        <Route path='*' element={<NotFound />} />
        {/* <Route path='/:ID' element={<SideBar/>} /> */}
      </Routes>
      {/* {pages[currentPath] ?? <SignIn />} */}
    </>
  )
}

export default App
