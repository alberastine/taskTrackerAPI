import { Request, Response } from 'express';
import User from '../models/User';
import { Task } from '../models/User';
import { hashPassword, comparePassword } from '../helpers/hashedPass';
import jwt from 'jsonwebtoken';

export const registerUser = async (req: Request, res: Response) => {
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

        const existingEmail = await User.findOne({ gmail });

        if (existingEmail) {
            res.status(400).json({ message: 'Email already exists' });
            return;
        }

        const hashedPassword = await hashPassword(password);

        const newUser = new User({
            username,
            password: hashedPassword,
            gmail,
            tasks: [],
            events: [],
        });

        await newUser.save();
        res.status(200).json({ message: 'User registered successfully' });
    } catch (error) {
        res.status(500).json({ message: 'Error during registration', error });
    }
};

export const loginUser = async (req: Request, res: Response) => {
    try {
        const { gmail, password } = req.body;

        const user = await User.findOne({ gmail });
        if (!user) {
            res.status(400).json({ message: 'Email or password incorrect' });
            return;
        }

        const isMatch = await comparePassword(password, user.password);
        if (!isMatch) {
            res.status(401).json({ error: 'Invalid password' });
            return;
        }

        const token = jwt.sign(
            {
                id: user._id,
                username: user.username,
                gmail: user.gmail,
                tasks: user.tasks,
            },
            process.env.JWT_SECRET || '',
            { expiresIn: '1h' }
        );

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
    } catch (error) {
        res.status(500).json({ message: 'Server error', error });
    }
};

export const getUserById = async (req: Request, res: Response) => {
    try {
        const id = req.params.id;
        const user = await User.findById(id);
        if (!user) {
            res.status(404).json({ error: 'User not found' });
            return;
        }
        res.status(200).json(user);
    } catch (error) {
        res.status(500).json({ error: 'Error fetching users' });
    }
};

export const getAllUser = async (req: Request, res: Response) => {
    try {
        const users = await User.find();
        res.status(200).json(users);
    } catch (error) {
        res.status(500).json({ error: 'Error fetching users' });
    }
};

export const getUserProfile = async (req: Request, res: Response) => {
    try {
        const userId = (req as any).user.id;

        const user = await User.findById(userId).select('-password');
        if (!user) {
            res.status(404).json({ message: 'User not found.' });
            return;
        }

        res.status(200).json({ user });
    } catch (error) {
        res.status(500).json({ message: 'Server error', error });
    }
};

export const logoutUser = (req: Request, res: Response): void => {
    res.clearCookie('token', {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax',
    });

    res.status(200).json({ message: 'Logged out successfully' });
};

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

export const addEvent = async (req: Request, res: Response) => {
    try {
        const userId = (req as any).user.id;
        const { title, date } = req.body;

        const user = await User.findById(userId);
        if (!user) {
            res.status(404).json({ message: 'User not found.' });
            return;
        }

        const newEvent = { title, date };
        user.events.push(newEvent);
        await user.save();

        res.status(200).json(newEvent);
    } catch (error) {
        res.status(500).json({ message: 'Error adding event', error });
    }
};

export const getEvents = async (req: Request, res: Response) => {
    try {
        const userId = (req as any).user.id;
        const user = await User.findById(userId);
        if (!user) {
            res.status(404).json({ message: 'User not found.' });
            return;
        }
        res.status(200).json(user.events);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching events', error });
    }
};

export const updateEvent = async (req: Request, res: Response): Promise<void> => {
    try {
        const userId = (req as any).user.id;
        const { eventId } = req.params;
        const { title, date } = req.body;

        // Find user
        const user = await User.findById(userId);
        if (!user) {
            res.status(404).json({ message: 'User not found.' });
            return;
        }

        // Find event by ID within the user's events array
        const event = user.events.id(eventId);
        if (!event) {
            res.status(404).json({ message: 'Event not found.' });
            return;
        }

        // Update event properties (title, date)
        if (title) event.title = title;
        if (date) event.date = date;

        // Save the user (with updated event)
        await user.save();
        res.status(200).json(event);
    } catch (error) {
        res.status(500).json({ message: 'Error updating event', error });
    }
};

export const deleteEvent = async (req: Request, res: Response): Promise<void> => {
    try {
        const userId = (req as any).user.id;
        const { eventId } = req.params;

        const user = await User.findById(userId);
        if (!user) {
            res.status(404).json({ message: 'User not found.' });
            return;
        }

        // Find and remove the event by ID
        const eventIndex = user.events.findIndex((event: any) => event.id === eventId);
        if (eventIndex === -1) {
            res.status(404).json({ message: 'Event not found.' });
            return;
        }

        // Remove the event from the array
        user.events.splice(eventIndex, 1);
        await user.save();

        res.status(200).json({ message: 'Event deleted successfully' });
    } catch (error) {
        res.status(500).json({ message: 'Error deleting event', error });
    }
};