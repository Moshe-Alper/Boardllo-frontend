
import { storageService } from '../async-storage.service'
import { makeId } from '../util.service'
import { userService } from '../user'

const STORAGE_KEY = 'board'

export const boardService = {
    query,
    getById,
    save,
    remove,
    addBoardMsg,
    addGroup,
}
window.cs = boardService


async function query(filterBy = { txt: '', price: 0 }) {
    var boards = await storageService.query(STORAGE_KEY)
    console.log('boards:', boards)
    const { txt, sortField, sortDir } = filterBy

    if (txt) {
        const regex = new RegExp(filterBy.txt, 'i')
        boards = boards.filter(board => regex.test(board.title) || regex.test(board.description))
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
            isStarred: board.isStarred,
            archivedAt: board.archivedAt,
            groups: board.group,
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

async function addGroup(boardId, group) {
    console.log('🚀 boardId from service', boardId)
    console.log('🚀 group from service', group)
    const board = await getById(boardId)
    if (!board) throw new Error('Board not found')

    const newGroup = {
        id: makeId(),
        title: group.title,
        archivedAt: null,
        tasks: [],
        style: {},
    }
    board.groups.push(newGroup)

    await storageService.put(STORAGE_KEY, board)
    return newGroup
}
