import { addTaskComment, assignTask, createSubtask, createSubtaskComment, createTask, deleteTask, getTaskById, getTasks, updateSubTask, updateTask } from "../controllers/tasksController.js";
import express from 'express';
import { isAuthorized } from "../middleware/isAuth.js";
import { clientRole } from "../middleware/userRole.js";

const taskRouter = express.Router();


taskRouter.post("/", isAuthorized, createTask);
taskRouter.get("/", isAuthorized, getTasks);
taskRouter.get("/:taskId", isAuthorized, getTaskById);
taskRouter.put("/:taskId", isAuthorized, updateTask);
taskRouter.put("/:taskId/assign", isAuthorized, clientRole(["admin", "manager"]), assignTask);
taskRouter.delete("/:taskId", isAuthorized, clientRole(["admin"]), deleteTask);
taskRouter.post("/:taskId/comment", isAuthorized, addTaskComment);

//subtasks
taskRouter.post("/:taskId/subtasks", isAuthorized, createSubtask);
taskRouter.put("/:taskId/subtasks/:subtaskId", isAuthorized, updateSubTask);
taskRouter.post("/:taskId/subtasks/:subtaskId/comment", isAuthorized, createSubtaskComment);

export default taskRouter;