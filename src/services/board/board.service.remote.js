import { httpService } from '../http.service'
import { makeId } from '../../services/util.service'
import { userService } from '../user/index'

const BASE_URL = 'board/'
const STORAGE_KEY_LOGGEDIN_USER = 'loggedinUser'

export const boardService = {
    query,
    getById,
    save,
    remove,
    saveGroup,
    removeGroup,
    saveTask,
    removeTask,
    assignMemberToTask,
    addBoardMsg
}

async function query(filterBy = { txt: '', archivedAt: '', sortField: '', sortDir: '' }) {
    return httpService.get(BASE_URL, filterBy)
}

function getById(boardId) {
    return httpService.get(`${BASE_URL}${boardId}`)
}

async function remove(boardId) {
    return httpService.delete(`${BASE_URL}${boardId}`)
}

async function save(board) {
    let savedBoard
    if (board._id) {
        savedBoard = await httpService.put(`${BASE_URL}${board._id}`, board)
    } else {
        savedBoard = await httpService.post(BASE_URL, board)
    }
    return savedBoard
}

async function saveGroup(boardId, group) {
    try {
        const board = await getById(boardId)
        if (!board) throw new Error('Board not found')

        const groupToSave = {
            id: group.id || makeId(),
            title: group.title,
            archivedAt: group.archivedAt || null,
            tasks: group.tasks || [],
            style: group.style || {},
            isCollapsed: group.isCollapsed || false
        }

        const groupIdx = board.groups.findIndex((g) => g.id === groupToSave.id)
        if (groupIdx === -1) {
            board.groups.push(groupToSave)
        } else {
            board.groups[groupIdx] = groupToSave
        }

        const savedBoard = await httpService.put(`${BASE_URL}${boardId}`, board)
        return groupIdx === -1 ? groupToSave : savedBoard.groups[groupIdx]
    } catch (error) {
        console.error('Error in saveGroup:', error)
        throw error
    }
}

async function removeGroup(boardId, groupId) {
    const board = await getById(boardId)
    if (!board) throw new Error('Board not found')

    const groupIdx = board.groups.findIndex((group) => group.id === groupId)
    if (groupIdx === -1) throw new Error('Group not found')

    const group = board.groups.splice(groupIdx, 1)[0]
    await httpService.put(`${BASE_URL}${boardId}`, board)
    return group
}

async function saveTask(boardId, groupId, task) {
    const board = await getById(boardId)
    if (!board) throw new Error('Board not found')

    const group = board.groups.find((group) => group.id === groupId)
    if (!group) throw new Error('Group not found')

    const taskIdx = group.tasks.findIndex((t) => t.id === task.id)
    if (taskIdx === -1) {
        group.tasks.push(task)
    } else {
        group.tasks[taskIdx] = task
    }

    await save(board)
    return task
}

async function removeTask(boardId, groupId, taskId) {
    const board = await getById(boardId)
    if (!board) throw new Error('Board not found')

    const group = board.groups.find((group) => group.id === groupId)
    if (!group) throw new Error('Group not found')

    const taskIdx = group.tasks.findIndex((t) => t.id === taskId)
    if (taskIdx === -1) throw new Error('Task not found')

    const task = group.tasks.splice(taskIdx, 1)[0]
    await httpService.put(`${BASE_URL}${boardId}`, board)
    return task
}

async function assignMemberToTask(boardId, taskId, memberId) {
    try {
        const board = await getById(boardId)
        if (!board) throw new Error('Board not found')

        const group = board.groups.find(group => 
            group.tasks.some(task => task.id === taskId)
        )
        if (!group) throw new Error('Task not found in any group')

        const task = group.tasks.find(task => task.id === taskId)
        if (!task) throw new Error('Task not found')

        if (!task.memberIds) task.memberIds = []
        if (!task.memberIds.includes(memberId)) {
            task.memberIds.push(memberId)
        }

        const updatedBoard = await httpService.put(`${BASE_URL}${boardId}`, board)
        return updatedBoard
    } catch (error) {
        console.error('Error in assignMemberToTask:', error)
        throw error
    }
}


async function addBoardMsg(boardId, txt) {
    const board = await getById(boardId)
    const loggedInUser = userService.getLoggedinUser()
    if (!loggedInUser) {
        throw new Error('User must be logged in to perform this action')
    }

    const msg = {
        id: makeId(),
        by: loggedInUser,
        txt
    }
    board.msgs.push(msg)
    await httpService.put(`${BASE_URL}${boardId}`, board)

    return msg
}