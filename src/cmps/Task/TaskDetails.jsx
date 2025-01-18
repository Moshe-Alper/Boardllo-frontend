import React, { useEffect, useState } from 'react'
import { useSelector } from 'react-redux'
import { svgService } from "../../services/svg.service"
import { showErrorMsg, showSuccessMsg } from '../../services/event-bus.service'
import { updateTask } from '../../store/actions/board.actions'

export function TaskDetails({ group, task: initialTask, onClose, onCoverColorSelect }) {
    const board = useSelector(storeState => storeState.boardModule.board)
    const currGroup = board?.groups?.find(g => g.id === group.id)
    const task = currGroup?.tasks?.find(t => t.id === initialTask.id) || initialTask

    const [isEditingTitle, setIsEditingTitle] = useState(false)
    const [editedTitle, setEditedTitle] = useState(task?.title || '')
    const [isEditingDescription, setIsEditingDescription] = useState(false)
    const [editedDescription, setEditedDescription] = useState(task?.description || '')
    const [comment, setComment] = useState('')

    const hasCover = task?.style?.coverColor ? true : false

    useEffect(() => {
        setEditedTitle(task?.title || '')
    }, [task])

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


    async function handleTitleSubmit() {
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
    
        const updatedTask = { ...task, title: editedTitle.trim() }
        
        try {
            await updateTask(board._id, group.id, updatedTask)
            showSuccessMsg('Title updated successfully')
            setIsEditingTitle(false)
        } catch (err) {
            showErrorMsg('Failed to update title')
            setEditedTitle(task.title)
            setIsEditingTitle(false)
        }
    }

    if (!task) return <div>Loading...</div>

    return (
        <div className="task-details-overlay" onClick={handleOverlayClick}>
            <section
                className={`task-details ${hasCover ? 'has-cover' : ''}`}
                style={{
                    '--cover-color': hasCover ? task.style.coverColor : 'transparent'
                }}>
                {hasCover && <div className="cover" />}
                <header className="details-header">
                    <div className="header-content">
                        <img src={svgService.cardIcon} alt="Card Icon" className="card-icon" />
                        <div className="title-container">
                            {isEditingTitle ? (
                                <input
                                    type="text"
                                    value={editedTitle}
                                    onChange={(ev) => setEditedTitle(ev.target.value)}
                                    onBlur={handleTitleSubmit}
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
                        <div className="list-info">
                            <span>in list</span>
                            <span className="list-name-btn">{group.title}</span>
                        </div>
                    </div>
                    <button className="close-btn" onClick={onClose}>
                        <img src={svgService.closeIcon} alt="Close" />
                    </button>
                </header>

                <div className="details-grid">
                    <div className="main-content">
                        <section className="notifications-section">
                            <div className="section-header">
                            </div>
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
                            <div className="activity-content">
                                <div className="activity-item">
                                    <div className="user-avatar"></div>
                                    <div className="activity-details">
                                        <p><span className="user-name">User</span> added this card to {group.title}</p>
                                        <span className="timestamp">8 Jan 2025, 15:01</span>
                                    </div>
                                </div>
                            </div>
                        </section>
                    </div>

                    <aside className="sidebar">
                        <div className="actions-list">
                            <section>
                                <div className="action-buttons">
                                    <button><img src={svgService.joinIcon} alt="Join" /> Join</button>
                                    <button><img src={svgService.memberIcon} alt="Members" /> Members</button>
                                    <button><img src={svgService.labelsIcon} alt="Labels" /> Labels</button>
                                    <button><img src={svgService.checklistIcon} alt="Checklist" /> Checklist</button>
                                    <button><img src={svgService.datesIcon} alt="Dates" /> Dates</button>
                                    <button><img src={svgService.attachmentIcon} alt="Attachment" /> Attachment</button>
                                    <button><img src={svgService.coverIcon} alt="Cover" /> Cover</button>
                                    <button><img src={svgService.customFieldIcon} alt="Custom Fields" /> Custom Fields</button>
                                </div>
                            </section>

                            <section>
                                <h3>Actions</h3>
                                <div className="action-buttons">
                                    <button><img src={svgService.rightArrowIcon} alt="Move" /> Move</button>
                                    <button><img src={svgService.copyIcon} alt="Copy" /> Copy</button>
                                    <button><img src={svgService.cardIcon} alt="Mirror" /> Mirror</button>
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