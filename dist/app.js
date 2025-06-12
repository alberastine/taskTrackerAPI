"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const db_1 = __importDefault(require("./config/db"));
// import dotenv from 'dotenv';
const body_parser_1 = __importDefault(require("body-parser"));
const auth_1 = __importDefault(require("./routes/auth"));
const cookie_parser_1 = __importDefault(require("cookie-parser"));
// dotenv.config();
const app = (0, express_1.default)();
app.use(body_parser_1.default.json());
app.use((0, cookie_parser_1.default)());
app.use((0, cors_1.default)({
    // origin: 'http://localhost:5173',
    origin: 'https://task-tracker-psi-cyan.vercel.app',
    credentials: true,
}));
app.use('/api/users', auth_1.default);
app.use('/uploads', express_1.default.static('uploads'));
(0, db_1.default)();
// app.use('/api/users', authRoutes);
exports.default = app;
