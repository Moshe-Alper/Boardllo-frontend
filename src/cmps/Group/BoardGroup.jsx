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
    const [tasks, setTasks] = useState(group.tasks || [])
    const [anchorEl, setAnchorEl] = useState(null)
    const [isCollapsed, setIsCollapsed] = useState(group.isCollapsed)
    
    useEffect(() => {
        loadBoard(board._id)
    }, [board._id])

    useEffect(() => {
        setTasks(group.tasks || [])
    }, [group.tasks])

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

        setTasks(prevTasks => [...prevTasks, { ...task, id: 'temp-id' }])

        try {
            const savedTask = await addTask(board._id, group.id, task)
            setTasks(prevTasks => prevTasks.map(task =>
                task.id === 'temp-id' ? savedTask : task
            ))

            loadBoard(board._id)
            showSuccessMsg(`Task added (id: ${savedTask.id})`)
            setNewTaskTitle('')
        } catch (err) {
            console.log('Cannot add task', err)
            showErrorMsg('Cannot add task')
            setTasks(prevTasks => prevTasks.filter(task => task.id !== 'temp-id'))
        }
    }

    function handleMenuClick(ev) {
        setAnchorEl(ev.target)
    }

    function handleMenuClose() {
        setAnchorEl(null)
    }

    async function toggleCollapse() {
        setIsCollapsed(!isCollapsed)
        const updatedGroup = { 
            ...group, 
            isCollapsed: !group.isCollapsed 
        }
        try {
            await updateGroup(board._id, updatedGroup)
            if (!updatedGroup.isCollapsed) {
                setIsEditingGroupTitle(false)
            }
        } catch (err) {
            setIsCollapsed(isCollapsed)
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
                    taskCount={tasks.length}
                />

                <div className="tasks-container">
                    {tasks.map((task, taskIndex) => (
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
                        dropId={`${group.id}-${tasks.length}`}
                        dropType="task"
                        remember={true}
                    >
                        <Drag.DropGuide
                            dropId={`${group.id}-${tasks.length}`}
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