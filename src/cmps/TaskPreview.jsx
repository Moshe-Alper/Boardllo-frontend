export function TaskPreview({ task }) {
return (
            // temporary backgroundColor
    <section className="task-preview" style={{ backgroundColor: 'lightgray' }}>
            <h5>{task.title}</h5>
            <p>{task.description}</p>
        </section>
    )
}