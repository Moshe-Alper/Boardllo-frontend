import React from 'react'
import { onToggleModal } from '../../store/actions/app.actions'

export function TaskQuickActions({ task, onClose }) {
    function onOpenCard() {
        onToggleModal({
            cmp: TaskDetails,
            props: { task }
        })
    }

    return (
        <div className="task-quick-actions">
            <button onClick={onOpenCard} className="quick-action-btn">
                <span>Open card</span>
            </button>
            <button className="quick-action-btn">
                <span>Edit labels</span>
            </button>
            <button className="quick-action-btn">
                <span>Change cover</span>
            </button>
            <button className="quick-action-btn">
                <span>Move</span>
            </button>
            <button className="quick-action-btn">
                <span>Copy</span>
            </button>
            <div className="divider"></div>
            <button className="quick-action-btn danger">
                <span>Archive</span>
            </button>
        </div>
    )
}
