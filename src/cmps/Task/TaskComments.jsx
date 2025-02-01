import React, { useState, useEffect } from 'react'
import { useSelector } from 'react-redux'
import { socketService, SOCKET_EMIT_SEND_MSG, SOCKET_EVENT_ADD_MSG, SOCKET_EMIT_SET_TOPIC } from '../../services/socket.service'
import { boardService } from '../../services/board'
import { showSuccessMsg, showErrorMsg } from '../../services/event-bus.service'

export function TaskComments({ boardId, groupId, taskId }) {
    const [comment, setComment] = useState('')
    const [isTyping, setIsTyping] = useState(false)
    const [typingUser, setTypingUser] = useState('')
    
    const loggedInUser = useSelector(storeState => storeState.userModule.loggedInUser)
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
        
        // Clear existing timeout and set new one
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

    const handleUpdateComment = async (commentId, newText) => {
        try {
            const updatedComment = await boardService.updateTaskComment(
                boardId,
                groupId,
                taskId,
                commentId,
                newText
            )
            
            socketService.emit('comment-updated', {
                taskId,
                comment: updatedComment
            })
            
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

    if (!task) return null

    return (
        <div className="task-comments">
            <form onSubmit={handleSubmitComment} className="comment-form">
                <textarea
                    value={comment}
                    onChange={(ev) => {
                        setComment(ev.target.value)
                        handleTyping()
                    }}
                    placeholder="Write a comment..."
                    rows={1}
                />
                <button type="submit" disabled={!comment.trim()}>
                    Save
                </button>
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
                                    {new Date(comment.createdAt).toLocaleString()}
                                </time>
                            </div>
                            <p>{comment.txt}</p>
                            {loggedInUser?._id === comment.byMember._id && (
                                <div className="comment-actions">
                                    <button onClick={() => handleUpdateComment(comment.id, comment.txt)}>
                                        Edit
                                    </button>
                                    <button onClick={() => handleDeleteComment(comment.id)}>
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