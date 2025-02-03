import express from 'express';
import { register, login, logOut, refreshRequest } from "../controllers/authController.js"

const userRouter = express.Router();

userRouter.post("/register", register);
userRouter.post("/login", login);
userRouter.post("/logout", logOut);
userRouter.post("/refresh", refreshRequest);

export default userRouter;