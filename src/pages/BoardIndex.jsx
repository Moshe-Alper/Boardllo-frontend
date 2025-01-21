/* eslint-disable react/prop-types */

import { useState, useEffect, useRef } from 'react'
import { useSelector } from 'react-redux'
import { Layout, Plus, Users } from 'lucide-react'
import { Link } from 'react-router-dom'

import { loadBoards, removeBoard, loadBoardsToSidebar } from '../store/actions/board.actions.js'

import { showSuccessMsg, showErrorMsg } from '../services/event-bus.service.js'
import { boardService } from '../services/board'
import { Loader } from '../cmps/Loader.jsx'
import { BoardCreateModal } from '../cmps/Board/BoardCreateModal.jsx'

// import { BoardFilter } from '../cmps/Board/BoardFilter.jsx'
// import { BoardList } from '../cmps/Board/BoardList.jsx'

export function BoardIndex() {
  const [filterBy, setFilterBy] = useState(boardService.getDefaultFilter())
  const boards = useSelector((storeState) => storeState.boardModule.boards)
  const workspaceBoards = boards?.filter((board) => !board.isGuest) || []
  const guestBoards = boards?.filter((board) => board.isGuest) || []

  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false)
  const [editingBoard, setEditingBoard] = useState(null)

  const createButtonRef = useRef(null)
  const editButtonRef = useRef(null)

  useEffect(() => {
    loadBoards(filterBy)
    loadBoardsToSidebar()
  }, [filterBy])

  function onSetFilterBy(filterBy) {
    setFilterBy((prevFilterBy) => ({ ...prevFilterBy, ...filterBy }))
  }

  async function onRemoveBoard(boardId) {
    try {
      await removeBoard(boardId)
      showSuccessMsg('Board removed')
    } catch (err) {
      showErrorMsg('Cannot remove board')
    }
  }

  if (!boards) return <Loader />

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
                  <span className='workspace-label'>Boardllo Workspace</span>
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
              <h3>Boardllo Workspace</h3>
            </div>
          </div>

          <div className='board-grid'>
            {workspaceBoards.slice(0, 4).map((board) => (
              <>
                <Link key={board._id} to={`/board/${board._id}`} className='board-tile'>
                  <div className='board-tile-details'>
                    <h3>{board.title}</h3>
                    <span className='workspace-label'>Boardllo Workspace</span>
                  </div>
                </Link>

                <section className='workspace-crud'>
                  <button
                    style={{ backgroundColor: '#000' }}
                    onClick={() => onRemoveBoard(board._id)}
                  >
                    Remove
                  </button>
                  <button
                    style={{ backgroundColor: '#888' }}
                    ref={editButtonRef}
                    onClick={() => setEditingBoard(board)}
                  >
                    Edit
                  </button>
                </section>
              </div>
            ))}
            <button
              ref={createButtonRef}
              onClick={() => setIsCreateModalOpen(true)}
              className='create-board-tile'
            >
              <Plus size={24} />
              <span>Create new board</span>
            </button>
          </div>
        </section>

        {/* Create Modal */}
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

        {/* Edit Modal */}
        {editingBoard && (
          <BoardCreateModal
            isOpen={!!editingBoard}
            onClose={() => setEditingBoard(null)}
            position={{
              top: editButtonRef.current?.getBoundingClientRect().bottom + 4,
              left: editButtonRef.current?.getBoundingClientRect().left
            }}
            board={editingBoard}
          />
        )}

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
