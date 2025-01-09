import { Link, NavLink } from 'react-router-dom'
import { useNavigate } from 'react-router'
import { useSelector } from 'react-redux'
import { showErrorMsg, showSuccessMsg } from '../services/event-bus.service.js'
import { logout } from '../store/actions/user.actions.js'
import { svgService } from '../services/svg.service.js'

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

  if (user) {
    return (
      <header className='app-header logged-in'>
        <nav className='nav-container'>
          <div className='nav-left'>
            <NavLink className='logo-link' to='/'>
              <img className='logo-img' src={svgService.logoIcon} alt='Logo' />
              <span className='logo-text'>Boardllo</span>
            </NavLink>

            <NavLink className='create-btn' to='/board'>
              Create
            </NavLink>

            {user?.isAdmin && (
              <NavLink className='admin-link' to='/admin'>
                Admin
              </NavLink>
            )}
          </div>

          <div className='nav-right'>
            <div className='nav-center'>
              <div className='search-wrapper'>
                <img className='search-icon' src={svgService.searchIcon} alt='Search' />
                <input
                  type='search'
                  className='search-input'
                  placeholder='Search'
                  aria-label='Search'
                />
              </div>
            </div>
            <button className='logout-btn' onClick={onLogout}>
              Logout
            </button>

            <Link to={`user/${user._id}`} className='user-profile'>
              {user.imgUrl ? (
                <img className='user-avatar' src={user.imgUrl} />
              ) : (
                <div className='user-initial'>{user.fullname?.charAt(0).toUpperCase()}</div>
              )}
            </Link>
          </div>
        </nav>
      </header>
    )
  }

  return (
    <header className='app-header'>
      <nav className='nav-container'>
        <div className='nav-left'>
          <NavLink className='logo-link' to='/'>
            <img className='logo-img' src={svgService.logoIcon} alt='Logo' />
            <span className='logo-text'>Boardllo</span>
          </NavLink>
        </div>

        <div className='nav-right'>
          <NavLink to='login' className='login-link'>
            Log in
          </NavLink>
          <NavLink to='signup' className='signup-link'>
            Get Boardllo for free
          </NavLink>
        </div>
      </nav>
    </header>
  )
}
