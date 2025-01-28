import { httpService } from '../http.service'
import { makeId } from '../../services/util.service'   

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
    let savedBoard
    if (board._id) {
        savedBoard = await httpService.put(`board/${board._id}`, board)
    } else {
        savedBoard = await httpService.post('board', board)
    }
    return savedBoard
}

async function saveGroup(boardId, group) {
    try {
        const board = await getById(boardId)
        if (!board) throw new Error('Board not found')

        // Ensure group has all required properties
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

        const savedBoard = await httpService.put(`board/${boardId}`, board)
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
    await httpService.put(`board/${boardId}`, board)
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
    await httpService.put(`board/${boardId}`, board)
    return task
}

async function addBoardMsg(boardId, txt) {
    const board = await getById(boardId)
    
    const msg = {
        id: makeId(),
        by: userService.getLoggedinUser(),
        txt
    }
    board.msgs.push(msg)
    await httpService.put(`board/${boardId}`, board)

    return msg
}