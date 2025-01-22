import { Layout, Users, CheckSquare } from 'lucide-react'
import { useSelector } from 'react-redux'
import { Link } from 'react-router-dom'

export function HomePage() {
  const user = useSelector((storeState) => storeState.userModule.user)

  return (
    <div className='homepage'>
      <main>
        <section className='hero-section  main-layout full'>
          <div className='hero-content'>
            <div className='hero-text'>
              <h1>Trello brings all your tasks, teammates, and tools together</h1>
              <p>Keep everything organized and work more collaboratively in one place.</p>
            </div>

            <div className='features-grid'>
              {!user ? (
                <Link to='/login'>
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
                <Link to='/signup'>
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
                <Link to='/signup'>
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
      </main>
    </div>
  )
}
