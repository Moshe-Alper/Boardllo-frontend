import { Popover, Button } from '@mui/material'

export function BoardGroupListActions({ anchorEl, isOpen, onClose, onAddTask }) {
    return (
        <Popover
            open={isOpen}
            anchorEl={anchorEl}
            onClose={onClose}
            anchorOrigin={{
                vertical: 'bottom',
                horizontal: 'left',
            }}
            transformOrigin={{
                vertical: 'top',
                horizontal: 'left',
            }}
            className="list-actions-popover"
        >
            <div className="list-actions">
                <header className="list-actions-header flex">
                    <h3>List actions</h3>
                    <button className="close-button" onClick={onClose}>×</button>
                </header>
                <div className="list-actions-content flex column">
                    <button className="action-button" onClick={() => { onAddTask(); onClose() }}>Add card...</button>
                    {/* <button className="action-button">Copy list...</button>
                    <button className="action-button">Move list...</button>
                    <button className="action-button">Watch</button> */}
                    <button className="action-button danger">Archive this list</button>
                </div>
            </div>
        </Popover>
    )
}
