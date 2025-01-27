import { httpService } from '../http.service'

export const boardService = {
    query,
    getById,
    save,
    remove,
    saveGroup,
    removeGroup,
    saveTask,
    removeTask,
    addBoardMsg
}

async function query(filterBy = { txt: '', archivedAt: '', sortField: '', sortDir: '' }) {
    return httpService.get('board', filterBy)
}

function getById(boardId) {
    return httpService.get(`board/${boardId}`)
}

async function remove(boardId) {
    return httpService.delete(`board/${boardId}`)
}

async function save(board) {
    console.log('🚀 board from board service frontend:', board)
    let savedBoard
    if (board._id) {
        savedBoard = await httpService.put(`board/${board._id}`, board)
    } else {
        savedBoard = await httpService.post('board', board)
    }
    return savedBoard
}

// Group functions
async function saveGroup(boardId, group) {
    const path = group.id 
        ? `board/${boardId}/group/${group.id}` 
        : `board/${boardId}/group`
    const method = group.id ? 'put' : 'post'
    return httpService[method](path, group)
}

async function removeGroup(boardId, groupId) {
    return httpService.delete(`board/${boardId}/group/${groupId}`)
}

// Task functions
async function saveTask(boardId, task) {
    const path = task.id 
        ? `board/${boardId}/task/${task.id}` 
        : `board/${boardId}/task`
    const method = task.id ? 'put' : 'post'
    return httpService[method](path, task)
}

async function removeTask(boardId, taskId) {
    return httpService.delete(`board/${boardId}/task/${taskId}`)
}

// Board Messages
async function addBoardMsg(boardId, txt) {
    const savedMsg = await httpService.post(`board/${boardId}/msg`, { txt })
    return savedMsg
}
