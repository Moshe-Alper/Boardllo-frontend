import React, { useState } from 'react'
import Popover from '@mui/material/Popover'
import { svgService } from "../../services/svg.service"
import { onToggleModal } from "../../store/actions/app.actions"
import { TaskDetails } from "./TaskDetails"
import { TaskQuickActions } from "./TaskQuickActions"
import { updateTask } from '../../store/actions/board.actions'

export function TaskPreview({ task, boardId, groupId, isDragging }) {
    const [anchorEl, setAnchorEl] = useState(null)
    const isPopoverOpen = Boolean(anchorEl)

    const hasCover = task?.style?.coverColor ? true : false

    function onOpenTaskDetails(ev) {
        if (ev.target.closest('.edit-icon-container')) return
        if (ev.target.closest('.MuiPopover-root')) return

        onToggleModal({
            cmp: TaskDetails,
            props: {
                task,
                onClose: onCloseTaskDetails,
                onCoverColorSelect: handleCoverColorSelect
            }
        })
    }

    function onCloseTaskDetails() {
        onToggleModal()
    }

    function onOpenPopover(ev) {
        ev.stopPropagation()
        setAnchorEl(ev.currentTarget)
    }

    function onClosePopover() {  // Removed ev parameter since it's not being used
        setAnchorEl(null)
    }

    async function handleCoverColorSelect(color) {
        const updatedTask = {
            ...task,
            style: {
                ...task.style,
                coverColor: color
            }
        }

        try {
            await updateTask(boardId, groupId, updatedTask)
        } catch (err) {
            console.log('Failed to update task cover color:', err)
        }
    }

    if (!task) return <div>Loading...</div>

    return (
        <article
            className={`task-preview flex column ${isDragging ? 'dragging' : ''} ${hasCover ? 'has-cover' : ''}`}
            style={{
                '--cover-color': hasCover ? task.style.coverColor : 'transparent',
                opacity: isDragging ? 0.5 : 1,
                transform: isDragging ? 'scale(1.02)' : 'scale(1)',
                transition: 'all 0.2s ease'
            }}
            onClick={onOpenTaskDetails}
        >
            <p>{task.title}</p>
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
                onClick={(ev) => ev.stopPropagation()} // Add stopPropagation here
            >
                <TaskQuickActions
                    task={task}
                    onClose={onClosePopover}
                    onCoverColorSelect={handleCoverColorSelect}
                />
            </Popover>
        </article>
    )
}