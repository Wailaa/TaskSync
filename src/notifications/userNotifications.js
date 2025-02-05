import { getSocketInstance } from "../config/socket.js";



export const emitNewTask = (task) => {
    const io = getSocketInstance();
    io.emit("taskCreated", task);
}