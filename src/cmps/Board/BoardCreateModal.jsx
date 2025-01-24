/* eslint-disable react/prop-types */

import { useState } from 'react';
import { X } from 'lucide-react';
import { addBoard, updateBoard } from '../../store/actions/board.actions.js';
import {
  showSuccessMsg,
  showErrorMsg,
} from '../../services/event-bus.service.js';
import { useNavigate } from 'react-router';

export function BoardCreateModal({ isOpen, onClose, position, board = null }) {
  const [title, setTitle] = useState(board?.title || '');
  const isEditing = !!board;
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!title.trim()) return;

    try {
      const boardData = {
        title: title.trim(),
        ...(isEditing && { _id: board._id }),
      };

      if (isEditing) {
        const savedBoard = await updateBoard({ ...board, ...boardData });
        showSuccessMsg(`Board "${title}" updated successfully`);
        onClose();
        return savedBoard;
      } else {
        const savedBoard = await addBoard(boardData);
        showSuccessMsg(`Board "${title}" created successfully`);
        navigate('/board');
        onClose();
        return savedBoard;
      }
    } catch (err) {
      showErrorMsg(`Cannot ${isEditing ? 'update' : 'create'} board`);
      console.error(`Failed to ${isEditing ? 'update' : 'create'} board:`, err);
    }
  };

  if (!isOpen) return null;

  return (
    <div
      className='board-create-menu'
      style={{ position: 'absolute', ...position }}
    >
      <div className='menu-header'>
        <h3>{isEditing ? 'Edit board' : 'Create board'}</h3>
        <button className='close-button' onClick={onClose}>
          <X size={16} />
        </button>
      </div>

      <div className='menu-content'>
        <div className='board-form'>
          <div className='input-wrapper'>
            <input
              type='text'
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder='Board title*'
              className={!title.trim() ? 'error' : ''}
            />
            {!title.trim() && (
              <span className='error-message'>👋 Board title is required</span>
            )}
          </div>

          <button
            className='submit-button'
            onClick={handleSubmit}
            disabled={!title.trim()}
          >
            {isEditing ? 'Save' : 'Create'}
          </button>
        </div>
      </div>
    </div>
  );
}
