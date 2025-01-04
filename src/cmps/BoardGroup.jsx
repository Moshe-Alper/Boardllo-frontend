import { TaskPreview } from "./TaskPreview"
import { boardService } from '../services/board'
import { showSuccessMsg, showErrorMsg } from '../services/event-bus.service'

export function BoardGroup({ board, group, onUpdateGroup }) {
 
async function handleTaskSave() {
    const task = boardService.getEmptyTask()
    task.title = 'Task ' + Math.floor(Math.random() * 100)
    task.description = prompt('Enter task description')
    try {
        await boardService.saveTask(board._id, group.id, task)
        showSuccessMsg(`Task added (id: ${task.id})`)
    } catch (err) {
        console.log('Cannot save task', err)
        showErrorMsg('Cannot save task')
    }
}

if (!group) return <div>Loading...</div>

return (
    <section className="board-group" style={{ backgroundColor: 'lightblue' }}> 
        {/* //Temporary backgroundColor */}
        <h5>{group.title}</h5>
        <button onClick={() => onUpdateGroup(group)}>Edit Group</button>
        <h5>🍕Tasks List🍕</h5>
        <button onClick={() => handleTaskSave()}>Save Task</button>
        {group.tasks.map(task => (
            <TaskPreview
                key={task.id}
                task={task} 
            />
        ))}
    </section>
)
}
