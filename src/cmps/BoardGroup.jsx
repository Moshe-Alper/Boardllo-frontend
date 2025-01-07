import { useEffect } from 'react'
import { boardService } from '../services/board'


import { TaskPreview } from "./TaskPreview"
import { loadBoard } from '../store/actions/board.actions'
import { showSuccessMsg, showErrorMsg } from '../services/event-bus.service'

export function BoardGroup({ board, group, onUpdateGroup }) {

    useEffect(() => {
        loadBoard(board._id)
    }, [board._id])

async function onAddTask() {
    const task = boardService.getEmptyTask();
    const title = prompt('Enter task title:');
    if (title === null || title.trim() === '') return alert('Invalid title');

    task.title = title
    try {
        await boardService.saveTask(board._id, group.id, task)
        loadBoard(board._id)
        showSuccessMsg(`Task added (id: ${task.id})`)
    } catch (err) {
        console.log('Cannot add task', err)
        showErrorMsg('Cannot add task')
    }
}

if (!group) return <div>Loading...</div>

return (
    <section className="board-group flex column"> 
        <h5>{group.title}</h5>
        <button onClick={() => onUpdateGroup(group)}>Edit Group Name</button>
        {group.tasks.map(task => (
            <TaskPreview
            key={task.id}
            task={task} 
            />
        ))}
        <button onClick={() => onAddTask()}>Add a card</button>
    </section>
)
}
