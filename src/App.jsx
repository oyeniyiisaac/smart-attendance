import SignIn from './Pages/SignIn'
import SignUp from './Pages/SignUp'
import StudentDashboard from './Pages/StudentDashboard'
import AttendanceHistroy from './Pages/AttendanceHistroy'
import { Route, Routes } from 'react-router-dom'
import SideBar from './Components/SideBar'
import NotFound from './Pages/NotFound'
import EligibilitySummary from './Pages/EligibilitySummary'


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
        <Route path='/signin' element={<SignIn />} />
        <Route path='/signup' element={<SignUp />} />

        <Route path='/' element={<SideBar />}>
          <Route path='student-dashboard' element={<StudentDashboard />} />
          <Route path='attendance-history' element={<AttendanceHistroy />} />
        </Route>
        <Route path='student-eligibility' element={ <EligibilitySummary/> } />

        <Route path='*' element={<NotFound />} />
        {/* <Route path='/:ID' element={<SideBar/>} /> */}
      </Routes>
      {/* {pages[currentPath] ?? <SignIn />} */}
    </>
  )
}

export default App
