import React, { useState, useRef, useEffect } from 'react'
import { svgService } from '../../services/svg.service'
import { showErrorMsg, showSuccessMsg } from '../../services/event-bus.service'
import { loadBoard, updateBoard } from '../../store/actions/board.actions'
import { BoardMenu } from './BoardMenu'

export function BoardHeader({ board, isSidebarOpen }) {
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

  if (!board) return <div className='board-header'>Loading board...</div>

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
      <button className='header-btn' onClick={() => setIsMenuOpen(!isMenuOpen)}>
        <img src={svgService.menuBarIcon} alt='Menu' />
      </button>
      <BoardMenu isOpen={isMenuOpen} toggleMenu={() => setIsMenuOpen(!isMenuOpen)} board={board} />
    </section>
  )
}