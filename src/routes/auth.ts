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

import {
    createTeam,
    sendTeamInvitation,
    respondToInvitation,
    requestToJoinTeam,
    respondToJoinRequest,
    deleteTeam,
    leaveTeam,
    getUserTeams,
} from '../controllers/teamController';

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

// team routes

router.post('/createTeam', authenticateToken, createTeam);
router.post('/inviteMember', authenticateToken, sendTeamInvitation);
router.post('/respondToInvitation', authenticateToken, respondToInvitation);
router.post('/requestToJoinTeam', authenticateToken, requestToJoinTeam);
router.post('/respondToJoinRequest', authenticateToken, respondToJoinRequest);
router.post('/leaveTeam', authenticateToken, leaveTeam);
router.delete('/deleteTeam', authenticateToken, deleteTeam);
router.get('/user-teams', authenticateToken, getUserTeams);

export default router;
