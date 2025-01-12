import React, { createContext, useState, useEffect, useContext } from 'react'
import { Card } from '@/components/ui/card'

// Create drag context
const DragContext = createContext()

// Main drag provider component
export function DragDropProvider({ onDrop, children }) {
  const [dragType, setDragType] = useState(null)
  const [dragItem, setDragItem] = useState(null)
  const [isDragging, setIsDragging] = useState(false)
  const [dropZone, setDropZone] = useState(null)

  useEffect(() => {
    document.body.style.cursor = dragItem ? "grabbing" : "default"
  }, [dragItem])

  const handleDragStart = (e, id, type) => {
    e.stopPropagation()
    e.dataTransfer.effectAllowed = 'move'
    setDragItem(id)
    setDragType(type)
  }

  const handleDrag = () => {
    setIsDragging(true)
  }

  const handleDragEnd = () => {
    setDragItem(null)
    setDragType(null)
    setIsDragging(false)
    setDropZone(null)
  }

  const handleDrop = (e) => {
    e.preventDefault()
    onDrop({ dragItem, dragType, dropZone })
    handleDragEnd()
  }

  return (
    <DragContext.Provider value={{
      dragItem,
      dragType,
      isDragging,
      dropZone,
      setDropZone,
      onDragStart: handleDragStart,
      onDrag: handleDrag,
      onDragEnd: handleDragEnd,
      onDrop: handleDrop
    }}>
      {children}
    </DragContext.Provider>
  )
}

// Draggable item component
export function DraggableItem({ id, type, className, children }) {
  const { onDragStart, onDrag, onDragEnd, dragItem, dragType, isDragging } = useContext(DragContext)
  
  return (
    <div
      draggable={true}
      onDragStart={(e) => onDragStart(e, id, type)}
      onDrag={onDrag}
      onDragEnd={onDragEnd}
      className={`cursor-grab ${dragItem === id && dragType === type && isDragging ? 'opacity-50' : ''} ${className}`}
    >
      {children}
    </div>
  )
}

// Drop zone component
export function DropZone({ id, type, className, children }) {
  const { dragItem, dragType, setDropZone, onDrop } = useContext(DragContext)

  const handleDragOver = (e) => {
    e.preventDefault()
    if (dragType === type) {
      setDropZone(id)
    }
  }

  return (
    <div
      onDragOver={handleDragOver}
      onDrop={onDrop}
      className={`relative ${className || ''}`}
    >
      {children}
      {dragType === type && (
        <div className="absolute inset-0 bg-blue-100/20 border-2 border-dashed border-blue-300 rounded-lg pointer-events-none" />
      )}
    </div>
  )
}

// Modified BoardGroup component
export function BoardGroup({ board, group, onUpdateGroup }) {
  return (
    <DraggableItem id={group.id} type="group" className="w-80 shrink-0">
      <Card className="bg-gray-50 p-4">
        <h3 className="font-semibold text-lg mb-4">{group.title}</h3>
        <div className="space-y-2">
          {group.tasks.map((task, index) => (
            <DropZone key={`${group.id}-${index}`} id={`${group.id}-${index}`} type="task">
              <DraggableItem id={task.id} type="task">
                <Card className="p-3 bg-white hover:bg-gray-50">
                  <p>{task.title}</p>
                </Card>
              </DraggableItem>
            </DropZone>
          ))}
          <DropZone id={`${group.id}-${group.tasks.length}`} type="task" className="h-20" />
        </div>
      </Card>
    </DraggableItem>
  )
}

// Modified BoardDetails component
export default function BoardDetails({ board, onUpdateBoard }) {
  const handleDrop = ({ dragItem, dragType, dropZone }) => {
    if (!board) return

    if (dragType === "task") {
      // Handle task drops
      const [targetGroupId, newIndexStr] = dropZone.split("-")
      const newIndex = parseInt(newIndexStr)

      // Find the task and its current group
      let sourceGroupIndex = -1
      let taskIndex = -1
      const task = board.groups.find((group, groupIndex) => {
        const index = group.tasks.findIndex(t => t.id === dragItem)
        if (index !== -1) {
          sourceGroupIndex = groupIndex
          taskIndex = index
          return true
        }
        return false
      })?.tasks[taskIndex]

      if (!task) return

      // Create new board state
      const newGroups = [...board.groups]
      
      // Remove task from source group
      newGroups[sourceGroupIndex].tasks.splice(taskIndex, 1)
      
      // Find target group index
      const targetGroupIndex = newGroups.findIndex(g => g.id === targetGroupId)
      
      // Add task to target group
      newGroups[targetGroupIndex].tasks.splice(newIndex, 0, task)

      // Update board
      onUpdateBoard({ ...board, groups: newGroups })
      
    } else if (dragType === "group") {
      // Handle group drops
      const newIndex = parseInt(dropZone)
      const oldIndex = board.groups.findIndex(g => g.id === dragItem)
      
      if (oldIndex === -1) return

      const newGroups = [...board.groups]
      const [movedGroup] = newGroups.splice(oldIndex, 1)
      newGroups.splice(newIndex, 0, movedGroup)

      onUpdateBoard({ ...board, groups: newGroups })
    }
  }

  if (!board) return <div>Loading...</div>

  return (
    <DragDropProvider onDrop={handleDrop}>
      <div className="flex gap-4 p-4 overflow-x-auto">
        {board.groups.map((group, index) => (
          <React.Fragment key={group.id}>
            <DropZone id={index.toString()} type="group">
              <BoardGroup 
                board={board} 
                group={group} 
                onUpdateGroup={onUpdateBoard} 
              />
            </DropZone>
          </React.Fragment>
        ))}
        <DropZone id={board.groups.length.toString()} type="group" className="w-80 h-96" />
      </div>
    </DragDropProvider>
  )
}