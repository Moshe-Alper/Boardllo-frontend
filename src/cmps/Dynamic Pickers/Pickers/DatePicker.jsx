import React, { useState } from 'react';
import { TextField, IconButton } from '@mui/material';
import { LocalizationProvider, DateCalendar } from '@mui/x-date-pickers';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { updateTask } from '../../../store/actions/board.actions';
import dayjs from 'dayjs';

export function DatePicker({ task, boardId, groupId, onClose }) {
  const [selectedDate, setSelectedDate] = useState(
    task.dueDate ? dayjs(task.dueDate) : null
  );
  const [isLoading, setIsLoading] = useState(false);

  async function handleDateChange(date) {
    if (!date) return;
    
    setIsLoading(true);
    try {
      const updatedTask = {
        ...task,
        dueDate: date.toISOString()
      };

      await updateTask(boardId, groupId, updatedTask);
      setSelectedDate(date);
    } catch (err) {
      console.error('Failed to update task date:', err);
    } finally {
      setIsLoading(false);
    }
  }

  function handleRemoveDate() {
    handleDateChange(null);
  }

  return (
    <div className="date-picker">
      <div className="date-picker__header">
        <div className="selected-date">
          {selectedDate && (
            <>
              <span className="date-display">
                {selectedDate.format('MMM D, YYYY')}
              </span>
              <IconButton 
                className="remove-date" 
                onClick={handleRemoveDate}
                disabled={isLoading}
                size="small"
              >
                ×
              </IconButton>
            </>
          )}
        </div>
      </div>

      <LocalizationProvider dateAdapter={AdapterDayjs}>
        <DateCalendar
          value={selectedDate}
          onChange={handleDateChange}
          disabled={isLoading}
          className="calendar"
          disablePast
        />
      </LocalizationProvider>

      <div className="quick-select-buttons">
        <button 
          className="quick-select-btn"
          onClick={() => handleDateChange(dayjs())}
          disabled={isLoading}
        >
          Today
        </button>
        <button 
          className="quick-select-btn"
          onClick={() => handleDateChange(dayjs().add(1, 'day'))}
          disabled={isLoading}
        >
          Tomorrow
        </button>
        <button 
          className="quick-select-btn"
          onClick={() => handleDateChange(dayjs().add(7, 'day'))}
          disabled={isLoading}
        >
          Next week
        </button>
      </div>

      {selectedDate && (
        <div className="time-select">
          <TextField
            type="time"
            size="small"
            value={selectedDate.format('HH:mm')}
            onChange={(e) => {
              const [hours, minutes] = e.target.value.split(':');
              const newDate = selectedDate.hour(parseInt(hours)).minute(parseInt(minutes));
              handleDateChange(newDate);
            }}
            disabled={isLoading}
            InputLabelProps={{
              shrink: true,
            }}
            inputProps={{
              step: 300, // 5 min
            }}
          />
        </div>
      )}
    </div>
  );
}