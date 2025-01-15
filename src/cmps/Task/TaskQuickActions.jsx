import React, { useState } from 'react'
import { CoverColorPicker } from '../../cmps/Picker/CoverColorPicker'

export function TaskQuickActions({ task, onClose, onCoverColorSelect }) {
    const [showColorPicker, setShowColorPicker] = useState(false)

    function onOpenCard() {
        if (onClose) onClose()
    }

    async function handleColorSelect(color) {
        await onCoverColorSelect(color)
        onClose()
    }

    if (showColorPicker) {
        return (
            <CoverColorPicker
                selectedColor={task.style?.coverColor || ''}
                onColorSelect={handleColorSelect}
            />
        )
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
                <button onClick={() => setShowColorPicker(true)} className="quick-action-btn">
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
