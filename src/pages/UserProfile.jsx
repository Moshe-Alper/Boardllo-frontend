import { useEffect, useState } from 'react'
import { useSelector } from 'react-redux'
import { useParams } from 'react-router-dom'

import { loadUser, updateUserName } from '../store/actions/user.actions'
import { store } from '../store/store'
import { showSuccessMsg } from '../services/event-bus.service'
import {
  socketService,
  SOCKET_EVENT_USER_UPDATED,
  SOCKET_EMIT_USER_WATCH
} from '../services/socket.service'
import { ImgUploader } from '../cmps/ImgUploader'
import { Loader } from '../cmps/Loader'
// import { Loader } from '../assets/svgs/dog.svg'

export function UserProfile() {
  const params = useParams()
  const user = useSelector((storeState) => storeState.userModule.watchedUser)
  const loggedInUser = useSelector((storeState) => storeState.userModule.user)

  const [bio, setBio] = useState('')
  const [username, setUsername] = useState('')
  const [isEditing, setIsEditing] = useState(false)

  useEffect(() => {
    loadUser(params.id)

    socketService.emit(SOCKET_EMIT_USER_WATCH, params.id)
    socketService.on(SOCKET_EVENT_USER_UPDATED, onUserUpdate)

    return () => {
      socketService.off(SOCKET_EVENT_USER_UPDATED, onUserUpdate)
    }
  }, [params.id])

  function onUserUpdate(updatedUser) {
    showSuccessMsg(`This user ${updatedUser.fullname} just got updated from socket`)
    store.dispatch({ type: 'SET_WATCHED_USER', user: updatedUser })

    if (updatedUser._id === loggedInUser._id) {
      store.dispatch({ type: 'SET_USER', user: updatedUser })
    }
  }

  async function handleSubmit(ev) {
    ev.preventDefault()
    try {
      if (username !== user.fullname) {
        await updateUserName({ ...user, fullname: username })
      }
      setIsEditing(false)
    } catch (error) {
      console.error('Failed to update username:', error)
    }
  }

  if (!user) return <Loader />

  return (
    <div className='user-profile-container'>
      <nav className='profile-nav'>
        <div className='nav-items'>
          <a className='nav-item active'>Profile and visibility</a>
          <a className='nav-item'>Activity</a>
        </div>
      </nav>

      <main className='profile-content'>
        <section className='profile-header'>
          <div className='profile-image'>
            <ImgUploader />
            <div className='profile-details'>
              <h3 className='fullname-user-details'>{user.fullname}</h3>
              <p className='username-user-details'>#{user._id}</p>
            </div>
          </div>

          <img
            className='dog-svg'
            src='https://trello.com/assets/eff3d701a9c3a71105ea.svg'
            alt=''
          />
          <h1>Manage your personal information</h1>
        </section>

        <section className='profile-info'>
          <div className='info-header'>
            <h2>About</h2>
            {!isEditing && (
              <button className='edit-button' onClick={() => setIsEditing(true)}>
                Edit
              </button>
            )}
          </div>

          {/* Inputs */}
          {isEditing ? (
            <form onSubmit={handleSubmit} className='edit-form'>
              <div className='form-group'>
                <label>Username</label>
                <div className='input-wrapper'>
                  <input
                    type='text'
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    placeholder='Enter username'
                  />
                  <span className='public-badge'>Always public</span>
                </div>
              </div>

              <div className='form-group'>
                <label>Bio</label>
                <div className='input-wrapper'>
                  <textarea
                    value={bio}
                    onChange={(e) => setBio(e.target.value)}
                    placeholder='Write a bio...'
                  />
                  <span className='public-badge'>Always public</span>
                </div>
              </div>

              <div className='button-group'>
                <button type='submit' className='save-button'>
                  Save
                </button>
                <button type='button' className='cancel-button' onClick={() => setIsEditing(false)}>
                  Cancel
                </button>
              </div>
            </form>
          ) : (
            <div className='view-mode'>
              <div className='info-field'>
                <label>Username</label>
                <p>{username}</p>
              </div>
              <div className='info-field'>
                <label>Bio</label>
                <p>{bio || 'No bio provided'}</p>
              </div>
            </div>
          )}
        </section>
      </main>
    </div>
  )
}
// <ImgUploader />
