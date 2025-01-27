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
  return httpService.get(`board`, filterBy)
}

function getById(boardId) {
  return httpService.get(`board/${boardId}`)
}

async function remove(boardId) {
  return httpService.delete(`board/${boardId}`)
}

async function save(board) {
  var savedBoard
  if (board._id) {
    savedBoard = await httpService.put(`board/${board._id}`, board)
  } else {
    savedBoard = await httpService.post('board', board)
  }
  return savedBoard
}

// Group functions
async function saveGroup(boardId, group) {
  if (group.id) {
    return httpService.put(`board/${boardId}/group/${group.id}`, group)
  } else {
    return httpService.post(`board/${boardId}/group`, group)
  }
}

async function removeGroup(boardId, groupId) {
  return httpService.delete(`board/${boardId}/group/${groupId}`)
}

// Task functions
async function saveTask(boardId, groupId, task) {
  if (task.id) {
    return httpService.put(`board/${boardId}/group/${groupId}/task/${task.id}`, task)
  } else {
    return httpService.post(`board/${boardId}/group/${groupId}/task`, task)
  }
}

async function removeTask(boardId, groupId, taskId) {
  return httpService.delete(`board/${boardId}/group/${groupId}/task/${taskId}`)
}

async function addBoardMsg(boardId, txt) {
  const savedMsg = await httpService.post(`board/${boardId}/msg`, { txt })
  return savedMsg
}