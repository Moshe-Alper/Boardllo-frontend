import { Popover, Button } from '@mui/material'

export function BoardGroupListActions({ anchorEl, isOpen, onClose, onAddTask }) {
    return (
        <Popover
            open={isOpen}
            anchorEl={anchorEl}
            onClose={onClose}
            anchorOrigin={{
                vertical: 'bottom',
                horizontal: 'left'
            }}
            transformOrigin={{
                vertical: 'top',
                horizontal: 'left'
            }}
            className="list-actions-popover"
        >
            <div className="list-actions">
                <header className="list-actions-header">
                    <h3>List actions</h3>
                    <button className="close-btn" onClick={onClose}>
                        <span>&times;</span>
                    </button>
                </header>
                
                <div className="list-actions-content">
                    <div className="actions-group">
                        <button className="action-btn" onClick={() => { onAddTask(); onClose() }}>
                            <span>Add card...</span>
                        </button>
                        <button className="action-btn">
                            <span>Copy list...</span>
                        </button>
                        <button className="action-btn">
                            <span>Move list...</span>
                        </button>
                        <button className="action-btn">
                            <span>Watch</span>
                        </button>
                    </div>
                    
                    <div className="actions-group">
                        <button className="action-btn action-btn-danger">
                            <span>Archive this list</span>
                        </button>
                    </div>
                </div>
            </div>
        </Popover>
    )
}
