import express from 'express';
import { authenticateToken } from '../helpers/authentication';
import { upload } from '../utils/multer';
import {
    addEvent,
    getEvents,
    updateEvent,
    deleteEvent,
} from '../controllers/calendarEventController';
import {
    registerUser,
    loginUser,
    getAllUser,
    getUserById,
    getUserProfile,
    logoutUser,
    uploadProfilePicture,
    uploadCoverPicture,
} from '../controllers/userController';
import { addTask } from '../controllers/taskController';

const router = express.Router();

//user routes
router.post('/signup', registerUser);
router.post('/login', loginUser);
router.post('/logout', logoutUser);
router.get('/id', getUserById);
router.get('/allUserInfo', getAllUser);
router.get('/profile', authenticateToken, getUserProfile);
router.post(
    '/uploadProfilePicture',
    authenticateToken,
    upload.single('profilePic'),
    uploadProfilePicture
);
router.post(
    '/uploadCoverPicture',
    authenticateToken,
    upload.single('coverPic'),
    uploadCoverPicture
);

// task routes
router.post('/addTask', authenticateToken, addTask);

// event routes
router.post('/events', authenticateToken, addEvent);
router.get('/events', authenticateToken, getEvents);
router.put('/events/:eventId', authenticateToken, updateEvent);
router.delete('/events/:eventId', authenticateToken, deleteEvent);

export default router;
