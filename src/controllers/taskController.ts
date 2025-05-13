import { Request, Response } from 'express';
import User from '../models/User';
import { Task } from '../models/User';

export const addTask = async (req: Request, res: Response) => {
    try {
        const userId = (req as any).user.id;

        const { taskName, dateStarted, deadline, status } = req.body;

        const user = await User.findById(userId);
        if (!user) {
            res.status(404).json({ message: 'User not found.' });
            return;
        }
        const newTask = new Task({
            taskName,
            dateStarted,
            deadline,
            status,
        });
        user.tasks.push(newTask);
        await user.save();
        res.status(200).json({ message: 'Task added successfully' });
    } catch (error) {
        res.status(500).json({ message: 'Error adding task', error });
    }
};
export const deleteTask = async (req: Request, res: Response) => {
    try {
        const userId = (req as any).user.id;
        const taskId = req.params.id;

        const user = await User.findById(userId);
        if (!user) {
            res.status(404).json({ message: 'User not found.' });
            return;
        }

        // Find and remove the task by ID
        const taskIndex = user.tasks.findIndex((task: any) => task.id === taskId);
        if (taskIndex === -1) {
            res.status(404).json({ message: 'Task not found.' });
            return;
        }

        // Remove the task from the array
        user.tasks.splice(taskIndex, 1);
        await user.save();

        res.status(200).json({ message: 'Task deleted successfully' });
    } catch (error) {
        res.status(500).json({ message: 'Error deleting task', error });
    }
};

export const updateTask = async (req: Request, res: Response) => {
    try {
        const userId = (req as any).user.id;
        const taskId = req.params.id;
        const { taskName, dateStarted, deadline, status } = req.body;

        const user = await User.findById(userId);
        if (!user) {
            res.status(404).json({ message: 'User not found.' });
            return;
        }

        const task = user.tasks.find((task: any) => task.id === taskId);
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
    } catch (error) {
        res.status(500).json({ message: 'Error updating task', error });
    }
};

export const getTasks = async (req: Request, res: Response) => {
    try {
        const userId = (req as any).user.id;
        const user = await User.findById(userId);
        if (!user) {
            res.status(404).json({ message: 'User not found.' });
            return;
        }
        res.status(200).json(user.tasks);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching tasks', error });
    }
};