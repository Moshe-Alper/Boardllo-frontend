import { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import { useSelector } from 'react-redux'

import { boardService } from '../services/board'
import { userService } from '../services/user'

import { showSuccessMsg, showErrorMsg } from '../services/event-bus.service'
import { loadBoard, updateBoard, addGroup, updateGroup } from '../store/actions/board.actions'

import { BoardGroup } from '../cmps/Group/BoardGroup'
import { AddGroupForm } from '../cmps/Group/AddGroupForm'
import { BoardHeader } from '../cmps/Board/BoardHeader'
import { DragDropContainer } from '../cmps/DragDropContainer'
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

    async function onUpdateGroup(updatedGroup) {
        try {
            const savedGroup = await updateGroup(board._id, updatedGroup)
            loadBoard(board._id)
            showSuccessMsg(`Group updated successfully (id: ${savedGroup.id})`)
        } catch (err) {
            console.error('Cannot update group', err)
            showErrorMsg('Cannot update group')
        }
    }

    async function handleDragDropGroup(result) {
        const { destination, source } = result
        
        if (!destination) return 
        
        if (destination.index === source.index) return
        
        const newGroups = Array.from(board.groups)
        const [movedGroup] = newGroups.splice(source.index, 1)
        newGroups.splice(destination.index, 0, movedGroup) 
        
        const updatedBoard = { ...board, groups: newGroups } 

        store.dispatch({ type: 'SET_BOARD', board: updatedBoard })
        try {
            const savedBoard = await updateBoard(updatedBoard)
            showSuccessMsg(`Board updated with new group order (id: ${savedBoard._id})`)
        } catch (err) {
            console.error('Cannot update board order', err)
            showErrorMsg('Cannot update board order')
            store.dispatch({ type: 'SET_BOARD', board })
        }
    }
    
    
    if (!board) return <div>Loading...</div>

    return (
        <section className="board-details">
            <BoardHeader board={board} />
            {board && <div>
                <section className="group-container flex">
                    <DragDropContainer
                        items={board.groups}
                        onDragEnd={handleDragDropGroup}
                        droppableId="board-groups"
                        type="group"
                    >
                        {(group) => (
                            <BoardGroup
                                key={group.id}
                                board={board}
                                group={group}
                                onUpdateGroup={(updatedGroup) => updateGroup(board._id, updatedGroup)}
                            />
                        )}
                    </DragDropContainer>

                    {isAddingGroup ? (
                        <AddGroupForm
                            board={board}
                            newGroupTitle={newGroupTitle}
                            setNewGroupTitle={setNewGroupTitle}
                            onAddGroup={() => onAddGroup(board._id)}
                            setIsAddingGroup={setIsAddingGroup}
                        />
                    ) : (
                        userService.getLoggedinUser() && (
                            <button
                                className="new-list-btn"
                                onClick={() => setIsAddingGroup(true)}
                                aria-label="Add a list"
                            >
                                {board.groups.length ? 'Add another list' : 'Add a list'}
                            </button>
                        )
                    )}
                </section>

                <pre>{JSON.stringify(board, null, 2)}</pre>
            </div>}

            {/* <button onClick={() => { onAddBoardMsg(board._id) }}>Add board msg</button> */}
        </section>
    )
}
