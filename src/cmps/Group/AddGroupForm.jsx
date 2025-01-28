import { svgService } from "../../services/svg.service"
import { useEffect, useRef } from "react"

export function AddGroupForm({
    newGroupTitle,
    setNewGroupTitle,
    onAddGroup,
    setIsAddingGroup,
    isAddingGroup,
    board,
}) {
    const textareaRef = useRef(null)

    function handleSubmit(ev) {
        ev.preventDefault()
        if (!newGroupTitle.trim()) return
        onAddGroup(board._id)
    }

    function handleKeyDown(ev) {
        if (ev.key === 'Enter') {
            ev.preventDefault()
            handleSubmit(ev)
        }
        if (ev.key === 'Escape') {
            setIsAddingGroup(false)
        }
    }

    function adjustHeight() {
        const textarea = textareaRef.current
        if (textarea) {
            textarea.style.height = 'inherit'
            textarea.style.height = `${textarea.scrollHeight}px`
        }
    }

    useEffect(() => {
        adjustHeight()
    }, [newGroupTitle])

    if (!isAddingGroup) {
        return (
            <button
                className="add-group-btn-preview"
                onClick={() => setIsAddingGroup(true)}
            >
                <img src={svgService.addIcon} alt="" className="add-icon" />
                {board?.groups?.length ? 'Add another list' : 'Add a list'}
            </button>
        )
    }

    if (!board) return <div>Loading...</div>
    return (
        <form
            className="add-group-form"
            onSubmit={handleSubmit}
        >
            <textarea
                ref={textareaRef}
                placeholder="Enter list name..."
                value={newGroupTitle}
                onChange={(ev) => {
                    setNewGroupTitle(ev.target.value)
                }}
                onKeyDown={handleKeyDown}
                rows="1"
                style={{ resize: 'none' }}
            />
            <div className="buttons-container">
                <button
                    type="submit"
                    className="add-group-btn-active"
                    aria-label="Add new group"
                >
                    Add List
                </button>
                <button
                    type="button"
                    className="cancel-btn"
                    aria-label="Cancel adding group"
                    onClick={() => setIsAddingGroup(false)}
                >
                    <img src={svgService.closeIcon} alt="Cancel" />
                </button>
            </div>
        </form>
    )
}