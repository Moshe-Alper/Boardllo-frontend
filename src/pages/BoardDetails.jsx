import { useEffect } from 'react'
import { useParams } from 'react-router-dom'
import { useSelector } from 'react-redux'
import { Link } from 'react-router-dom'

import { showSuccessMsg, showErrorMsg } from '../services/event-bus.service'
import { loadBoard, addBoardMsg } from '../store/board.actions'


export function BoardDetails() {

    const { boardId } = useParams()
    const board = useSelector(storeState => storeState.boardModule.board)

    useEffect(() => {
        loadBoard(boardId)
    }, [boardId])

    async function onAddBoardMsg(boardId) {
        try {
            await addBoardMsg(boardId, 'bla bla ' + parseInt(Math.random() * 10))
            showSuccessMsg(`Board msg added`)
        } catch (err) {
            showErrorMsg('Cannot add board msg')
        }

    }

    return (
        <section className="board-details">
            <Link to="/board">Back to list</Link>
            <h1>Board Details</h1>
            {board && <div>
                <h3>{board.title}</h3>
                <pre> {JSON.stringify(board, null, 2)} </pre>
            </div>
            }
            <button onClick={() => { onAddBoardMsg(board._id) }}>Add board msg</button>

        </section>
    )
}