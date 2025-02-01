import { io } from "socket.io-client";
import { userService } from "./user";

export const SOCKET_EVENT_ADD_MSG = "chat-add-msg";
export const SOCKET_EMIT_SEND_MSG = "chat-send-msg";
export const SOCKET_EMIT_SET_TOPIC = "chat-set-topic";
export const SOCKET_EMIT_USER_WATCH = "user-watch";

export const SOCKET_EVENT_USER_UPDATED = "user-updated";
export const SOCKET_EVENT_REVIEW_ADDED = "review-added";
export const SOCKET_EVENT_REVIEW_REMOVED = "review-removed";
export const SOCKET_EVENT_REVIEW_ABOUT_YOU = "review-about-you";

const SOCKET_EMIT_LOGIN = "set-user-socket";
const SOCKET_EMIT_LOGOUT = "unset-user-socket";

const baseUrl = process.env.NODE_ENV === "production" ? "" : "http://localhost:3030";

export const socketService = createSocketService();

window.socketService = socketService;

socketService.setup();

function createSocketService() {
    let socket = null;
    
    const socketService = {
        setup() {
            socket = io(baseUrl, {
                transports: ["websocket"],  
                reconnection: true,         
                reconnectionAttempts: 5,    
                reconnectionDelay: 2000,    
            });

            socket.on("connect", () => {
                console.log(`✅ Connected to WebSocket! Socket ID: ${socket.id}`);
                
                const user = userService.getLoggedinUser();
                if (user) {
                    this.login(user._id);
                }
            });

            socket.on("disconnect", (reason) => {
                console.warn(`❌ Disconnected from WebSocket. Reason: ${reason}`);
            });

            socket.on("reconnect_attempt", (attempt) => {
                console.log(`🔄 Reconnecting attempt ${attempt}...`);
            });

            socket.on("connect_error", (err) => {
                console.error(`⚠️ WebSocket connection error:`, err.message);
            });

            // 📌 Listen for board updates
            socket.on("board-updated", (updatedBoard) => {
                console.log("🔄 Board updated:", updatedBoard);
            });

            // 📌 Listen for card moves
            socket.on("card-moved", (card) => {
                console.log("🚀 Card moved:", card);
            });

            // 📌 Listen for typing indicator
            socket.on("user-typing", ({ userId, cardId }) => {
                console.log(`⌨️ User ${userId} is typing on card ${cardId}`);
            });
        },

        on(eventName, cb) {
            if (!socket) return;
            socket.on(eventName, cb);
        },

        off(eventName, cb = null) {
            if (!socket) return;
            if (!cb) socket.removeAllListeners(eventName);
            else socket.off(eventName, cb);
        },

        emit(eventName, data) {
            if (!socket.connected) {
                console.warn("⚠️ Cannot emit, socket is disconnected.");
                return;
            }
            socket.emit(eventName, data);
        },

        login(userId) {
            if (socket) socket.emit(SOCKET_EMIT_LOGIN, userId);
        },

        logout() {
            if (socket) socket.emit(SOCKET_EMIT_LOGOUT);
        },

        joinBoard(boardId) {
            socket.emit("board-join", boardId);
        },

        updateBoard(boardId, updatedBoard) {
            socket.emit("board-update", { boardId, updatedBoard });
        },

        moveCard(boardId, card) {
            socket.emit("card-move", { boardId, card });
        },

        notifyTyping(boardId, userId, cardId) {
            socket.emit("card-typing", { boardId, userId, cardId });
        },

        terminate() {
            if (socket) {
                socket.disconnect();
                console.log("🛑 WebSocket disconnected.");
            }
            socket = null;
        }
    };

    return socketService;
}
