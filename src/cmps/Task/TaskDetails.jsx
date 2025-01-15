import React, { useEffect } from 'react'
import { svgService } from "../../services/svg.service"

export function TaskDetails({ task, onClose }) {
    if (!task) return <div>Loading...</div>

    function handleEscape(ev) {
        if (ev.key === 'Escape') {
            onClose()
        }
    }

    function handleOverlayClick(ev) {
        if (ev.target === ev.currentTarget) {
            onClose()
        }
    }

    useEffect(() => {
        document.addEventListener('keydown', handleEscape)
        return () => {
            document.removeEventListener('keydown', handleEscape)
        }
    }, [])

    return (
        <div className="task-details-overlay" onClick={handleOverlayClick}>
            <div className="task-details">
                <header className="details-header">
                    <h2>{task.title}</h2>
                    <div className="close-task-icon" onClick={onClose}>
                        <img src={svgService.closeIcon} alt="Close Icon" />
                    </div>
                </header>

                <div className="details-grid">
                    <div className="main-content">
                        <section className="description-section">
                            <h3>Description</h3>
                            <div className={`description-content ${!task.description ? 'empty' : ''}`}>
                                {task.description || 'Add a more detailed description...'}
                            </div>
                        </section>

                        <section className="activity-section">
                            <h3>Activity</h3>
                            <div className="activity-content">
                                <div className="no-activity">No activity yet...</div>
                            </div>
                        </section>
                    </div>

                    <aside className="sidebar">
                        <div className="actions-list">
                            <h3>Add to card</h3>
                            <div className="action-buttons">
                                <button>Members</button>
                                <button>Labels</button>
                                <button>Checklist</button>
                                <button>Dates</button>
                                <button>Attachment</button>
                            </div>
                        </div>
                    </aside>
                </div>
            </div>
        </div>
    )
}
