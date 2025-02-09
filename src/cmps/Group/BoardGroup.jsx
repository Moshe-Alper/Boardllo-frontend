import { useEffect, useState, useRef } from 'react'
import { addTask, loadBoard, updateBoard, updateGroup } from '../../store/actions/board.actions'
import { boardService } from '../../services/board'
import { showSuccessMsg, showErrorMsg } from '../../services/event-bus.service'
import { BoardGroupHeader } from './BoardGroupHeader'
import { TaskPreview } from '../Task/TaskPreview'
import { TaskDragDropContainer } from '../DragDropSystem'
import { svgService } from '../../services/svg.service'
import { Loader } from '../Loader'

export function BoardGroup({ board, group, onUpdateGroup, isDragging }) {
    const [isEditingGroupTitle, setIsEditingGroupTitle] = useState(false)
    const [editedGroupTitle, setEditedGroupTitle] = useState(group.title)
    const [isAddingTask, setIsAddingTask] = useState(false)
    const [newTaskTitle, setNewTaskTitle] = useState('')
    const [anchorEl, setAnchorEl] = useState(null)
    const [isCollapsed, setIsCollapsed] = useState(group.isCollapsed)
    const tasksContainerRef = useRef(null)

    useEffect(() => {
        loadBoard(board._id)
    }, [board._id])

    useEffect(() => {
        if (isAddingTask) {
            tasksContainerRef.current?.scrollTo({ 
                top: tasksContainerRef.current.scrollHeight,
                behavior: 'smooth'
            })
        }
    }, [isAddingTask])

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
        const title = newTaskTitle.trim()
        if (!title) {
            showErrorMsg('Task title cannot be empty')
            return
        }
    
        const tempId = `temp-${Date.now()}`
        const task = {
            ...boardService.getEmptyTask(),
            id: tempId,
            title
        }
    
        const updatedTasks = group.tasks ? [...group.tasks, task] : [task]
        onUpdateGroup({
            ...group,
            tasks: updatedTasks
        })
    
        try {
            const savedTask = await addTask(board._id, group.id, task)
            
            const taskIndex = updatedTasks.findIndex(t => t.id === tempId)
            if (taskIndex !== -1) {
                updatedTasks[taskIndex] = savedTask
            }
    
            setNewTaskTitle('')
            showSuccessMsg(`Task added (id: ${savedTask.id})`)
        } catch (err) {
            console.log('Cannot add task', err)
            showErrorMsg('Cannot add task')
            
            onUpdateGroup({
                ...group,
                tasks: group.tasks.filter(t => t.id !== tempId)
            })
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

    if (!group) return <Loader />

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
                    isAddingTask={isAddingTask}
                    setIsAddingTask={setIsAddingTask}
                    newTaskTitle={newTaskTitle}
                    handleTitleChange={handleTaskTitleChange}
                    tasksContainerRef={tasksContainerRef}
                    onAddTask={onAddTask}
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

            <footer className="board-group-footer">
                <div className='add-task-btn-preview'>
                    <button onClick={() => setIsAddingTask(true)}>
                        <img src={svgService.addIcon} alt="Add" className="add-icon" />
                        Add a card
                    </button>
                </div>
            </footer>
        </section>
    )
}