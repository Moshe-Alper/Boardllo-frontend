import { svgService } from "../../services/svg.service";

export function TaskPreview({ task }) {
    // console.log('🚀 task.id', task.id)
    return (
        <article className="task-preview flex column">
            <p>{task.title}</p>
            <div className="edit-icon-container">
                <div className="edit-icon">
                    <img src={svgService.pencilIcon} alt="Edit Icon" />
                </div>
            </div>
        </article>
    )
}
