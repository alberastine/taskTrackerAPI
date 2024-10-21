import { Request, Response } from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import User from '../models/User';

export const registerUser = async (req: Request, res: Response) => {
    try {
        const { username, password } = req.body;
        console.log('BODY: ', req.body);
        const hashedPassword = await bcrypt.hash(password, 10);
        const newUser = new User({ username, password: hashedPassword });
        await newUser.save();
        res.status(201).json({ message: 'User registered successfully!' });
    } catch (error) {
        res.status(500).json({ error: 'Error registering user' });
    }
};

export const loginUser = async (req: Request, res: Response) => {
    try {
        const { username, password } = req.body;
        const user = await User.findOne({ username, password });
        if (!user) return res.status(404).json({ error: 'User not found' });

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch)
            return res.status(400).json({ error: 'Invalid credentials' });

        const token = jwt.sign(
            { id: user._id },
            process.env.JWT_SECRET || 'defaultsecret',
            { expiresIn: '1h' }
        );
        res.json({ token, message: 'Login successful' });
    } catch (error) {
        res.status(500).json({ error: 'Error logging in' });
    }
};
