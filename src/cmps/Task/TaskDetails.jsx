import React from 'react'
import { svgService } from "../../services/svg.service"
import { onToggleModal } from '../../store/actions/app.actions'

export function TaskDetails({ task }) {
    return (
        <div className="task-details">
            <header className="details-header">
                <h2>{task.title}</h2>
                <div className="close-task-icon" onClick={() => onToggleModal()}>
                    <img src={svgService.closeIcon} alt="Close Icon"/>
                </div>
            </header>
            <div className="details-grid">
                <div className="main-content">
                    <section className="description-section">
                        <h3>Description</h3>
                        {task.description || 'Add a more detailed description...'}
                    </section>

                    <section className="activity-section">
                        <h3>Activity</h3>
                        {/* Activity/comments list */}
                    </section>
                </div>

                <aside className="sidebar">
                    <div className="actions-list">
                        <h3>Add to card</h3>
                        {/* Actions like Members, Labels, Checklist, etc */}
                    </div>
                </aside>
            </div>
        </div>
    )
}
