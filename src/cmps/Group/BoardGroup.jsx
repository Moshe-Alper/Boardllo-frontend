import { useEffect, useState } from 'react'
import { addTask, loadBoard } from '../../store/actions/board.actions'
import { boardService } from '../../services/board'

import { showSuccessMsg, showErrorMsg } from '../../services/event-bus.service'
import { BoardGroupHeader } from './BoardGroupHeader'
import { BoardGroupFooter } from './BoardGroupFooter'
import { TaskPreview } from '../Task/TaskPreview'

import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd'

export function BoardGroup({ board, group, onUpdateGroup }) {
    const [isEditingGroupTitle, setIsEditingGroupTitle] = useState(false)
    const [editedGroupTitle, setEditedGroupTitle] = useState(group.title)
    const [isAddingTask, setIsAddingTask] = useState(false)
    const [newTaskTitle, setNewTaskTitle] = useState('')
    const [tasks, setTasks] = useState(group.tasks)
    const [anchorEl, setAnchorEl] = useState(null)
    const [isCollapsed, setIsCollapsed] = useState(false)

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

        setTasks(prevTasks => [...prevTasks, { ...task, _id: 'temp-id' }])

        try {
            const savedTask = await addTask(board._id, group.id, task)
            setTasks(prevTasks => prevTasks.map(task =>
                task._id === 'temp-id' ? savedTask : task
            ))

            loadBoard(board._id)
            showSuccessMsg(`Task added (id: ${savedTask.id})`)
            setNewTaskTitle('')
        } catch (err) {
            console.log('Cannot add task', err)
            showErrorMsg('Cannot add task')
            setTasks(prevTasks => prevTasks.filter(task => task._id !== 'temp-id'))
        }
    }

    function handleMenuClick(ev) {
        setAnchorEl(ev.target)
    }

    function handleMenuClose() {
        setAnchorEl(null)
    }
    function toggleCollapse() {
        setIsCollapsed(!isCollapsed)
        if (!isCollapsed) {
            setIsEditingGroupTitle(false)
        }
    }

    function handleGroupClick() {
        if (isCollapsed) {
            setIsCollapsed(false)
        }
    }

    function handleDragDrop(results) {
        const { source, destination, type } = results

        if (!destination) return
        if (source.droppableId === destination.droppableId && 
            source.index === destination.index) 
        return
        if (type === "task") {
            const reorderedTasks = Array.from(tasks)
            const sourceIdx = source.index
            const destinationIdx = destination.index
            const [removedTask] = reorderedTasks.splice(sourceIdx, 1)
            reorderedTasks.splice(destinationIdx, 0, removedTask)
            setTasks(reorderedTasks)
            onUpdateGroup({ ...group, tasks: reorderedTasks }, group.title)
        }
    }

    if (!group) return <div>Loading...</div>

    return (
        <section
            className={`board-group flex column ${isCollapsed ? 'collapsed' : ''}`}
            onClick={handleGroupClick}
        >
            <DragDropContext onDragEnd={handleDragDrop}>
                <Droppable droppableId="Root" type="task">
                    {(provided) => (
                        <div {...provided.droppableProps} ref={provided.innerRef}>
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
                                isCollapsed={isCollapsed}
                                onToggleCollapse={toggleCollapse}
                                taskCount={tasks.length}
                            />

                            <div className="tasks-container">
                                {tasks.map((task, index) => (
                                    <Draggable
                                        key={task.id}
                                        draggableId={task.id}
                                        index={index}>
                                        {(provided) => (
                                            <div
                                                ref={provided.innerRef}
                                                {...provided.draggableProps}
                                                {...provided.dragHandleProps}
                                            >
                                                <TaskPreview task={task} />
                                            </div>
                                        )}
                                    </Draggable>
                                ))}
                                {provided.placeholder}
                            </div>

                            <BoardGroupFooter
                                group={group}
                                isAddingTask={isAddingTask}
                                setIsAddingTask={setIsAddingTask}
                                newTaskTitle={newTaskTitle}
                                handleTitleChange={handleTaskTitleChange}
                                onAddTask={onAddTask}
                            />
                            {/* {provided.placeholder} */}
                        </div>
                    )}
                </Droppable>
            </DragDropContext>
        </section>
    )
}