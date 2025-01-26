/* eslint-disable react/prop-types */
import { useState } from 'react'
import { userService } from '../services/user'
import { useNavigate } from 'react-router'
import { signup } from '../store/actions/user.actions.js'
import { showErrorMsg, showSuccessMsg } from '../services/event-bus.service.js'

export function SignupForm() {
  const [credentials, setCredentials] = useState(userService.getEmptyUser())

  const navigate = useNavigate()

  async function _signup(credentials) {
    try {
      await signup(credentials)
      navigate('/board')
      showSuccessMsg('Signed in successfully')
    } catch (err) {
      console.log(`problem with signup`, err)
      showErrorMsg('Oops try again')
    }
  }

  function handleChange({ target }) {
    const { name: field, value } = target
    setCredentials((prevCreds) => ({
      ...prevCreds,
      [field]: value,
      imgUrl: (field === 'fullname' || field === 'username') 
        ? userService.getDefaultAvatar(value) 
        : prevCreds.imgUrl
    }))
  }

  function handleSubmit(ev) {
    ev.preventDefault()
    _signup(credentials)
    navigate('/')
  }

  return (
    <section className='login-form-container'>
      <form className='login-form' onSubmit={handleSubmit}>
        <div className='form-group'>
          <div className='logo'>Boardllo</div>
          <p>Sign up</p>
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
        <button type='submit'>Sign up</button>
        <a href='login'>
          <p>Already account?</p>
        </a>
        <hr className='horizon'></hr>
        <div className='logo'>Boardllo</div>
      </form>
    </section>
  )
}
