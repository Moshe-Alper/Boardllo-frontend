import React, { useState, useRef, useEffect } from 'react'
import { svgService } from '../../services/svg.service'
import { loadBoard, updateBoard } from '../../store/actions/board.actions'
import { BoardMenu } from './BoardMenu'
import { Droppable } from "react-beautiful-dnd"
import { MemberDraggable } from '../DragDropSystem'
import { Loader } from '../Loader'

export function BoardHeader({ board, isSidebarOpen, onUpdateGroup }) {
  const [isEditingTitle, setIsEditingTitle] = useState(false)
  const [title, setTitle] = useState(board?.title || '')
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const textareaRef = useRef(null)

  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.width = '0px'
      const scrollWidth = textareaRef.current.scrollWidth
      textareaRef.current.style.width = scrollWidth + 'px'
    }
  }, [title, isEditingTitle])

  async function handleTitleUpdate() {
    const trimmedTitle = title.trim()
    if (!trimmedTitle) {
      showErrorMsg('Board title cannot be empty')
      setTitle(board?.title || '')
      setIsEditingTitle(false)
      return
    }

    try {
      const updatedBoard = { ...board, title: trimmedTitle }
      await updateBoard(updatedBoard)
      await loadBoard(board._id)
      setIsEditingTitle(false)
    } catch (error) {
      setTitle(board?.title || '')
      setIsEditingTitle(false)
    }
  }

  function onDragEnd(result) {
    if (!result.destination) return

    if (result.destination.droppableId.startsWith('task-')) {
      let taskId = result.destination.droppableId.replace('task-', '')
      let memberId = result.draggableId

      let updatedGroup = board.groups.find(group =>
        group.tasks.some(task => task.id === taskId)
      )

      if (updatedGroup) {
        let tasks = updatedGroup.tasks.map(task => {
          if (task.id === taskId) {
            let memberIds = new Set(task.memberIds || [])
            memberIds.add(memberId)
            return { ...task, memberIds: Array.from(memberIds) }
          }
          return task
        })

        onUpdateGroup({
          ...updatedGroup,
          tasks
        })
      }
    }
  }

  if (!board) return <Loader />
  
  return (
    <section className={`board-header ${isMenuOpen ? 'menu-open' : ''} ${isSidebarOpen ? 'sidebar-open' : ''}`}>
      {isEditingTitle ? (
        <textarea
          ref={textareaRef}
          value={title}
          onChange={(ev) => setTitle(ev.target.value)}
          onBlur={handleTitleUpdate}
          onKeyDown={(ev) => {
            if (ev.key === 'Enter') {
              ev.preventDefault()
              ev.target.blur()
            }
            if (ev.key === 'Escape') {
              setTitle(board?.title || '')
              setIsEditingTitle(false)
            }
          }}
          rows={1}
          autoFocus
        />
      ) : (
        <h1 onClick={() => board?._id && setIsEditingTitle(true)}>{board.title}</h1>
      )}

      <Droppable droppableId="board-members" direction="horizontal" type="member">
        {(provided) => (
          <div ref={provided.innerRef} {...provided.droppableProps} className="members">
            {board.members?.map((member, index) => (
              <MemberDraggable key={member._id} member={member} index={index} />
            ))}
            {provided.placeholder}
          </div>
        )}
      </Droppable>

      <button className='header-btn' onClick={() => setIsMenuOpen(!isMenuOpen)}>
        <img src={svgService.threeDotsIcon} alt='Menu' />
      </button>

      <BoardMenu
        isOpen={isMenuOpen}
        toggleMenu={() => setIsMenuOpen(!isMenuOpen)}
        board={board}
      />
    </section>
  )
}