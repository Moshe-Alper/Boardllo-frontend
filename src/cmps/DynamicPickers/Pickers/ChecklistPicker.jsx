import React, { useState } from 'react'
import { TextField, Select, MenuItem } from '@mui/material'
import { updateTask } from '../../../store/actions/board.actions'

export function ChecklistPicker({ task, boardId, groupId, onClose }) {
  const [title, setTitle] = useState('Checklist')
  const [copyFrom, setCopyFrom] = useState('none')
  const [isLoading, setIsLoading] = useState(false)

  async function handleSubmit(e) {
    e.preventDefault()
    if (!title.trim()) return

    setIsLoading(true)
    try {
      const newChecklist = {
        id: Date.now().toString(),
        title: title.trim(),
        items: []
      }

      const updatedTask = {
        ...task,
        checklists: [...(task.checklists || []), newChecklist]
      }

      await updateTask(boardId, groupId, updatedTask)
      onClose()
    } catch (err) {
      console.error('Failed to add checklist:', err)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="picker-content">
      <div className="form-group">
        <label>Title</label>
        <TextField
          fullWidth
          size="small"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          disabled={isLoading}
        />
      </div>

      <div className="form-group">
        <label>Copy items from...</label>
        <Select
          fullWidth
          size="small"
          value={copyFrom}
          onChange={(e) => setCopyFrom(e.target.value)}
          disabled={isLoading}
        >
          <MenuItem value="none">(none)</MenuItem>
        </Select>
      </div>

      <button 
        type="submit" 
        className="add-button"
        disabled={isLoading || !title.trim()}
      >
        Add
      </button>
    </form>
  )
}