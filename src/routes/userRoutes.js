import express from 'express';
import { register, login, logOut } from "../controllers/authController.js"

const userRouter = express.Router();

userRouter.post("/register", register);
userRouter.post("/login", login);
userRouter.get("/logout", logOut);

export { userRouter };