import React, { useState } from 'react'
import { Box, Typography, Button, TextField, IconButton } from '@mui/material'
import { styled } from '@mui/material/styles'

const StyledButton = styled(Button)({
  textTransform: 'none',
  padding: '6px 12px',
  fontSize: '14px',
  borderRadius: '3px',
  '&.MuiButton-contained': {
    backgroundColor: '#0079BF',
    '&:hover': {
      backgroundColor: '#026AA7'
    }
  }
})

const StyledIconButton = styled(IconButton)({
  color: '#172B4D',
  padding: '6px',
  borderRadius: '3px',
  '&:hover': {
    backgroundColor: '#091E420F'
  }
})

const StyledTextField = styled(TextField)({
  '& .MuiOutlinedInput-root': {
    fontSize: '14px',
    color: '#172B4D',
    backgroundColor: '#fff',
    '& fieldset': {
      borderColor: '#091E4224'
    }
  }
})

export function TaskDescription({ initialDescription = '' }) {
  const [isEditing, setIsEditing] = useState(false)
  const [description, setDescription] = useState(initialDescription)
  const [tempDescription, setTempDescription] = useState(initialDescription)

  function handleSave() {
    setDescription(tempDescription)
    setIsEditing(false)
  }

  if (isEditing) {
    return (
      <Box sx={{ border:'1px solid black', p: 1.5, borderRadius: '3px' }}>
        <Box sx={{ display: 'flex', gap: 0.5, mb: 1 }}>
          <StyledButton size="small" sx={{ bgcolor: 'transparent' }}>Aa</StyledButton>
          <StyledIconButton size="small"><strong>B</strong></StyledIconButton>
          <StyledIconButton size="small"><em>I</em></StyledIconButton>
          <StyledIconButton size="small" >...</StyledIconButton>
          <StyledIconButton size="small" >•</StyledIconButton>
          <StyledIconButton size="small" >🔗</StyledIconButton>
          <StyledIconButton size="small" >@</StyledIconButton>
          <StyledIconButton size='small' >+</StyledIconButton>
        </Box>
        <StyledTextField
          multiline
          fullWidth
          minRows={4}
          value={tempDescription}
          onChange={(ev) => setTempDescription(ev.target.value)}
          placeholder="Add a more detailed description..."
        />
        <Box sx={{ display: 'flex', gap: 1, mt: 1.5 }}>
          <StyledButton variant="contained" onClick={handleSave}>Save</StyledButton>
          <StyledButton onClick={() => setIsEditing(false)}>Cancel</StyledButton>
          <Box sx={{ flexGrow: 1 }} />
        </Box>
      </Box>
    )
  }

  return (
    <Box 
      onClick={() => setIsEditing(true)}
      sx={{ 
        p: 1.5, 
        cursor: 'pointer',
        '&:hover': { bgcolor: '#091E420F' }
      }}
    >
      <Typography sx={{ 
        fontSize: 14,
        color: description ? '#172B4D' : '#5E6C84',
        fontStyle: description ? 'normal' : 'italic'
      }}>
        {description || 'Add a more detailed description...'}
      </Typography>
    </Box>
  )
}