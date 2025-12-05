import { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import { useSelector, useDispatch } from 'react-redux'
import { boardService } from '../services/board'
import { showSuccessMsg, showErrorMsg } from '../services/event-bus.service'
import {
  loadBoard, addGroup, loadBoardsToSidebar, updateGroup,
  assignMemberToTask,
  updateBoard
} from '../store/actions/board.actions'
import { CLEAR_BOARD } from '../store/reducers/board.reducer'
import { BoardGroup } from '../cmps/Group/BoardGroup'
import { AddGroupForm } from '../cmps/Group/AddGroupForm'
import { BoardHeader } from '../cmps/Board/BoardHeader'
import { BoardSidebar } from '../cmps/Board/BoardSidebar'
import { GroupDragDropContainer } from '../cmps/DragDropSystem'
import { BoardMenu } from '../cmps/Board/BoardMenu'
import { DragDropContext } from 'react-beautiful-dnd'
import { Loader } from '../cmps/Loader'

export function BoardDetails() {
  const { boardId } = useParams()
  const board = useSelector((storeState) => storeState.boardModule.board)
  const boards = useSelector((storeState) => storeState.boardModule.boards)
  const [isAddingGroup, setIsAddingGroup] = useState(false)
  const [newGroupTitle, setNewGroupTitle] = useState('')
  const [isSidebarOpen, setIsSidebarOpen] = useState(() => {
    const sidebarState = localStorage.getItem('isSidebarOpen')
    return sidebarState ? JSON.parse(sidebarState) : false
  })
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const dispatch = useDispatch()

  const toggleSidebar = () => {
    const newSidebarState = !isSidebarOpen
    setIsSidebarOpen(newSidebarState)
    localStorage.setItem('isSidebarOpen', JSON.stringify(newSidebarState))
  }
  const toggleBoardMenu = () => {
    setIsMenuOpen(!isMenuOpen)
  }

  useEffect(() => {
    // Clear stale board data when boardId changes to prevent flickering
    if (board && board._id !== boardId) {
      dispatch({ type: CLEAR_BOARD })
    }
    loadBoard(boardId)
    loadBoardsToSidebar()
  }, [boardId, board, dispatch])

  async function onAddGroup(boardId) {
    if (!newGroupTitle.trim()) {
      showErrorMsg('Group title cannot be empty')
      setIsAddingGroup(false)
      return
    }
    const group = boardService.getEmptyGroup()
    group.title = newGroupTitle
    try {
      const savedGroup = await addGroup(boardId, group)
      showSuccessMsg(`Group added (id: ${savedGroup.id})`)
      loadBoard(board._id)
      setNewGroupTitle('')
      setIsAddingGroup(false)
    } catch (err) {
      console.log('Cannot add group', err)
      showErrorMsg('Cannot add group')
    }
  }

  async function onUpdateGroup(updatedGroup) {
    try {
      const savedGroup = await updateGroup(board._id, updatedGroup)
      loadBoard(board._id)
      showSuccessMsg(`Group updated successfully (id: ${savedGroup.id})`)
    } catch (err) {
      console.error('Cannot update group', err)
      showErrorMsg('Cannot update group')
    }
  }

  async function handleDragEnd(result) {
    const { source, destination, type } = result
  
    if (!destination) return
  
    const updatedBoard = { ...board }
    try {
      switch (type) {
        case 'group':
          const [removed] = updatedBoard.groups.splice(source.index, 1)
          updatedBoard.groups.splice(destination.index, 0, removed)
          await updateBoard(updatedBoard)
          showSuccessMsg('Group order updated')
          break
  
        case 'task':
          const sourceGroup = updatedBoard.groups.find(g => g.id === source.droppableId)
          const destGroup = updatedBoard.groups.find(g => g.id === destination.droppableId)
          if (!sourceGroup || !destGroup) return
          
          const [movedTask] = sourceGroup.tasks.splice(source.index, 1)
          destGroup.tasks.splice(destination.index, 0, movedTask)
          
          if (sourceGroup.id !== destGroup.id) {
            await updateGroup(board._id, sourceGroup)
            await updateGroup(board._id, destGroup)
          } else {
            await updateGroup(board._id, sourceGroup)
          }
          showSuccessMsg('Task moved successfully')
          break
  
        case 'member':
          if (destination.droppableId.startsWith('task-')) {
            const taskId = destination.droppableId.replace('task-', '')
            const memberId = result.draggableId
            await assignMemberToTask(board._id, taskId, memberId)
          }
          break
      }
    } catch (err) {
      console.error('Failed to update after drag and drop:', err)
      showErrorMsg('Failed to update changes')
    }
  }

  // Ensure board exists and matches the route boardId to prevent rendering stale data
  if (!board || board._id !== boardId) return <Loader />
  return (
    <DragDropContext onDragEnd={handleDragEnd}>
      <div className={`board-layout ${isSidebarOpen ? 'sidebar-open' : ''}`}>
        <BoardSidebar
          isOpen={isSidebarOpen}
          toggleDrawer={toggleSidebar}
          boards={boards}
        />
        <section className='board-details'>
          <BoardHeader
            board={board}
            isSidebarOpen={isSidebarOpen}
            onUpdateGroup={onUpdateGroup}
          />
          <main className='group-container'>
            <GroupDragDropContainer
              items={board.groups}
              onDragEnd={handleDragEnd}
            >
              {(group, index, isDragging) => (
                <BoardGroup
                  board={board}
                  group={group}
                  index={index}
                  onUpdateGroup={onUpdateGroup}
                  isDragging={isDragging}
                />
              )}
            </GroupDragDropContainer>

            <AddGroupForm
              board={board}
              newGroupTitle={newGroupTitle}
              setNewGroupTitle={setNewGroupTitle}
              onAddGroup={() => onAddGroup(board._id)}
              isAddingGroup={isAddingGroup}
              setIsAddingGroup={setIsAddingGroup}
            />
          </main>
        </section>
        <BoardMenu
          isOpen={isMenuOpen}
          toggleMenu={toggleBoardMenu}
          board={board}
        />
      </div>
    </DragDropContext>
  )
}
