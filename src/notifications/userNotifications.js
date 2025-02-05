import { getSocketInstance } from "../config/socket.js";



export const emitNewTask = (task) => {
    const io = getSocketInstance();
    io.emit("taskCreated", task);
};

export const emitUpdatedTask = (updatedTask) => {
    const io = getSocketInstance();
    io.emit("taskUpdated", updatedTask);
};

export const emitDeleteTask = (taskID) => {
    const io = getSocketInstance();
    io.emit("taskDeleted", { taskId: taskID });

};