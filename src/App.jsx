import SignIn from './Pages/SignIn'
import SignUp from './Pages/SignUp'


const App = () => {
  const isSignInPage = window.location.pathname === '/signin'

  return (
    <>
      {isSignInPage ? <SignIn /> : <SignUp />}
    </>
  )
}

export default App
