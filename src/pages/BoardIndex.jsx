import { useState, useEffect } from 'react'
import { useSelector } from 'react-redux'
import { Layout, Plus, Users } from 'lucide-react'
import { Link } from 'react-router-dom'

import {
  loadBoards,
  addBoard,
  updateBoard,
  removeBoard,
  loadBoardsToSidebar
} from '../store/actions/board.actions.js'

import { showSuccessMsg, showErrorMsg } from '../services/event-bus.service.js'
import { boardService } from '../services/board'
import { Loader } from '../cmps/Loader.jsx'

// import { BoardFilter } from '../cmps/Board/BoardFilter.jsx'
// import { BoardList } from '../cmps/Board/BoardList.jsx'

export function BoardIndex() {
  const [filterBy, setFilterBy] = useState(boardService.getDefaultFilter())
  const boards = useSelector((storeState) => storeState.boardModule.boards)
  const workspaceBoards = boards?.filter((board) => !board.isGuest) || []
  const guestBoards = boards?.filter((board) => board.isGuest) || []

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

  async function onAddBoard() {
    const board = boardService.getEmptyBoard()
    board.title = prompt('Board Title?')
    if (!board.title) return
    try {
      const savedBoard = await addBoard(board)
      showSuccessMsg(`Board added (id: ${savedBoard._id})`)
    } catch (err) {
      showErrorMsg('Cannot add board')
    }
  }

  async function onUpdateBoard(board) {
    const title = prompt('New title?', board.title)
    if (!title) return

    const updatedBoard = {
      ...board,
      title: title
    }

    try {
      const savedBoard = await updateBoard(updatedBoard)
      showSuccessMsg(`Board updated, new title: ${savedBoard.title}`)
    } catch (err) {
      showErrorMsg('Cannot update board')
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
              <h3>Boardllo Workspace</h3>
            </div>
          </div>
          <div className='board-grid'>
            {workspaceBoards.map((board) => (
              <>
                <Link key={board._id} to={`/board/${board._id}`} className='board-tile'>
                  <div className='board-tile-details'>
                    <h3>{board.title}</h3>
                  </div>
                </Link>
                <section className='workspace-crud'>
                  <button onClick={() => onRemoveBoard(board._id)}>Remove</button>
                  <button
                    onClick={() => onUpdateBoard(board)}
                    style={{ backgroundColor: '#0052cc' }}
                  >
                    Edit
                  </button>
                </section>
              </>
            ))}
            <button onClick={onAddBoard} className='create-board-tile'>
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

/*
 ;<main className='board-index'>
   {userService.getLoggedinUser() && <button onClick={onAddBoard}>Add a Board</button>}
 </main>
 <BoardFilter filterBy={filterBy} onSetFilterBy={onSetFilterBy} />
<BoardList boards={boards} onRemoveBoard={onRemoveBoard} onUpdateBoard={onUpdateBoard} /> 
*/
