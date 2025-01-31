import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import { connectDB } from './config/db.js';
import { userRouter } from './routes/userRoutes.js';


const app = express();

app.use(cors());
app.use(express.json());

connectDB();

app.use("/api/user", userRouter);

const PORT = process.env.PORT;
app.listen(PORT,() => {
    console.log(`Server running on port ${PORT}`);
});