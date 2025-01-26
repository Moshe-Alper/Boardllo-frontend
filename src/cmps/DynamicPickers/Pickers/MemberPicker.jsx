import React, { useState, useEffect } from 'react'
import { svgService } from '../../../services/svg.service'

export function MemberPicker({ initialTask, onMemberUpdate, boardMembers }) {
    const [searchTerm, setSearchTerm] = useState('')
    const [currentMemberIds, setCurrentMemberIds] = useState(initialTask?.memberIds || [])

    useEffect(() => {
        setCurrentMemberIds(initialTask?.memberIds || [])
    }, [initialTask?.memberIds])

    function getFilteredMembers(members) {
        return members.filter(member =>
            member.fullname.toLowerCase().includes(searchTerm.toLowerCase())
        )
    }

    function handleMemberUpdate(memberId) {
        const updatedMembers = currentMemberIds.includes(memberId)
            ? currentMemberIds.filter(id => id !== memberId)
            : [...currentMemberIds, memberId]
        setCurrentMemberIds(updatedMembers)
        onMemberUpdate(updatedMembers)
    }

    const taskMembersList = boardMembers.filter(member => currentMemberIds.includes(member._id))
    const availableBoardMembers = boardMembers.filter(member => !currentMemberIds.includes(member._id))

    return (
        <div className="member-picker">
            <input
                type="text"
                placeholder="Search members..."
                className="search-input"
                value={searchTerm}
                onChange={(ev) => setSearchTerm(ev.target.value)}
            />

            {taskMembersList.length > 0 && (
                <>
                    <h3 className="picker-title">Task Members</h3>
                    <ul className="members-list">
                        {getFilteredMembers(taskMembersList).map(member => (
                            <li key={member._id} className="member-item">
                                <div className="member-details">
                                    <div className="member-avatar">
                                        <img src={member.imgUrl} alt={member.fullname} />
                                    </div>
                                    <span className="member-name">{member.fullname}</span>
                                    <button
                                        className="remove-member"
                                        onClick={(ev) => {
                                            ev.stopPropagation()
                                            handleMemberUpdate(member._id)
                                        }}
                                    >
                                        <img src={svgService.closeIcon} alt="Remove member" />
                                    </button>
                                </div>
                            </li>
                        ))}
                    </ul>
                </>
            )}

            {availableBoardMembers.length > 0 && (
                <>
                    <h3 className="picker-title">Board Members</h3>
                    <ul className="members-list">
                        {getFilteredMembers(availableBoardMembers).map(member => (
                            <li
                                key={member._id}
                                className="member-item"
                                onClick={() => handleMemberUpdate(member._id)}
                            >
                                <div className="member-details">
                                    <div className="member-avatar">
                                        <img src={member.imgUrl} alt={member.fullname} />
                                    </div>
                                    <span className="member-name">{member.fullname}</span>
                                </div>
                            </li>
                        ))}
                    </ul>
                </>
            )}
        </div>
    )
}