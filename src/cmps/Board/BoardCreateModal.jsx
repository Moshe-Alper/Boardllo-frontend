/* eslint-disable react/prop-types */

import { useState } from 'react'
import { X } from 'lucide-react'
import { addBoard, updateBoard, setBoardBackground } from '../../store/actions/board.actions.js'
import { showSuccessMsg, showErrorMsg } from '../../services/event-bus.service.js'
import { useDispatch } from 'react-redux'

const BACKGROUNDS = [
  { id: 'bg-1', style: { background: 'linear-gradient(135deg, #0061D5 0%, #0C66E4 100%)' } },
  { id: 'bg-2', style: { backgroundColor: '#1D2125' } },
  { id: 'bg-3', style: { background: 'linear-gradient(135deg, #5C6BC0 0%, #512DA8 100%)' } },
  { id: 'bg-4', style: { background: 'linear-gradient(135deg, #FF8A65 0%, #FF5722 100%)' } },
  {
    id: 'bg-5',
    style: { background: 'linear-gradient(135deg, rgb(113, 66, 52) 0%, rgb(34, 255, 244) 100%)' }
  }
]

export function BoardCreateModal({ isOpen, onClose, position, board = null }) {
  const [title, setTitle] = useState(board?.title || '')
  const [selectedBackground, setSelectedBackground] = useState('bg-1')
  const dispatch = useDispatch()
  const isEditing = !!board

  const handleBackgroundSelect = (bgId) => {
    setSelectedBackground(bgId)
    const selectedBg = BACKGROUNDS.find((bg) => bg.id === bgId)
    if (selectedBg) {
      // Convert style object to string for storage
      const styleString = selectedBg.style.background || selectedBg.style.backgroundColor
      dispatch(setBoardBackground(styleString))
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!title.trim()) return

    try {
      const selectedBg = BACKGROUNDS.find((bg) => bg.id === selectedBackground)
      const styleString = selectedBg.style.background || selectedBg.style.backgroundColor

      const boardData = {
        title: title.trim(),
        style: styleString,
        isTemplate: false,
        ...(isEditing && { _id: board._id })
      }

      if (isEditing) {
        const savedBoard = await updateBoard({ ...board, ...boardData })
        showSuccessMsg(`Board "${title}" updated successfully`)
        onClose()
        return savedBoard
      } else {
        const savedBoard = await addBoard(boardData)
        showSuccessMsg(`Board "${title}" created successfully`)
        onClose()
        return savedBoard
      }
    } catch (err) {
      showErrorMsg(`Cannot ${isEditing ? 'update' : 'create'} board`)
      console.error(`Failed to ${isEditing ? 'update' : 'create'} board:`, err)
    }
  }

  if (!isOpen) return null

  const selectedBg = BACKGROUNDS.find((bg) => bg.id === selectedBackground)

  return (
    <div className='board-create-menu' style={{ position: 'absolute', ...position }}>
      <div className='menu-header'>
        <h3>{isEditing ? 'Edit board' : 'Create board'}</h3>
        <button className='close-button' onClick={onClose}>
          <X size={16} />
        </button>
      </div>

      <div className='board-preview' style={selectedBg.style}>
        <div className='preview-columns'>
          <div className='preview-column'></div>
          <div className='preview-column'></div>
          <div className='preview-column'></div>
        </div>
      </div>

      <div className='menu-content'>
        <div className='background-picker'>
          <h4>Background</h4>
          <div className='background-grid'>
            {BACKGROUNDS.map((bg) => (
              <button
                key={bg.id}
                className={`bg-option ${selectedBackground === bg.id ? 'selected' : ''}`}
                style={bg.style}
                onClick={() => handleBackgroundSelect(bg.id)}
              />
            ))}
          </div>
        </div>

        <div className='board-form'>
          <div className='input-wrapper'>
            <input
              type='text'
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder='Board title*'
              className={!title.trim() ? 'error' : ''}
            />
            {!title.trim() && <span className='error-message'>👋 Board title is required</span>}
          </div>

          <button className='submit-button' onClick={handleSubmit} disabled={!title.trim()}>
            {isEditing ? 'Save' : 'Create'}
          </button>
        </div>
      </div>
    </div>
  )
}
