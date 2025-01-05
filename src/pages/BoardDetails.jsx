import { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import { useSelector } from 'react-redux'
import { Link } from 'react-router-dom'

import { boardService } from '../services/board'
import { userService } from '../services/user'

import { showSuccessMsg, showErrorMsg } from '../services/event-bus.service'
import { loadBoard, addBoardMsg, addGroup, updateGroup, loadGroups } from '../store/board.actions'

import { BoardGroup } from '../cmps/BoardGroup'

export function BoardDetails() {

    const { boardId } = useParams()
    const board = useSelector(storeState => storeState.boardModule.board)

    useEffect(() => {
        loadBoard(boardId)
    }, [boardId])


    useEffect(() => {
        if (board && board.groups) {
            loadGroups(board._id)
        }
    }, [board])
    
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
        } catch (err) {
            console.log('Cannot add group', err)
            showErrorMsg('Cannot add group')
        }
    }

    async function onUpdateGroup(group) {
        const title = prompt('New title?', group.title)
        if (title === null) return alert('Invalid title')
        const groupToSave = { ...group, title }
        // console.log('🚀 groupToSave', groupToSave)
        try {
            const savedGroup = await updateGroup(board._id, groupToSave)
            showSuccessMsg(`Group updated, new title: ${savedGroup.title}`)
        } catch (err) {
            showErrorMsg('Cannot update group')
        }
    }

    
    if (!board) return <div>Loading...</div>
    // console.log('🚀 board', board)
    
    return (
        <section className="board-details">
            <Link to="/board">Back to list</Link>
                <h3>{board.title}</h3>
            {board && <div>
                {userService.getLoggedinUser() && <button onClick={() => { onAddGroup(board._id) }}>+ Add another list</button>}
                <section className="group-container flex">
                {board.groups.map(group => (
                    <BoardGroup
                    key={group.id}
                    board={board}
                    group={group}
                    onUpdateGroup={onUpdateGroup}
                    />
                ))}
                </section>
                <pre> {JSON.stringify(board, null, 2)} </pre>
            </div>
            }
            <button onClick={() => { onAddBoardMsg(board._id) }}>Add board msg</button>

        </section>
    )
}