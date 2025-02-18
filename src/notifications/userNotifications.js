import { getSocketInstance } from "../config/socket.js";
import { getSocketIdByUserId } from "../services/onlineUsersService.js";



export const emitNewEvent = async (event, userId, message) => {
    const SocketId = await getSocketIdByUserId(userId);
    getSocketInstance().to(SocketId).emit(event, {
        message, event
    });
    // saveToNotifications(event, userId, message);
};

// export const saveToNotifications = async (type, userId, message) => {
//     const notification = new Notification({
//         userId,
//         message,
//         type
//     });
//     await notification.save();
// };