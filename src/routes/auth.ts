import express from 'express';
import {
    registerUser,
    loginUser,
    getAllUser,
    getUserById,
} from '../controllers/authController';

const router = express.Router();

router.post('/signup', (req, res) => {
    registerUser(req, res);
});
router.post('/login', (req, res) => {
    loginUser(req, res);
});
router.get('/id', (req, res) => {
    getUserById(req, res);
});
router.get('/allUserInfo', getAllUser);

export default router;
