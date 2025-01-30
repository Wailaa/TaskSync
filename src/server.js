import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import { connectDB } from './config/db.js';


const app = express();

app.use(cors());

connectDB();

const PORT = process.env.PORT;
app.listen(PORT,() => {
    console.log(`Server running on port ${PORT}`);
});