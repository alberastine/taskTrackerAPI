"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateUser = exports.logoutUser = exports.uploadCoverPicture = exports.uploadProfilePicture = exports.getUserProfile = exports.getAllUser = exports.getUserById = exports.loginUser = exports.registerUser = void 0;
const User_1 = __importDefault(require("../models/User"));
const hashedPass_1 = require("../helpers/hashedPass");
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const Team_1 = __importDefault(require("../models/Team"));
const registerUser = async (req, res) => {
    try {
        const { username, password, gmail } = req.body;
        if (!username) {
            res.json({ error: 'Name is required' });
            return;
        }
        if (!password || password.length < 6) {
            res.json({
                error: 'Password is required and should be at least 6 characters',
            });
            return;
        }
        const existingEmail = await User_1.default.findOne({ gmail });
        if (existingEmail) {
            res.status(400).json({ message: 'Email already exists' });
            return;
        }
        const hashedPassword = await (0, hashedPass_1.hashPassword)(password);
        const newUser = new User_1.default({
            username,
            password: hashedPassword,
            gmail,
            tasks: [],
            events: [],
        });
        await newUser.save();
        res.status(200).json({ message: 'User registered successfully' });
    }
    catch (error) {
        res.status(500).json({ message: 'Error during registration', error });
    }
};
exports.registerUser = registerUser;
const loginUser = async (req, res) => {
    try {
        const { gmail, password } = req.body;
        const user = await User_1.default.findOne({ gmail });
        if (!user) {
            res.status(400).json({ message: 'Email or password incorrect' });
            return;
        }
        const isMatch = await (0, hashedPass_1.comparePassword)(password, user.password);
        if (!isMatch) {
            res.status(401).json({ error: 'Invalid password' });
            return;
        }
        const token = jsonwebtoken_1.default.sign({
            id: user._id,
            username: user.username,
            gmail: user.gmail,
            tasks: user.tasks,
        }, process.env.JWT_SECRET || '', { expiresIn: '1h' });
        res.cookie('token', token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'lax',
            maxAge: 3600000,
        });
        res.status(200).json({
            message: 'Logged in successfully',
            user: {
                id: user._id,
                username: user.username,
                gmail: user.gmail,
                tasks: user.tasks,
            },
        });
        return;
    }
    catch (error) {
        res.status(500).json({ message: 'Server error', error });
    }
};
exports.loginUser = loginUser;
const getUserById = async (req, res) => {
    try {
        const id = req.params.id;
        const user = await User_1.default.findById(id);
        if (!user) {
            res.status(404).json({ error: 'User not found' });
            return;
        }
        res.status(200).json(user);
    }
    catch (error) {
        res.status(500).json({ error: 'Error fetching users' });
    }
};
exports.getUserById = getUserById;
const getAllUser = async (req, res) => {
    try {
        const users = await User_1.default.find();
        res.status(200).json(users);
    }
    catch (error) {
        res.status(500).json({ error: 'Error fetching users' });
    }
};
exports.getAllUser = getAllUser;
const getUserProfile = async (req, res) => {
    try {
        const userId = req.user.id;
        const user = await User_1.default.findById(userId).select('-password');
        if (!user) {
            res.status(404).json({ message: 'User not found.' });
            return;
        }
        res.status(200).json({ user });
    }
    catch (error) {
        res.status(500).json({ message: 'Server error', error });
    }
};
exports.getUserProfile = getUserProfile;
const uploadProfilePicture = async (req, res) => {
    try {
        if (!req.file) {
            res.status(400).json({ message: 'No file uploaded.' });
            return;
        }
        const userId = req.user.id;
        const imagePath = `/uploads/${req.file?.filename}`;
        const updatedUser = await User_1.default.findByIdAndUpdate(userId, { profilePic: imagePath }, { new: true });
        if (!updatedUser) {
            res.status(404).json({ message: 'User not found.' });
            return;
        }
        res.status(200).json({
            message: 'Profile picture updated.',
            user: updatedUser,
        });
        return;
    }
    catch (error) {
        res.status(500).json({
            message: 'Error uploading profile picture.',
            error,
        });
        return;
    }
};
exports.uploadProfilePicture = uploadProfilePicture;
const uploadCoverPicture = async (req, res) => {
    try {
        if (!req.file) {
            res.status(400).json({ message: 'No file uploaded.' });
            return;
        }
        const userId = req.user.id;
        const imagePath = `/uploads/${req.file?.filename}`;
        const updatedUser = await User_1.default.findByIdAndUpdate(userId, { coverPic: imagePath }, { new: true });
        if (!updatedUser) {
            res.status(404).json({ message: 'User not found.' });
            return;
        }
        res.status(200).json({
            message: 'Cover picture updated.',
            user: updatedUser,
        });
        return;
    }
    catch (error) {
        res.status(500).json({
            message: 'Error uploading profile picture.',
            error,
        });
        return;
    }
};
exports.uploadCoverPicture = uploadCoverPicture;
const logoutUser = (req, res) => {
    res.clearCookie('token', {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax',
    });
    res.status(200).json({ message: 'Logged out successfully' });
};
exports.logoutUser = logoutUser;
const updateUser = async (req, res) => {
    try {
        const userId = req.user.id;
        const { username, gmail, currentPassword, newPassword } = req.body;
        const user = await User_1.default.findById(userId);
        if (!user) {
            res.status(404).json({ message: 'User not found' });
            return;
        }
        const updates = {};
        if (username && username.trim()) {
            if (username.length < 3) {
                res.status(400).json({
                    message: 'Username must be at least 3 characters long',
                });
                return;
            }
            updates.username = username.trim();
        }
        if (gmail && gmail.trim()) {
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!emailRegex.test(gmail)) {
                res.status(400).json({ message: 'Invalid email format' });
                return;
            }
            const existingEmail = await User_1.default.findOne({
                gmail: gmail.trim(),
                _id: { $ne: userId },
            });
            if (existingEmail) {
                res.status(400).json({ message: 'Email already in use' });
                return;
            }
            updates.gmail = gmail.trim();
        }
        if (newPassword && newPassword.trim()) {
            if (!currentPassword) {
                res.status(400).json({
                    message: 'Current password is required to update password',
                });
                return;
            }
            const isMatch = await (0, hashedPass_1.comparePassword)(currentPassword, user.password);
            if (!isMatch) {
                res.status(401).json({
                    message: 'Current password is incorrect',
                });
                return;
            }
            if (newPassword.length < 6) {
                res.status(400).json({
                    message: 'New password must be at least 6 characters long',
                });
                return;
            }
            updates.password = await (0, hashedPass_1.hashPassword)(newPassword);
        }
        if (Object.keys(updates).length === 0) {
            res.status(400).json({
                message: 'No valid updates provided',
            });
            return;
        }
        const updatedUser = await User_1.default.findByIdAndUpdate(userId, updates, {
            new: true,
        }).select('-password');
        await Team_1.default.updateMany({ leader_id: userId }, { $set: { leader_username: updates.username } });
        await Team_1.default.updateMany({ 'members_lists.user_id': userId }, { $set: { 'members_lists.$[elem].username': updates.username } }, { arrayFilters: [{ 'elem.user_id': userId }] });
        await Team_1.default.updateMany({ 'invited_users.user_id': userId }, { $set: { 'invited_users.$[elem].username': updates.username } }, { arrayFilters: [{ 'elem.user_id': userId }] });
        await Team_1.default.updateMany({ 'join_requests.user_id': userId }, { $set: { 'join_requests.$[elem].username': updates.username } }, { arrayFilters: [{ 'elem.user_id': userId }] });
        res.status(200).json({
            message: 'User updated successfully',
            user: updatedUser,
        });
    }
    catch (error) {
        res.status(500).json({
            message: 'Error updating user',
            error,
        });
    }
};
exports.updateUser = updateUser;
