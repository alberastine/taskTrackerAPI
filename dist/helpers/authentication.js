"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.authenticateToken = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const authenticateToken = (req, res, next) => {
    const token = req.cookies.token;
    if (!token) {
        res.status(401).json({ message: 'No token. Access denied.' });
        return;
    }
    try {
        const decoded = jsonwebtoken_1.default.verify(token, process.env.JWT_SECRET || '');
        req.user = decoded;
        next(); // Pass control to the next middleware/route handler
    }
    catch (err) {
        res.status(403).json({ message: 'Invalid or expired token.' });
        return;
    }
};
exports.authenticateToken = authenticateToken;
