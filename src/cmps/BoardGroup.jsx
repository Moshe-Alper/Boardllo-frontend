import { useEffect, useState } from 'react'
import { boardService } from '../services/board'
import { svgService } from '../services/svg.service'
import { TaskPreview } from './TaskPreview'
import { loadBoard } from '../store/actions/board.actions'
import { showSuccessMsg, showErrorMsg } from '../services/event-bus.service'

import TextField from '@mui/material/TextField'

export function BoardGroup({ board, group, onUpdateGroup }) {
    const [isAddingTask, setIsAddingTask] = useState(false)
    const [newTaskTitle, setNewTaskTitle] = useState('')
    const [isEditingTitle, setIsEditingTitle] = useState(false)
    const [editedTitle, setEditedTitle] = useState(group.title)

    useEffect(() => {
        loadBoard(board._id)
    }, [board._id])

    function handleTitleChange(ev) {
        setNewTaskTitle(ev.target.value)
    }

    async function handleAddTask(ev) {
        ev.preventDefault()
        if (!newTaskTitle.trim()) return
        const task = boardService.getEmptyTask()
        task.title = newTaskTitle

        try {
            await boardService.saveTask(board._id, group.id, task)
            loadBoard(board._id)
            showSuccessMsg(`Task added (id: ${task.id})`)
            setNewTaskTitle('')
            setIsAddingTask(false)
        } catch (err) {
            console.log('Cannot add task', err)
            showErrorMsg('Cannot add task')
        }
    }

    async function handleTitleSave() {
        if (!editedTitle.trim()) {
            alert('Title cannot be empty')
            return
        }
        try {
            group.title = editedTitle
            await onUpdateGroup(group)
            setIsEditingTitle(false)
            showSuccessMsg('Group title updated')
        } catch (err) {
            console.error('Cannot update group title', err)
            showErrorMsg('Cannot update group title')
        }
    }

    if (!group) return <div>Loading...</div>

    return (
        <section className="board-group flex column">
            {isEditingTitle ? (
                <div className="title-editor">
                    <TextField
                        value={editedTitle}
                        onChange={(ev) => setEditedTitle(ev.target.value)}
                        onBlur={handleTitleSave}
                        onKeyDown={(ev) => {
                            if (ev.key === 'Enter') handleTitleSave()
                            if (ev.key === 'Escape') setIsEditingTitle(false)
                        }}
                        autoFocus
                        variant="outlined"
                        size="small"
                    />
                </div>
            ) : (
                <div className="title-container">
                    <h5 onClick={() => setIsEditingTitle(true)} style={{ cursor: 'pointer' }}>
                        {group.title}
                    </h5>
                    <div className="title-actions">
                        <button className="collapse-btn">
                            {/* Todo make a hover with collapse and list action text */}
                            <img src={svgService.collapseIcon} alt="Collapse Icon" />
                        </button>
                        <button className="menu-btn">
                            <img src={svgService.threeDotsIcon} alt="List actions Icon" />
                        </button>
                    </div>
                </div>
            )}

            {group.tasks.map(task => (
                <TaskPreview key={task.id} task={task} />
            ))}

            {isAddingTask ? (
                <form className="add-task-container" onSubmit={handleAddTask}>
                    <input
                        type="text"
                        placeholder="Enter task title or paste a link"
                        value={newTaskTitle}
                        onChange={handleTitleChange}
                    />
                    <div className="buttons-container">
                        <button type="submit" className="add-card-btn">Add a card</button>
                        <button
                            type="button"
                            className="cancel-btn"
                            onClick={() => setIsAddingTask(false)}
                        >
                            x
                        </button>
                    </div>
                </form>
            ) : (
                <button className="add-list-btn" onClick={() => setIsAddingTask(true)}>
                    Add a card
                </button>
            )}
        </section>
    )
}
