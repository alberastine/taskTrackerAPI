"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteEvent = exports.updateEvent = exports.getEvents = exports.addEvent = void 0;
const User_1 = __importDefault(require("../models/User"));
const addEvent = async (req, res) => {
    try {
        const userId = req.user.id;
        const { title, date } = req.body;
        const user = await User_1.default.findById(userId);
        if (!user) {
            res.status(404).json({ message: 'User not found.' });
            return;
        }
        const newEvent = { title, date };
        user.events.push(newEvent);
        await user.save();
        res.status(200).json(newEvent);
    }
    catch (error) {
        res.status(500).json({ message: 'Error adding event', error });
    }
};
exports.addEvent = addEvent;
const getEvents = async (req, res) => {
    try {
        const userId = req.user.id;
        const user = await User_1.default.findById(userId);
        if (!user) {
            res.status(404).json({ message: 'User not found.' });
            return;
        }
        res.status(200).json(user.events);
    }
    catch (error) {
        res.status(500).json({ message: 'Error fetching events', error });
    }
};
exports.getEvents = getEvents;
const updateEvent = async (req, res) => {
    try {
        const userId = req.user.id;
        const { eventId } = req.params;
        const { title, date } = req.body;
        // Find user
        const user = await User_1.default.findById(userId);
        if (!user) {
            res.status(404).json({ message: 'User not found.' });
            return;
        }
        // Find event by ID within the user's events array
        const event = user.events.find((event) => event.id === eventId);
        if (!event) {
            res.status(404).json({ message: 'Event not found.' });
            return;
        }
        // Update event properties (title, date)
        if (title)
            event.title = title;
        if (date)
            event.date = date;
        // Save the user (with updated event)
        await user.save();
        res.status(200).json(event);
    }
    catch (error) {
        res.status(500).json({ message: 'Error updating event', error });
    }
};
exports.updateEvent = updateEvent;
const deleteEvent = async (req, res) => {
    try {
        const userId = req.user.id;
        const { eventId } = req.params;
        const user = await User_1.default.findById(userId);
        if (!user) {
            res.status(404).json({ message: 'User not found.' });
            return;
        }
        // Find and remove the event by ID
        const eventIndex = user.events.findIndex((event) => event.id === eventId);
        if (eventIndex === -1) {
            res.status(404).json({ message: 'Event not found.' });
            return;
        }
        // Remove the event from the array
        user.events.splice(eventIndex, 1);
        await user.save();
        res.status(200).json({ message: 'Event deleted successfully' });
    }
    catch (error) {
        res.status(500).json({ message: 'Error deleting event', error });
    }
};
exports.deleteEvent = deleteEvent;
