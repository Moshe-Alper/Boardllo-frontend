import { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import { useSelector, useDispatch } from 'react-redux'
import { boardService } from '../services/board'
import { showSuccessMsg, showErrorMsg } from '../services/event-bus.service'
import {
  loadBoard,
  updateBoard,
  addGroup,
  loadBoardsToSidebar,
  updateGroup
} from '../store/actions/board.actions'
import { BoardGroup } from '../cmps/Group/BoardGroup'
import { AddGroupForm } from '../cmps/Group/AddGroupForm'
import { BoardHeader } from '../cmps/Board/BoardHeader'
import { BoardSidebar } from '../cmps/Board/BoardSidebar'
import { GroupDragDropContainer } from '../cmps/DragDropSystem'
import { BoardMenu } from '../cmps/Board/BoardMenu'

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
  const [activeItem, setActiveItem] = useState(null)
  const [activeType, setActiveType] = useState(null)
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
    loadBoard(boardId)
    loadBoardsToSidebar()
  }, [boardId])

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

    if (
      !destination ||
      (source.droppableId === destination.droppableId && source.index === destination.index)
    ) {
      return
    }

    const updatedBoard = { ...board }

    if (type === 'group') {
      const [removed] = updatedBoard.groups.splice(source.index, 1)
      updatedBoard.groups.splice(destination.index, 0, removed)

      try {
        await updateBoard(updatedBoard)
        showSuccessMsg('Group reordered successfully')
      } catch (err) {
        console.error('Failed to reorder group:', err)
        showErrorMsg('Failed to reorder group')
      }
    } else if (type === 'task') {
      const sourceGroup = updatedBoard.groups.find((group) => group.id === source.droppableId)
      const destinationGroup = updatedBoard.groups.find(
        (group) => group.id === destination.droppableId
      )

      if (!sourceGroup || !destinationGroup) return

      const [movedTask] = sourceGroup.tasks.splice(source.index, 1)
      destinationGroup.tasks.splice(destination.index, 0, movedTask)

      try {
        await updateBoard(updatedBoard)
        showSuccessMsg('Task moved successfully')
      } catch (err) {
        console.error('Failed to move task:', err)
        showErrorMsg('Failed to move task')
      }
    }
  }

  if (!board) return <div>Loading...</div>

  return (
    <div className={`board-layout ${isSidebarOpen ? 'sidebar-open' : ''}`}>
      <BoardSidebar isOpen={isSidebarOpen} toggleDrawer={toggleSidebar} boards={boards} />
      <section className='board-details'>
        <BoardHeader 
        board={board} 
        isSidebarOpen={isSidebarOpen}
        />
        <main className='group-container'>
          <GroupDragDropContainer items={board.groups} onDragEnd={handleDragEnd}>
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
      <BoardMenu isOpen={isMenuOpen} toggleMenu={toggleBoardMenu} board={board} />
    </div>
  )
}
