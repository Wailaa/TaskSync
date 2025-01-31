import express from 'express';
import {register,login} from "../controllers/authController.js"

const userRouter = express.Router();

userRouter.post("/register",register);

export {userRouter};