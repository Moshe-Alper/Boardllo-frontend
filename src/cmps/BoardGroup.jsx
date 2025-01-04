export function BoardGroup({ group, updateGroup }) {

    return (
        <section className="board-group">
            <h5>{group.title}</h5>
            <button onClick={() => updateGroup(group)}>Edit Group</button>
            {group.tasks.map(task => (
                <TaskPreview 
                key={task.id} 
                task={task} />
            ))}
        </section>
    )
}