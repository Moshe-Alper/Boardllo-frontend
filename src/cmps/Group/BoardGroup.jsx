import { useEffect, useState } from 'react'
import { addTask, loadBoard, updateBoard, updateGroup } from '../../store/actions/board.actions'
import { boardService } from '../../services/board'
import { showSuccessMsg, showErrorMsg } from '../../services/event-bus.service'
import { BoardGroupHeader } from './BoardGroupHeader'
import { BoardGroupFooter } from './BoardGroupFooter'
import { TaskPreview } from '../Task/TaskPreview'
import { TaskDragDropContainer } from '../DragDropSystem'
import { makeId } from '../../services/util.service'
import { store } from '../../store/store'

export function BoardGroup({ board, group, onUpdateGroup, isDragging }) {
    const [isEditingGroupTitle, setIsEditingGroupTitle] = useState(false)
    const [editedGroupTitle, setEditedGroupTitle] = useState(group.title)
    const [isAddingTask, setIsAddingTask] = useState(false)
    const [newTaskTitle, setNewTaskTitle] = useState('')
    const [anchorEl, setAnchorEl] = useState(null)
    const [isCollapsed, setIsCollapsed] = useState(group.isCollapsed)

    useEffect(() => {
        loadBoard(board._id)
    }, [board._id])

    function handleGroupTitleSave() {
        group.title = editedGroupTitle
        onUpdateGroup(group)
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

        const tempTask = { ...task, id: 'temp-id' }

        const updatedGroup = {
            ...group,
            tasks: [...(group.tasks || []), tempTask]
        }

        onUpdateGroup(updatedGroup)

        try {
            const savedTask = await addTask(board._id, group.id, task)

            const finalGroup = {
                ...group,
                tasks: updatedGroup.tasks.map(task =>
                    task.id === 'temp-id' ? savedTask : task
                )
            }

            onUpdateGroup(finalGroup)
            setNewTaskTitle('')
            showSuccessMsg(`Task added (id: ${savedTask.id})`)
        } catch (err) {
            console.log('Cannot add task', err)
            showErrorMsg('Cannot add task')
            const revertedGroup = {
                ...group,
                tasks: group.tasks.filter(task => task.id !== 'temp-id')
            }
            onUpdateGroup(revertedGroup)
        }
    }

    function handleMenuClick(ev) {
        setAnchorEl(ev.target)
    }

    function handleMenuClose() {
        setAnchorEl(null)
    }

    async function toggleCollapse() {
        const newCollapsedState = !isCollapsed
        setIsCollapsed(newCollapsedState)

        const updatedGroup = {
            ...group,
            isCollapsed: newCollapsedState
        }
        try {
            await updateGroup(board._id, updatedGroup)
            if (!newCollapsedState) {
                setIsEditingGroupTitle(false)
            }
        } catch (err) {
            setIsCollapsed(!newCollapsedState)
            console.log('Collapsed not updated', err)
        }
    }

    function handleGroupClick() {
        if (isCollapsed) {
            setIsCollapsed(false)
        }
    }

    function getTaskClass(task) {
        if (!task || !task.style) {
            return 'task-preview';
        }
        return task.style.coverColor ? 'task-preview has-cover' : 'task-preview'
    }

    if (!group) return <div>Loading...</div>

    return (
        <section
            className={`board-group 
        ${isCollapsed ? 'collapsed' : ''} 
        ${isDragging ? 'dragging' : ''} 
        ${isAddingTask ? 'is-adding-task' : ''}`}
            onClick={handleGroupClick}
        >
            <BoardGroupHeader
                group={group}
                boardId={board._id}
                isEditingTitle={isEditingGroupTitle}
                setIsEditingTitle={setIsEditingGroupTitle}
                editedTitle={editedGroupTitle}
                setEditedTitle={setEditedGroupTitle}
                handleGroupTitleSave={handleGroupTitleSave}
                handleMenuClick={handleMenuClick}
                handleMenuClose={handleMenuClose}
                anchorEl={anchorEl}
                onAddTask={() => setIsAddingTask(true)}
                isCollapsed={isCollapsed}
                onToggleCollapse={toggleCollapse}
                taskCount={(group.tasks || []).length}
            />

            {!isCollapsed && (
                <TaskDragDropContainer
                    groupId={group.id}
                    tasks={group.tasks || []}
                >
                    {(task, index, isDragging) => (
                        <TaskPreview
                            boardId={board._id}
                            group={group}
                            task={task}
                            isDragging={isDragging}
                            className={getTaskClass(task)}
                        />
                    )}
                </TaskDragDropContainer>
            )}

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