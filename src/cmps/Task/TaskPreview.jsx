import React from 'react'
import { svgService } from "../../services/svg.service"
import { onToggleModal } from "../../store/actions/app.actions"
import { TaskDetails } from "./TaskDetails"
import { TaskQuickActions } from "./TaskQuickActions"

export function TaskPreview({ task, isDragging }) {
    const hasCover = !!task.style.coverColor

    function onOpenTaskDetails(ev) {
        if (ev.target.closest('.edit-icon-container')) return

        onToggleModal({
            cmp: TaskDetails,
            props: { task }
        })
    }

    function onOpenQuickActions(ev) {
        ev.stopPropagation()
        onToggleModal({
            cmp: TaskQuickActions,
            props: { task }
        })
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
                <div className="edit-icon" onClick={onOpenQuickActions}>
                    <img src={svgService.pencilIcon} alt="Edit Icon" />
                </div>
            </div>
        </article>
    )
}