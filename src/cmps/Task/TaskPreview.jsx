import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useSelector } from 'react-redux'
import Popover from '@mui/material/Popover'
import { svgService } from "../../services/svg.service"
import { TaskQuickActions } from "./TaskQuickActions"
import { boardService } from '../../services/board'

export function TaskPreview({ task, boardId, isDragging }) {

    if (!task?.id || !task?.title) {
        // console.log('TaskPreview: Invalid task data - missing required fields', task)
        return null
    }

    const [anchorEl, setAnchorEl] = useState(null)
    const isPopoverOpen = Boolean(anchorEl)
    const navigate = useNavigate()
    const labels = boardService.getDefaultLabels()
    const boardMembers = useSelector(storeState => storeState.boardModule.board.members) || []

    function onOpenTaskDetails(ev) {
        if (ev.target.closest('.edit-icon-container')) return
        if (ev.target.closest('.MuiPopover-root')) return
        navigate(`/board/${boardId}/${task.id}`)
    }

    function onOpenPopover(ev) {
        ev.stopPropagation()
        setAnchorEl(ev.currentTarget)
    }

    function onClosePopover() {
        setAnchorEl(null)
    }

    return (
        <article
            className={`task-preview flex column ${isDragging ? 'dragging' : ''} ${task.style?.coverColor ? 'has-cover' : ''}`}
            style={{
                opacity: isDragging ? 0.5 : 1,
                transform: isDragging ? 'scale(1.02)' : 'scale(1)',
                transition: 'all 0.2s ease',
                '--cover-color': task.style?.coverColor || 'transparent',
            }}
            onClick={onOpenTaskDetails}
        >

            {task.labelIds?.length > 0 && (
                <div className='task-labels'>
                    {task.labelIds?.map(labelId => {
                        const label = labels.find(l => l.id === labelId)
                        if (!label) return null
                        return (
                            <div
                                key={labelId}
                                className="task-label"
                                style={{ backgroundColor: label.color }}
                                title={label.title}
                            >
                                <span>{label.title}</span>
                            </div>
                        )
                    })}
                </div>
            )}
            <p>{task.title}</p>

            <div className="task-preview-bottom">
            {task.description && (
            <span className="desc-icon-container" title="This card has a description">
                <img src={svgService.descriptionIcon} alt="Description" className='desc-icon' />
            </span>
            )}

            {task.checklists?.length > 0 && (
                <span className="checklist-status" title="Checklist items complete">
                    <span className="checklist-icon-container">
                    <img src={svgService.checklistIcon} alt="Checklist" className='checklist-icon' />
                    </span>
                    <span>{task.checklists.reduce((acc, list) => acc + list.todos.filter(todo => todo.isDone).length, 0)}
                    /{task.checklists.reduce((acc, list) => acc + list.todos.length, 0)}</span>
                </span>
            )}

            {task.memberIds?.length > 0 && (
                <div className="task-members">
                    {task.memberIds.map(memberId => {
                            const member = boardMembers.find(m => m._id === memberId)
                            if (!member) return null
                            return (
                                <button
                                    key={memberId}
                                    className="task-member"
                                    title={member.fullname}
                                >
                                    <span>
                                        <img src={member.imgUrl} alt={member.fullname} />
                                    </span>
                                </button>
                            )
                        })}
                    </div>
                )}
            </div>


            
            <div className="edit-icon-container">
                <div className="edit-icon" onClick={onOpenPopover}>
                    <img src={svgService.pencilIcon} alt="Edit Icon" />
                </div>
            </div>

            <Popover
                open={isPopoverOpen}
                anchorEl={anchorEl}
                onClose={onClosePopover}
                anchorOrigin={{
                    vertical: 'top',
                    horizontal: 'left',
                }}
                transformOrigin={{
                    vertical: 'top',
                    horizontal: 'left',
                }}
                onClick={(ev) => ev.stopPropagation()}
            >
                <TaskQuickActions
                    task={task}
                    onClose={onClosePopover}
                />
            </Popover>
        </article>
    )
}