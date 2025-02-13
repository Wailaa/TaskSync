
import express from "express";
import { clientRole } from "../middleware/userRole.js";
import { createCategory, getCategory } from "../controllers/categoryController.js";
import { isAuthorized } from "../middleware/isAuth.js";


const categoryRouter = express.Router();

categoryRouter.post("/", isAuthorized, clientRole(["admin", "manager"]), createCategory);
categoryRouter.get("/", isAuthorized, getCategory);

export default categoryRouter;