import dotenv from "dotenv";
import express from 'express';
import cors from 'cors';
import http from "http";
import { connectRedis } from "./config/redis.js";
import { connectDB } from './config/db.js';
import userRouter from './routes/userRoutes.js';
import taskRouter from './routes/taskRoutes.js';
import commentRouter from "./routes/commentRouter.js";
import categoryRouter from "./routes/categoriesRoutes.js";
import activityRouter from "./routes/activityLogRoutes.js";
import { initializeSocket } from "./config/socket.js";
import { activateCheckTaskDeadlines } from "./utils/scheduler.js";
import notificationRouter from "./routes/notificationsRouter.js";


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
connectRedis();
activateCheckTaskDeadlines();

const server = http.createServer(app);
initializeSocket(server);

app.use("/api/user", userRouter);
app.use("/api/tasks", taskRouter);
app.use("/api/category", categoryRouter);
app.use("/api/comment", commentRouter);
app.use("/api/activity", activityRouter);
app.use("/api/notifications", notificationRouter);

const PORT = process.env.PORT;
server.listen(PORT, () => {
    console.log(`✅ Server running on port ${PORT}`);
});

