import { storageService } from '../async-storage.service'
import { makeId } from '../util.service'
import { userService } from '../user'

const STORAGE_KEY = 'board'

export const boardService = {
  query,
  getById,
  save,
  remove,

  saveGroup,
  removeGroup,

  saveTask,
  removeTask,

  addBoardMsg,
}

window.cs = boardService

async function query(filterBy = { txt: '', price: 0 }) {
  var boards = await storageService.query(STORAGE_KEY)
  const { txt, sortField, sortDir } = filterBy

  if (txt) {
    const regex = new RegExp(filterBy.txt, 'i')
    boards = boards.filter((board) => regex.test(board.title) || regex.test(board.description))
  }

  if (sortField === 'title' || sortField === 'owner') {
    boards.sort((board1, board2) => {
      let val1, val2

      if (sortField === 'owner') {
        val1 = board1.owner?.fullname || ''
        val2 = board2.owner?.fullname || ''
      } else {
        val1 = board1[sortField] || ''
        val2 = board2[sortField] || ''
      }

      return val1.localeCompare(val2) * +sortDir
    })
  }

  boards = boards.map(({ _id, title, owner }) => ({ _id, title, owner }))
  return boards
}

function getById(boardId) {
  return storageService.get(STORAGE_KEY, boardId)
}

async function remove(boardId) {
  // throw new Error('Nope')
  await storageService.remove(STORAGE_KEY, boardId)
}

async function save(board) {
  var savedBoard
  if (board._id) {
    const boardToSave = {
      _id: board._id,
      title: board.title,
      isStarred: board.isStarred,
      archivedAt: board.archivedAt,
      groups: board.groups
    }
    savedBoard = await storageService.put(STORAGE_KEY, boardToSave)
  } else {
    const boardToSave = {
      title: board.title,
      isStarred: false,
      archivedAt: null,
      groups: [],
      // Later, owner is set by the backend
      owner: userService.getLoggedinUser(),
      msgs: []
    }
    savedBoard = await storageService.post(STORAGE_KEY, boardToSave)
  }
  return savedBoard
}

// Group functions

async function saveGroup(boardId, group) {
  const board = await getById(boardId)
  if (!board) throw new Error('Board not found')

  const groupIdx = board.groups.findIndex((g) => g.id === group.id)
  if (groupIdx === -1) {
    const newGroup = {
      id: makeId(),
      title: group.title,
      archivedAt: null,
      tasks: [],
      style: {}
    }
    board.groups.push(newGroup)
    await storageService.put(STORAGE_KEY, board)
    return newGroup
  } else {
    board.groups[groupIdx] = group
    await storageService.put(STORAGE_KEY, board)
    return group
  }
}

async function removeGroup(boardId, groupId) {
  const board = await getById(boardId)
  if (!board) throw new Error('Board not found')

  const groupIdx = board.groups.findIndex((g) => g.id === groupId)
  if (groupIdx === -1) throw new Error('Group not found')

  const group = board.groups.splice(groupIdx, 1)[0]
  await storageService.put(STORAGE_KEY, board)
  return group
}

// Tasks functions
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
  await storageService.put(STORAGE_KEY, board)
  return task
}

// BoardMsg functions
async function addBoardMsg(boardId, txt) {
  // Later, this is all done by the backend
  const board = await getById(boardId)

  const msg = {
    id: makeId(),
    by: userService.getLoggedinUser(),
    txt
  }
  board.msgs.push(msg)
  await storageService.put(STORAGE_KEY, board)

  return msg
}