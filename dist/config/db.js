"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
// Cloud MongoDB URI
const MONGO_URI = process.env.MONGO_URI || '';
const connectDB = async () => {
    try {
        //local server
        // await mongoose.connect(process.env.MONGO_URI || '');
        //cloud server
        await mongoose_1.default.connect(MONGO_URI);
        console.log('MongoDB connected successfully.');
    }
    catch (error) {
        console.error('MongoDB connection error:', error);
        process.exit(1);
    }
};
exports.default = connectDB;
