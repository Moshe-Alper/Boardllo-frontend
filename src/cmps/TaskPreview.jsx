export function TaskPreview({ task }) {
return (
            // temporary backgroundColor
    <article className="task-preview flex column">
            <p>{task.description}</p>
        </article>
    )
}