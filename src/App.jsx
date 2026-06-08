import SignIn from './Pages/SignIn'
import SignUp from './Pages/SignUp'
import StudentDashboard from './Pages/StudentDashboard'
import AttendanceHistroy from './Pages/AttendanceHistroy'


const App = () => {
  const currentPath = window.location.pathname

  const pages = {
    '/signin': <SignIn />,
    '/signup': <SignUp />,
    '/student-dashboard': <StudentDashboard />,
    '/attendance-history': <AttendanceHistroy />

  }

  return (
    <>
      {pages[currentPath] ?? <SignIn />}
    </>
  )
}

export default App
