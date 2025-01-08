import { useEffect, useState } from 'react'
import { boardService } from '../../services/board'
import { BoardGroupHeader } from './BoardGroupHeader'
import { TaskPreview } from '../TaskPreview'
import { loadBoard } from '../../store/actions/board.actions'
import { showSuccessMsg, showErrorMsg } from '../../services/event-bus.service'
import { BoardGroupFooter } from './BoardGroupFooter'

export function BoardGroup({ board, group, onUpdateGroup }) {
    const [isEditingGroupTitle, setIsEditingGroupTitle] = useState(false)
    const [editedGroupTitle, setEditedGroupTitle] = useState(group.title)

    const [isAddingTask, setIsAddingTask] = useState(false)
    const [newTaskTitle, setNewTaskTitle] = useState('')

    const [anchorEl, setAnchorEl] = useState(null)

    useEffect(() => {
        loadBoard(board._id)
    }, [board._id])

    function handleUpdateGroup(group, title) {
        onUpdateGroup(group, title)
    }

    function handleTaskTitleChange(ev) {
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

    async function handleGroupTitleSave() {
        if (!editedGroupTitle.trim()) {
            showErrorMsg('Title cannot be empty')
            return
        }
        try {
            group.title = editedGroupTitle
            await onUpdateGroup(group)
            setIsEditingGroupTitle(false)
            showSuccessMsg('Group title updated')
        } catch (err) {
            console.error('Cannot update group title', err)
            showErrorMsg('Cannot update group title')
        }
    }

    const handleMenuClick = (ev) => {
        setAnchorEl(ev.target)
    }

    const handleMenuClose = () => {
        setAnchorEl(null)
    }

    if (!group) return <div>Loading...</div>

    return (
        <section className="board-group flex column">
            <BoardGroupHeader
                group={group}
                boardId={board._id}
                isEditingTitle={isEditingGroupTitle}
                setIsEditingTitle={setIsEditingGroupTitle}
                editedTitle={editedGroupTitle}
                setEditedTitle={setEditedGroupTitle}
                handleTitleSave={handleGroupTitleSave}
                handleMenuClick={handleMenuClick}
                handleMenuClose={handleMenuClose}
                anchorEl={anchorEl}
                onAddTask={() => setIsAddingTask(true)}
                handleUpdateGroup={handleUpdateGroup} 
            />

            <div className="tasks-container">
                {group.tasks.map(task => (
                    <TaskPreview key={task.id} task={task} />
                ))}
            </div>

            <BoardGroupFooter
                group={group}
                isAddingTask={isAddingTask}
                setIsAddingTask={setIsAddingTask}
                newTaskTitle={newTaskTitle}
                handleTitleChange={handleTaskTitleChange}
                handleAddTask={handleAddTask}
            />
        </section>
    )
}
