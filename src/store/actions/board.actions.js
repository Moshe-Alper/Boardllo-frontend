import { boardService } from '../../services/board'
import { store } from '../store'
import { ADD_BOARD, REMOVE_BOARD, SET_BOARDS, SET_BOARD, UPDATE_BOARD, ADD_BOARD_MSG, ADD_GROUP, UPDATE_GROUP, ADD_TASK, UPDATE_TASK, REMOVE_GROUP, UNDO_REMOVE_BOARD, UNDO_REMOVE_GROUP, REMOVE_TASK, UNDO_REMOVE_TASK } from '../reducers/board.reducer'


// Board Actions
export async function loadBoards(filterBy) {
    try {
        const boards = await boardService.query(filterBy)
        store.dispatch(getCmdSetBoards(boards))
    } catch (err) {
        console.log('Cannot load boards', err)
        throw err
    }
}

export async function loadBoard(boardId) {
    try {
        const board = await boardService.getById(boardId)
        store.dispatch(getCmdSetBoard(board))
    } catch (err) {
        console.log('Cannot load board', err)
        throw err
    }
}

export async function addBoard(board) {
    try {
        const savedBoard = await boardService.save(board)
        store.dispatch(getCmdAddBoard(savedBoard))
        return savedBoard
    } catch (err) {
        console.log('Cannot add board', err)
        throw err
    }
}

export async function updateBoard(board) {
    try {
        const savedBoard = await boardService.save(board)
        store.dispatch(getCmdUpdateBoard(savedBoard))
        return savedBoard
    } catch (err) {
        console.log('Cannot save board', err)
        throw err
    }
}

export async function removeBoard(boardId) {
    store.dispatch(getCmdRemoveBoard(boardId))
    try {
        await boardService.remove(boardId)
    } catch (err) {
        store.dispatch(getCmdUndoRemoveBoard())
        console.log('Cannot remove board', err)
        throw err
    }
}

// Group Actions
export async function addGroup(boardId, group) {
    const optimisticGroup = { ...group, id: 'temp-id' }
    store.dispatch(getCmdAddGroup(optimisticGroup))
    try {
        const savedGroup = await boardService.saveGroup(boardId, group)
        store.dispatch(getCmdUpdateGroup(savedGroup))
        return savedGroup
    } catch (err) {
        store.dispatch(getCmdRemoveGroup(optimisticGroup._id))
        console.log('Cannot add group', err)
        throw err
    }
}

export async function updateGroup(boardId, group) {
    const originalGroup = { ...group }
    store.dispatch(getCmdUpdateGroup(group))
    try {
        const savedGroup = await boardService.saveGroup(boardId, group)
        return savedGroup
    } catch (err) {
        store.dispatch(getCmdUpdateGroup(originalGroup))
        console.log('Cannot update group', err)
        throw err
    }
}

export async function removeGroup(boardId, groupId) {
    store.dispatch(getCmdRemoveGroup(groupId))
    try {
        await boardService.removeGroup(boardId, groupId)
    } catch (err) {
        store.dispatch(getCmdUndoRemoveGroup())
        console.log('Cannot remove group', err)
        throw err
    }
}

// Task Actions
export async function addTask(boardId, groupId, task) {
    const optimisticTask = { ...task, _id: 'temp-id' }
    store.dispatch(getCmdAddTask(optimisticTask))
    try {
        const savedTask = await boardService.saveTask(boardId, groupId, task)
        store.dispatch(getCmdUpdateTask(savedTask))
        return savedTask
    } catch (err) {
        store.dispatch(getCmdRemoveTask(optimisticTask._id))
        console.log('Cannot add task', err)
        throw err
    }
}

export async function updateTask(boardId, groupId, task) {
    const originalTask = { ...task }
    store.dispatch(getCmdUpdateTask(task))
    try {
        const savedTask = await boardService.saveTask(boardId, groupId, task)
        return savedTask
    } catch (err) {
        store.dispatch(getCmdUpdateTask(originalTask))
        console.log('Cannot update task', err)
        throw err
    }
}

export async function removeTask(boardId, groupId, taskId) {
    store.dispatch(getCmdRemoveTask(taskId))
    try {
        await boardService.removeTask(boardId, groupId, taskId)
    } catch (err) {
        store.dispatch(getCmdUndoRemoveTask())
        console.log('Cannot remove task', err)
        throw err
    }
}

// BoardMsg Actions
export async function addBoardMsg(boardId, txt) {
    try {
        const msg = await boardService.addBoardMsg(boardId, txt)
        store.dispatch(getCmdAddBoardMsg(msg))
        return msg
    } catch (err) {
        console.log('Cannot add board msg', err)
        throw err
    }
}


// Board Command Creators
function getCmdSetBoards(boards) {
    return {
        type: SET_BOARDS,
        boards
    }
}

function getCmdSetBoard(board) {
    return {
        type: SET_BOARD,
        board
    }
}

function getCmdRemoveBoard(boardId) {
    return {
        type: REMOVE_BOARD,
        boardId
    }
}

function getCmdAddBoard(board) {
    return {
        type: ADD_BOARD,
        board
    }
}

function getCmdUpdateBoard(board) {
    return {
        type: UPDATE_BOARD,
        board
    }
}

function getCmdAddBoardMsg(msg) {
    return {
        type: ADD_BOARD_MSG,
        msg
    }
}

function getCmdUndoRemoveBoard() {
    return {
        type: UNDO_REMOVE_BOARD
    }
}

// Group Command Creators
function getCmdAddGroup(group) {
    return {
        type: ADD_GROUP,
        group
    }
}

function getCmdUpdateGroup(group) {
    return {
        type: UPDATE_GROUP,
        group
    }
}

function getCmdRemoveGroup(groupId) {
    return {
        type: REMOVE_GROUP,
        groupId
    }
}

function getCmdUndoRemoveGroup() {
    return {
        type: UNDO_REMOVE_GROUP
    }
}

// Task Command Creators
function getCmdAddTask(task) {
    return {
        type: ADD_TASK,
        task
    }
}

function getCmdUpdateTask(task) {
    return {
        type: UPDATE_TASK,
        task
    }
}

function getCmdRemoveTask(taskId) {
    return {
        type: REMOVE_TASK,
        taskId
    }
}

function getCmdUndoRemoveTask() {
    return {
        type: UNDO_REMOVE_TASK
    }
}


unitTestActions()
async function unitTestActions() {
    // await loadBoards()
    // await addBoard(boardService.getEmptyBoard())
    // await updateBoard({
    //     _id: 'm1oC7',
    //     title: 'Board-Good',
    // })
    // await removeBoard('m1oC7')
    // TODO unit test addBoardMsg
    // await addGroup(boardService.getEmptyGroup())
    // await removeGroup('HLe0s', 'SKh8Xs')
    // await removeTask('HLe0s', 'dP5kdh', 'e7tONZ')

}
