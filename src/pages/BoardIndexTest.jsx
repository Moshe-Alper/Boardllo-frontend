import React, { useState, useEffect } from 'react'
import { useSelector } from 'react-redux'
import { Link } from 'react-router-dom'
import { Clock, Layout, Plus, Settings, Users } from 'lucide-react'
import { boardService } from '../services/board'
import { loadBoards, loadBoardsToSidebar } from '../store/actions/board.actions'
import { svgService } from '../services/svg.service'

export function BoardIndexTest() {
  const [filterBy, setFilterBy] = useState(boardService.getDefaultFilter())
  const boards = useSelector((storeState) => storeState.boardModule.boards)
  const [isSidebarOpen, setIsSidebarOpen] = useState(true)

  const workspaceBoards = boards?.filter((board) => !board.isGuest) || []
  const guestBoards = boards?.filter((board) => board.isGuest) || []

  useEffect(() => {
    loadBoards(filterBy)
    loadBoardsToSidebar()
  }, [filterBy])

  return (
    <div className='board-index-container'>
      {/* Left Sidebar */}
      <aside className='sidebar'>
        <nav className='sidebar-nav'>
          <div className='nav-section'>
            <Link to='/' className='nav-item active'>
              <Layout size={16} />
              <span>Boards</span>
            </Link>
            <Link to='/templates' className='nav-item'>
              <Layout size={16} />
              <span>Templates</span>
            </Link>
            <Link to='/' className='nav-item'>
              <Layout size={16} />
              <span>Home</span>
            </Link>
          </div>

          <div className='workspace-section'>
            <div className='workspace-header'>
              <span className='workspace-title'>Workspaces</span>
            </div>
            <div className='workspace-content'>
              <div className='workspace-item'>
                <div className='workspace-icon'>B</div>
                <span>Boardllo Workspace</span>
              </div>
              <div className='workspace-tools'>
                <Link to='/boards' className='tool-item active'>
                  <Layout size={16} />
                  <span>Boards</span>
                </Link>
                <Link to='/members' className='tool-item'>
                  <Users size={16} />
                  <span>Members</span>
                </Link>
              </div>
            </div>
          </div>
        </nav>
      </aside>

      {/* Main Content */}
      <main className='main-content'>
        <section className='recently-viewed'>
          <h2>Recently viewed</h2>
          <div className='board-grid'>
            {workspaceBoards.slice(0, 4).map((board) => (
              <Link key={board._id} to={`/board/${board._id}`} className='board-tile'>
                <div className='board-tile-details'>
                  <h3>{board.title}</h3>
                  <span className='workspace-label'>Trello Workspace</span>
                </div>
              </Link>
            ))}
          </div>
        </section>

        <section className='your-workspaces'>
          <h2>YOUR WORKSPACES</h2>
          <div className='workspace-header'>
            <div className='workspace-info'>
              <div className='workspace-icon'>B</div>
              <h3>Trello Workspace</h3>
            </div>
          </div>
          <div className='board-grid'>
            {workspaceBoards.map((board) => (
              <Link key={board._id} to={`/board/${board._id}`} className='board-tile'>
                <div className='board-tile-details'>
                  <h3>{board.title}</h3>
                </div>
              </Link>
            ))}
            <button className='create-board-tile'>
              <Plus size={24} />
              <span>Create new board</span>
            </button>
          </div>
        </section>

        <section className='guest-workspaces'>
          <h2>GUEST WORKSPACES</h2>
          <div className='board-grid'>
            {guestBoards.map((board) => (
              <Link key={board._id} to={`/board/${board._id}`} className='board-tile'>
                <div className='board-tile-details'>
                  <h3>{board.title}</h3>
                  <span className='workspace-label'>Guest Workspace</span>
                </div>
              </Link>
            ))}
          </div>
        </section>
      </main>
    </div>
  )
}
