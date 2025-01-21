import React from 'react'
import { svgService } from '../../services/svg.service'

export function BoardGroupFooter({isAddingTask, setIsAddingTask, newTaskTitle, handleTitleChange, onAddTask }) {

    function handleKeyPress(ev) {
        if (ev.key === 'Enter' && !ev.shiftKey) {
            ev.preventDefault()
            onAddTask(ev)
        }
    }

    return (
        <footer className="board-group-footer">
            {isAddingTask ? (
                <form className="add-task-container" onSubmit={onAddTask}>
                    <textarea
                        placeholder="Enter task title or paste a link"
                        value={newTaskTitle}
                        onChange={handleTitleChange}
                        onKeyDown={handleKeyPress}
                    />
                    <div className="buttons-container">
                        <button type="submit" className="add-task-btn-active">Add card</button>
                        <button
                            type="button"
                            className="cancel-btn"
                            onClick={() => setIsAddingTask(false)}
                        >
                            <img src={svgService.closeIcon} alt="Cancel" />
                        </button>
                    </div>
                </form>
            ) : (
                <button className="add-task-btn-preview" onClick={() => setIsAddingTask(true)}>
                    <img src={svgService.addIcon} alt="Add" className="add-icon" />
                    Add a card
                </button>
            )}
        </footer>
    )
}