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
            // Initialize tasks arrays for all groups if they don't exist
            updatedBoard.groups = updatedBoard.groups.map(group => ({
                ...group,
                tasks: group.tasks || []
            }))
    
            if (dragType === "task") {
                const [targetGroupId, targetTaskIdxString] = drop.split("-")
                const targetTaskIdx = parseInt(targetTaskIdxString) || 0 // Default to 0 if NaN
                
                // Find source group and task
                let sourceGroupIdx = -1
                let sourceTaskIdx = -1
                let task = null
    
                // Find and remove task from source group
                for (let groupIdx = 0; groupIdx < updatedBoard.groups.length; groupIdx++) {
                    const taskIdx = updatedBoard.groups[groupIdx].tasks.findIndex(t => t.id === dragItem)
                    if (taskIdx !== -1) {
                        sourceGroupIdx = groupIdx
                        sourceTaskIdx = taskIdx
                        task = updatedBoard.groups[groupIdx].tasks[taskIdx]
                        updatedBoard.groups[groupIdx].tasks.splice(taskIdx, 1)
                        break
                    }
                }
    
                if (!task) return
    
                // Find target group
                const targetGroupIdx = updatedBoard.groups.findIndex(g => g.id === targetGroupId)
                if (targetGroupIdx === -1) return
    
                // Ensure target group has a tasks array
                if (!updatedBoard.groups[targetGroupIdx].tasks) {
                    updatedBoard.groups[targetGroupIdx].tasks = []
                }
    
                // Add task to new position
                updatedBoard.groups[targetGroupIdx].tasks.splice(targetTaskIdx, 0, task)
    
            } else if (dragType === "group") {
                const targetGroupIdx = parseInt(drop)
                const sourceGroupIdx = updatedBoard.groups.findIndex(g => g.id === dragItem)
                
                if (sourceGroupIdx === -1) return
    
                const [group] = updatedBoard.groups.splice(sourceGroupIdx, 1)
                updatedBoard.groups.splice(targetGroupIdx, 0, group)
            }
    
            // Optimistic update
            store.dispatch({ type: 'SET_BOARD', board: updatedBoard })
            await updateBoard(updatedBoard)
            showSuccessMsg('Board updated successfully')
        } catch (err) {
            console.error('Cannot update board', err)
            showErrorMsg('Cannot update board')
            loadBoard(board._id)
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
                    <pre> {JSON.stringify(board, null, 2)} </pre>
                </section>
            </div>
        </section>
    )
}
