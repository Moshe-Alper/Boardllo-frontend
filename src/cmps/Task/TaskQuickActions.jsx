// TaskQuickActions.jsx
import React from 'react'
import { onToggleModal } from '../../store/actions/app.actions'
import { TaskDetails } from '../Task/TaskDetails'

export function TaskQuickActions({ task }) {
    function onOpenCard() {
        // Close current quick actions modal
        onToggleModal(null)
        // Open task details modal
        onToggleModal({
            cmp: TaskDetails,
            props: { task }
        })
    }

    return (
        <div className="task-quick-actions">
            <header className="quick-actions-header">
                <h3>Card actions</h3>
                <button className="close" onClick={() => onToggleModal()}>×</button>
            </header>
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
            </div>
        </div>
    )
}