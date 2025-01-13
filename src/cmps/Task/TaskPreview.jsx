import { svgService } from "../../services/svg.service";

export function TaskPreview({ task, isDragging, className }) {
    console.log('🚀 className', className)
    return (
        <article className={`${className} flex column ${isDragging ? "rotate-3" : ""}`}>
            <p>{task.title}</p>
            <div className="edit-icon-container">
                <div className="edit-icon">
                    <img src={svgService.pencilIcon} alt="Edit Icon" />
                </div>
            </div>
        </article>
    )
}