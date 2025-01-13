const { DEV, VITE_LOCAL } = import.meta.env
import { getRandomIntInclusive, makeId } from '../util.service'

import { boardService as local } from './board.service.local'
import { boardService as remote } from './board.service.remote'

function getEmptyBoard() {
  return {
    title: makeId(),
    isStarred: false,
    archivedAt: null,
    groups: [],
    msgs: []
  }
}

function getEmptyGroup() {
  return {
    id: makeId(),
    title: '',
    archivedAt: null,
    tasks: [
      {
        id: makeId(),
        title: ''
      }
    ],
    style: {}
  }
}

function getEmptyTask() {
  return {
    id: makeId(),
    title: '',
    description: '',
    status: 'pending',
    priority: 'normal',
    dueDate: null,
    comments: [],
    checklists: [],
    memberIds: [],
    labelIds: [],
    byMember: null,
    style: {
      backgroundColor: '',
      coverColor: 'blue'
    },
    archivedAt: null
  }
}

function getDefaultFilter() {
  return {
    txt: '',
    archivedAt: '',
    sortField: '',
    sortDir: ''
    // pageIdx: 0
  }
}

const service = VITE_LOCAL === 'true' ? local : remote
// console.log(VITE_LOCAL == 'true', VITE_LOCAL)

export const boardService = {
  getEmptyBoard,
  getEmptyGroup,
  getEmptyTask,
  getDefaultFilter,
  ...service
}

//* Easy access to this service from the dev tools console
//* when using script - dev / dev:local

if (DEV) window.boardService = boardService
