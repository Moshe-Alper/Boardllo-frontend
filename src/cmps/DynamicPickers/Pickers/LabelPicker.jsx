import React, { useState } from 'react'
import { svgService } from '../../../services/svg.service'
// Demo labels - replace with API call later
const defaultLabels = [
  { id: 'l1', title: 'Done', color: 'var(--label-done)' },
  { id: 'l2', title: 'To Do', color: 'var(--label-todo)' },
  { id: 'l3', title: 'Critical', color: 'var(--label-critical)' },
  { id: 'l4', title: 'Nice to do', color: 'var(--label-nice-to-do)' },
  { id: 'l5', title: 'In Progress', color: 'var(--label-in-progress)' }
]

export function LabelPicker({ task, boardId, groupId, onClose, onLabelUpdate }) {
  const [searchTerm, setSearchTerm] = useState('')
  const [labels] = useState(defaultLabels)
  const [isLoading, setIsLoading] = useState(false)

  function getFilteredLabels() {
    return labels.filter(label =>
      label.title.toLowerCase().includes(searchTerm.toLowerCase())
    )
  }

  async function toggleLabel(labelId) {
    setIsLoading(true)
    try {
      await onLabelUpdate(task.id, labelId)
    } catch (err) {
      console.log('Failed to update task labels:', err)
    } finally {
      setIsLoading(false)
    }
  }

  function isLabelAssigned(labelId) {
    return task.labelIds?.includes(labelId) || false
  }

  const filteredLabels = getFilteredLabels()

  return (
    <>
      <input
        type="text"
        placeholder="Search labels..."
        className="search-input"
        value={searchTerm}
        onChange={(ev) => setSearchTerm(ev.target.value)}
      />
      <h3 className="label-picker-title">Labels</h3>
      <ul>
        {filteredLabels.map(label => (
          <li key={label.id} className="label-item">
            
            <label className="label-container">
              <input
                type="checkbox"
                className="label-checkbox"
                checked={isLabelAssigned(label.id)}
                onChange={() => toggleLabel(label.id)}
              />
              <span className="checkmark"></span>

              <div
                className="label-color"
                style={{
                  backgroundColor: label.color,
                }}
              >
                <span className="label-title">{label.title}</span>
              </div>
              <button className="edit-button">
              <img src={svgService.pencilIcon} alt="Edit Icon" />
              </button>

            </label>

          </li>
        ))}
      </ul>

      {/* <button className="create-label-button">
        Create a new label
      </button> */}

    </>
  )
}
