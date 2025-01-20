import React, { useState } from 'react'
import Popover from '@mui/material/Popover'
import { svgService } from "../../services/svg.service"
import { onToggleModal } from "../../store/actions/app.actions"
import { TaskDetails } from "./TaskDetails"
import { TaskQuickActions } from "./TaskQuickActions"

export function TaskPreview({ task, boardId, group, isDragging }) {
    const [anchorEl, setAnchorEl] = useState(null)
    const isPopoverOpen = Boolean(anchorEl)

    function onOpenTaskDetails(ev) {
        if (ev.target.closest('.edit-icon-container')) return
        if (ev.target.closest('.MuiPopover-root')) return

        onToggleModal({
            cmp: TaskDetails,
            props: {
                group,
                task,
                onClose: onCloseTaskDetails,
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

    function onClosePopover() {
        setAnchorEl(null)
    }

    if (!task) return <div>Loading...</div>

    return (
        <article
            className={`task-preview flex column ${isDragging ? 'dragging' : ''}`}
            style={{
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