import express from 'express';
import { isAuthorized } from "../middleware/isAuth.js";
import { clientRole } from "../middleware/userRole.js";
import { register, login, logOut, refreshRequest } from "../controllers/authController.js"


const userRouter = express.Router();

userRouter.post("/register", register);
userRouter.post("/login", login);
userRouter.post("/logout", logOut);
userRouter.post("/refresh", refreshRequest);
userRouter.put("/:id/role", isAuthorized, clientRole(["admin"]));

export default userRouter;