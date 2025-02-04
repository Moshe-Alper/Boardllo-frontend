import io from 'socket.io-client'
import { userService } from './user'

// Chat Events
export const SOCKET_EVENT_ADD_MSG = 'chat-add-msg'
export const SOCKET_EMIT_SEND_MSG = 'chat-send-msg'
export const SOCKET_EMIT_SET_TOPIC = 'chat-set-topic'
export const SOCKET_EMIT_USER_WATCH = 'user-watch'

// User Events
export const SOCKET_EVENT_USER_UPDATED = 'user-updated'
export const SOCKET_EVENT_REVIEW_ADDED = 'review-added'
export const SOCKET_EVENT_REVIEW_REMOVED = 'review-removed'
export const SOCKET_EVENT_REVIEW_ABOUT_YOU = 'review-about-you'

// Task Events
export const SOCKET_EVENT_TASK_UPDATED = 'task-updated'
export const SOCKET_EMIT_TASK_TOPIC = 'task-set-topic'
export const SOCKET_EVENT_TASK_COMMENT_ADDED = 'task-comment-added'
export const SOCKET_EVENT_TASK_TYPING = 'task-user-typing'
export const SOCKET_EVENT_TASK_STOPPED_TYPING = 'task-stopped-typing'

const SOCKET_EMIT_LOGIN = 'set-user-socket'
const SOCKET_EMIT_LOGOUT = 'unset-user-socket'

const baseUrl = process.env.NODE_ENV === 'production' ? '' : '//localhost:3030'

// For production:
export const socketService = createSocketService()

// For development (comment out the line above and uncomment this for dummy service):
// export const socketService = createDummySocketService()

// For debugging from console
window.socketService = socketService

socketService.setup()

function createSocketService() {
    var socket = null
    const socketService = {
        setup() {
            socket = io(baseUrl)
            const user = userService.getLoggedinUser()
            if (user) this.login(user._id)
        },
        on(eventName, cb) {
            socket.on(eventName, cb)
        },
        off(eventName, cb = null) {
            if (!socket) return
            if (!cb) socket.removeAllListeners(eventName)
            else socket.off(eventName, cb)
        },
        emit(eventName, data) {
            if (!socket) return
            socket.emit(eventName, data)
        },
        login(userId) {
            socket.emit(SOCKET_EMIT_LOGIN, userId)
        },
        logout() {
            socket.emit(SOCKET_EMIT_LOGOUT)
        },
        terminate() {
            socket = null
        },
        // Task specific methods
        joinTask(taskId) {
            if (!socket) return
            socket.emit(SOCKET_EMIT_TASK_TOPIC, taskId)
        },
        leaveTask(taskId) {
            if (!socket) return
            socket.emit(SOCKET_EMIT_TASK_TOPIC, null)
        },
        emitTaskComment(taskId, comment) {
            if (!socket) return
            socket.emit(SOCKET_EVENT_TASK_COMMENT_ADDED, { taskId, comment })
        },
        emitTaskTyping(taskId, username) {
            if (!socket) return
            socket.emit(SOCKET_EVENT_TASK_TYPING, { taskId, username })
        },
        emitTaskStoppedTyping(taskId) {
            if (!socket) return
            socket.emit(SOCKET_EVENT_TASK_STOPPED_TYPING, { taskId })
        }
    }
    return socketService
}

function createDummySocketService() {
    var listenersMap = {}
    const socketService = {
        listenersMap,
        setup() {
            listenersMap = {}
            console.log('Dummy socket service setup')
        },
        terminate() {
            this.setup()
        },
        login() {
            console.log('Dummy socket service here, login - got it')
        },
        logout() {
            console.log('Dummy socket service here, logout - got it')
        },
        on(eventName, cb) {
            listenersMap[eventName] = [...(listenersMap[eventName] || []), cb]
        },
        off(eventName, cb) {
            if (!listenersMap[eventName]) return
            if (!cb) delete listenersMap[eventName]
            else listenersMap[eventName] = listenersMap[eventName].filter(l => l !== cb)
        },
        emit(eventName, data) {
            var listeners = listenersMap[eventName]
            
            // Handle chat messages
            if (eventName === SOCKET_EMIT_SEND_MSG) {
                listeners = listenersMap[SOCKET_EVENT_ADD_MSG]
            }
            
            // Handle task comments (simulate real-time updates)
            if (eventName === SOCKET_EVENT_TASK_COMMENT_ADDED) {
                listeners = listenersMap[SOCKET_EVENT_TASK_COMMENT_ADDED]
            }
            
            if (!listeners) return

            listeners.forEach(listener => {
                listener(data)
            })
        },
        // Task specific methods (dummy versions)
        joinTask(taskId) {
            console.log('Dummy socket service: Joining task', taskId)
        },
        leaveTask(taskId) {
            console.log('Dummy socket service: Leaving task', taskId)
        },
        emitTaskComment(taskId, comment) {
            this.emit(SOCKET_EVENT_TASK_COMMENT_ADDED, { taskId, comment })
        },
        emitTaskTyping(taskId, username) {
            this.emit(SOCKET_EVENT_TASK_TYPING, { taskId, username })
        },
        emitTaskStoppedTyping(taskId) {
            this.emit(SOCKET_EVENT_TASK_STOPPED_TYPING, { taskId })
        },
        // Test methods
        testChatMsg() {
            this.emit(SOCKET_EVENT_ADD_MSG, { from: 'Someone', txt: 'Aha it worked!' })
        },
        testUserUpdate() {
            this.emit(SOCKET_EVENT_USER_UPDATED, { ...userService.getLoggedinUser() })
        },
        testTaskComment() {
            this.emit(SOCKET_EVENT_TASK_COMMENT_ADDED, {
                taskId: 'test-task',
                comment: { text: 'Test comment', user: 'Test User' }
            })
        }
    }
    window.listenersMap = listenersMap
    return socketService
}