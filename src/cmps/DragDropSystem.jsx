import { DragDropContext, Droppable, Draggable } from "react-beautiful-dnd"

export function GroupDragDropContainer({ items = [], onDragEnd, children }) {
    return (
        <DragDropContext onDragEnd={onDragEnd}>
            <Droppable droppableId="board" type="group" direction="horizontal">
                {(provided) => (
                    <ul 
                        className="groups-container"
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
        </DragDropContext>
    )
}

export function TaskDragDropContainer({ groupId, tasks = [], children }) {
    return (
        <Droppable droppableId={groupId} type="task">
            {(provided) => (
                <li 
                    className="tasks-container"
                    ref={provided.innerRef} 
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
                    {provided.placeholder}
                </li>
            )}
        </Droppable>
    )
}