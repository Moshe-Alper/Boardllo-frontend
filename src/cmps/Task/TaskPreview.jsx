import React from 'react'
import { svgService } from "../../services/svg.service"

export function TaskPreview({ task, isDragging }) {
    const hasCover = !!task.style.coverColor

    return (
        <article
            className={`task-preview flex column ${isDragging ? 'dragging' : ''} ${hasCover ? 'has-cover' : ''}`}
            style={{
                '--cover-color': hasCover ? task.style.coverColor : 'transparent',
                opacity: isDragging ? 0.5 : 1,
                transform: isDragging ? 'scale(1.02)' : 'scale(1)',
                transition: 'all 0.2s ease'
            }}
        >
            <p>{task.title}</p>
            <div className="edit-icon-container">
                <div className="edit-icon">
                    <img src={svgService.pencilIcon} alt="Edit Icon" />
                </div>
            </div>
        </article>
    )
}