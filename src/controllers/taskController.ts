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