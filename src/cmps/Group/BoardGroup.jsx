import { useEffect, useState } from 'react'
import { addTask, loadBoard } from '../../store/actions/board.actions'
import { boardService } from '../../services/board'
import { showSuccessMsg, showErrorMsg } from '../../services/event-bus.service'
import { BoardGroupHeader } from './BoardGroupHeader'
import { BoardGroupFooter } from './BoardGroupFooter'
import { TaskPreview } from '../Task/TaskPreview'

export function BoardGroup({ board, group, onUpdateGroup }) {
    const [isEditingGroupTitle, setIsEditingGroupTitle] = useState(false)
    const [editedGroupTitle, setEditedGroupTitle] = useState(group.title)
    const [isAddingTask, setIsAddingTask] = useState(false)
    const [newTaskTitle, setNewTaskTitle] = useState('')
    const [tasks, setTasks] = useState(group.tasks)
    const [anchorEl, setAnchorEl] = useState(null)

    useEffect(() => {
        loadBoard(board._id)
    }, [board._id])

    function onUpdateGroupTitle(group, title) {
        onUpdateGroup(group, title)
    }

    function handleGroupTitleSave() {
        onUpdateGroup(group, editedGroupTitle)
        setIsEditingGroupTitle(false)
    }

    function handleTaskTitleChange(ev) {
        setNewTaskTitle(ev.target.value)
    }

    async function onAddTask(ev) {
        ev.preventDefault()

        if (!newTaskTitle.trim()) {
            showErrorMsg('Task title cannot be empty')
            return
        }

        const task = boardService.getEmptyTask()
        task.title = newTaskTitle

        // Optimistic
        setTasks(prevTasks => [...prevTasks, { ...task, _id: 'temp-id' }])

        try {
            const savedTask = await addTask(board._id, group.id, task)
            setTasks(prevTasks => prevTasks.map(task => task._id === 'temp-id' ? savedTask : task))

            loadBoard(board._id)
            showSuccessMsg(`Task added (id: ${savedTask.id})`)
            setNewTaskTitle('')
        } catch (err) {
            console.log('Cannot add task', err)
            showErrorMsg('Cannot add task')

            // Optimistic undo
            setTasks(prevTasks => prevTasks.filter(task => task._id !== 'temp-id'))
        }
    }


    function handleMenuClick(ev) {
        setAnchorEl(ev.target)
    }

    function handleMenuClose() {
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
                updateGroupTitle={onUpdateGroupTitle} 
            />

            <div className="tasks-container">
                {tasks.map(task => (
                    <TaskPreview key={task.id} task={task} />
                ))}
            </div>

            <BoardGroupFooter
                group={group}
                isAddingTask={isAddingTask}
                setIsAddingTask={setIsAddingTask}
                newTaskTitle={newTaskTitle}
                handleTitleChange={handleTaskTitleChange}
                onAddTask={onAddTask}
            />
        </section>
    )
}
