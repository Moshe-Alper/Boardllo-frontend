import React, { useState } from 'react'
import { TextField, Select, MenuItem } from '@mui/material'
import { updateTask } from '../../../store/actions/board.actions'

export function ChecklistPicker({ initialTask, onChecklistUpdate, board }) {
  const [title, setTitle] = useState('Checklist')
  const [copyFrom, setCopyFrom] = useState('none')
  const [isLoading, setIsLoading] = useState(false)
  const groups = board.groups
  const task = groups.find(group => group.tasks.find(task => task.id === initialTask.id))

  function handleSubmit(ev) {
    ev.preventDefault()
    setIsLoading(true)
    const newChecklist = {
      id: Date.now(),
      title,
      items: [],
    }
  
    if (copyFrom !== 'none') {
      const checklistToCopy = initialTask.checklists.find(
        (checklist) => checklist.id === copyFrom
      )
      newChecklist.items = checklistToCopy.items.map((item) => ({
        ...item,
        id: Date.now(),
      }))
    } else {
      newChecklist.items = [
        { id: Date.now(), title: 'First item', isDone: false },
      ]
    }

    const updatedTask = {
      ...initialTask,
      checklists: [...initialTask.checklists, newChecklist],
    }
    onChecklistUpdate(updatedTask)
    setIsLoading(false)
    
      // Log group titles and task titles
      groups.forEach(group => {
        console.log(`Group: ${group.title}`)
        group.tasks.forEach(task => {
          console.log(`  Task: ${task.title}`)
        })
      })
  }

  // Populate the Select options with group titles and task titles
  const selectOptions = groups.flatMap(group => 
    group.tasks.map(task => ({
      groupTitle: group.title,
      taskTitle: task.title,
      taskId: task.id
    }))
  )

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