import { createTask, getTaskById, getTasks, updateTask } from "../controllers/tasksController.js";
import express from 'express';
import { isAuthorized } from "../middleware/isAuth.js";

const taskRouter = express.Router();


taskRouter.post("/", isAuthorized, createTask);
taskRouter.get("/", isAuthorized, getTasks);
taskRouter.get("/:id", isAuthorized, getTaskById);
taskRouter.put("/:id", isAuthorized, updateTask);

export default taskRouter;