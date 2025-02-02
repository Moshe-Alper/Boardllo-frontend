import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useSelector } from 'react-redux'
import Popover from '@mui/material/Popover'
import { svgService } from "../../services/svg.service"
import { TaskQuickActions } from "./TaskQuickActions"
import { boardService } from '../../services/board'
import { Droppable } from 'react-beautiful-dnd'
import { getDueStatus } from '../../services/util.service'

export function TaskPreview({ task, boardId, isDragging }) {

    if (!task?.id || !task?.title) {
        console.log('TaskPreview: Invalid task data - missing required fields', task)
        return null
    }
    const loggedInUserId = userService.getLoggedinUser()._id
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
        <Droppable droppableId={`task-${task.id}`} type="member">
            {(provided, snapshot) => (
                <article
                    ref={provided.innerRef}
                    {...provided.droppableProps}
                    className={`task-preview flex column ${isDragging ? 'dragging' : ''} ${task.style?.coverColor ? 'has-cover' : ''
                        } ${snapshot.isDraggingOver ? 'drag-over' : ''}`}
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

                        {task.watchers?.includes(loggedInUserId) && (
                            <span className="watch-icon-container" title="You are watching this card">
                                <img src={svgService.watchIcon} alt="Watching" className='watch-icon' />
                            </span>
                        )}

                        {task.description && (
                            <span className="desc-icon-container" title="This card has a description">
                                <img src={svgService.descriptionIcon} alt="Description" className='desc-icon' />
                            </span>
                        )}

                        {task.dueDate && (
                            <span className={`due-date ${getDueStatus(task.dueDate).status}`}>
                                <span className="due-date-icon-container">
                                    <img src={svgService.clockIcon} alt="Due date" className='due-date-icon' />
                                </span>
                                <span className="due-date-text">{getDueStatus(task.dueDate).text}</span>
                            </span>
                        )}

                        {task.comments?.length > 0 && (
                            <span className="comment-icon-container" title="Comments on this card">
                                <span className="comment-icon-wrapper">
                                    <img src={svgService.commentIcon} alt="Comments" className='comment-icon' />
                                </span>
                                <span className="comment-count">{task.comments.length}</span>
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
                    {provided.placeholder}
                </article>
            )}
        </Droppable>
    )
}