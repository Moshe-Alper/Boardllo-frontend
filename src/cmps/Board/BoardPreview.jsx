import { Link } from 'react-router-dom'

export function BoardPreview({ board }) {
    return (
        <article className="preview">
            <header>
                <Link to={`/board/${board._id}`}>{board.title}</Link>
            </header>

            {board.owner && <p>Owner: <Link to={`/user/${board.owner._id}`}>{board.owner.fullname}</Link></p>}

        </article>
    )
}