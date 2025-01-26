import React, { useState, useEffect } from 'react'

export function CoverPicker({ initialTask, onCoverUpdate }) {
  const [selectedColor, setSelectedColor] = useState(initialTask.coverColor || '')
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

  useEffect(() => {
    setSelectedColor(initialTask.coverColor || '')
  }, [initialTask.coverColor])

  function handleCoverSelect(color) {
    setIsLoading(true)
    setSelectedColor(color)
    onCoverUpdate(color)
    setTimeout(() => setIsLoading(false), 300)
  }

  return (
    <div className="picker-content">
      <div className="colors-container">
        {colors.map(({ id, value }) => (
          <button
            key={id}
            className={`color-option ${selectedColor === value ? 'selected' : ''}`}
            style={{ backgroundColor: value }}
            onClick={() => !isLoading && handleCoverSelect(value)}
            disabled={isLoading}
            aria-label={`Select ${id} color`}
          />
        ))}
      </div>

      {selectedColor && (
        <button
          className="secondary-button"
          onClick={() => handleCoverSelect('')}
          disabled={isLoading}
        >
          Remove Cover
        </button>
      )}
    </div>
  )
}