import { Popover, Button } from '@mui/material'

export function BoardGroupMenu({ anchorEl, isOpen, onClose, onAddTask }) {

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
        >
            <div className="list-action flex column">
                <header className='list-action-header flex'>
                    <h3>List actions</h3>
                    <Button onClick={onClose}>X</Button>
                </header>
                <Button onClick={() => { onAddTask(); onClose() }}>Add a card</Button>
            </div>
        </Popover>
    )
}
