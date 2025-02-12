import { Server } from "socket.io";
import { addOnlineUser, removeOnlineUser } from "../services/onlineUsersService.js";

let io;

export const initializeSocket = (server) => {
    io = new Server(server, {
        cors: {
            origin: [process.env.URI_ORIGIN1, process.env.URI_ORIGIN2],
            methods: ["GET", "POST"],
            credentials: true
        }
    });
    console.log("✅ Socket.io is initialized successfully");

    io.on("connection", (socket) => {
        console.log('User connected with ID:', socket.id);

        socket.on('register', (data) => {
            addOnlineUser(data.userId, socket.id);
            console.log('Registered User ID:', data.userId);
        });

        socket.on("disconnect", () => {
            removeOnlineUser(socket.id);
            console.log("User disconnected:", socket.id);
        });
    });

    return io;
};

export const getSocketInstance = () => {

    if (!io) {
        throw new Error("❌ Socket.io has not been initialized!");
    }
    return io;
};
