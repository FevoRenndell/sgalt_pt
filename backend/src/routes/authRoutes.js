import express from 'express';
import authenticateJWT from '../middlewares/authenticateJWT.js';
import { login, me, logout } from '../controllers/authController.js';

const router = express.Router();

router.post('/login', login);
router.post('/logout', logout);
router.get('/me', authenticateJWT, me);


export default router;
