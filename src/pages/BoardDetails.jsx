import React, { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import { useSelector } from 'react-redux'
import { boardService } from '../services/board'
import { userService } from '../services/user'
import { showSuccessMsg, showErrorMsg } from '../services/event-bus.service'
import { loadBoard, updateBoard, addGroup } from '../store/actions/board.actions'
import { BoardGroup } from '../cmps/Group/BoardGroup'
import { AddGroupForm } from '../cmps/Group/AddGroupForm'
import { BoardHeader } from '../cmps/Board/BoardHeader'
import { Drag } from '../cmps/DragDrop/DragDropSystem'
import { store } from '../store/store'

export function BoardDetails() {
    const { boardId } = useParams()
    const board = useSelector(storeState => storeState.boardModule.board)
    const [isAddingGroup, setIsAddingGroup] = useState(false)
    const [newGroupTitle, setNewGroupTitle] = useState('')

    useEffect(() => {
        loadBoard(boardId)
    }, [boardId])

    async function onAddGroup(boardId) {
        if (!newGroupTitle.trim()) {
            showErrorMsg('Group title cannot be empty')
            setIsAddingGroup(false)
            return
        }
        const group = boardService.getEmptyGroup()
        group.title = newGroupTitle

        try {
            const savedGroup = await addGroup(boardId, group)
            showSuccessMsg(`Group added (id: ${savedGroup.id})`)
            loadBoard(board._id)
            setNewGroupTitle('')
            setIsAddingGroup(false)
        } catch (err) {
            console.log('Cannot add group', err)
            showErrorMsg('Cannot add group')
        }
    }

    async function handleDrop({ dragItem, dragType, drop }) {
        // console.log('Drop event:', { dragItem, dragType, drop })
    
        if (!board) return
        const newBoard = structuredClone(board)
    
        try {
            if (dragType === "task") {
                const [targetGroupId, newIndexStr] = drop.split("-")
                const newIndex = parseInt(newIndexStr)
    
                // Find source group and task
                let sourceGroupIndex = -1
                let taskIndex = -1
    
                newBoard.groups.forEach((group, gIndex) => {
                    if (!group.tasks) group.tasks = []
                    const tIndex = group.tasks.findIndex(t => t.id === dragItem)
                    if (tIndex !== -1) {
                        sourceGroupIndex = gIndex
                        taskIndex = tIndex
                    }
                })
    
                if (sourceGroupIndex === -1) return
    
                // Get task and remove from old position
                const [task] = newBoard.groups[sourceGroupIndex].tasks.splice(taskIndex, 1)
    
                // Find target group and ensure it has a tasks array
                const targetGroupIndex = newBoard.groups.findIndex(g => g.id === targetGroupId)
                if (!newBoard.groups[targetGroupIndex].tasks) {
                    newBoard.groups[targetGroupIndex].tasks = []
                }
    
                // Add task to new position
                newBoard.groups[targetGroupIndex].tasks.splice(newIndex, 0, task)
    
            } else if (dragType === "group") {
                const newIndex = parseInt(drop)
    
                // Find source group
                const sourceGroupIndex = newBoard.groups.findIndex(g => g.id === dragItem)
                if (sourceGroupIndex === -1) return
    
                // Get group and remove from old position
                const [group] = newBoard.groups.splice(sourceGroupIndex, 1)
    
                // Add group to new position
                newBoard.groups.splice(newIndex, 0, group)
            }
    
            console.log('Updating board:', newBoard)
            await updateBoard(newBoard)
            store.dispatch({ type: 'SET_BOARD', board: newBoard })
            showSuccessMsg('Board updated successfully')
        } catch (err) {
            console.error('Cannot update board', err)
            showErrorMsg('Cannot update board')
            loadBoard(boardId)
        }
    }

    if (!board) return <div>Loading...</div>

    return (
        <section className="board-details">
            <BoardHeader board={board} />
            <div>
                <section className="group-container">
                    <Drag handleDrop={handleDrop}>
                        {({ activeItem, activeType, isDragging }) => (
                            <Drag.DropZone className="flex overflow-x-auto">
                                {board.groups.map((group, groupIndex) => (
                                    <React.Fragment key={group.id}>
                                        {/* Drop zone for group positioning */}
                                        <Drag.DropZone 
                                            dropId={groupIndex.toString()} 
                                            dropType="group" 
                                            remember={true}
                                        >
                                            <Drag.DropGuide 
                                                dropId={groupIndex.toString()}
                                                dropType="group" 
                                                className="board-group" 
                                            />
                                        </Drag.DropZone>
    
                                        <Drag.DropZones 
                                            prevId={groupIndex.toString()}
                                            nextId={(groupIndex + 1).toString()}
                                            dropType="group"
                                            split="x"
                                            remember={true}
                                        >
                                            <BoardGroup
                                                board={board}
                                                group={group}
                                                activeItem={activeItem}
                                                activeType={activeType}
                                                isDragging={isDragging}
                                                onUpdateGroup={(updatedGroup) => {
                                                    const newBoard = { ...board }
                                                    const index = newBoard.groups.findIndex(g => g.id === updatedGroup.id)
                                                    if (index !== -1) {
                                                        newBoard.groups[index] = updatedGroup
                                                        updateBoard(newBoard)
                                                    }
                                                }}
                                            />
                                        </Drag.DropZones>
                                    </React.Fragment>
                                ))}
    
                                <Drag.DropZone 
                                    dropId={board.groups.length.toString()} 
                                    dropType="group" 
                                    remember={true}
                                >
                                    {isAddingGroup ? (
                                        <AddGroupForm
                                            board={board}
                                            newGroupTitle={newGroupTitle}
                                            setNewGroupTitle={setNewGroupTitle}
                                            onAddGroup={() => onAddGroup(board._id)}
                                            setIsAddingGroup={setIsAddingGroup}
                                        />
                                    ) : (
                                        <button
                                            className="new-list-btn"
                                            onClick={() => setIsAddingGroup(true)}
                                        >
                                            {board.groups.length ? 'Add another list' : 'Add a list'}
                                        </button>
                                    )}
                                </Drag.DropZone>
                            </Drag.DropZone>
                        )}
                    </Drag>
                </section>
            </div>
        </section>
    )
}