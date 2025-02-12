import express from "express";

import { isAuthorized } from "../middleware/isAuth.js";
import { getNotifications } from "../controllers/notificationController.js";

const notificationRouter = express.Router();

notificationRouter.get("/", isAuthorized, getNotifications);

export default notificationRouter;