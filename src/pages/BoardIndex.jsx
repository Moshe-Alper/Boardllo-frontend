/* eslint-disable react/prop-types */
import { Fragment, useState, useEffect, useRef } from 'react'
import { useSelector } from 'react-redux'
import { Layout, Pencil, Plus, Trash2, Users, Star } from 'lucide-react'
import { Link } from 'react-router-dom'

import {
  loadBoards,
  removeBoard,
  loadBoardsToSidebar,
  updateBoard
} from '../store/actions/board.actions.js'

import { showSuccessMsg, showErrorMsg } from '../services/event-bus.service.js'
import { boardService } from '../services/board'
import { Loader } from '../cmps/Loader.jsx'
import { BoardCreateModal } from '../cmps/Board/BoardCreateModal.jsx'

export function BoardIndex() {
  const [filterBy, setFilterBy] = useState(boardService.getDefaultFilter())
  const boards = useSelector((storeState) => storeState.boardModule.boards)
  const workspaceBoards = Array.isArray(boards)
    ? boards.filter((board) => !board.isGuest)
    : []
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false)
  const [editingBoard, setEditingBoard] = useState(null)
  const createButtonRef = useRef(null)

  useEffect(function() {
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

  async function toggleStar(ev, boardId) {
    ev.preventDefault()
    try {
      const board = boards.find(b => b._id === boardId)
      if (board) {
        const updatedBoard = { ...board, isStarred: !board.isStarred }
        await updateBoard(updatedBoard)
        loadBoards(filterBy)
      }
    } catch (err) {
      showErrorMsg('Cannot update board')
    }
  }

  if (!boards) return <Loader />

  const starredBoards = workspaceBoards.filter(function(board) { 
    return board.isStarred 
  })

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
              {starredBoards.map(function(board) {
                return (
                  <Fragment key={board._id}>
                    <Link to={`/board/${board._id}`} className='board-tile'>
                      <div className='workspace-crud'>
                        <button
                          className='crud-btn'
                          onClick={function(ev) {
                            ev.preventDefault()
                            const rect = ev.currentTarget.getBoundingClientRect()
                            setEditingBoard({ ...board, buttonPos: rect })
                          }}
                        >
                          <Pencil size={14} />
                        </button>
                        <button
                          className='crud-btn star-btn'
                          onClick={function(ev) { toggleStar(ev, board._id) }}
                        >
                          <Star size={14} fill='#fff' />
                        </button>
                      </div>
                      <div className='board-tile-details'>
                        <h3>{board.title}</h3>
                        <span className='workspace-label'>Boardllo Workspace</span>
                      </div>
                    </Link>
                  </Fragment>
                )
              })}
            </div>
          </section>
        )}

        <section className='recently-viewed'>
          <h2>RECENTLY VIEWED</h2>
          <div className='board-grid'>
            {workspaceBoards.slice(0, 2).map(function(board) {
              return (
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
              )
            })}
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
            {workspaceBoards.slice(0, 8).map(function(board) {
              return (
                <Fragment key={board._id}>
                  <Link to={`/board/${board._id}`} className='board-tile'>
                    <div className='workspace-crud'>
                      <button
                        className='crud-btn'
                        onClick={function(ev) {
                          ev.preventDefault()
                          const rect = ev.currentTarget.getBoundingClientRect()
                          setEditingBoard({ ...board, buttonPos: rect })
                        }}
                      >
                        <Pencil size={14} />
                      </button>
                      <button
                        className='crud-btn'
                        onClick={function(ev) { toggleStar(ev, board._id) }}
                      >
                        {board.isStarred ? (
                          <Star size={14} fill='#fff' />
                        ) : (
                          <Star size={14} />
                        )}
                      </button>
                      <button
                        className='crud-btn'
                        onClick={function(ev) {
                          ev.preventDefault()
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
              )
            })}

            <button
              ref={createButtonRef}
              onClick={function() { setIsCreateModalOpen(true) }}
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
            onClose={function() { setIsCreateModalOpen(false) }}
            position={{
              top: createButtonRef.current?.getBoundingClientRect().bottom + 4,
              left: createButtonRef.current?.getBoundingClientRect().left,
            }}
          />
        )}

        {editingBoard && (
          <BoardCreateModal
            isOpen={true}
            onClose={function() { setEditingBoard(null) }}
            position={{
              top: editingBoard.buttonPos?.bottom + 4,
              left: editingBoard.buttonPos?.left,
            }}
            board={editingBoard}
          />
        )}
      </main>
    </div>
  )
}