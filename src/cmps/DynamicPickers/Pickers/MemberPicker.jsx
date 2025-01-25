import React, { useState } from 'react'
import { svgService } from '../../../services/svg.service'

export function MemberPicker({ initialTask, board, onMemberUpdate }) {
    const [searchTerm, setSearchTerm] = useState('')
    const [cardMembers, setCardMembers] = useState(initialTask.memberIds || [])
    
    function handleMemberToggle(memberId) {
        const isCurrentlyCardMember = cardMembers.includes(memberId)
        const newCardMembers = isCurrentlyCardMember
            ? cardMembers.filter(id => id !== memberId)
            : [...cardMembers, memberId]
            
        setCardMembers(newCardMembers)
        onMemberUpdate(initialTask.id, memberId)
    }

    function getFilteredMembers(members) {
        return members.filter(member =>
            member.fullname.toLowerCase().includes(searchTerm.toLowerCase())
        )
    }

    const boardMembers = board.members || []
    const cardMembersList = boardMembers.filter(member => cardMembers.includes(member._id))
    const availableBoardMembers = boardMembers.filter(member => !cardMembers.includes(member._id))

    return (
        <div className="member-picker">
            <input
                type="text"
                placeholder="Search members..."
                className="search-input"
                value={searchTerm}
                onChange={(ev) => setSearchTerm(ev.target.value)}
            />

            {cardMembersList.length > 0 && (
                <>
                    <h3 className="picker-title">Card Members</h3>
                    <ul className="members-list">
                        {getFilteredMembers(cardMembersList).map(member => (
                            <li key={member._id} className="member-item">
                                <div className="member-details"
                                 onClick={() => handleMemberToggle(member._id)}
                                >
                                    <div className="member-avatar">
                                      
                                        <img src={member.imgUrl} alt={member.fullname} />
                                    </div>
                                    <span className="member-name">{member.fullname}</span>
                                    <button 
                                        className="remove-member"
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
                                onClick={() => handleMemberToggle(member._id)}
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