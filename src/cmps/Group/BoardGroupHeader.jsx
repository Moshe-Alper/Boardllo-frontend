import React from 'react'
import { TextField } from '@mui/material'
import { svgService } from '../../services/svg.service'
import { BoardGroupListActions } from './BoardGroupListActions'

export function BoardGroupHeader({
    group,
    isEditingTitle,
    setIsEditingTitle,
    editedTitle,
    setEditedTitle,
    handleGroupTitleSave,
    handleMenuClick,
    anchorEl,
    handleMenuClose,
    onAddTask,
    isCollapsed,
    onToggleCollapse,
    taskCount
}) {

    function saveTitle() {
        if (editedTitle.trim()) {
            handleGroupTitleSave()
        } else {
            showErrorMsg('Group title cannot be empty')
        }
    }

    return (
        <header className={`board-group-header flex space-between ${isCollapsed ? 'collapsed' : ''}`}>
            {isCollapsed ? (
                <div className="collapsed-content">
                    <div className="title-actions">
                        <button
                            className="collapse-btn collapsed"
                            onClick={onToggleCollapse}
                        >
                            <img src={svgService.expandIcon} alt="Expand Icon" />
                        </button>
                    </div>

                    <div className="title-container">
                        {isEditingTitle && !isCollapsed ? (
                            <TextField
                                value={editedTitle}
                                onChange={(ev) => setEditedTitle(ev.target.value)}
                                onBlur={saveTitle}
                                onKeyDown={(ev) => {
                                    if (ev.key === 'Enter') saveTitle()
                                    if (ev.key === 'Escape') setIsEditingTitle(false)
                                }}
                                autoFocus
                                variant="outlined"
                                size="small"
                            />
                        ) : (
                            <h5
                                onClick={() => {
                                    if (!isCollapsed) setIsEditingTitle(true)
                                }}
                                className={isCollapsed ? 'collapsed-title' : ''}
                            >
                                {group.title}
                            </h5>
                        )}
                    </div>

                    <div className="task-count">
                        <h3>{taskCount}</h3>
                    </div>
                </div>
            ) : (
                <>
                    {isEditingTitle ? (
                        <div className="title-editor">
                            <TextField
                                value={editedTitle}
                                onChange={(ev) => setEditedTitle(ev.target.value)}
                                onBlur={saveTitle}
                                onKeyDown={(ev) => {
                                    if (ev.key === 'Enter') saveTitle()
                                    if (ev.key === 'Escape') setIsEditingTitle(false)
                                }}
                                autoFocus
                                variant="outlined"
                                size="small"
                            />
                        </div>
                    ) : (
                        <div className="title-container">
                            <h5 onClick={() => setIsEditingTitle(true)}>
                                {group.title}
                            </h5>
                        </div>
                    )}

                    <div className="title-actions">
                        <button
                            className="collapse-btn"
                            onClick={onToggleCollapse}
                        >
                            <img src={svgService.collapseIcon} alt="Collapse Icon" />
                        </button>
                        <button className="menu-btn" onClick={handleMenuClick}>
                            <img src={svgService.threeDotsIcon} alt="List actions Icon" />
                        </button>
                    </div>

                    <BoardGroupListActions
                        anchorEl={anchorEl}
                        onClose={handleMenuClose}
                        isOpen={Boolean(anchorEl)}
                        onAddTask={onAddTask}
                    />
                </>
            )}
        </header>
    )
}