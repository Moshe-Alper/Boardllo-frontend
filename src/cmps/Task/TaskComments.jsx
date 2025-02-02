import React, { useState, useEffect } from 'react'
import { useSelector } from 'react-redux'
import { socketService } from '../../services/socket.service'
import { boardService } from '../../services/board'
import { showSuccessMsg, showErrorMsg } from '../../services/event-bus.service'
import { userService } from '../../services/user'

export function TaskComments({ boardId, groupId, taskId }) {
    const [comment, setComment] = useState('')
    const [isTyping, setIsTyping] = useState(false)
    const [typingUser, setTypingUser] = useState('')
    const [editingCommentId, setEditingCommentId] = useState(null)
    const [editText, setEditText] = useState('')

    const loggedInUser = useSelector((storeState) => storeState.userModule.user)
    const board = useSelector(storeState => storeState.boardModule.board)
    const task = board?.groups
        ?.find(g => g.id === groupId)
        ?.tasks?.find(t => t.id === taskId)

    useEffect(() => {
        if (!task) return

        socketService.emit('join-task', taskId)

        socketService.on('user-typing', ({ username }) => {
            if (username !== loggedInUser?.fullname) {
                setTypingUser(username)
                setIsTyping(true)
            }
        })

        socketService.on('user-stopped-typing', () => {
            setTypingUser('')
            setIsTyping(false)
        })

        socketService.on('comment-added', refreshBoard)
        socketService.on('comment-updated', refreshBoard)
        socketService.on('comment-removed', refreshBoard)

        return () => {
            socketService.emit('leave-task', taskId)
            socketService.off('user-typing')
            socketService.off('user-stopped-typing')
            socketService.off('comment-added')
            socketService.off('comment-updated')
            socketService.off('comment-removed')
        }
    }, [taskId, loggedInUser])

    const refreshBoard = async () => {
        try {
            const updatedBoard = await boardService.getById(boardId)
            // Dispatch to your store to update the board
        } catch (err) {
            console.error('Failed to refresh board:', err)
        }
    }

    const handleTyping = () => {
        socketService.emit('user-typing', {
            taskId,
            username: loggedInUser?.fullname
        })

        if (window.typingTimeout) {
            clearTimeout(window.typingTimeout)
        }
        window.typingTimeout = setTimeout(() => {
            socketService.emit('user-stopped-typing', { taskId })
        }, 1000)
    }

    const handleSubmitComment = async (ev) => {
        ev.preventDefault()
        if (!comment.trim()) return

        try {
            const newComment = await boardService.addTaskComment(
                boardId,
                groupId,
                taskId,
                comment.trim()
            )

            socketService.emit('comment-added', {
                taskId,
                comment: newComment
            })

            setComment('')
            showSuccessMsg('Comment added successfully')

        } catch (err) {
            console.error('Failed to add comment:', err)
            showErrorMsg('Failed to add comment')
        }
    }

    const startEditing = (comment) => {
        setEditingCommentId(comment.id)
        setEditText(comment.txt)
    }

    const cancelEditing = () => {
        setEditingCommentId(null)
        setEditText('')
    }

    const handleUpdateComment = async (commentId) => {
        if (!editText.trim()) return

        try {
            const updatedComment = await boardService.updateTaskComment(
                boardId,
                groupId,
                taskId,
                commentId,
                editText.trim()
            )

            socketService.emit('comment-updated', {
                taskId,
                comment: updatedComment
            })

            setEditingCommentId(null)
            setEditText('')
            showSuccessMsg('Comment updated successfully')

        } catch (err) {
            console.error('Failed to update comment:', err)
            showErrorMsg('Failed to update comment')
        }
    }

    const handleDeleteComment = async (commentId) => {
        try {
            await boardService.removeTaskComment(
                boardId,
                groupId,
                taskId,
                commentId
            )

            socketService.emit('comment-removed', {
                taskId,
                commentId
            })

            showSuccessMsg('Comment removed successfully')

        } catch (err) {
            console.error('Failed to remove comment:', err)
            showErrorMsg('Failed to remove comment')
        }
    }

    const formatCommentDate = (date) => {
        const now = new Date()
        const commentDate = new Date(date)
        const diffInMinutes = Math.floor((now - commentDate) / (1000 * 60))
        
        if (diffInMinutes < 2) {
            return 'Just now'
        }
        return commentDate.toLocaleString()
    }

    if (!task) return null
    
    return (
        <div className="task-comments">
            <form onSubmit={handleSubmitComment} className="comment-form">
                <div className="user-avatar">
                    {task.byMember?.imgUrl ? (
                        <img src={task.byMember.imgUrl} alt={task.byMember.fullname} />
                    ) : null}
                </div>
                <textarea
                    value={comment}
                    onChange={(ev) => {
                        setComment(ev.target.value)
                        handleTyping()
                    }}
                    className="comment-input"
                    placeholder="Write a comment..."
                    rows={1}
                />
                <div className="comment-form-actions">
                    <button type="submit" disabled={!comment.trim()}>
                        Save
                    </button>
                </div>
            </form>

            {isTyping && <div className="typing-indicator">{typingUser} is typing...</div>}

            <ul className="comments-list">
                {task.comments?.map((comment) => (
                    <li key={comment.id} className="comment-item">
                        <div className="comment-avatar">
                            {comment.byMember.imgUrl ? (
                                <img
                                    src={comment.byMember.imgUrl}
                                    alt={comment.byMember.fullname}
                                />
                            ) : (
                                <div className="avatar-placeholder">
                                    {comment.byMember.fullname[0].toUpperCase()}
                                </div>
                            )}
                        </div>
                        <div className="comment-content">
                            <div className="comment-header">
                                <span className="comment-author">
                                    {comment.byMember.fullname}
                                </span>
                                <time>
                                    {formatCommentDate(comment.createdAt)}
                                </time>
                            </div>
                            {editingCommentId === comment.id ? (
                                <div className="edit-comment-form">
                                    <textarea
                                        value={editText}
                                        onChange={(e) => setEditText(e.target.value)}
                                        className="edit-input"
                                        rows={2}
                                    />
                                    <div className="edit-actions">
                                        <button 
                                            onClick={() => handleUpdateComment(comment.id)}
                                            disabled={!editText.trim()}
                                        >
                                            Save
                                        </button>
                                        <button onClick={cancelEditing}>
                                            Discard Changes
                                        </button>
                                    </div>
                                </div>
                            ) : (
                                <p>{comment.txt}</p>
                            )}
                            {loggedInUser && comment.byMember._id === loggedInUser._id && !editingCommentId && (
                                <div className="comment-actions">
                                    <button 
                                        onClick={() => startEditing(comment)}
                                        className="edit-btn"
                                    >
                                        Edit
                                    </button>
                                    <button 
                                        onClick={() => handleDeleteComment(comment.id)}
                                        className="delete-btn"
                                    >
                                        Delete
                                    </button>
                                </div>
                            )}
                        </div>
                    </li>
                ))}
            </ul>
        </div>
    )
}