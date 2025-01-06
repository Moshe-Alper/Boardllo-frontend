/* eslint-disable react/prop-types */
import { useState } from 'react'
import { userService } from '../services/user/user.service.local.js'
import { useNavigate } from 'react-router'

export function LoginForm({ onLogin, isSignup, toggleSignup }) {
  const [credentials, setCredentials] = useState(userService.getEmptyCredentials())
  const navigate = useNavigate()

  function handleChange({ target }) {
    const { name: field, value } = target
    setCredentials((prevCreds) => ({ ...prevCreds, [field]: value }))
  }

  function handleSubmit(ev) {
    ev.preventDefault()
    onLogin(credentials)
    navigate('/')
  }

  return (
    <section className='login-form-container'>
      <form className='login-form' onSubmit={handleSubmit}>
        <div className='form-group'>
          <div className='logo'>Boardllo</div>
          <p>{isSignup ? `Login to continue` : 'Sign up'}</p>
          <label htmlFor='username'></label>
          <input
            id='username'
            type='text'
            name='username'
            value={credentials.username}
            placeholder='Enter your username'
            onChange={handleChange}
            required
          />
        </div>
        <div className='form-group'>
          <label htmlFor='password'></label>
          <input
            id='password'
            type='password'
            name='password'
            value={credentials.password}
            placeholder='Enter your password'
            onChange={handleChange}
            required
          />
        </div>
        {!isSignup && (
          <div className='form-group'>
            <label htmlFor='fullname'></label>
            <input
              id='fullname'
              type='text'
              name='fullname'
              value={credentials.fullname}
              placeholder='Enter your full name'
              onChange={handleChange}
              required
            />
          </div>
        )}
        <button type='submit'>{isSignup ? 'Log in' : 'Sign up'}</button>
        <a href='#' onClick={toggleSignup}>
          <p>{isSignup ? `Create an account ` : `Already account?`}</p>
        </a>
        <hr className='horizon'></hr>
        <div className='logo'>Boardllo</div>
      </form>
    </section>
  )
}
