import React, { useEffect, useState } from 'react'
import { useSelector } from 'react-redux'
import { useNavigate, useParams } from 'react-router-dom'
import { boardService } from '../../services/board'
import { svgService } from "../../services/svg.service"
import { showErrorMsg, showSuccessMsg } from '../../services/event-bus.service'
import { updateTask } from '../../store/actions/board.actions'
import { onTogglePicker } from '../../store/actions/app.actions'
import { MemberPicker } from '../DynamicPickers/Pickers/MemberPicker'
import { LabelPicker } from '../DynamicPickers/Pickers/LabelPicker'
import { DatePicker } from '../DynamicPickers/Pickers/DatePicker'
import { ChecklistPicker } from '../DynamicPickers/Pickers/ChecklistPicker'
import { CoverPicker } from '../DynamicPickers/Pickers/CoverPicker'
import { TaskDescription } from './TaskDescription'

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

function findTaskAndGroup(groups, taskId) {
    for (const group of groups) {
        const task = group.tasks?.find(t => t.id === taskId)
        if (task) return [group, task]
    }
    return [null, null]
}

export function TaskDetails() {
    const navigate = useNavigate()
    const { boardId, taskId } = useParams()
    const board = useSelector(storeState => storeState.boardModule.board)
    const [task, setTask] = useState(null)
    const [currGroup, setCurrGroup] = useState(null)

    // title
    const [isEditingTitle, setIsEditingTitle] = useState(false)
    const [editedTitle, setEditedTitle] = useState('')
    // description
    const [editedDescription, setEditedDescription] = useState('')
    // labels
    const [labels] = useState(boardService.getDefaultLabels())
    // checklist
    const [newTodoTitle, setNewTodoTitle] = useState('')
    const [editingChecklistId, setEditingChecklistId] = useState(null)
    const [hiddenChecklists, setHiddenChecklists] = useState({})

    useEffect(() => {
        if (board?.groups) {
            const [foundGroup, foundTask] = findTaskAndGroup(board.groups, taskId)
            setTask(foundTask)
            setCurrGroup(foundGroup)
            setEditedTitle(foundTask?.title || '')
            setEditedDescription(foundTask?.description || '')
        }
    }, [board, taskId])

    useEffect(() => {
        document.addEventListener('keydown', handleEscape)
        return () => document.removeEventListener('keydown', handleEscape)
    }, [])

    const hasCover = task?.style?.coverColor ? true : false

    function handleEscape(ev) {
        if (ev.key === 'Escape') navigate(`/board/${board._id}`)
    }

    function handleOverlayClick(ev) {
        if (ev.target === ev.currentTarget) navigate(`/board/${board._id}`)
    }

    function handleTitleKeyPress(ev) {
        if (ev.key === 'Enter') ev.target.blur()
        if (ev.key === 'Escape') {
            setEditedTitle(task.title)
            setIsEditingTitle(false)
        }
    }

    async function handleTaskUpdate(field, value) {
        if (!value.trim()) {
            showErrorMsg(`${field} cannot be empty`)
            return false
        }

        if (value === task[field]) return true

        const updatedTask = { ...task, [field]: value.trim() }
        console.log('🚀 updatedTask', updatedTask)
        try {
            await updateTask(board._id, currGroup.id, updatedTask)
            setTask(updatedTask)
            showSuccessMsg(`${field} updated successfully`)
            return true
        } catch (err) {
            showErrorMsg(`Failed to update ${field}`)
            return false
        }
    }

    async function handleTitleUpdate() {
        const success = await handleTaskUpdate('title', editedTitle)
        if (success) setIsEditingTitle(false)
        else setEditedTitle(task.title)
    }

    async function handleDescriptionUpdate(newDescription) {
        const success = await handleTaskUpdate('description', newDescription)
        if (success) {
            setEditedDescription(newDescription)
            setTask(prev => ({ ...prev, description: newDescription }))
        } else {
            setEditedDescription(task.description)
        }
    }

    async function handleLabelUpdate(taskId, updatedLabels) {
        if (task.id !== taskId) return
        const updatedTask = { ...task, labelIds: updatedLabels }

        try {
            await updateTask(board._id, currGroup.id, updatedTask)
            setTask(updatedTask)
        } catch (err) {
            showErrorMsg('Failed to update label')
        }
    }

    async function handleMemberUpdate(updatedMembers) {
        const updatedTask = { ...task, memberIds: updatedMembers }
        try {
            await updateTask(board._id, currGroup.id, updatedTask)
            setTask(updatedTask)
        } catch (err) {
            showErrorMsg('Failed to update members')
        }
    }

    async function handleCoverUpdate(newCoverColor) {
        const updatedTask = { ...task, style: { ...task.style, coverColor: newCoverColor } }
        try {
            await updateTask(board._id, currGroup.id, updatedTask)
            setTask(updatedTask)
        } catch (err) {
            showErrorMsg('Failed to update cover')
        }
    }

    async function handleDateUpdate(newDueDate) {
        console.log('newDueDate', newDueDate)
        const updatedTask = { ...task, dueDate: newDueDate }
        try {
            await updateTask(board._id, currGroup.id, updatedTask)
            setTask(updatedTask)
        } catch (err) {
            showErrorMsg('Failed to update due date')
        }
    }

    async function handleChecklistUpdate(newChecklist) {
        const updatedTask = { ...task, checklists: newChecklist }
        try {
            await updateTask(board._id, currGroup.id, updatedTask)
            setTask(updatedTask)
        } catch (err) {
            showErrorMsg('Failed to update checklist')
        }
    }

    async function handleDeleteChecklist(checklistId) {
        const updatedChecklists = task.checklists.filter(cl => cl.id !== checklistId)
        try {
            await handleChecklistUpdate(updatedChecklists)
            showSuccessMsg('Checklist deleted successfully')
        } catch (err) {
            showErrorMsg('Failed to delete checklist')
        }
    }

    async function handleAddTodoItem(checklistId) {
        if (!newTodoTitle.trim()) {
            showErrorMsg('Todo item cannot be empty')
            return
        }
        
        const newTodo = {
            id: Date.now(),
            title: newTodoTitle.trim(),
            isDone: false
        }

        const updatedChecklists = task.checklists.map(cl => {
            if (cl.id === checklistId) {
                return {
                    ...cl,
                    todos: [...cl.todos, newTodo]
                }
            }
            return cl
        })

        try {
            await handleChecklistUpdate(updatedChecklists)
            setNewTodoTitle('')
            setEditingChecklistId(null)
            showSuccessMsg('Todo item added successfully')
        } catch (err) {
            showErrorMsg('Failed to add todo item')
        }
    }

    function handlePickerToggle(Picker, title, ev) {
        if (!Picker) return

        onTogglePicker({
            cmp: Picker,
            title,
            props: {
                board,
                groupId: currGroup.id,
                initialTask: task,
                onClose: () => onTogglePicker(),

                // labels
                onLabelUpdate: handleLabelUpdate,
                // members
                onMemberUpdate: handleMemberUpdate,
                boardMembers: board.members || [],
                taskMembers: task.memberIds || [],
                // cover
                onCoverUpdate: handleCoverUpdate,
                // due date
                onDateUpdate: handleDateUpdate,
                // checklist
                onChecklistUpdate: handleChecklistUpdate

            },
            triggerEl: ev.currentTarget
        })
    }


    if (!task) return <div>Loading...</div>
    const boardMembers = board?.members || []
    const taskMembers = task?.memberIds || []

    return (
        <div className="task-details-overlay" onClick={handleOverlayClick}>
            <article className={`task-details ${hasCover ? 'has-cover' : ''}`}>
                {hasCover && <div className="cover" style={{ backgroundColor: task.style.coverColor }} />}

                <header className="task-header">
                    <div className="task-header-container">
                        <hgroup>
                            {isEditingTitle ? (
                                <textarea
                                    value={editedTitle}
                                    onChange={(ev) => {
                                        const textarea = ev.target
                                        textarea.style.height = 'auto'
                                        textarea.style.height = `${textarea.scrollHeight}px`
                                        setEditedTitle(ev.target.value)
                                    }}
                                    onBlur={handleTitleUpdate}
                                    onKeyDown={handleTitleKeyPress}
                                    autoFocus
                                    rows={1}
                                />
                            ) : (
                                <span onClick={() => setIsEditingTitle(true)}>{task.title}</span>
                            )}
                        </hgroup>

                        <img src={svgService.cardIcon} alt="Card Icon" className="card-icon" />

                        <div className="task-list-container">
                            <p className="list-title">
                                <span>in list</span>
                                <button>
                                    <span>{currGroup.title}</span>
                                </button>
                            </p>
                        </div>
                    </div>
                    <button className="close-btn" onClick={() => navigate(`/board/${boardId}`)}>
                        <img src={svgService.closeIcon} alt="Close" />
                    </button>
                </header>

                <main className="task-main">
                    <section className="task-content">
                        <section className="task-metadata">

                            {taskMembers.length > 0 && (
                                <div className="metadata-container members">
                                    <h3>Members</h3>
                                    <div className="members-list">
                                        {taskMembers.map((memberId) => {
                                            const member = boardMembers.find(m => m._id === memberId)
                                            if (!member) return null
                                            return (
                                                <div key={member._id} className="member" title={member.fullname}>
                                                    {member.imgUrl && <img src={member.imgUrl} alt={member.fullname} />}
                                                </div>
                                            )
                                        })}
                                        <button onClick={(ev) => handlePickerToggle(MemberPicker, 'Members', ev)}>
                                            <img src={svgService.addIcon} alt="Add Member" />
                                        </button>
                                    </div>
                                </div>
                            )}

                            {task.labelIds.length > 0 && (
                                <div className="metadata-container labels">
                                    <h3>Labels</h3>
                                    <div className="labels-list">
                                        {labels
                                            .filter(label => task.labelIds?.includes(label.id))
                                            .map(label => (
                                                <span
                                                    key={label.id}
                                                    className="label"
                                                    style={{ backgroundColor: label.color }}
                                                >
                                                    {label.title}
                                                </span>
                                            ))}
                                        <button onClick={(ev) => handlePickerToggle(LabelPicker, 'Labels', ev)}>
                                            <img src={svgService.addIcon} alt="Add Label" />
                                        </button>
                                    </div>
                                </div>
                            )}

                            <div className="metadata-container notification">
                                <h3>Notification</h3>
                                <div className="notification-toggle" role="presentation">
                                    <button>
                                        <img src={svgService.watchIcon} alt="Watch" />
                                        <span>Watch</span>
                                    </button>
                                </div>
                            </div>

                            <div className="metadata-container due-date">
                                <h3>Due Date</h3>
                                <div className="date-info">
                                    <input type="checkbox" className="due-date-checkbox" />
                                    <button>
                                        <span>Jan 25 at 12:00 PM</span>
                                        <img src={svgService.arrowDownIcon} alt="Toggle Calender" />
                                    </button>
                                </div>
                            </div>
                        </section>

                        <section className="desc">
                            <img src={svgService.descriptionIcon} alt="Description" className='desc-icon' />
                            <hgroup className="desc-header">
                                <div className="desc-controls">
                                    <h3>Description</h3>
                                </div>
                            </hgroup>

                            <div className="desc-content">
                                <TaskDescription
                                    initialDescription={task.description}
                                    onDescriptionUpdate={handleDescriptionUpdate}
                                />
                            </div>
                        </section>

                        {task.checklists && task.checklists.length > 0 && (
                            <section className="checklist">
                                {task.checklists.map(checklist => {
                                    const hasCheckedItems = checklist.todos?.some(todo => todo.isDone)
                                    const isHidden = hiddenChecklists[checklist.id]
                                    const visibleTodos = isHidden
                                        ? checklist.todos.filter(todo => !todo.isDone)
                                        : checklist.todos

                                    return (
                                        <div key={checklist.id} className="checklist-group">
                                            <img src={svgService.checklistIcon} alt="Checklist" className="checklist-icon" />
                                            <hgroup className="checklist-header">
                                                <div className="checklist-controls">
                                                    <h3>{checklist.title}</h3>
                                                    <div className="checklist-actions">
                                                        {hasCheckedItems && (
                                                            <button
                                                                onClick={() => {
                                                                    setHiddenChecklists(prev => ({
                                                                        ...prev,
                                                                        [checklist.id]: !prev[checklist.id]
                                                                    }))
                                                                }}
                                                            >
                                                                {isHidden ? 'Show checked items' : 'Hide checked items'}
                                                            </button>
                                                        )}
                                                        <button
                                                            onClick={() => handleDeleteChecklist(checklist.id)}
                                                        >
                                                            Delete
                                                        </button>
                                                    </div>
                                                </div>
                                            </hgroup>
                                            <div className="checklist-content">
                                                {visibleTodos && visibleTodos.length > 0 ? (
                                                    <ul>
                                                        {visibleTodos.map(todo => (
                                                            <li key={todo.id}>
                                                                <input
                                                                    type="checkbox"
                                                                    checked={todo.isDone}
                                                                    onChange={() => {
                                                                        const updatedChecklists = task.checklists.map(cl => {
                                                                            if (cl.id === checklist.id) {
                                                                                return {
                                                                                    ...cl,
                                                                                    todos: cl.todos.map(t =>
                                                                                        t.id === todo.id ? { ...t, isDone: !t.isDone } : t
                                                                                    )
                                                                                }
                                                                            }
                                                                            return cl
                                                                        })
                                                                        handleChecklistUpdate(updatedChecklists)
                                                                    }}
                                                                />
                                                                <span className={todo.isDone ? 'line-through' : ''}>
                                                                    {todo.title}
                                                                </span>
                                                            </li>
                                                        ))}
                                                    </ul>
                                                ) : null}

                                                {editingChecklistId === checklist.id ? (
                                                    <form className="add-todo-form">
                                                    <textarea
                                                        value={newTodoTitle}
                                                        onChange={(ev) => setNewTodoTitle(ev.target.value)}
                                                        placeholder="Add an item..."
                                                        onKeyPress={(ev) => {
                                                            if (ev.key === "Enter" && !ev.shiftKey) {
                                                                ev.preventDefault();
                                                                handleAddTodoItem(checklist.id);
                                                            }
                                                        }}
                                                    />
                                                    <div className="add-todo-actions">
                                                        <button
                                                            type="button"
                                                            onClick={(ev) => {
                                                                ev.preventDefault();
                                                                handleAddTodoItem(checklist.id);
                                                            }}
                                                        >
                                                            Add
                                                        </button>
                                                        <button
                                                            type="button" 
                                                            onClick={(ev) => {
                                                                ev.preventDefault();
                                                                setEditingChecklistId(null);
                                                                setNewTodoTitle("");
                                                            }}
                                                        >
                                                            Cancel
                                                        </button>
                                                    </div>
                                                </form>
                                                ) : (
                                                    <div
                                                        onClick={() => setEditingChecklistId(checklist.id)}
                                                        className="add-todo-btn"
                                                    >
                                                        <button>
                                                            Add an item
                                                        </button>
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                    )
                                })}

                            </section>
                        )}
                        <section className="activity">
                            <img src={svgService.activityIcon} alt="Activity" className='activity-icon' />
                            <hgroup className="activity-header">
                                <div className="activity-controls">
                                    <h3>Activity</h3>
                                    <button>Show details</button>
                                </div>
                            </hgroup>
                            <div className="activity-item">
                                <div className="user-avatar"></div>
                                <p><span>User</span> added this card to {currGroup.title}</p>
                                <time>8 Jan 2025, 15:01</time>
                            </div>
                        </section>
                    </section>

                    <aside className="task-sidebar">
                        <ul className="features">
                            <li>
                                {PICKERS.map(({ icon, label, picker }) => (
                                    <button
                                        key={label}
                                        onClick={(ev) => handlePickerToggle(picker, label, ev)}
                                    >
                                        <img src={svgService[icon]} alt={label} />
                                        <span>{label}</span>
                                    </button>
                                ))}
                            </li>
                        </ul>

                        <ul className="actions">
                            <hgroup>
                                <h4>Actions</h4>
                            </hgroup>
                            <li>
                                {ACTION_BUTTONS.map(({ icon, label }) => (
                                    <button key={label}>
                                        <img src={svgService[icon]} alt={label} />
                                        <span>{label}</span>
                                    </button>
                                ))}
                            </li>
                        </ul>
                    </aside>
                </main>
            </article>
        </div>
    )
}