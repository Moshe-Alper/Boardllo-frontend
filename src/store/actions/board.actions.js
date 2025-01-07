import { boardService } from '../../services/board'
import { store } from '../store'
import { ADD_BOARD, REMOVE_BOARD, SET_BOARDS, SET_BOARD, UPDATE_BOARD, ADD_BOARD_MSG, SET_GROUP, SET_GROUPS, ADD_GROUP, UPDATE_GROUP } from '../reducers/board.reducer'


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

export async function removeBoard(boardId) {
    try {
        await boardService.remove(boardId)
        store.dispatch(getCmdRemoveBoard(boardId))
    } catch (err) {
        console.log('Cannot remove board', err)
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

// Group Actions
// export async function loadGroups(boardId) {
//     try {
//         const groups = await boardService.getGroups(boardId)
//         store.dispatch(getCmdSetGroups(groups))
//     } catch (err) {
//         console.log('Cannot load groups', err)
//         throw err
//     }
// }

export async function loadGroup(boardId, groupId) {
    try {
        const group = await boardService.getGroups(boardId, groupId)
        store.dispatch(getCmdSetGroup(group))
    } catch (err) {
        console.log('Cannot load group', err)
        throw err
    }
}

export async function addGroup(boardId, group) {
    try {
        const savedGroup = await boardService.saveGroup(boardId, group)
        store.dispatch(getCmdAddGroup(savedGroup))
        return savedGroup
    } catch (err) {
        console.log('Cannot add group', err)
        throw err
    }
}

export async function updateGroup(boardId, group) {
    try {
        const savedGroup = await boardService.saveGroup(boardId, group)
        store.dispatch(getCmdUpdateGroup(savedGroup))
        return savedGroup
    } catch (err) {
        console.log('Cannot update group', err)
        throw err
    }
}

// Task Actions
export async function saveTask(boardId, groupId, task) {
    try {
        const savedTask = await boardService.saveTask(boardId, groupId, task)
        return savedTask
    } catch (err) {
        console.log('Cannot save task', err)
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


// Command Creators:
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

function getCmdSetGroups(groups) {
    return {
        type: SET_GROUPS,
        groups
    }
}

function getCmdSetGroup(group) {
    return {
        type: SET_GROUP,
        group
    }
}

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

// unitTestActions()
async function unitTestActions() {
    await loadBoards()
    await addBoard(boardService.getEmptyBoard())
    await updateBoard({
        _id: 'm1oC7',
        title: 'Board-Good',
    })
    await removeBoard('m1oC7')
    // TODO unit test addBoardMsg
    // await addGroup(boardService.getEmptyGroup())
}
