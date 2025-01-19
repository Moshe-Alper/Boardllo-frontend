import React, { useState } from 'react'
import { TextField, Checkbox, LinearProgress } from '@mui/material'
import { svgService } from '../../../services/svg.service'
import { updateTask } from '../../../store/actions/board.actions'

export function ChecklistPicker({ task, boardId, groupId, onClose }) {
  const [isLoading, setIsLoading] = useState(false)
  const [newItemText, setNewItemText] = useState('')
  const [editingId, setEditingId] = useState(null)
  const [editText, setEditText] = useState('')

  // Initialize checklist if it doesn't exist
  const checklist = task.checklist || []

  const completedItems = checklist.filter(item => item.isComplete).length
  const progress = checklist.length > 0 
    ? Math.round((completedItems / checklist.length) * 100) 
    : 0

  async function handleAddItem(e) {
    e.preventDefault()
    if (!newItemText.trim()) return

    setIsLoading(true)
    try {
      const newItem = {
        id: Date.now().toString(),
        text: newItemText.trim(),
        isComplete: false
      }

      const updatedChecklist = [...checklist, newItem]
      await updateTaskChecklist(updatedChecklist)
      setNewItemText('')
    } catch (err) {
      console.error('Failed to add checklist item:', err)
    } finally {
      setIsLoading(false)
    }
  }

  async function handleToggleItem(itemId) {
    setIsLoading(true)
    try {
      const updatedChecklist = checklist.map(item => 
        item.id === itemId 
          ? { ...item, isComplete: !item.isComplete }
          : item
      )
      await updateTaskChecklist(updatedChecklist)
    } catch (err) {
      console.error('Failed to toggle checklist item:', err)
    } finally {
      setIsLoading(false)
    }
  }

  async function handleDeleteItem(itemId) {
    setIsLoading(true)
    try {
      const updatedChecklist = checklist.filter(item => item.id !== itemId)
      await updateTaskChecklist(updatedChecklist)
    } catch (err) {
      console.error('Failed to delete checklist item:', err)
    } finally {
      setIsLoading(false)
    }
  }

  async function handleEditSubmit(itemId) {
    if (!editText.trim()) return

    setIsLoading(true)
    try {
      const updatedChecklist = checklist.map(item =>
        item.id === itemId
          ? { ...item, text: editText.trim() }
          : item
      )
      await updateTaskChecklist(updatedChecklist)
      setEditingId(null)
      setEditText('')
    } catch (err) {
      console.error('Failed to edit checklist item:', err)
    } finally {
      setIsLoading(false)
    }
  }

  function startEditing(item) {
    setEditingId(item.id)
    setEditText(item.text)
  }

  async function updateTaskChecklist(newChecklist) {
    const updatedTask = {
      ...task,
      checklist: newChecklist
    }
    await updateTask(boardId, groupId, updatedTask)
  }

  return (
    <div className="checklist-picker">
      <div className="checklist-progress">
        <div className="progress-header">
          <span>{progress}%</span>
        </div>
        <LinearProgress 
          variant="determinate" 
          value={progress} 
          className="progress-bar"
        />
      </div>

      <div className="checklist-items">
        {checklist.map(item => (
          <div key={item.id} className="checklist-item">
            <Checkbox
              checked={item.isComplete}
              onChange={() => !isLoading && handleToggleItem(item.id)}
              disabled={isLoading}
            />
            
            {editingId === item.id ? (
              <form 
                className="edit-form"
                onSubmit={(e) => {
                  e.preventDefault()
                  handleEditSubmit(item.id)
                }}
              >
                <TextField
                  fullWidth
                  size="small"
                  value={editText}
                  onChange={(e) => setEditText(e.target.value)}
                  autoFocus
                  onBlur={() => handleEditSubmit(item.id)}
                  disabled={isLoading}
                />
              </form>
            ) : (
              <div className="item-content">
                <span 
                  className={`item-text ${item.isComplete ? 'completed' : ''}`}
                  onClick={() => startEditing(item)}
                >
                  {item.text}
                </span>
                <button
                  onClick={() => !isLoading && handleDeleteItem(item.id)}
                  disabled={isLoading}
                  className="close-button"
                >
                  <img src={svgService.closeIcon} alt="Close" />
                </button>
              </div>
            )}
          </div>
        ))}
      </div>

      <form onSubmit={handleAddItem} className="add-item-form">
        <TextField
          fullWidth
          size="small"
          placeholder="Add an item..."
          value={newItemText}
          onChange={(e) => setNewItemText(e.target.value)}
          disabled={isLoading}
        />
        <button 
          type="submit" 
          className="add-button"
          disabled={isLoading || !newItemText.trim()}
        >
          Add
        </button>
      </form>
    </div>
  )
}