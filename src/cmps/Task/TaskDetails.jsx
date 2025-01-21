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
            <article className={`task-details ${hasCover ? 'has-cover' : ''}`}>
                {hasCover && <div className="cover" style={{ backgroundColor: task.style.coverColor }} />}

                <header className="task-header">
                    <img src={svgService.cardIcon} alt="Card Icon" className="card-icon" />

                    <h2 className="task-title">
                        {isEditingTitle ? (
                            <textarea
                                value={editedTitle}
                                onChange={(ev) => {
                                    const textarea = ev.target
                                    textarea.style.height = 'auto'
                                    textarea.style.height = `${textarea.scrollHeight}px`
                                    setEditedTitle(ev.target.value)
                                }}
                                onBlur={handleTitleSubmit}
                                onKeyDown={handleTitleKeyPress}
                                autoFocus
                                rows={1}
                            />
                        ) : (
                            <span onClick={() => setIsEditingTitle(true)}>{task.title}</span>
                        )}
                    </h2>
                    <div className="task-list">in list <span className="list-name">{currGroup.title}</span></div>
                    <button className="close-btn" onClick={() => navigate(`/board/${boardId}`)}>
                        <img src={svgService.closeIcon} alt="Close" />
                    </button>
                </header>

                <main className="task-content">
                    <section className="notifications">
                        <img src={svgService.watchIcon} alt="Watch" />
                        <h3>Notifications</h3>
                        <button className="watch-btn">Watch</button>
                    </section>

                    <section className="description">
                        <img src={svgService.descriptionIcon} alt="Description" />
                        <h3>Description</h3>
                        {isEditingDescription ? (
                            <textarea
                                value={editedDescription}
                                onChange={(ev) => setEditedDescription(ev.target.value)}
                                placeholder="Add a more detailed description..."
                                autoFocus
                            />
                        ) : (
                            <div
                                onClick={() => setIsEditingDescription(true)}
                                className={!task.description ? 'empty' : ''}
                            >
                                {task.description || 'Add a more detailed description...'}
                            </div>
                        )}
                    </section>

                    <section className="activity">
                        <img src={svgService.activityIcon} alt="Activity" />
                        <h3>Activity</h3>
                        <button className="show-details">Show details</button>
                        <div className="activity-item">
                            <div className="user-avatar"></div>
                            <p><span>User</span> added this card to {currGroup.title}</p>
                            <time>8 Jan 2025, 15:01</time>
                        </div>
                    </section>
                </main>

                <aside className="task-sidebar">
                    <div className="add-to-card">
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

                    <div className="actions">
                        <h3>Actions</h3>
                        {ACTION_BUTTONS.map(({ icon, label }) => (
                            <button key={label}>
                                <img src={svgService[icon]} alt={label} />
                                {label}
                            </button>
                        ))}
                    </div>
                </aside>
            </article>
        </div>
    )
}