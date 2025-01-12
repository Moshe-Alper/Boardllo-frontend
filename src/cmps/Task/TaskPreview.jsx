import { svgService } from "../../services/svg.service";

export function TaskPreview({ task, isDragging }) {
    return (
        <article className={`task-preview flex column ${isDragging ? "rotate-3" : ""}`}>
            <p>{task.title}</p>
            <div className="edit-icon-container">
                <div className="edit-icon">
                    <img src={svgService.pencilIcon} alt="Edit Icon" />
                </div>
            </div>
        </article>
    )
}