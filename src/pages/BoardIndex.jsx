import { useState, useEffect } from 'react'
import { useSelector } from 'react-redux'

import {
  loadBoards,
  addBoard,
  updateBoard,
  removeBoard,
  addBoardMsg
} from '../store/actions/board.actions.js'

import { showSuccessMsg, showErrorMsg } from '../services/event-bus.service.js'
import { boardService } from '../services/board'
import { userService } from '../services/user'

import { BoardList } from '../cmps/BoardList'
import { BoardFilter } from '../cmps/BoardFilter'
import { Loader } from '../cmps/Loader.jsx'

export function BoardIndex() {
  const [filterBy, setFilterBy] = useState(boardService.getDefaultFilter())
  const boards = useSelector((storeState) => storeState.boardModule.boards)

  useEffect(() => {
    loadBoards(filterBy)
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
    <main className='board-index'>
      <BoardFilter filterBy={filterBy} onSetFilterBy={onSetFilterBy} />
      <BoardList boards={boards} onRemoveBoard={onRemoveBoard} onUpdateBoard={onUpdateBoard} />
      {userService.getLoggedinUser() && <button onClick={onAddBoard}>Add a Board</button>}
    </main>
  )
}
