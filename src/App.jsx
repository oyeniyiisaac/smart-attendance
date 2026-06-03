import SignIn from './Pages/SignIn'
import SignUp from './Pages/SignUp'
import StudentDashboard from './Pages/StudentDashboard'


const App = () => {
  const isSignInPage = window.location.pathname === '/signin'
  const isSignUpPage = window.location.pathname === '/signup'
  const isStudentDashboard = window.location.pathname === '/student-dashboard'

  return (
    <>
      {isSignInPage ? <SignIn /> : null}
      {isSignUpPage ? <SignUp /> : null}
      {isStudentDashboard?  <StudentDashboard />: null}
    </>
  )
}

export default App
