import { Layout, Users, CheckSquare } from 'lucide-react'
import { useSelector } from 'react-redux'
import { Link, useNavigate } from 'react-router-dom'
import { signup } from '../store/actions/user.actions'
import { showErrorMsg, showSuccessMsg } from '../services/event-bus.service'

export function HomePage() {
  const user = useSelector((storeState) => storeState.userModule.user)
  const navigate = useNavigate()

  const defaultUser = {
    username: 'default_user',
    password: '123',
    fullname: 'default',
  }

  async function handleDefaultLogin() {
    try {
      await signup(defaultUser)
      showSuccessMsg('Welcome to Boardllo!')
      navigate('/board')
    } catch (err) {
      console.error('Signup failed:', err)
      showErrorMsg('Oops! Something went wrong')
    }
  }

  return (
    <div className='homepage'>
      <main>
        <section className='hero-section  main-layout full'>
          <div className='hero-content'>
            <div className='hero-text'>
              <h1>
                Boardllo brings all your tasks, teammates, and tools together
              </h1>
              <p>
                Keep everything organized and work more collaboratively in one
                place.
              </p>
            </div>

            <div className='features-grid'>
              {!user ? (
                <Link onClick={handleDefaultLogin}>
                  <div className='feature-card'>
                    <Layout className='feature-icon' />
                    <h3>Boards View</h3>
                    <p>Organize work with lists, cards, and boards</p>
                  </div>
                </Link>
              ) : (
                <Link to='/board'>
                  <div className='feature-card'>
                    <Layout className='feature-icon' />
                    <h3>Boards View</h3>
                    <p>Organize work with lists, cards, and boards</p>
                  </div>
                </Link>
              )}
              {!user ? (
                <Link to='/login'>
                  <div className='feature-card'>
                    <Users className='feature-icon' />
                    <h3>Team Collaboration</h3>
                    <p>Work together efficiently with your team</p>
                  </div>
                </Link>
              ) : (
                <Link to='/board'>
                  <div className='feature-card'>
                    <Users className='feature-icon' />
                    <h3>Team Collaboration</h3>
                    <p>Work together efficiently with your team</p>
                  </div>
                </Link>
              )}

              {!user ? (
                <Link to='/login'>
                  <div className='feature-card'>
                    <CheckSquare className='feature-icon' />
                    <h3>Task Management</h3>
                    <p>Track progress with checklists and due dates</p>
                  </div>
                </Link>
              ) : (
                <Link to='/board'>
                  <div className='feature-card'>
                    <CheckSquare className='feature-icon' />
                    <h3>Task Management</h3>
                    <p>Track progress with checklists and due dates</p>
                  </div>
                </Link>
              )}
            </div>
          </div>

          <section className='homepage-imgs'>
            <img
              className='collage-img'
              src='https://res.cloudinary.com/dv7uswhcz/image/upload/v1736446520/yqedfnbivqhfogcaixdj.png'
              alt=''
            />
          </section>
        </section>

        <section className='social-proof'>
          <h2>Trusted by millions of users worldwide</h2>
          <div className='stats-grid'>
            {['4.5+ Stars', '2M+ Users', '100+ Countries', '50K+ Teams'].map(
              (stat) => (
                <div key={stat} className='stat-item'>
                  <p>{stat}</p>
                </div>
              )
            )}
          </div>
        </section>
      </main>
    </div>
  )
}
