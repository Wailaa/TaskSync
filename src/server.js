import dotenv from "dotenv";
import express from 'express';
import cors from 'cors';
import { connectDB } from './config/db.js';
import userRouter from './routes/userRoutes.js';
import taskRouter from './routes/taskRoutes.js';

dotenv.config();

const app = express();

app.use(cors());
app.use(express.json());

connectDB();

app.use("/api/user", userRouter);
app.use("/api/tasks", taskRouter);

const PORT = process.env.PORT;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});