import { DragDropContext, Droppable, Draggable } from "react-beautiful-dnd"
import { svgService } from "../services/svg.service"
import { forwardRef } from 'react'


export function MemberDraggable({ member, index }) {
    return (
        <Draggable draggableId={member._id} index={index}>
            {(provided, snapshot) => (
                <div
                    ref={provided.innerRef}
                    {...provided.draggableProps}
                    {...provided.dragHandleProps}
                    className="member"
                >
                    <img src={member.imgUrl} alt={member.fullname} />
                </div>
            )}
        </Draggable>
    )
}

export function GroupDragDropContainer({ items = [], onDragEnd, children }) {
    return (
            <Droppable droppableId="board" type="group" direction="horizontal">
                {(provided) => (
                    <ul 
                        className="board-content"
                        ref={provided.innerRef} 
                        {...provided.droppableProps}
                        
                    >
                        {items.map((item, index) => (
                            <Draggable 
                                key={item.id} 
                                draggableId={item.id} 
                                index={index}
                            >
                                {(provided, snapshot) => (
                                    <div
                                        ref={provided.innerRef}
                                        {...provided.draggableProps}
                                        {...provided.dragHandleProps}
                                    >
                                        {children(item, index, snapshot.isDragging)}
                                    </div>
                                )}
                            </Draggable>
                        ))}
                        {provided.placeholder}
                    </ul>
                )}
            </Droppable>
    )
}

export function TaskDragDropContainer({ groupId, tasks = [], children, isAddingTask, setIsAddingTask, newTaskTitle, handleTitleChange, onAddTask, tasksContainerRef }) {
    
    function handleKeyPress(ev) {
        if (ev.key === 'Enter' && !ev.shiftKey) {
            ev.preventDefault()
            onAddTask(ev)
        }
    }
    return (
        <Droppable droppableId={groupId} type="task">
            {(provided) => (
                <li
                    className="tasks-container"
                    ref={(el) => {
                        provided.innerRef(el)
                        if (tasksContainerRef) tasksContainerRef.current = el
                    }}
                    {...provided.droppableProps}
                >
                    {tasks.map((task, index) => (
                        <Draggable
                            key={task.id}
                            draggableId={task.id}
                            index={index}
                        >
                            {(provided, snapshot) => (
                                <div
                                    ref={provided.innerRef}
                                    {...provided.draggableProps}
                                    {...provided.dragHandleProps}
                                >
                                    {children(task, index, snapshot.isDragging)}
                                </div>
                            )}
                        </Draggable>
                    ))}
                    {isAddingTask && (
                        <form className="add-task-container" onSubmit={onAddTask}>
                            <textarea
                                placeholder="Enter task title or paste a link"
                                value={newTaskTitle}
                                onChange={handleTitleChange}
                                onKeyDown={handleKeyPress}
                            />
                            <div className="add-task-btn-container">
                                <button type="submit" className="add-task-btn-active">Add card</button>
                                <button
                                    type="button"
                                    className="cancel-btn"
                                    onClick={() => setIsAddingTask(false)}
                                >
                                    <img src={svgService.closeIcon} alt="Cancel" />
                                </button>
                            </div>
                        </form>
                    )}
                    {provided.placeholder}
                </li>
            )}
        </Droppable>
    )
}