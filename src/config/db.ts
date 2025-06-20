import mongoose from 'mongoose';
import dotenv from 'dotenv';

dotenv.config();

// Cloud MongoDB URI
const MONGO_URI = process.env.MONGO_URI || '';

const connectDB = async () => {
    try {
        //local server
        // await mongoose.connect(process.env.MONGO_URI || '');

        //cloud server
        await mongoose.connect(MONGO_URI);

        console.log('MongoDB connected successfully.');
    } catch (error) {
        console.error('MongoDB connection error:', error);
        process.exit(1);
    }
};

export default connectDB;
