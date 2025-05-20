import { Request, Response } from 'express';
import User from '../models/User';


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

export const updateEvent = async (
    req: Request,
    res: Response
): Promise<void> => {
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
        const event = user.events.find((event: any) => event.id === eventId);
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

export const deleteEvent = async (
    req: Request,
    res: Response
): Promise<void> => {
    try {
        const userId = (req as any).user.id;
        const { eventId } = req.params;

        const user = await User.findById(userId);
        if (!user) {
            res.status(404).json({ message: 'User not found.' });
            return;
        }

        // Find and remove the event by ID
        const eventIndex = user.events.findIndex(
            (event: any) => event.id === eventId
        );
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