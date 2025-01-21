export const SET_BOARDS = 'SET_BOARDS'
export const SET_BOARD = 'SET_BOARD'
export const REMOVE_BOARD = 'REMOVE_BOARD'
export const ADD_BOARD = 'ADD_BOARD'
export const UPDATE_BOARD = 'UPDATE_BOARD'
export const UNDO_REMOVE_BOARD = 'UNDO_REMOVE_BOARD'

export const ADD_GROUP = 'ADD_GROUP'
export const UPDATE_GROUP = 'UPDATE_GROUP'
export const REMOVE_GROUP = 'REMOVE_GROUP'
export const UNDO_REMOVE_GROUP = 'UNDO_REMOVE_GROUP'

export const ADD_TASK = 'ADD_TASK'
export const UPDATE_TASK = 'UPDATE_TASK'
export const REMOVE_TASK = 'REMOVE_TASK'
export const UNDO_REMOVE_TASK = 'UNDO_REMOVE_TASK'
export const SET_BOARD_BACKGROUND = 'SET_BOARD_BACKGROUND'

export const ADD_BOARD_MSG = 'ADD_BOARD_MSG'

const initialState = {
  boards: [],
  lastBoards: [],
  board: null,
  lastBoard: null,
  currentBackground: '#0079BF',

  groups: [],
  lastGroups: [],
  group: null,
  lastGroup: null,

  tasks: [],
  lastTasks: [],
  task: null,
  lastTask: null
}

export function boardReducer(state = initialState, action) {
  let newState = state
  let boards, groups, tasks

  switch (action.type) {
    // Board reducers
    case SET_BOARDS:
      newState = { ...state, boards: action.boards }
      break
    case SET_BOARD:
      newState = { ...state, board: action.board }
      break
    case REMOVE_BOARD:
      const removedBoard = state.boards.find((board) => board._id === action.boardId)
      newState = {
        ...state,
        boards: state.boards.filter((board) => board._id !== action.boardId),
        lastBoard: removedBoard
      }
      break
    case UNDO_REMOVE_BOARD:
      if (state.lastBoard) {
        newState = { ...state, boards: [...state.boards, state.lastBoard], lastBoard: null }
      }
      break
    case ADD_BOARD:
      newState = { ...state, boards: [...state.boards, action.board] }
      break
    case UPDATE_BOARD:
      boards = state.boards.map((board) => (board._id === action.board._id ? action.board : board))
      newState = { ...state, boards }
      break

    // Group reducers
    case ADD_GROUP:
      newState = { ...state, groups: [...state.groups, action.group] }
      break
    case UPDATE_GROUP:
      groups = state.groups.map((group) => (group._id === action.group._id ? action.group : group))
      newState = { ...state, groups }
      break
    case REMOVE_GROUP:
      const removedGroup = state.groups.find((group) => group._id === action.groupId)
      newState = {
        ...state,
        groups: state.groups.filter((group) => group._id !== action.groupId),
        lastGroup: removedGroup
      }
      break
    case UNDO_REMOVE_GROUP:
      if (state.lastGroup) {
        newState = { ...state, groups: [...state.groups, state.lastGroup], lastGroup: null }
      }
      break
    // Group reducers
    case ADD_GROUP:
      newState = { ...state, groups: [...state.groups, action.group] }
      break
    case UPDATE_GROUP:
      groups = state.groups.map((group) => (group.id === action.group.id ? action.group : group))
      newState = { ...state, groups }
      break
    case REMOVE_GROUP:
      const removedGroup = state.groups.find((group) => group.id === action.groupId)
      newState = {
        ...state,
        groups: state.groups.filter((group) => group.id !== action.groupId),
        lastGroup: removedGroup
      }
      break
    case UNDO_REMOVE_GROUP:
      if (state.lastGroup) {
        newState = { ...state, groups: [...state.groups, state.lastGroup], lastGroup: null }
      }
      break

    // Task reducers
    case ADD_TASK:
      newState = { ...state, tasks: [...state.tasks, action.task] }
      break
    case UPDATE_TASK:
      tasks = state.tasks.map((task) => (task._id === action.task._id ? action.task : task))
      newState = { ...state, tasks }
      break
    case REMOVE_TASK:
      const removedTask = state.tasks.find((task) => task._id === action.taskId)
      newState = {
        ...state,
        tasks: state.tasks.filter((task) => task._id !== action.taskId),
        lastTask: removedTask
      }
      break
    case UNDO_REMOVE_TASK:
      if (state.lastTask) {
        newState = { ...state, tasks: [...state.tasks, state.lastTask], lastTask: null }
      }
      break
    // Task reducers
    case ADD_TASK:
      newState = { ...state, tasks: [...state.tasks, action.task] }
      break
    case UPDATE_TASK:
      newState = {
        ...state,
        board: {
          ...state.board,
          groups: state.board.groups.map((group) => {
            const taskExists = group.tasks.some((t) => t.id === action.task.id)
            if (!taskExists) return group

            return {
              ...group,
              tasks: group.tasks.map((task) =>
                task.id === action.task.id ? { ...task, ...action.task } : task
              )
            }
          })
        }
      }
      break
    case REMOVE_TASK:
      const removedTask = state.tasks.find((task) => task.id === action.taskId)
      newState = {
        ...state,
        tasks: state.tasks.filter((task) => task.id !== action.taskId),
        lastTask: removedTask
      }
      break
    case UNDO_REMOVE_TASK:
      if (state.lastTask) {
        newState = { ...state, tasks: [...state.tasks, state.lastTask], lastTask: null }
      }
      break

    // Board Messages reducers
    case ADD_BOARD_MSG:
      newState = {
        ...state,
        board: { ...state.board, msgs: [...(state.board.msgs || []), action.msg] }
      }
      break

    default:
  }
  return newState
}

// unitTestReducer()

function unitTestReducer() {
  var state = initialState
  const board1 = { _id: 'b101', title: 'Board 1', msgs: [] }
  const board2 = { _id: 'b102', title: 'Board 2', msgs: [] }

  state = boardReducer(state, { type: SET_BOARDS, boards: [board1, board2] })
  console.log('After SET_BOARDS:', state)

  state = boardReducer(state, { type: REMOVE_BOARD, boardId: board2._id })
  console.log('After REMOVE_BOARD:', state)

  state = boardReducer(state, { type: UNDO_REMOVE_BOARD })
  console.log('After UNDO_REMOVE_BOARD:', state)

  const group1 = { _id: 'g101', title: 'Group 1' }
  state = boardReducer(state, { type: ADD_GROUP, group: group1 })
  console.log('After ADD_GROUP:', state)

  state = boardReducer(state, { type: REMOVE_GROUP, groupId: group1._id })
  console.log('After REMOVE_GROUP:', state)

  state = boardReducer(state, { type: UNDO_REMOVE_GROUP })
  console.log('After UNDO_REMOVE_GROUP:', state)
}
