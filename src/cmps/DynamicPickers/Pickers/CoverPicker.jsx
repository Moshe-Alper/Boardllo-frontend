import React, { useState } from 'react'
import { updateTask } from '../../../store/actions/board.actions'

export function CoverPicker({ task, boardId, groupId, onClose }) {
  const [selectedColor, setSelectedColor] = useState(task.coverColor || '')
  const [isLoading, setIsLoading] = useState(false)

  const colors = [
    { id: 'blue', value: '#0052cc' },
    { id: 'light-blue', value: '#00c7e5' },
    { id: 'green', value: '#57d9a3' },
    { id: 'yellow', value: '#ffc400' },
    { id: 'orange', value: '#ffab00' },
    { id: 'red', value: '#f99cdb' },
    { id: 'purple', value: '#6554c0' },
    { id: 'light-purple', value: '#8777d9' },
    { id: 'gray', value: '#505f79' },
    { id: 'dark', value: '#172b4d' }
  ]

  async function handleColorSelect(color) {
    setIsLoading(true)
    try {
      const updatedTask = {
        ...task,
        coverColor: color
      }

      await updateTask(boardId, groupId, updatedTask)
      setSelectedColor(color)
      
      if (!color) {
        onClose()
      }
    } catch (err) {
      console.error('Failed to update cover color:', err)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="picker-content">
      <div className="colors-container">
        {colors.map(({ id, value }) => (
          <button
            key={id}
            className={`color-option ${selectedColor === value ? 'selected' : ''}`}
            style={{ backgroundColor: value }}
            onClick={() => !isLoading && handleColorSelect(value)}
            disabled={isLoading}
            aria-label={`Select ${id} color`}
          />
        ))}
      </div>

      {selectedColor && (
        <button
          className="secondary-button"
          onClick={() => handleColorSelect('')}
          disabled={isLoading}
        >
          Remove Cover
        </button>
      )}
    </div>
  )
}