import { Link, NavLink } from 'react-router-dom'
import { useNavigate } from 'react-router'
import { useSelector } from 'react-redux'
import { svgService } from '../services/svg.service.js'
import UserMenuDropdown from '../cmps/UserMenuDropdown.jsx'
import { Layout } from 'lucide-react'
import { useRef, useState } from 'react'
import { BoardCreateModal } from './Board/BoardCreateModal.jsx'

export function AppHeader() {
  const user = useSelector((storeState) => storeState.userModule.user)
  const [filterBy, setFilterBy] = useState(boardService.getDefaultFilter())
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false)
  const [isSearch, setIsSearch] = useState(false) 
  const createButtonRef = useRef(null)
  const navigate = useNavigate()

  function handleNavigate(path) {
    navigate(path)
  }

  function handleChange({ target }) {
    const field = target.name
    let value = target.value

    switch (target.type) {
      case 'number':
      case 'range':
        value = +value || ''
        break
      case 'checkbox':
        value = target.checked
        break
      default:
        break
    }

    setFilterBy(prevFilter => ({ ...prevFilter, [field]: value }))
  }

   function handleSearchFocus() {
    setIsSearch(true)
  }

  console.log('🚀 filterBy, isSearch', filterBy.txt, isSearch)
  if (user) {
    return (
      <header className='app-header logged-in'>
        <nav className='nav-container'>
          <div className='nav-left'>
            <NavLink className='logo-link' to='/'>
              <Layout className='icon-user' />
              <span className='logo-text'>Boardllo</span>
            </NavLink>

            <button
              ref={createButtonRef}
              className='create-btn'
              onClick={() => setIsCreateModalOpen(!isCreateModalOpen)}
            >
              Create
            </button>

            {isCreateModalOpen && (
              <BoardCreateModal
                isOpen={isCreateModalOpen}
                onClose={() => setIsCreateModalOpen(false)}
                position={{
                  top: createButtonRef.current?.getBoundingClientRect().bottom + 4,
                  left: createButtonRef.current?.getBoundingClientRect().left
                }}
              />
            )}

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
                  name="txt"
                  value={filterBy.txt}
                  onChange={handleChange}
                  onFocus={handleSearchFocus}
                />
              </div>
            </div>
            <Link className='search-icon-mobile' to='search'>
              <img className='search-icon-mobile' src={svgService.searchIcon} alt='Search' />
            </Link>

            <img
              style={{ cursor: 'pointer' }}
              src={`${svgService.notificationIcon}`}
              alt='notification-icon'
            />
            <img style={{ cursor: 'pointer' }} src={`${svgService.infoIcon}`} alt='info-icon' />
            <UserMenuDropdown user={user} onNavigate={handleNavigate} />
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
            <Layout className='icon-header' />
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
