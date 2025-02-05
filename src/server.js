import dotenv from "dotenv";
import express from 'express';
import cors from 'cors';
import { connectDB } from './config/db.js';
import userRouter from './routes/userRoutes.js';
import taskRouter from './routes/taskRoutes.js';
import http from "http";
import { initializeSocket } from "./config/socket.js";

dotenv.config();

const app = express();

const corsOptions = {
    origin: ["http://localhost:3000", "http://127.0.0.1:5500"],
    methods: ["GET", "POST"],
    credentials: true
};

app.use(cors(corsOptions));
app.use(express.json());

connectDB();

const server = http.createServer(app);
initializeSocket(server);

app.use("/api/user", userRouter);
app.use("/api/tasks", taskRouter);

const PORT = process.env.PORT;
server.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});

