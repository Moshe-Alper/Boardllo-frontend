import { Link } from 'react-router-dom'
import { ArrowRight, Layout, Users, CheckSquare } from 'lucide-react'

export function HomePage() {
  return (
    <div className='homepage'>
      <main>
        <section className='hero-section  main-layout full'>
          <div className='hero-content'>
            <div className='hero-text'>
              <h1>Trello brings all your tasks, teammates, and tools together</h1>
              <p>Keep everything organized and work more collaboratively in one place.</p>
              <Link className='cta-button' to='/board'>
                View Boards
                <ArrowRight className='arrow-icon' />
              </Link>
            </div>

            <div className='features-grid'>
              <div className='feature-card'>
                <Layout className='feature-icon' />
                <h3>Boards View</h3>
                <p>Organize work with lists, cards, and boards</p>
              </div>
              <div className='feature-card'>
                <Users className='feature-icon' />
                <h3>Team Collaboration</h3>
                <p>Work together efficiently with your team</p>
              </div>
              <div className='feature-card'>
                <CheckSquare className='feature-icon' />
                <h3>Task Management</h3>
                <p>Track progress with checklists and due dates</p>
              </div>
            </div>
          </div>
        </section>

        <section className='social-proof main-layout full'>
          <h2>Trusted by millions of users worldwide</h2>
          <div className='stats-grid'>
            {['4.5+ Stars', '2M+ Users', '100+ Countries', '50K+ Teams'].map((stat) => (
              <div key={stat} className='stat-item'>
                <p>{stat}</p>
              </div>
            ))}
          </div>
        </section>
      </main>
    </div>
  )
}
