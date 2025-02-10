import { assignTask, createTask, deleteTask, getTaskById, getTasks, updateTask } from "../controllers/tasksController.js";
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

export default taskRouter;