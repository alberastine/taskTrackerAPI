import express from 'express';
import cors from 'cors';
import connectDB from './config/db';
import authRoutes from './routes/auth';
// import dotenv from 'dotenv';
import bodyParser from "body-parser";
import router from './routes/auth';

// dotenv.config();

const app = express();

app.use(bodyParser.json());
app.use(cors({ origin: 'http://localhost:5173' }));
app.use('/api/users', router);

connectDB();

// app.use('/api/users', authRoutes);

export default app;
