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
        msgs: [],
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
                title: '',
            }
        ],
        style: {},
    }
}

function getDefaultFilter() {
    return {
        txt: '',
        archivedAt: '',
        sortField: '',
        sortDir: '',
        // pageIdx: 0
    }
}

const service = VITE_LOCAL === 'true' ? local : remote
export const boardService = { getEmptyBoard, getEmptyGroup, getDefaultFilter, ...service }






























//* Easy access to this service from the dev tools console
//* when using script - dev / dev:local

if (DEV) window.boardService = boardService
