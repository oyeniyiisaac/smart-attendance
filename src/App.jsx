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
import StudentManagement from './AdminSections/Pages/StudentManagement'
import CourseManagement from './AdminSections/Pages/CourseManagement'
import StudentCourseRegistration from './StudentSection/Pages/CourseRegister'
import RegistrationSuccess from './StudentSection/Pages/RegristrationSuccess'
import EnrolCourses from './StudentSection/Pages/EnrolCourse'
import LandingPage from '../LandingPage'
import StudentProfileSettings from './StudentSection/Pages/StudentProfileSettings'
import ForgotPassword from './StudentSection/Pages/ForgotPassword'
import AdminSettings from './AdminSections/Pages/AdminSettings'
import { AOSWrapper } from './Utils/aos'
import BotpressChat from './Components/BotpressChat'

const App = () => {
  return (
    <AOSWrapper>
      <Routes>
        <Route path='/' element={<LandingPage />} />
        <Route path='/signup' element={<SignUp />} />
        <Route path='/signin' element={<SignIn />} />
        <Route path='/forgot-password' element={<ForgotPassword />} />
        <Route path='/navbarbottom' element={<NavbarBottom />} />
        <Route path='/student' element={<>
          <NavbarTopDashboard className="lg:hidden z-50 "/>
          <SideBar />
          <NavbarBottom />
        </>}>
          <Route path='dashboard' element={<StudentDashboard />} />
          <Route path='history' element={<AttendanceHistroy />} />
          <Route path='profile-settings' element={<StudentProfileSettings />} />
          <Route path='eligibility' element={<EligibilitySummary />} />
          <Route path='enrol-courses' element={<EnrolCourses />} />
          <Route path='register-course' element={<StudentCourseRegistration />} />
        </Route>
        <Route path='/admin/login' element={<AdminLogin />} />
        <Route path='/admin' element={<NavBar />} >
          <Route path='lecturer-dashboard' element={<AdminDashboard />} />
          <Route path='session' element={<CreateSessionForm/>} />
          <Route path='monitor' element={<SessionMonitor/>} />
          <Route path='viewall' element={<SetViewAll/>} />
          <Route path='reports' element={<AdminReport/>} />
          <Route path='student-management' element={<StudentManagement/>} />
          <Route path='course-management' element={<CourseManagement />} />
          <Route path="monitor/:id" element={<SessionMonitor />} />
          <Route path='settings' element={<AdminSettings />} />
        </Route>
        <Route path='/adminsidebar' element={<AdminSideBar />} />
        {/* <Route path='/adminsidebar' element={<Adminsidebar/>} /> */}
        <Route path='/registration-success' element={<RegistrationSuccess />} />

        <Route path='*' element={<NotFound />} />
        {/* <Route path='/:ID' element={<SideBar/>} /> */}
      </Routes>
      
      {/* 🤖 Institutional Botpress Chatbot Widget on Every Page */}
      <BotpressChat />
    </AOSWrapper>
  )
}

export default App
