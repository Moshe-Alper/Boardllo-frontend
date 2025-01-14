import React, { useState } from 'react'
import Popover from '@mui/material/Popover'
import { svgService } from "../../services/svg.service"
import { onToggleModal } from "../../store/actions/app.actions"
import { TaskDetails } from "./TaskDetails"
import { TaskQuickActions } from "./TaskQuickActions"

export function TaskPreview({ task, isDragging }) {
    const [anchorEl, setAnchorEl] = useState(null)
    const isPopoverOpen = Boolean(anchorEl)

    const hasCover = !!task?.style?.coverColor

    function onOpenTaskDetails(ev) {
        if (ev.target.closest('.edit-icon-container')) return

        onToggleModal({
            cmp: TaskDetails,
            props: { task }
        })
    }

    function onOpenPopover(ev) {
        ev.stopPropagation()
        setAnchorEl(ev.currentTarget)
    }

    function onClosePopover(ev) {
        ev.stopPropagation()
        setAnchorEl(null)
    }

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
            >
                <TaskQuickActions task={task} onClose={onClosePopover} />
            </Popover>
        </article>
    )
}