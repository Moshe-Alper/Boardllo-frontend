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
    addTaskComment,
    updateTaskComment,
    removeTaskComment
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
        if (!group) throw new Error('Group not found')
        
        const board = await getById(boardId)
        if (!board) throw new Error('Board not found')

        const groupToSave = _createGroupForSave(group)
        
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

async function addTaskComment(boardId, groupId, taskId, txt) {
    try {
        const board = await getById(boardId)
        if (!board) throw new Error('Board not found')

        const group = board.groups.find(g => g.id === groupId)
        if (!group) throw new Error('Group not found')

        const task = group.tasks.find(t => t.id === taskId)
        if (!task) throw new Error('Task not found')

        const loggedInUser = userService.getLoggedinUser()
        if (!loggedInUser) {
            throw new Error('User must be logged in to comment')
        }

        const comment = {
            id: makeId(),
            txt,
            createdAt: Date.now(),
            byMember: {
                _id: loggedInUser._id,
                fullname: loggedInUser.fullname,
                imgUrl: loggedInUser.imgUrl
            }
        }

        if (!task.comments) task.comments = []
        task.comments.push(comment)

        await save(board)
        return comment
    } catch (error) {
        console.error('Error in addTaskComment:', error)
        throw error
    }
}

async function updateTaskComment(boardId, groupId, taskId, commentId, txt) {
    try {
        const board = await getById(boardId)
        if (!board) throw new Error('Board not found')

        const group = board.groups.find(g => g.id === groupId)
        if (!group) throw new Error('Group not found')

        const task = group.tasks.find(t => t.id === taskId)
        if (!task) throw new Error('Task not found')

        const comment = task.comments?.find(c => c.id === commentId)
        if (!comment) throw new Error('Comment not found')

        const loggedInUser = userService.getLoggedinUser()
        if (!loggedInUser || loggedInUser._id !== comment.byMember._id) {
            throw new Error('Unauthorized to edit this comment')
        }

        comment.txt = txt
        comment.updatedAt = Date.now()

        await save(board)
        return comment
    } catch (error) {
        console.error('Error in updateTaskComment:', error)
        throw error
    }
}

async function removeTaskComment(boardId, groupId, taskId, commentId) {
    try {
        const board = await getById(boardId)
        if (!board) throw new Error('Board not found')

        const group = board.groups.find(g => g.id === groupId)
        if (!group) throw new Error('Group not found')

        const task = group.tasks.find(t => t.id === taskId)
        if (!task) throw new Error('Task not found')

        const commentIdx = task.comments?.findIndex(c => c.id === commentId)
        if (commentIdx === -1) throw new Error('Comment not found')

        const comment = task.comments[commentIdx]
        const loggedInUser = userService.getLoggedinUser()
        if (!loggedInUser || loggedInUser._id !== comment.byMember._id) {
            throw new Error('Unauthorized to delete this comment')
        }

        task.comments.splice(commentIdx, 1)
        await save(board)
        return commentId
    } catch (error) {
        console.error('Error in removeTaskComment:', error)
        throw error
    }
}

function _createGroupForSave(group) {
    return {
        id: group.id || makeId(),
        title: group.title,
        archivedAt: group.archivedAt || null,
        tasks: group.tasks || [],
        style: group.style || {},
        isCollapsed: group.isCollapsed || false
    }
}