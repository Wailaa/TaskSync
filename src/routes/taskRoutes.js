import { createTask, deleteTask, getTaskById, getTasks, updateTask } from "../controllers/tasksController.js";
import express from 'express';
import { isAuthorized } from "../middleware/isAuth.js";
import { clientRole } from "../middleware/userRole.js";

const taskRouter = express.Router();


taskRouter.post("/", isAuthorized, clientRole(["admin", "manager"]), createTask);
taskRouter.get("/", isAuthorized, getTasks);
taskRouter.get("/:id", isAuthorized, getTaskById);
taskRouter.put("/:id", isAuthorized, updateTask);
taskRouter.delete("/:id", isAuthorized, clientRole(["admin"]), deleteTask);

export default taskRouter;