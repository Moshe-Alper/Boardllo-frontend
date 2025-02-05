/* eslint-disable react/prop-types */

import { Pencil, Trash2 } from 'lucide-react';
import { userService } from '../../services/user';
import { BoardPreview } from './BoardPreview';

export function BoardList({ boards, onRemoveBoard, onUpdateBoard }) {
  function shouldShowActionBtns(board) {
    const user = userService.getLoggedinUser();
    if (!user) return false;
    if (user.isAdmin) return true;
    return board.owner?._id === user._id;
  }

  return (
    <section className='board-list'>
      {boards.map((board) => (
        <article key={board._id}>
          <BoardPreview board={board} />
          {shouldShowActionBtns(board) && (
            <div className='actions'>
              <button onClick={() => onUpdateBoard(board)}>
                <Pencil size={14} />
              </button>
              <button onClick={() => onRemoveBoard(board._id)}>
                <Trash2 size={14} />
              </button>
            </div>
          )}
        </article>
      ))}
    </section>
  );
}
