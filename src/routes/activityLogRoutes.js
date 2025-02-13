import express from "express";

import { getActivityLogs } from "../controllers/activityLogController.js";
import { isAuthorized } from "../middleware/isAuth.js";

const activityRouter = express.Router();

activityRouter.get("/:taskId", isAuthorized, getActivityLogs);

export default activityRouter;