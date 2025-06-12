import express from 'express';
import cors from 'cors';
import connectDB from './config/db';
import authRoutes from './routes/auth';
// import dotenv from 'dotenv';
import bodyParser from 'body-parser';
import router from './routes/auth';
import cookieParser from 'cookie-parser';

// dotenv.config();

const app = express();

app.use(bodyParser.json());
app.use(cookieParser());
app.use(
    cors({
        // origin: 'http://localhost:5173',
        origin: 'https://task-tracker-psi-cyan.vercel.app',
        credentials: true,
    })
);
app.use('/api/users', router);
app.use('/uploads', express.static('uploads'));

connectDB();

// app.use('/api/users', authRoutes);

export default app;
