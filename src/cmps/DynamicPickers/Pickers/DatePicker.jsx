import React, { useState } from 'react'
import { TextField, Select, MenuItem } from '@mui/material'
import { LocalizationProvider, DateCalendar } from '@mui/x-date-pickers'
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs'
import dayjs from 'dayjs'

export function DatePicker({ initialTask, onDateUpdate }) {
  const [selectedDate, setSelectedDate] = useState(null)
  const [dueTime, setDueTime] = useState('')
  const [reminder, setReminder] = useState('none')
  const [isLoading, setIsLoading] = useState(false)

function handleDateSave(date) {
  setIsLoading(true)
  const updatedDate = selectedDate ? dayjs(selectedDate).format('YYYY-MM-DD') : null

  const updatedTask = {
    ...initialTask,
    dueDate: updatedDate,
    reminder: reminder === 'none' ? null : reminder,
  }

  onDateUpdate(updatedTask)
  setIsLoading(false)
}


function handleDateRemove() {  
  setIsLoading(true)
  const updatedTask = {
    ...initialTask,
    dueDate: null,
    reminder: null,
  } 
  onDateUpdate(updatedTask)
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
              onChange={(ev) => setDueTime(ev.target.value)}
              disabled={isLoading}
            />
          </div>

          <div className="form-group">
            <label>Set due date reminder</label>
            <Select
              fullWidth
              size="small"
              value={reminder}
              onChange={(ev) => setReminder(ev.target.value)}
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
          onClick={handleDateSave}
          disabled={isLoading}
        >
          Save
        </button>
        <button 
          className="secondary-button"
          onClick={handleDateRemove}
          disabled={isLoading}
        >
          Remove
        </button>
      </div>
    </div>
  )
}

