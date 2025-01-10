import { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import { useSelector } from 'react-redux'

import { boardService } from '../services/board'
import { userService } from '../services/user'

import { showSuccessMsg, showErrorMsg } from '../services/event-bus.service'
import { loadBoard, addBoardMsg, addGroup, updateGroup } from '../store/actions/board.actions'

import { BoardGroup } from '../cmps/Group/BoardGroup'
import { AddGroupForm } from '../cmps/Group/AddGroupForm'
import { BoardHeader } from '../cmps/Board/BoardHeader'

export function BoardDetails() {

    const { boardId } = useParams()
    const board = useSelector(storeState => storeState.boardModule.board)

    const [isAddingGroup, setIsAddingGroup] = useState(false)
    const [newGroupTitle, setNewGroupTitle] = useState('')

    useEffect(() => {
        loadBoard(boardId)
    }, [boardId])


    // async function onAddBoardMsg(boardId) {
    //     try {
    //         await addBoardMsg(boardId, 'bla bla ' + parseInt(Math.random() * 10))
    //         showSuccessMsg(`Board msg added`)
    //     } catch (err) {
    //         showErrorMsg('Cannot add board msg')
    //     }
    // }

    async function onAddGroup(boardId) {
        if (!newGroupTitle) return
        const group = boardService.getEmptyGroup()
        group.title = newGroupTitle
        try {
            await addGroup(boardId, group)
            loadBoard(board._id)
            showSuccessMsg(`Group added (id: ${group.id})`)
            setIsAddingGroup(false)
        } catch (err) {
            console.log('Cannot add group', err)
            showErrorMsg('Cannot add group')
        }
    }

    async function onUpdateGroup(group, title) {
        if (!title) return

        const updatedGroup = {
            ...group,
            title: title
        }

        try {
            const savedGroup = await updateGroup(board._id, updatedGroup)
            loadBoard(board._id)
            showSuccessMsg(`Group updated, new title: ${savedGroup.title}`)
        } catch (err) {
            console.error('Cannot update group', err)
            showErrorMsg('Cannot update group')
        }
    }

    if (!board) return <div>Loading...</div>
    // console.log('🚀 board in BoardDetails:', board)

    return (
        <section className="board-details"> 
            <BoardHeader board={board} />
            {board && <div>
                <section className="group-container flex">
                    {board.groups.map(group => (
                        <BoardGroup
                            key={group.id}
                            board={board}
                            group={group}
                            onUpdateGroup={(group, title) => onUpdateGroup(group, title)}
                        />
                    ))}

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
