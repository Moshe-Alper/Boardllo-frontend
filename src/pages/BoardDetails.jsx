import { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import { useSelector } from 'react-redux'
import { Link } from 'react-router-dom'

import { showSuccessMsg, showErrorMsg } from '../services/event-bus.service'
import { boardService } from '../services/board'
import { userService } from '../services/user'
import { loadBoard, addBoardMsg, addGroup, loadGroups } from '../store/board.actions'

import { BoardGroup } from '../cmps/BoardGroup'

export function BoardDetails() {

    const { boardId } = useParams()
    const board = useSelector(storeState => storeState.boardModule.board)

    const [isGroupsUpdated, setIsGroupsUpdated] = useState(false)

    useEffect(() => {
        loadBoard(boardId)
    }, [boardId])


    useEffect(() => {
        if (boardId) {
            loadGroups(boardId)
        }
    }, [boardId, isGroupsUpdated])

    async function onAddBoardMsg(boardId) {
        try {
            await addBoardMsg(boardId, 'bla bla ' + parseInt(Math.random() * 10))
            showSuccessMsg(`Board msg added`)
        } catch (err) {
            showErrorMsg('Cannot add board msg')
        }

    }

    async function onAddGroup(boardId) {
        const group = boardService.getEmptyGroup()
        group.title = 'Group ' + Math.floor(Math.random() * 100)
        try {
            await addGroup(boardId, group)
            showSuccessMsg(`Group added (id: ${group.id})`)
            setIsGroupsUpdated(prev => !prev)
        } catch (err) {
            console.log('Cannot add group', err)
            showErrorMsg('Cannot add group')
        }
    }

    async function onUpdateGroup(group) {
        const title = prompt('New title?', group.title)
        if (!title) return
        const groupToSave = { ...group, title }
        try {
            const savedGroup = await boardService.updateGroup(board._id, groupToSave)
            showSuccessMsg(`Group updated, new title: ${savedGroup.title}`)
            setIsGroupsUpdated(prev => !prev) 
        } catch (err) {
            showErrorMsg('Cannot update group')
        }
    }
    if (!board) return <div>Loading...</div>
    // console.log('🚀 board', board)
    
    return (
        <section className="board-details">
            <Link to="/board">Back to list</Link>
            <h1>Board Details</h1>
            {board && <div>
                <h3>{board.title}</h3>
                {userService.getLoggedinUser() && <button onClick={() => { onAddGroup(board._id) }}>Add a Group</button>}
                <h3>🍎Groups list:🍎</h3>
                {board.groups.map(group => (
                    <BoardGroup
                        key={group.id}
                        board={board}
                        group={group}
                        onUpdateGroup={onUpdateGroup}
                    />
                ))}
                <pre> {JSON.stringify(board, null, 2)} </pre>
            </div>
            }
            <button onClick={() => { onAddBoardMsg(board._id) }}>Add board msg</button>

        </section>
    )
}