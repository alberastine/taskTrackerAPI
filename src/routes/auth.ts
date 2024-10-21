import express from 'express';
import { registerUser, loginUser } from '../controllers/authController';

const router = express.Router();

router.post('/signup', registerUser);
router.post('/login', (req, res) => {
    loginUser(req, res);
});

export default router;
