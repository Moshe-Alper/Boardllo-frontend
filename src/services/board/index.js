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
      coverColor: ''
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

// Styles
async function generateComponentStyles(baseColor, gradientDirection = 'r') {
  return {
    BoardDetails: `bg-gradient-to-${gradientDirection} from-${baseColor}-400 to-${baseColor}-600`,
    BoardHeader: `bg-${baseColor}-600/80`,
    AppHeader: `bg-${baseColor}-700/90`,
    BoardSidebar: `bg-${baseColor}-800/20`
  }
}

async function getRandomColorScheme() {
  const colorSchemes = [
    { color: 'blue', direction: 'r' },
    { color: 'purple', direction: 'r' },
    { color: 'green', direction: 'r' },
    { color: 'indigo', direction: 'br' },
    { color: 'pink', direction: 'br' }
  ]

  return colorSchemes[Math.floor(Math.random() * colorSchemes.length)]
}

async function generateRandomStyles() {
  const { color, direction } = this.getRandomColorScheme()
  return this.generateComponentStyles(color, direction)
}


async function saveBoardStyle(boardId, style) {
  try {
      const board = await this.getById(boardId)
      board.style = style
      return await this.save(board)
  } catch (err) {
      console.error('Failed to save board style:', err)
      throw err
  }
}

const service = VITE_LOCAL === 'true' ? local : remote
// console.log(VITE_LOCAL == 'true', VITE_LOCAL)

export const boardService = {
  getEmptyBoard,
  getEmptyGroup,
  getEmptyTask,
  getDefaultFilter,
  
  generateComponentStyles,
  getRandomColorScheme,
  generateRandomStyles,
  saveBoardStyle,
  ...service
}

//* Easy access to this service from the dev tools console
//* when using script - dev / dev:local

if (DEV) window.boardService = boardService
