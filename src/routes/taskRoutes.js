import { createTask, getTaskById } from "../controllers/tasksController.js";
import express from 'express';
import { isAuthorized } from "../middleware/isAuth.js";

const taskRouter = express.Router();


taskRouter.post("/", isAuthorized, createTask);
taskRouter.get("/", isAuthorized, getTasks);

export default taskRouter;