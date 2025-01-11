import { Layout, Users, CheckSquare } from 'lucide-react'
// import { useNavigate } from '../assets/img/assetsCollage.png'

export function HomePage() {
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
          <section className='homepage-imgs'>
            <img
              className='collage-img'
              src='https://res.cloudinary.com/dv7uswhcz/image/upload/v1736446520/yqedfnbivqhfogcaixdj.png'
              alt=''
            />
            <img
              className='carousel-img'
              src='https://res.cloudinary.com/dv7uswhcz/image/upload/v1736446520/plnikgc85kndsu9be3ra.png'
              alt=''
            />
          </section>
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
