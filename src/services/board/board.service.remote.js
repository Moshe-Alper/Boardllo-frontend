import { httpService } from '../http.service'

const BASE_URL = '/api/board/'

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
    return httpService.get(BASE_URL, filterBy)  // Changed to use BASE_URL
}

function getById(boardId) {
    return httpService.get(BASE_URL + boardId)  // Changed to use BASE_URL
}

async function remove(boardId) {
    return httpService.delete(BASE_URL + boardId)  // Changed to use BASE_URL
}

async function save(board) {
    var savedBoard
    if (board._id) {
        savedBoard = await httpService.put(BASE_URL + board._id, board)  // Changed to use BASE_URL
    } else {
        savedBoard = await httpService.post(BASE_URL, board)  // Changed to use BASE_URL
    }
    return savedBoard
}

// Group functions
async function saveGroup(boardId, group) {
    if (group.id) {
        return httpService.put(`${BASE_URL}${boardId}/group/${group.id}`, group)  // Changed to use BASE_URL
    } else {
        return httpService.post(`${BASE_URL}${boardId}/group`, group)  // Changed to use BASE_URL
    }
}

async function removeGroup(boardId, groupId) {
    return httpService.delete(`${BASE_URL}${boardId}/group/${groupId}`)  // Changed to use BASE_URL
}

// Task functions
async function saveTask(boardId, groupId, task) {
    if (task.id) {
        return httpService.put(`${BASE_URL}${boardId}/group/${groupId}/task/${task.id}`, task)  // Changed to use BASE_URL
    } else {
        return httpService.post(`${BASE_URL}${boardId}/group/${groupId}/task`, task)  // Changed to use BASE_URL
    }
}

async function removeTask(boardId, groupId, taskId) {
    return httpService.delete(`${BASE_URL}${boardId}/group/${groupId}/task/${taskId}`)  // Changed to use BASE_URL
}

async function addBoardMsg(boardId, txt) {
    return httpService.post(`${BASE_URL}${boardId}/msg`, { txt })  // Changed to use BASE_URL
}