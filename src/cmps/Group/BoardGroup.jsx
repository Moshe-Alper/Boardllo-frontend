import { useEffect, useState } from 'react'
import { addTask, loadBoard, updateGroup } from '../../store/actions/board.actions'
import { boardService } from '../../services/board'
import { showSuccessMsg, showErrorMsg } from '../../services/event-bus.service'
import { BoardGroupHeader } from './BoardGroupHeader'
import { BoardGroupFooter } from './BoardGroupFooter'
import { TaskPreview } from '../Task/TaskPreview'
import { Drag } from '../DragDrop/DragDropSystem'

export function BoardGroup({ board, group, onUpdateGroup, activeItem, activeType, isDragging }) {
    const [isEditingGroupTitle, setIsEditingGroupTitle] = useState(false)
    const [editedGroupTitle, setEditedGroupTitle] = useState(group.title)
    const [isAddingTask, setIsAddingTask] = useState(false)
    const [newTaskTitle, setNewTaskTitle] = useState('')
    const [anchorEl, setAnchorEl] = useState(null)
    const [isCollapsed, setIsCollapsed] = useState(group.isCollapsed)
    
    // Ensure group always has a tasks array
    if (!group.tasks) {
        group.tasks = []
        onUpdateGroup(group)
    }

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
        <Drag.DragItem
            dragId={group.id}
            dragType="group"
            className={`cursor-grab ${activeItem === group.id && activeType === "group" && isDragging ? "hidden" : ""}`}
        >
            <section
                className={`board-group flex column ${isCollapsed ? 'collapsed' : ''} ${activeItem === group.id && activeType === "group" ? "rotate-3" : ""}`}
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

                <div className="tasks-container">
                    {(group.tasks || []).map((task, taskIndex) => (
                        <Drag.DropZones
                            key={task.id}
                            prevId={`${group.id}-${taskIndex}`}
                            nextId={`${group.id}-${taskIndex + 1}`}
                            dropType="task"
                            remember={true}
                        >
                            <Drag.DropGuide
                                dropId={`${group.id}-${taskIndex}`}
                                dropType="task"
                                className="task-preview bg-gray-200 h-20 mx-2 mb-2"
                            />

                            <Drag.DragItem
                                dragId={task.id}
                                dragType="task"
                                className={`cursor-grab ${activeItem === task.id && activeType === "task" && isDragging ? "hidden" : ""}`}
                            >
                                <TaskPreview
                                    task={task}
                                    isDragging={activeItem === task.id && activeType === "task"}
                                />
                            </Drag.DragItem>
                        </Drag.DropZones>
                    ))}

                    <Drag.DropZone
                        dropId={`${group.id}-${(group.tasks || []).length}`}
                        dropType="task"
                        remember={true}
                    >
                        <Drag.DropGuide
                            dropId={`${group.id}-${(group.tasks || []).length}`}
                            dropType="task"
                            className="task-preview bg-gray-200 h-20 mx-2"
                        />
                    </Drag.DropZone>
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
        </Drag.DragItem>
    )
}