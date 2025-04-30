import express from 'express';
import {
    registerUser,
    loginUser,
    getAllUser,
    getUserById,
    getUserProfile,
    logoutUser,
} from '../controllers/authController';
import { authenticateToken } from '../helpers/authentication';

const router = express.Router();

router.post('/signup', registerUser);
router.post('/login', loginUser);
router.post('/logout', logoutUser);
router.get('/id', getUserById);
router.get('/allUserInfo', getAllUser);
router.get('/profile', authenticateToken, getUserProfile);

export default router;
