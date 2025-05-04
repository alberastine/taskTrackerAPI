import express from 'express';
import {
    registerUser,
    loginUser,
    getAllUser,
    getUserById,
    getUserProfile,
    logoutUser,
    addTask,
    addEvent,
    getEvents,
    updateEvent,
    deleteEvent
} from '../controllers/authController';
import { authenticateToken } from '../helpers/authentication';

const router = express.Router();

router.post('/signup', registerUser);
router.post('/login', loginUser);
router.post('/logout', logoutUser);
router.get('/id', getUserById);
router.get('/allUserInfo', getAllUser);
router.get('/profile', authenticateToken, getUserProfile);
router.post('/addTask', authenticateToken, addTask);
router.post('/events', authenticateToken, addEvent);
router.get('/events', authenticateToken, getEvents);
router.put('/events/:eventId', authenticateToken, updateEvent);
router.delete('/events/:eventId', authenticateToken, deleteEvent);

export default router;
