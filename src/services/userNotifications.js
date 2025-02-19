import { getSocketInstance } from "../config/socket.js";
import { getSocketIdByUserId } from "./onlineUsersService.js";
import { userService } from "./userService.js";



export const emitNewEvent = async (event, userId, message) => {
    const SocketId = await getSocketIdByUserId(userId);
    getSocketInstance().to(SocketId).emit(event, {
        message, event
    });
    await userService.addNotification(event, userId, message);
};
