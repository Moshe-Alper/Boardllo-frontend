
export function AddGroupForm({ board, onAddGroup, setIsAddingGroup, setNewGroupTitle, newGroupTitle }) {

    function handleSubmit(ev) {
        ev.preventDefault()
        onAddGroup(board._id)
    }

    return (
        <form 
            className="add-group-form"
            onSubmit={handleSubmit}
        >
            <input
                type="text"
                placeholder="Enter list name..."
                value={newGroupTitle}
                onChange={(ev) => setNewGroupTitle(ev.target.value)}
            />
            <div className="buttons-container">
                <button
                    type="submit"
                    className="add-group-btn"
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
                    x
                </button>
            </div>
        </form>
    );
}