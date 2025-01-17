import React, { useEffect, useState } from 'react'
import { svgService } from "../../services/svg.service"
import { showErrorMsg, showSuccessMsg } from '../../services/event-bus.service'
import { updateTask, loadBoard } from '../../store/actions/board.actions'

export function TaskDetails({ task, onClose, onCoverColorSelect, board }) {
    const [isEditingTitle, setIsEditingTitle] = useState(false)
    const [editedTitle, setEditedTitle] = useState(task?.title || '')
    const [isEditingDescription, setIsEditingDescription] = useState(false)
    const [editedDescription, setEditedDescription] = useState(task?.description || '')
    const [comment, setComment] = useState('')

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

    async function handleTitleBlur() {
        if (!editedTitle.trim()) {
            setEditedTitle(task.title)
            setIsEditingTitle(false)
            showErrorMsg('Title cannot be empty')
            return
        }

        if (editedTitle === task.title) {
            setIsEditingTitle(false)
            return
        }

        try {
            const updatedTask = { ...task, title: editedTitle.trim() }
            const savedTask = await updateTask(board._id, updatedTask)
            await loadBoard(board._id)
            showSuccessMsg(`Task updated successfully (id: ${savedTask.id})`)
            setIsEditingTitle(false)
        } catch (err) {
            console.error('Cannot update task', err)
            showErrorMsg('Cannot update task')
            setEditedTitle(task.title)
            setIsEditingTitle(false)
        }
    }

    function handleTitleKeyPress(e) {
        if (e.key === 'Enter') {
            e.target.blur()
        }
        if (e.key === 'Escape') {
            setEditedTitle(task.title)
            setIsEditingTitle(false)
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
            <section className="task-details">
                <header className="details-header">
                    <div className="header-content">
                        <img src={svgService.cardIcon} alt="Card Icon" className="card-icon" />
                        <div className="list-info">
                            <span>in list</span>
                            <button className="list-name-btn">NEW LIST FOR PADDING</button>
                        </div>
                        <div className="title-container">
                            {isEditingTitle ? (
                                <input
                                    type="text"
                                    value={editedTitle}
                                    onChange={(e) => setEditedTitle(e.target.value)}
                                    onBlur={handleTitleBlur}
                                    onKeyDown={handleTitleKeyPress}
                                    className="title-input"
                                    autoFocus
                                />
                            ) : (
                                <h2 onClick={() => setIsEditingTitle(true)}>
                                    {task.title}
                                </h2>
                            )}
                        </div>
                    </div>
                    <button className="close-btn" onClick={onClose}>
                        <img src={svgService.closeIcon} alt="Close" />
                    </button>
                </header>

                <div className="details-grid">
                    <div className="main-content">
                        <section className="notifications-section">
                            <h3>Notifications</h3>
                            <button className="watch-btn">
                                <img src={svgService.watchIcon} alt="Watch" />
                                Watch
                            </button>
                        </section>

                        <section className="description-section">
                            <div className="section-header">
                                <img src={svgService.descriptionIcon} alt="Description" />
                                <h3>Description</h3>
                            </div>
                            {isEditingDescription ? (
                                <textarea
                                    value={editedDescription}
                                    onChange={(ev) => setEditedDescription(ev.target.value)}
                                    className="description-textarea"
                                    placeholder="Add a more detailed description..."
                                    autoFocus
                                />
                            ) : (
                                <div
                                    onClick={() => setIsEditingDescription(true)}
                                    className={`description-content ${!task.description ? 'empty' : ''}`}
                                >
                                    {task.description || 'Add a more detailed description...'}
                                </div>
                            )}
                        </section>

                        <section className="activity-section">
                            <div className="section-header">
                                <img src={svgService.activityIcon} alt="Activity" />
                                <h3>Activity</h3>
                                <button className="show-details-btn">Show details</button>
                            </div>
                            <div className="comment-input-container">
                                <div className="user-avatar"></div>
                                <input
                                    type="text"
                                    placeholder="Write a comment..."
                                    value={comment}
                                    onChange={(ev) => setComment(ev.target.value)}
                                    className="comment-input"
                                />
                            </div>
                            <div className="activity-content">
                                <div className="activity-item">
                                    <div className="user-avatar"></div>
                                    <div className="activity-details">
                                        <p><span className="user-name">User</span> added this card to NEW LIST FOR PADDING</p>
                                        <span className="timestamp">8 Jan 2025, 15:01</span>
                                    </div>
                                </div>
                            </div>
                        </section>
                    </div>

                    <aside className="sidebar">
                        <div className="actions-list">
                            <section className="add-to-card">
                                <h3>Add to card</h3>
                                <div className="action-buttons">
                                    <button><img src={svgService.joinIcon} alt="Join" /> Join</button>
                                    <button><img src={svgService.membersIcon} alt="Members" /> Members</button>
                                    <button><img src={svgService.labelsIcon} alt="Labels" /> Labels</button>
                                    <button><img src={svgService.checklistIcon} alt="Checklist" /> Checklist</button>
                                    <button><img src={svgService.datesIcon} alt="Dates" /> Dates</button>
                                    <button><img src={svgService.attachmentIcon} alt="Attachment" /> Attachment</button>
                                    <button><img src={svgService.coverIcon} alt="Cover" /> Cover</button>
                                    <button><img src={svgService.customFieldIcon} alt="Custom Fields" /> Custom Fields</button>
                                </div>
                            </section>

                            <section className="actions">
                                <h3>Actions</h3>
                                <div className="action-buttons">
                                    <button><img src={svgService.moveIcon} alt="Move" /> Move</button>
                                    <button><img src={svgService.copyIcon} alt="Copy" /> Copy</button>
                                    <button><img src={svgService.mirrorIcon} alt="Mirror" /> Mirror</button>
                                    <button><img src={svgService.templateIcon} alt="Template" /> Make template</button>
                                    <button><img src={svgService.archiveIcon} alt="Archive" /> Archive</button>
                                    <button><img src={svgService.shareIcon} alt="Share" /> Share</button>
                                </div>
                            </section>
                        </div>
                    </aside>
                </div>
            </section>
        </div>
    )
}