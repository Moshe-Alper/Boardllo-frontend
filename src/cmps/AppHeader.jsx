import { Link, NavLink } from 'react-router-dom'
import { useNavigate } from 'react-router'
import { useSelector } from 'react-redux'
import { showErrorMsg, showSuccessMsg } from '../services/event-bus.service.js'
import { logout } from '../store/actions/user.actions.js'

export function AppHeader() {
  const user = useSelector((storeState) => storeState.userModule.user)
  const navigate = useNavigate()

  async function onLogout() {
    try {
      await logout()
      navigate('/')
      showSuccessMsg(`Bye now`)
    } catch (err) {
      showErrorMsg('Cannot logout')
    }
  }

  return (
    <header className='app-header main-container full'>
      <nav className=''>
        <NavLink className='logo' to='/'>
          Boardllo
        </NavLink>

        <NavLink className='create-link' to='/board'>
          Create
        </NavLink>
        {user?.isAdmin && <NavLink to='/admin'>Admin</NavLink>}

        {!user && (
          <NavLink to='login' className='login-link'>
            Signup
          </NavLink>
        )}

        {user && (
          <div className='user-info'>
            <Link to={`user/${user._id}`}>
              {user.imgUrl && <img src={user.imgUrl} />}
              {user.fullname}
            </Link>
            <button onClick={onLogout}>logout</button>
          </div>
        )}
      </nav>
    </header>
  )
}
