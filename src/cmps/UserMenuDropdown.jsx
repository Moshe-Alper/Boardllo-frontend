/* eslint-disable react/prop-types */
import { useState, useRef, useEffect } from 'react'
import { useNavigate } from 'react-router'
import { logout } from '../store/actions/user.actions'
import { showErrorMsg, showSuccessMsg } from '../services/event-bus.service'

const UserMenuDropdown = ({ user, onNavigate }) => {
  const [isOpen, setIsOpen] = useState(false)
  const dropdownRef = useRef(null)
  const navigate = useNavigate()

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  const handleNavigation = (path) => {
    onNavigate(path)
    setIsOpen(false)
  }

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
    <div className='user-menu-dropdown' ref={dropdownRef}>
      <div className='avatar-container' onClick={() => setIsOpen(!isOpen)}>
        {user.imgUrl ? (
          <img className='user-avatar' src={user.imgUrl} alt='User' />
        ) : (
          <div className='user-initial'>{user.fullname?.charAt(0).toUpperCase()}</div>
        )}
      </div>

      {isOpen && (
        <div className='dropdown-menu'>
          <div className='account-section'>
            <div className='section-title'>ACCOUNT</div>
            <div className='user-info'>
              {user.imgUrl ? (
                <img className='user-avatar-small' src={user.imgUrl} alt='User' />
              ) : (
                <div className='user-initial-small'>{user.fullname?.charAt(0).toUpperCase()}</div>
              )}
              <div className='user-details'>
                <div className='user-name'>{user.fullname}</div>
                <div className='user-email'>{user.email}</div>
              </div>
            </div>
          </div>

          <div className='menu-section'>
            <div className='section-title'>Boardllo</div>
            <button onClick={() => handleNavigation(`/user/${user._id}`)} className='menu-item'>
              Profile and visibility
            </button>
            <button onClick={() => handleNavigation('/activity')} className='menu-item'>
              Activity
            </button>
          </div>

          <div className='logout-section'>
            <button
              onClick={() => {
                onLogout()
                setIsOpen(false)
              }}
              className='menu-item'
            >
              Log out
            </button>
          </div>
        </div>
      )}
    </div>
  )
}
export default UserMenuDropdown
