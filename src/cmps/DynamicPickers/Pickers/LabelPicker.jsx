import React, { useState } from 'react'
import { TextField, Checkbox } from '@mui/material'
import { updateTask } from '../../../store/actions/board.actions'

// Demo labels - replace with API call later
const defaultLabels = [
  { id: 'l1', title: 'Done', color: '#8DD48D' },
  { id: 'l2', title: 'To Do', color: '#F2D675' },
  { id: 'l3', title: 'Critical', color: '#C65F5F' },
  { id: 'l4', title: 'Nice to do', color: '#E6D7F5' },
  { id: 'l5', title: 'In Progress', color: '#77A7FF' }
]

export function LabelPicker({ task, boardId, groupId, onClose }) {
  const [searchTerm, setSearchTerm] = useState('')
  const [labels] = useState(defaultLabels)
  const [isLoading, setIsLoading] = useState(false)
  const [isColorblindMode, setIsColorblindMode] = useState(false)

  function getFilteredLabels() {
    return labels.filter(label =>
      label.title.toLowerCase().includes(searchTerm.toLowerCase())
    )
  }

  async function toggleLabel(labelId) {
    setIsLoading(true)
    try {
      const updatedLabelIds = task.labelIds?.includes(labelId)
        ? task.labelIds.filter(id => id !== labelId)
        : [...(task.labelIds || []), labelId]

      const updatedTask = {
        ...task,
        labelIds: updatedLabelIds
      }

      await updateTask(boardId, groupId, updatedTask)
    } catch (err) {
      console.error('Failed to update task labels:', err)
    } finally {
      setIsLoading(false)
    }
  }

  function isLabelAssigned(labelId) {
    return task.labelIds?.includes(labelId) || false
  }

  const filteredLabels = getFilteredLabels()

  return (
    <div className="label-picker">
      <div className="labels-search">
        <TextField
          fullWidth
          size="small"
          placeholder="Search labels..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      <div className="labels-list">
        <div className="labels-list__header">
          Labels
        </div>

        {filteredLabels.map(label => (
          <div
            key={label.id}
            className="label-item"
            onClick={() => !isLoading && toggleLabel(label.id)}
          >
            <div className="label-info">
              <div 
                className="label-color" 
                style={{ 
                  backgroundColor: label.color,
                  border: isColorblindMode ? '1px solid #ddd' : 'none'
                }}
              />
              <div className="label-title">{label.title}</div>
            </div>

            <div className="label-actions">
              <Checkbox
                checked={isLabelAssigned(label.id)}
                tabIndex={-1}
                disableRipple
              />
              <button className="edit-button">
                <span className="edit-icon">✎</span>
              </button>
            </div>
          </div>
        ))}

        <button className="create-label-button">
          Create a new label
        </button>

        <button 
          className="colorblind-toggle"
          onClick={() => setIsColorblindMode(!isColorblindMode)}
        >
          Enable colorblind friendly mode
        </button>
      </div>
    </div>
  )
}