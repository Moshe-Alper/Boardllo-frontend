/* eslint-disable react/prop-types */

import { Fragment, useState, useEffect, useRef } from 'react'
import { useSelector } from 'react-redux'
import { Layout, Pencil, Plus, Trash2, Users, Star } from 'lucide-react'
import { Link } from 'react-router-dom'

import {
  loadBoards,
  removeBoard,
  loadBoardsToSidebar,
} from '../store/actions/board.actions.js'

import { showSuccessMsg, showErrorMsg } from '../services/event-bus.service.js'
import { boardService } from '../services/board'
import { Loader } from '../cmps/Loader.jsx'
import { BoardCreateModal } from '../cmps/Board/BoardCreateModal.jsx'

export function BoardIndex() {
  const [filterBy, setFilterBy] = useState(boardService.getDefaultFilter())
  const boards = useSelector((storeState) => storeState.boardModule.boards)
  const workspaceBoards = Array.isArray(boards) ? 
  boards.filter((board) => !board.isGuest) : 
  []
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false)
  const [editingBoard, setEditingBoard] = useState(null)
  const [starredBoards, setStarredBoards] = useState([])

  const createButtonRef = useRef(null)

  useEffect(() => {
    loadBoards(filterBy)
    loadBoardsToSidebar()
  }, [filterBy])

  async function onRemoveBoard(boardId) {
    try {
      await removeBoard(boardId)
      showSuccessMsg('Board removed')
    } catch (err) {
      showErrorMsg('Cannot remove board')
    }
  }

  const toggleStar = (e, boardId) => {
    e.preventDefault()
    setStarredBoards((prev) =>
      prev.includes(boardId)
        ? prev.filter((id) => id !== boardId)
        : [...prev, boardId]
    )
  }

  if (!boards) return <Loader />

  return (
    <div className='board-index-container'>
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

      <main className='main-content'>
        {starredBoards.length > 0 && (
          <section className='starred-boards'>
            <h2>STARRED BOARDS</h2>
            <div className='board-grid'>
              {workspaceBoards
                .filter((board) => starredBoards.includes(board._id))
                .map((board) => (
                  <Fragment key={board._id}>
                    <Link to={`/board/${board._id}`} className='board-tile'>
                      <div className='workspace-crud'>
                        <button
                          className='crud-btn'
                          onClick={(e) => {
                            e.preventDefault()
                            const rect =
                              e.currentTarget.getBoundingClientRect()
                            setEditingBoard({ ...board, buttonPos: rect })
                          }}
                        >
                          <Pencil size={14} />
                        </button>
                        <button
                          className='crud-btn star-btn'
                          onClick={(e) => toggleStar(e, board._id)}
                        >
                          <Star size={14} fill='#fff' />
                        </button>
                      </div>
                      <div className='board-tile-details'>
                        <h3>{board.title}</h3>
                        <span className='workspace-label'>
                          Boardllo Workspace
                        </span>
                      </div>
                    </Link>
                  </Fragment>
                ))}
            </div>
          </section>
        )}

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
              <Fragment key={board._id}>
                <Link to={`/board/${board._id}`} className='board-tile'>
                  <div className='workspace-crud'>
                    <button
                      className='crud-btn'
                      onClick={(e) => {
                        e.preventDefault()
                        const rect = e.currentTarget.getBoundingClientRect()
                        setEditingBoard({ ...board, buttonPos: rect })
                      }}
                    >
                      <Pencil size={14} />
                    </button>
                    <button
                      className='crud-btn'
                      onClick={(e) => toggleStar(e, board._id)}
                    >
                      {starredBoards.includes(board._id) ? (
                        <Star size={14} fill='#fff' />
                      ) : (
                        <Star size={14} />
                      )}
                    </button>
                    <button
                      className='crud-btn'
                      onClick={(e) => {
                        e.preventDefault()
                        onRemoveBoard(board._id)
                      }}
                    >
                      <Trash2 size={14} />
                    </button>
                  </div>
                  <div className='board-tile-details'>
                    <h3>{board.title}</h3>
                    <span className='workspace-label'>Boardllo Workspace</span>
                  </div>
                </Link>
              </Fragment>
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

        {isCreateModalOpen && (
          <BoardCreateModal
            isOpen={isCreateModalOpen}
            onClose={() => setIsCreateModalOpen(false)}
            position={{
              top: createButtonRef.current?.getBoundingClientRect().bottom + 4,
              left: createButtonRef.current?.getBoundingClientRect().left,
            }}
          />
        )}

        {editingBoard && (
          <BoardCreateModal
            isOpen={true}
            onClose={() => setEditingBoard(null)}
            position={{
              top: editingBoard.buttonPos?.bottom + 4,
              left: editingBoard.buttonPos?.left,
            }}
            board={editingBoard}
          />
        )}

        <section className='recently-viewed'>
          <h2>Recently viewed</h2>
          <div className='board-grid'>
            {workspaceBoards.slice(0, 4).map((board) => (
              <Link
                key={board._id}
                to={`/board/${board._id}`}
                className='board-tile'
              >
                <div className='board-tile-details'>
                  <h3>{board.title}</h3>
                  <span className='workspace-label'>Boardllo Workspace</span>
                </div>
              </Link>
            ))}
          </div>
        </section>
      </main>
    </div>
  )
}
