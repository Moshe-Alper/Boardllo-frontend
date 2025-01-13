import { useEffect, useState } from 'react'
import { addTask, loadBoard, updateGroup } from '../../store/actions/board.actions'
import { boardService } from '../../services/board'
import { showSuccessMsg, showErrorMsg } from '../../services/event-bus.service'
import { BoardGroupHeader } from './BoardGroupHeader'
import { BoardGroupFooter } from './BoardGroupFooter'
import { TaskPreview } from '../Task/TaskPreview'
import { TaskDragDropContainer } from '../DragDropSystem'

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
        
        // Update the group directly
        group.tasks = [...(group.tasks || []), tempTask]
        onUpdateGroup({ ...group })

        try {
            const savedTask = await addTask(board._id, group.id, task)
            
            group.tasks = group.tasks.map(t => t.id === 'temp-id' ? savedTask : t)
            onUpdateGroup({ ...group })

            loadBoard(board._id)
            showSuccessMsg(`Task added (id: ${savedTask.id})`)
            setNewTaskTitle('')
        } catch (err) {
            console.log('Cannot add task', err)
            showErrorMsg('Cannot add task')
            
            group.tasks = group.tasks.filter(t => t.id !== 'temp-id')
            onUpdateGroup({ ...group })
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

    if (!group) return <div>Loading...</div>

    return (
        <section
            className={`board-group flex column ${isCollapsed ? 'collapsed' : ''} 
                      ${isDragging ? 'dragging' : ''}`}
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
                            key={task.id}
                            task={task}
                            isDragging={isDragging}
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