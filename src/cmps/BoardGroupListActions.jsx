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
        >
            <div className="list-action flex column">
                <header className='list-action-header flex'>
                    <h3>List actions</h3>
                    <Button onClick={onClose}>X</Button>
                </header>
                <Button onClick={() => { onAddTask(); onClose() }}>Add a card</Button>
                {/* <Button onClick={onClose}>Copy list</Button>
                <Button onClick={onClose}>Move list</Button>
                <Button onClick={onClose}>Watch</Button> */}
                <Button onClick={onClose}>Archive list</Button>
            </div>
        </Popover>
    )
}
