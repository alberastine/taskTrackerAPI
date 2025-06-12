"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getTasks = exports.updateTask = exports.deleteTask = exports.addTask = void 0;
const User_1 = __importDefault(require("../models/User"));
const User_2 = require("../models/User");
const addTask = async (req, res) => {
    try {
        const userId = req.user.id;
        const { taskName, dateStarted, deadline, status } = req.body;
        const user = await User_1.default.findById(userId);
        if (!user) {
            res.status(404).json({ message: 'User not found.' });
            return;
        }
        const newTask = new User_2.Task({
            taskName,
            dateStarted,
            deadline,
            status,
        });
        user.tasks.push(newTask);
        await user.save();
        res.status(200).json({ message: 'Task added successfully' });
    }
    catch (error) {
        res.status(500).json({ message: 'Error adding task', error });
    }
};
exports.addTask = addTask;
const deleteTask = async (req, res) => {
    try {
        const userId = req.user.id;
        const taskId = req.params.id;
        const user = await User_1.default.findById(userId);
        if (!user) {
            res.status(404).json({ message: 'User not found.' });
            return;
        }
        // Find and remove the task by ID
        const taskIndex = user.tasks.findIndex((task) => task.id === taskId);
        if (taskIndex === -1) {
            res.status(404).json({ message: 'Task not found.' });
            return;
        }
        // Remove the task from the array
        user.tasks.splice(taskIndex, 1);
        await user.save();
        res.status(200).json({ message: 'Task deleted successfully' });
    }
    catch (error) {
        res.status(500).json({ message: 'Error deleting task', error });
    }
};
exports.deleteTask = deleteTask;
const updateTask = async (req, res) => {
    try {
        const userId = req.user.id;
        const taskId = req.params.id;
        const { taskName, dateStarted, deadline, status } = req.body;
        const user = await User_1.default.findById(userId);
        if (!user) {
            res.status(404).json({ message: 'User not found.' });
            return;
        }
        const task = user.tasks.find((task) => task.id === taskId);
        if (!task) {
            res.status(404).json({ message: 'Task not found.' });
            return;
        }
        task.taskName = taskName || task.taskName;
        task.dateStarted = dateStarted || task.dateStarted;
        task.deadline = deadline || task.deadline;
        task.status = status || task.status;
        await user.save();
        res.status(200).json({ message: 'Task updated successfully' });
    }
    catch (error) {
        res.status(500).json({ message: 'Error updating task', error });
    }
};
exports.updateTask = updateTask;
const getTasks = async (req, res) => {
    try {
        const userId = req.user.id;
        const user = await User_1.default.findById(userId);
        if (!user) {
            res.status(404).json({ message: 'User not found.' });
            return;
        }
        res.status(200).json(user.tasks);
    }
    catch (error) {
        res.status(500).json({ message: 'Error fetching tasks', error });
    }
};
exports.getTasks = getTasks;
