import React, { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import { useSelector } from 'react-redux'
import { boardService } from '../services/board'
import { showSuccessMsg, showErrorMsg } from '../services/event-bus.service'
import { loadBoard, updateBoard, addGroup, loadBoardsToSidebar } from '../store/actions/board.actions'
import { BoardGroup } from '../cmps/Group/BoardGroup'
import { AddGroupForm } from '../cmps/Group/AddGroupForm'
import { BoardHeader } from '../cmps/Board/BoardHeader'
import { BoardSidebar } from '../cmps/Board/BoardSidebar'
import { Drag } from '../cmps/DragDrop/DragDropSystem'
import { store } from '../store/store'

export function BoardDetails() {
    const { boardId } = useParams()
    const board = useSelector(storeState => storeState.boardModule.board)
    const [isAddingGroup, setIsAddingGroup] = useState(false)
    const [newGroupTitle, setNewGroupTitle] = useState('')
    const [isSidebarOpen, setIsSidebarOpen] = useState(false)
    const [boards, setBoards] = useState([])

    function toggleSidebar() {
        setIsSidebarOpen(!isSidebarOpen)
    }

    useEffect(() => {
        loadBoard(boardId)
        loadBoardsToSidebar()
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
        if (!board) return
        const updatedBoard = structuredClone(board)
        
        try {
            if (dragType === "task") {
                // Handle dropping task into a group (either empty or with tasks)
                const [targetGroupId, targetTaskIdxString] = drop.split("-")
                const targetTaskIdx = parseInt(targetTaskIdxString)
    
                // Find source group and task
                let sourceGroupIdx = -1
                let sourceTaskIdx = -1
    
                updatedBoard.groups.forEach((group, groupIdx) => {
                    if (!group.tasks) group.tasks = [] // Ensure tasks exist on each group
                    const taskIdx = group.tasks.findIndex(task => task.id === dragItem)
                    if (taskIdx !== -1) {
                        sourceGroupIdx = groupIdx
                        sourceTaskIdx = taskIdx
                    }
                })
    
                if (sourceGroupIdx === -1) return
    
                // Get task and remove from old position
                const [task] = updatedBoard.groups[sourceGroupIdx].tasks.splice(sourceTaskIdx, 1)
    
                // Find target group and ensure it has a tasks array
                const targetGroupIdx = updatedBoard.groups.findIndex(group => group.id === targetGroupId)
                if (targetGroupIdx === -1) return
    
                if (!updatedBoard.groups[targetGroupIdx].tasks) {
                    updatedBoard.groups[targetGroupIdx].tasks = [] // Initialize tasks if empty
                }
    
                // Add task to new position in the target group
                updatedBoard.groups[targetGroupIdx].tasks.splice(targetTaskIdx, 0, task)
    
            } else if (dragType === "group") {
                // Handle group-to-group drag and drop
                const targetGroupIdx = parseInt(drop)
    
                // Find source group
                const sourceGroupIdx = updatedBoard.groups.findIndex(group => group.id === dragItem)
                if (sourceGroupIdx === -1) return
    
                // Get group and remove from old position
                const [group] = updatedBoard.groups.splice(sourceGroupIdx, 1)
    
                // Add group to new position
                updatedBoard.groups.splice(targetGroupIdx, 0, group)
            }
    
            // Optimistic
            store.dispatch({ type: 'SET_BOARD', board: updatedBoard });
            await updateBoard(updatedBoard)
            showSuccessMsg('Board updated successfully')
        } catch (err) {
            console.error('Cannot update board', err)
            showErrorMsg('Cannot update board')
            // Optimistic error handling
            loadBoard(board.id)
        }
    }
    
    if (!board) return <div>Loading...</div>

    return (
        <section className="board-details">
            <BoardHeader board={board} />
            <div>
                <BoardSidebar isOpen={isSidebarOpen} toggleDrawer={toggleSidebar} boards={boards} />
            </div>
            <div>
                <section className="group-container">
                    <Drag handleDrop={handleDrop}>
                        {({ activeItem, activeType, isDragging }) => (
                            <Drag.DropZone className="flex overflow-x-auto">
                                {board.groups.map((group, groupIdx) => (
                                    <React.Fragment key={group.id}>
                                        <Drag.DropZone
                                            dropId={groupIdx.toString()} 
                                            dropType="group"  
                                            remember={true}
                                        >
                                            <Drag.DropGuide
                                                dropId={groupIdx.toString()}
                                                dropType="group"
                                                className="board-group"
                                            />
                                        </Drag.DropZone>

                                        <Drag.DropZones
                                            prevId={groupIdx.toString()}
                                            nextId={(groupIdx + 1).toString()}
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
                                                    const index = newBoard.groups.findIndex(group => group.id === updatedGroup.id)
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
