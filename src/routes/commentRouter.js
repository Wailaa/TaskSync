import express from "express";

import { createComment, getComments } from "../controllers/commentController.js";
import { isAuthorized } from "../middleware/isAuth.js";

const commentRouter = express.Router();

commentRouter.post("/:taskId", isAuthorized, createComment);
commentRouter.get("/:taskId/comments", isAuthorized, getComments);
export default commentRouter;