import React, { useState } from 'react'
import { TextField, Select, MenuItem } from '@mui/material'
import { makeId } from '../../../services/util.service'

export function ChecklistPicker({ initialTask, onChecklistUpdate, board }) {
  const [title, setTitle] = useState('Checklist')
  const [copyFrom, setCopyFrom] = useState('none')
  const [isLoading, setIsLoading] = useState(false)
  const groups = board.groups

  const tasksWithChecklists = groups.flatMap(group =>
    group.tasks.filter(task => task.checklists?.length > 0)
  )

  function handleSubmit(ev) {
    ev.preventDefault()
    setIsLoading(true)
    const newChecklist = {
      id: Date.now(),
      title,
      todos: [],
    }

    if (copyFrom !== 'none') {
      const sourceTask = tasksWithChecklists.find(task => 
        task.checklists?.some(checklist => checklist.id === copyFrom)
      )
      
      if (sourceTask) {
        const checklistToCopy = sourceTask.checklists.find(
          checklist => checklist.id === copyFrom
        )
        
        if (checklistToCopy) {
          newChecklist.todos = checklistToCopy.todos.map(todo => ({
            id: makeId(),
            title: todo.title,
            isDone: false
          }))
        }
      }
    } else {
      newChecklist.todos = [
        { id: makeId(), title: 'First item', isDone: false }
      ]
    }

    const updatedChecklists = [...(initialTask.checklists || []), newChecklist]
    onChecklistUpdate(updatedChecklists)
    setIsLoading(false)
  }

  return (
    <form onSubmit={handleSubmit} className="checklist-picker">
      <div className="form-group">
        <label>Title</label>
        <TextField
          fullWidth
          size="small"
          value={title}
          onChange={(ev) => setTitle(ev.target.value)}
          disabled={isLoading}
        />
      </div>

      <div className="form-group">
        <label>Copy items from...</label>
        <Select
          fullWidth
          size="small"
          value={copyFrom}
          onChange={(ev) => setCopyFrom(ev.target.value)}
          disabled={isLoading}
        >
          <MenuItem value="none">(none)</MenuItem>
          {tasksWithChecklists.map(task => 
            task.checklists?.map(checklist => (
              <MenuItem 
                key={checklist.id} 
                value={checklist.id}
              >
                {`${task.title} - ${checklist.title}`}
              </MenuItem>
            ))
          )}
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