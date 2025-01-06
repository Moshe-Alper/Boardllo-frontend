import { useSelector, useDispatch } from 'react-redux'
import { showErrorMsg, showSuccessMsg } from '../services/event-bus.service.js'
import { login, signup, toggleIsSignUp } from '../store/actions/user.actions.js'
import { LoginForm } from '../cmps/LoginForm.jsx'

export function LoginSignup() {
  const isSignup = useSelector((storeState) => storeState.userModule.isSignup)
  const dispatch = useDispatch()

  function onLogin(credentials) {
    isSignup ? _login(credentials) : _signup(credentials)
  }

  async function _login(credentials) {
    try {
      await login(credentials)
      showSuccessMsg('Logged in successfully')
    } catch (err) {
      console.log(`problem with login`, err)
      showErrorMsg('Oops try again')
    }
  }

  async function _signup(credentials) {
    try {
      await signup(credentials)
      showSuccessMsg('Signed in successfully')
    } catch (err) {
      console.log(`problem with signup`, err)
      showErrorMsg('Oops try again')
    }
  }

  function toggleSignup() {
    dispatch(toggleIsSignUp(!isSignup))
  }

  return (
    <section className='login-user-cmp'>
      <main className='login-user-container'>
        <div className='login-page'>
          <LoginForm toggleSignup={toggleSignup} onLogin={onLogin} isSignup={isSignup} />
          <div className='btns'></div>
        </div>
      </main>
    </section>
  )
}
