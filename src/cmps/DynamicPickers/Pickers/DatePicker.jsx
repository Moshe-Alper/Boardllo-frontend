import React, { useState } from 'react'
import { TextField, Select, MenuItem } from '@mui/material'
import { LocalizationProvider, DateCalendar } from '@mui/x-date-pickers'
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs'
import { updateTask } from '../../../store/actions/board.actions'
import dayjs from 'dayjs'

export function DatePicker({ task, boardId, groupId, onClose }) {
  const [selectedDate, setSelectedDate] = useState(
    task.dueDate ? dayjs(task.dueDate) : null
  )
  const [dueTime, setDueTime] = useState(
    task.dueDate ? dayjs(task.dueDate).format('HH:mm') : ''
  )
  const [reminder, setReminder] = useState('none')
  const [isLoading, setIsLoading] = useState(false)

  async function handleSave() {
    if (!selectedDate) return

    setIsLoading(true)
    try {
      const date = dueTime 
        ? selectedDate.hour(dueTime.split(':')[0]).minute(dueTime.split(':')[1])
        : selectedDate

      const updatedTask = {
        ...task,
        dueDate: date.toISOString(),
        reminder
      }

      await updateTask(boardId, groupId, updatedTask)
      onClose()
    } catch (err) {
      console.error('Failed to update task date:', err)
    } finally {
      setIsLoading(false)
    }
  }

  async function handleRemove() {
    setIsLoading(true)
    try {
      const updatedTask = {
        ...task,
        dueDate: null,
        reminder: 'none'
      }
      await updateTask(boardId, groupId, updatedTask)
      onClose()
    } catch (err) {
      console.error('Failed to remove dates:', err)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="picker-content">
      <LocalizationProvider dateAdapter={AdapterDayjs}>
        <DateCalendar
          value={selectedDate}
          onChange={setSelectedDate}
          disabled={isLoading}
          className="calendar"
        />
      </LocalizationProvider>

      {selectedDate && (
        <>
          <div className="form-group">
            <TextField
              type="time"
              size="small"
              fullWidth
              value={dueTime}
              onChange={(e) => setDueTime(e.target.value)}
              disabled={isLoading}
            />
          </div>

          <div className="form-group">
            <label>Set due date reminder</label>
            <Select
              fullWidth
              size="small"
              value={reminder}
              onChange={(e) => setReminder(e.target.value)}
              disabled={isLoading}
            >
              <MenuItem value="none">None</MenuItem>
              <MenuItem value="15">15 Minutes before</MenuItem>
              <MenuItem value="30">30 Minutes before</MenuItem>
              <MenuItem value="60">1 Hour before</MenuItem>
              <MenuItem value="1440">1 Day before</MenuItem>
            </Select>
          </div>

          <div className="reminder-text">
            Reminders will be sent to all members and watchers of this card.
          </div>
        </>
      )}

      <div className="button-group">
        <button 
          className="primary-button" 
          onClick={handleSave}
          disabled={isLoading}
        >
          Save
        </button>
        <button 
          className="secondary-button"
          onClick={handleRemove}
          disabled={isLoading}
        >
          Remove
        </button>
      </div>
    </div>
  )
}