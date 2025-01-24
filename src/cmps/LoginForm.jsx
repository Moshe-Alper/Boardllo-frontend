/* eslint-disable react/prop-types */
import { useState } from "react";
import { userService } from "../services/user/user.service.local.js";
import { useNavigate } from "react-router";
import { login } from "../store/actions/user.actions.js";
import { showErrorMsg, showSuccessMsg } from "../services/event-bus.service.js";

export function LoginForm() {
  const [credentials, setCredentials] = useState(
    userService.getEmptyCredentials()
  );
  const navigate = useNavigate();

  async function _login(credentials) {
    try {
      await login(credentials);
      navigate("/board");
      showSuccessMsg("Logged in successfully");
    } catch (err) {
      console.log(`problem with login`, err);
      showErrorMsg("Oops try again");
    }
  }

  function handleChange({ target }) {
    const { name: field, value } = target;
    setCredentials((prevCreds) => ({ ...prevCreds, [field]: value }));
  }

  function handleSubmit(ev) {
    ev.preventDefault();
    _login(credentials);
    navigate("/");
  }

  return (
    <section className='login-form-container'>
      <form className='login-form' onSubmit={handleSubmit}>
        <div className='form-group'>
          <div className='logo'>Boardllo</div>
          <p>Login to continue</p>
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
        <button type='submit'>Log in</button>
        <a href='signup'>
          <p>Create an account</p>
        </a>
        <hr className='horizon'></hr>
        <div className='logo'>Boardllo</div>
      </form>
    </section>
  );
}
