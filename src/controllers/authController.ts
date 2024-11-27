import { Request, Response } from 'express';
import User from '../models/User';

export const registerUser = async (req: Request, res: Response) => {
    const { username, password, gmail } = req.body;

    // Check if the username or Gmail already exists
    try {
        const existingUser = await User.findOne({
            $or: [{ username }, { gmail }],
        });

        if (existingUser) {
            return res
                .status(400)
                .json({ message: 'Username or Gmail already exists' });
        }

        // Create a new user
        const newUser = new User({
            username,
            password,
            gmail,
            tasks: [],
        });

        await newUser.save();
        res.status(200).json({ message: 'User registered successfully' });
    } catch (error) {
        res.status(500).json({ message: 'Error during registration', error });
    }
};

export const loginUser = async (req: Request, res: Response) => {
    const { username, password } = req.body;
    try {
        // Find user by username
        const user = await User.findOne({ username, password });

        if (!user) {
            return res
                .status(400)
                .json({ message: 'Username or password incorrect' });
        }

        // Check if the password matches
        if (user.password !== password) {
            return res
                .status(400)
                .json({ message: 'Username or password incorrect' });
        }

        // Successful login
        res.status(202).json({
            message: 'Login successful',
            user: {
                id: user._id,
                username: user.username,
                gmail: user.gmail,
                tasks: user.tasks,
            },
        });
    } catch (error) {
        res.status(500).json({ message: 'Server error', error });
    }
};

export const getUserById = async (req: Request, res: Response) => {
    try {
        const id = req.params.id;
        const user = await User.findById(id);
        if (!user) {
            return res.status(404).json({ error: 'User not found' });
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
