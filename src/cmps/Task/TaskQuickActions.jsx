import React from 'react'
import { TaskDetails } from '../Task/TaskDetails'
import { onToggleModal } from '../../store/actions/app.actions'
import { TaskPreview } from './TaskPreview'

export function TaskQuickActions({ task, onClose }) {
    function onOpenCard() {
        if (onClose) onClose()
    }

    return (
        <div className="task-quick-actions">
            <div className="actions-list">
                <button onClick={onOpenCard} className="quick-action-btn">
                    <span>Open card</span>
                </button>
            </div>
            <div className="actions-list">
                <button className="quick-action-btn">
                    <span>Edit labels</span>
                </button>
                <button className="quick-action-btn">
                    <span>Change cover</span>
                </button>
            </div>
            <div className="actions-list">
                <button className="quick-action-btn">
                    <span>Move</span>
                </button>
                <button className="quick-action-btn">
                    <span>Copy</span>
                </button>
            </div>
            <div className="actions-list danger">
                <button className="quick-action-btn">
                    <span>Archive</span>
                </button>
                <button className="save" onClick={onClose} style={{ color: 'blue' }}>Save</button>
            </div>
        </div>
    )
}
