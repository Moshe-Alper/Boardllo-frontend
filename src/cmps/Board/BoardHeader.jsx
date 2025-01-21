import React, { useState } from 'react'
import { svgService } from '../../services/svg.service'
import { showErrorMsg, showSuccessMsg } from '../../services/event-bus.service'
import { loadBoard, updateBoard } from '../../store/actions/board.actions'
import { BoardMenu } from './BoardMenu'

export function BoardHeader({ board, onUpdateBoard }) {
  const [isEditingTitle, setIsEditingTitle] = useState(false)
  const [editedTitle, setEditedTitle] = useState(board?.title || '')
  const [isMenuOpen, setIsMenuOpen] = useState(false)

  async function onUpdateBoardTitle() {
    if (!editedTitle.trim()) {
      showErrorMsg('Board title cannot be empty')
      setEditedTitle(board?.title || '')
      setIsEditingTitle(false)
      return
    }

    if (!board?._id) {
      showErrorMsg('Cannot update board: Invalid board ID')
      setEditedTitle(board?.title || '')
      setIsEditingTitle(false)
      return
    }

    try {
      const updatedBoard = { ...board, title: editedTitle.trim() }
      await updateBoard(updatedBoard)
      await loadBoard(board._id)
      showSuccessMsg('Board title updated successfully')
      setIsEditingTitle(false)
    } catch (err) {
      console.log('Cannot update board title', err)
      showErrorMsg('Cannot update board title')
      setEditedTitle(board?.title || '')
      setIsEditingTitle(false)
    }
  }

  const handleTitleClick = () => {
    if (!board?._id) return
    setIsEditingTitle(true)
  }

  const handleTitleBlur = () => {
    onUpdateBoardTitle()
  }

  const handleTitleKeyPress = (e) => {
    if (e.key === 'Enter') {
      e.target.blur()
    }
    if (e.key === 'Escape') {
      setEditedTitle(board?.title || '')
      setIsEditingTitle(false)
    }
  }

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen)
  }

  if (!board) {
    return <div className='board-header'>Loading board...</div>
  }

  return (
    <section className={`board-header ${isMenuOpen ? 'menu-open' : ''}`}>
      <div className='board-header-left'>
        {isEditingTitle ? (
          <input
            type='text'
            value={editedTitle}
            onChange={(e) => setEditedTitle(e.target.value)}
            onBlur={handleTitleBlur}
            onKeyDown={handleTitleKeyPress}
            className='board-title-input'
            autoFocus
          />
        ) : (
          <h1 onClick={handleTitleClick}>{board.title}</h1>
        )}
        <button className='star-btn'>
          <img src={svgService.starIcon} alt='Star' />
        </button>
      </div>

      <div className='board-header-right'>
        <div className='filters'>
          <button className='header-btn'>
            <img src={svgService.filterIcon} alt='Filter' />
            <span>Filters</span>
          </button>
        </div>
        <div className='share'>
          <button className='header-btn share-btn'>
            <img src={svgService.shareIcon} alt='Share' />
            <span>Share</span>
          </button>
        </div>
        <div className='members'>
          <button className='header-btn members-btn'>
            <img src={svgService.membersIcon} alt='Members' />
          </button>
        </div>
        <div className='menu-btn'>
          <button className='header-btn' onClick={toggleMenu}>
            <img src={svgService.menuBarIcon} alt='Menu' />
          </button>
        </div>
      </div>
      <BoardMenu isOpen={isMenuOpen} toggleMenu={toggleMenu} board={board} />
    </section>
  )
}
