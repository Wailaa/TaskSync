import { assignSubtaskToUser, assignTask, createSubtask, createTask, deleteTask, getTaskById, getTasks, updateSubTask, updateTask } from "../controllers/tasksController.js";
import express from 'express';
import { isAuthorized } from "../middleware/isAuth.js";
import { clientRole } from "../middleware/userRole.js";

const taskRouter = express.Router();


taskRouter.post("/", isAuthorized, createTask);
taskRouter.get("/", isAuthorized, getTasks);
taskRouter.get("/:id", isAuthorized, getTaskById);
taskRouter.put("/:id", isAuthorized, updateTask);
taskRouter.put("/:id/assign", isAuthorized, clientRole(["admin", "manager"]), assignTask);
taskRouter.delete("/:id", isAuthorized, clientRole(["admin"]), deleteTask);

//subtasks
taskRouter.post("/:id/subtasks", isAuthorized, createSubtask);
taskRouter.put("/subtasks/:subtaskId/assign", isAuthorized, clientRole(["admin", "manager"]), assignSubtaskToUser);
taskRouter.put("/subtasks/:subtaskId", isAuthorized, updateSubTask);

export default taskRouter;