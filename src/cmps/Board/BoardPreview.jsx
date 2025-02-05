/* eslint-disable react/prop-types */

import { Link } from 'react-router-dom';

export function BoardPreview({ board }) {
  return (
    <div className='board-preview'>
      <header>
        <Link to={`/board/${board._id}`}>
          <h3>{board.title}</h3>
        </Link>
      </header>

      {board.owner && (
        <p>
          Owner:{' '}
          <Link to={`/user/${board.owner._id}`}>{board.owner.fullname}</Link>
        </p>
      )}
    </div>
  );
}
