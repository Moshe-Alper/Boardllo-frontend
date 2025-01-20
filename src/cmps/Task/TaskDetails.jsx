import React, { useEffect, useState } from 'react'
import { useSelector } from 'react-redux'
import { useNavigate, useParams } from 'react-router-dom'
import { svgService } from "../../services/svg.service"
import { showErrorMsg, showSuccessMsg } from '../../services/event-bus.service'
import { updateTask } from '../../store/actions/board.actions'
import { onTogglePicker } from '../../store/actions/app.actions'
import { MemberPicker } from '../DynamicPickers/Pickers/MemberPicker'
import { LabelPicker } from '../DynamicPickers/Pickers/LabelPicker'
import { DatePicker } from '../DynamicPickers/Pickers/DatePicker'
import { ChecklistPicker } from '../DynamicPickers/Pickers/ChecklistPicker'
import { CoverPicker } from '../DynamicPickers/Pickers/CoverPicker'

const PICKERS = [
    { icon: 'joinIcon', label: 'Join', picker: null },
    { icon: 'memberIcon', label: 'Members', picker: MemberPicker },
    { icon: 'labelsIcon', label: 'Labels', picker: LabelPicker },
    { icon: 'datesIcon', label: 'Dates', picker: DatePicker },
    { icon: 'checklistIcon', label: 'Checklist', picker: ChecklistPicker },
    { icon: 'coverIcon', label: 'Cover', picker: CoverPicker },
    { icon: 'attachmentIcon', label: 'Attachment', picker: null },
    { icon: 'customFieldIcon', label: 'Custom Fields', picker: null }
]

const ACTION_BUTTONS = [
    { icon: 'rightArrowIcon', label: 'Move' },
    { icon: 'copyIcon', label: 'Copy' },
    { icon: 'cardIcon', label: 'Mirror' },
    { icon: 'templateIcon', label: 'Make template' },
    { icon: 'archiveIcon', label: 'Archive' },
    { icon: 'shareIcon', label: 'Share' }
]

export function TaskDetails() {
    const navigate = useNavigate()
    const { boardId, taskId } = useParams() // Get IDs from URL
    const board = useSelector(storeState => storeState.boardModule.board)
    
    // Find the task and its group
    const [currGroup, task] = React.useMemo(() => {
        if (!board?.groups) return [null, null]
        
        for (const group of board.groups) {
            const foundTask = group.tasks?.find(t => t.id === taskId)
            if (foundTask) {
                return [group, foundTask]
            }
        }
        return [null, null]
    }, [board, taskId])


    const [isEditingTitle, setIsEditingTitle] = useState(false)
    const [editedTitle, setEditedTitle] = useState(task?.title || '')
    const [isEditingDescription, setIsEditingDescription] = useState(false)
    const [editedDescription, setEditedDescription] = useState(task?.description || '')

    const hasCover = task?.style?.coverColor ? true : false

    useEffect(() => {
        setEditedTitle(task?.title || '')
    }, [task])

    useEffect(() => {
        document.addEventListener('keydown', handleEscape)
        return () => {
            document.removeEventListener('keydown', handleEscape)
        }
    }, [])

    function handleEscape(ev) {
        if (ev.key === 'Escape') {
            navigate(`/board/${board._id}`)
        }
    }

    function handleOverlayClick(ev) {
        if (ev.target === ev.currentTarget) {
            navigate(`/board/${board._id}`)
        }
    }

    function handleTitleKeyPress(ev) {
        if (ev.key === 'Enter') {
            ev.target.blur()
        }
        if (ev.key === 'Escape') {
            setEditedTitle(task.title)
            setIsEditingTitle(false)
        }
    }

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
            await updateTask(board._id, currGroup.id, updatedTask)
            showSuccessMsg('Title updated successfully')
            setIsEditingTitle(false)
        } catch (err) {
            showErrorMsg('Failed to update title')
            setEditedTitle(task.title)
            setIsEditingTitle(false)
        }
    }

    function handlePickerToggle(Picker, title, ev) {
        if (!Picker) return

        onTogglePicker({
            cmp: Picker,
            title,
            props: {
                boardId: board._id,
                groupId: currGroup.id,
                task,
                onClose: () => onTogglePicker()
            },
            triggerEl: ev.currentTarget
        })
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
                            <span className="list-name-btn">{currGroup.title}</span>
                        </div>
                    </div>
                    <button className="close-btn" onClick={() => navigate(`/board/${boardId}`)}>
                            <img src={svgService.closeIcon} alt="Close" />
                        </button>
                </header>

                <div className="details-grid">
                    <div className="main-content">
                        <section className="notifications-section">
                            <div className="section-header">
                                <h3>Notifications</h3>
                            </div>
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
                                        <p><span className="user-name">User</span> added this card to {currGroup.title}</p>
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
                                    {PICKERS.map(({ icon, label, picker }) => (
                                        <button
                                            key={label}
                                            onClick={(ev) => handlePickerToggle(picker, label, ev)}
                                        >
                                            <img src={svgService[icon]} alt={label} />
                                            {label}
                                        </button>
                                    ))}
                                </div>
                            </section>

                            <section>
                                <h3>Actions</h3>
                                <div className="action-buttons">
                                    {ACTION_BUTTONS.map(({ icon, label }) => (
                                        <button key={label}>
                                            <img src={svgService[icon]} alt={label} />
                                            {label}
                                        </button>
                                    ))}
                                </div>
                            </section>
                        </div>
                    </aside>
                </div>
            </section>
        </div>
    )
}