import React, { useState, useEffect } from 'react'
import { TextField, Select, MenuItem, Button } from '@mui/material'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import dayjs from 'dayjs'

export function DatePicker({ initialTask, onDateUpdate, onClose }) {
  const [currentDate, setCurrentDate] = useState(
    initialTask?.dueDate ? dayjs(initialTask.dueDate) : dayjs('2025-02-02')
  )
  const [startDate, setStartDate] = useState('')
  const [dueTime, setDueTime] = useState('10:26')
  const [reminder, setReminder] = useState('none')

  useEffect(function() {
    if (initialTask?.dueDate) {
      const taskDate = dayjs(initialTask.dueDate)
      setCurrentDate(taskDate)
      setDueTime(taskDate.format('HH:mm'))
    }
  }, [initialTask?.dueDate])

  function getDaysInMonth(date) {
    const daysInMonth = date.daysInMonth()
    const firstDayOfMonth = date.startOf('month').day()
    const prevMonthDays = Array.from({ length: firstDayOfMonth }, function(_, i) {
      return {
        day: date.subtract(1, 'month').daysInMonth() - firstDayOfMonth + i + 1,
        isPrevMonth: true
      }
    })
    
    const currentMonthDays = Array.from({ length: daysInMonth }, function(_, i) {
      return {
        day: i + 1,
        isCurrentMonth: true
      }
    })
    
    const nextMonthDays = Array.from({ length: 42 - daysInMonth - firstDayOfMonth }, function(_, i) {
      return {
        day: i + 1,
        isNextMonth: true
      }
    })
    
    return [...prevMonthDays, ...currentMonthDays, ...nextMonthDays]
  }

  function handlePrevMonth() {
    setCurrentDate(currentDate.subtract(1, 'month'))
  }

  function handleNextMonth() {
    setCurrentDate(currentDate.add(1, 'month'))
  }

  function handleDateClick(day) {
    let newDate
    if (day.isCurrentMonth) {
      newDate = currentDate.date(day.day)
    } else if (day.isPrevMonth) {
      newDate = currentDate.subtract(1, 'month').date(day.day)
    } else {
      newDate = currentDate.add(1, 'month').date(day.day)
    }
    setCurrentDate(newDate)
  }

  function handleStartDateChange(e) {
    setStartDate(e.target.value)
  }

  function handleTimeChange(e) {
    setDueTime(e.target.value)
  }

  function handleReminderChange(e) {
    setReminder(e.target.value)
  }

  function handleSave() {
    const [hours, minutes] = dueTime.split(':')
    const dueDate = currentDate
      .hour(parseInt(hours))
      .minute(parseInt(minutes))
      .toDate()

    onDateUpdate(dueDate)
    onClose()
  }

  function handleRemove() {
    onDateUpdate(null)
    onClose()
  }

  return (
    <div className="date-picker-content">
      <div className="calendar-header">
        <ChevronLeft 
          className="month-nav-btn"
          onClick={handlePrevMonth}
        />
        <span className="current-month">
          {currentDate.format('MMMM YYYY')}
        </span>
        <ChevronRight 
          className="month-nav-btn"
          onClick={handleNextMonth}
        />
      </div>

      <div className="calendar-grid">
        <div className="weekdays">
          {['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'].map(function(day) {
            return (
              <div key={day} className="weekday">{day}</div>
            )
          })}
        </div>

        <div className="days">
          {getDaysInMonth(currentDate).map(function(day, index) {
            return (
              <button
                key={index}
                className={`day-btn ${day.isCurrentMonth ? 'current' : 'other-month'} ${currentDate.date() === day.day && day.isCurrentMonth ? 'selected' : ''}`}
                onClick={function() { handleDateClick(day) }}
              >
                {day.day}
              </button>
            )
          })}
        </div>
      </div>

      <div className="date-fields">
        <div className="field-group">
          <label>Start date</label>
          <TextField
            placeholder="D/M/YYYY"
            size="small"
            fullWidth
            className="start-date-input"
            value={startDate}
            onChange={handleStartDateChange}
          />
        </div>

        <div className="field-group">
          <label>Due date</label>
          <div className="due-date-group">
            <TextField
              value={currentDate.format('DD/MM/YYYY')}
              size="small"
              className="date-input"
            />
            <TextField
              type="time"
              value={dueTime}
              onChange={handleTimeChange}
              size="small"
              className="time-input"
            />
          </div>
        </div>

        <div className="field-group">
          <label>Set due date reminder</label>
          <Select
            value={reminder}
            onChange={handleReminderChange}
            size="small"
            fullWidth
          >
            <MenuItem value="none">None</MenuItem>
            <MenuItem value="15">15 Minutes before</MenuItem>
            <MenuItem value="30">30 Minutes before</MenuItem>
            <MenuItem value="60">1 Hour before</MenuItem>
            <MenuItem value="1440">1 Day before</MenuItem>
          </Select>
        </div>

        <p className="reminder-text">
          Reminders will be sent to all members and watchers of this card.
        </p>

        <div className="button-group">
          <Button 
            variant="contained" 
            fullWidth 
            className="save-btn"
            onClick={handleSave}
          >
            Save
          </Button>
          <Button 
            variant="outlined" 
            fullWidth
            className="remove-btn"
            onClick={handleRemove}
          >
            Remove
          </Button>
        </div>
      </div>
    </div>
  )
}