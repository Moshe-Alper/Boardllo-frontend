import React, { useState } from 'react'

import { TextField, Avatar, Checkbox, CircularProgress } from '@mui/material'
import { updateTask } from '../../../store/actions/board.actions'

// replace with API call later
const demoMembers = [
  { _id: 'u1', fullname: 'John Doe', username: 'johnd', imgUrl: '/api/placeholder/32/32' },
  { _id: 'u2', fullname: 'Jane Smith', username: 'janes', imgUrl: '/api/placeholder/32/32' },
  { _id: 'u3', fullname: 'Mike Johnson', username: 'mikej', imgUrl: '/api/placeholder/32/32' },
  { _id: 'u4', fullname: 'Sarah Wilson', username: 'sarahw', imgUrl: '/api/placeholder/32/32' }
]

export function MemberPicker({ task, boardId, groupId, onClose }) {
  const [searchTerm, setSearchTerm] = useState('')
  const [members] = useState(demoMembers)
  const [isLoading, setIsLoading] = useState(false)

  function getFilteredMembers() {
    return members.filter(member => 
      member.fullname.toLowerCase().includes(searchTerm.toLowerCase()) ||
      member.username.toLowerCase().includes(searchTerm.toLowerCase())
    )
  }

  async function toggleMember(memberId) {
    setIsLoading(true)
    try {
      const updatedMemberIds = task.memberIds?.includes(memberId)
        ? task.memberIds.filter(id => id !== memberId)
        : [...(task.memberIds || []), memberId]

      const updatedTask = {
        ...task,
        memberIds: updatedMemberIds
      }

      await updateTask(boardId, groupId, updatedTask)
    } catch (err) {
      console.error('Failed to update task members:', err)
    } finally {
      setIsLoading(false)
    }
  }

  function isMemberAssigned(memberId) {
    return task.memberIds?.includes(memberId) || false
  }

  function getInitials(fullname) {
    return fullname
      .split(' ')
      .map(name => name[0])
      .join('')
      .toUpperCase()
  }
  const filteredMembers = getFilteredMembers()

  return (
    <>
      <div className="members-search">
        <TextField
          fullWidth
          size="small"
          placeholder="Search members..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      <div className="members-list">
        <div className="members-list__header">
          Board members
        </div>

        {filteredMembers.map(member => (
          <div
            key={member._id}
            className="member-item"
            onClick={() => !isLoading && toggleMember(member._id)}
          >
            <div className="member-info">
              <Avatar src={member.imgUrl} alt={member.fullname}>
                {!member.imgUrl && getInitials(member.fullname)}
              </Avatar>
              <div className="member-details">
                <div className="member-name">{member.fullname}</div>
                <div className="member-username">@{member.username}</div>
              </div>
            </div>

            {isLoading ? (
              <CircularProgress size={20} className="member-loading" />
            ) : (
              <Checkbox
                checked={isMemberAssigned(member._id)}
                tabIndex={-1}
                disableRipple
              />
            )}
          </div>
        ))}
      </div>
    </>
  )
}
