export const SET_BOARDS = 'SET_BOARDS'
export const SET_BOARD = 'SET_BOARD'
export const REMOVE_BOARD = 'REMOVE_BOARD'
export const ADD_BOARD = 'ADD_BOARD'
export const UPDATE_BOARD = 'UPDATE_BOARD'

export const SET_GROUPS = 'SET_GROUPS'
export const SET_GROUP = 'SET_GROUP'
export const ADD_GROUP = 'ADD_GROUP'
export const UPDATE_GROUP = 'UPDATE_GROUP'

export const SAVE_TASK = 'SAVE_TASK'

export const ADD_BOARD_MSG = 'ADD_BOARD_MSG'

const initialState = {
    boards: [],
    board: null,
    groups: [],
    group: null,
    tasks: [],
    task: null,
}

export function boardReducer(state = initialState, action) {
    var newState = state
    var boards
    switch (action.type) {
        // Board reduces
        case SET_BOARDS:
            newState = { ...state, boards: action.boards }
            break
        case SET_BOARD:
            newState = { ...state, board: action.board }
            break
        case REMOVE_BOARD:
            const lastRemovedBoard = state.boards.find(board => board._id === action.boardId)
            boards = state.boards.filter(board => board._id !== action.boardId)
            newState = { ...state, boards, lastRemovedBoard }
            break
        case ADD_BOARD:
            newState = { ...state, boards: [...state.boards, action.board] }
            break
        case UPDATE_BOARD:
            boards = state.boards.map(board => (board._id === action.board._id) ? action.board : board)
            newState = { ...state, boards }
            break


        // Group reduces 
        case SET_GROUPS:
            newState = { ...state, groups: action.groups }
            break
        case SET_GROUP:
            newState = { ...state, group: action.group }
            break
        case ADD_GROUP:
            newState = { ...state, groups: [...state.groups, action.group] }
            break
        case UPDATE_GROUP:
            const groups = state.groups.map(group => (group._id === action.group._id) ? action.group : group)
            newState = { ...state, groups }
            break

        // Task reduces
        case SAVE_TASK:
            newState = { ...state, task: action.task }
            break
            
        // Board Massages reduces
        case ADD_BOARD_MSG:
            newState = { ...state, board: { ...state.board, msgs: [...state.board.msgs || [], action.msg] } }
            break
        default:
    }
    return newState
}

// unitTestReducer()

function unitTestReducer() {
    var state = initialState
    const board1 = { _id: 'b101', title: 'Board ' + parseInt(Math.random() * 10), msgs: [] }
    const board2 = { _id: 'b102', title: 'Board ' + parseInt(Math.random() * 10), msgs: [] }

    state = boardReducer(state, { type: SET_BOARDS, boards: [board1] })
    console.log('After SET_BOARDS:', state)

    state = boardReducer(state, { type: ADD_BOARD, board: board2 })
    console.log('After ADD_BOARD:', state)

    state = boardReducer(state, { type: UPDATE_BOARD, board: { ...board2, title: 'Good' } })
    console.log('After UPDATE_BOARD:', state)

    state = boardReducer(state, { type: REMOVE_BOARD, boardId: board2._id })
    console.log('After REMOVE_BOARD:', state)

    const msg = { id: 'm' + parseInt(Math.random() * 100), txt: 'Some msg' }
    state = boardReducer(state, { type: ADD_BOARD_MSG, boardId: board1._id, msg })
    console.log('After ADD_BOARD_MSG:', state)

    state = boardReducer(state, { type: REMOVE_BOARD, boardId: board1._id })
    console.log('After REMOVE_BOARD:', state)

}

