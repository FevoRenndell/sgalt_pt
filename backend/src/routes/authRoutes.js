import express from 'express';
import authenticateJWT from '../middlewares/authenticateJWT.js';
import { login, me } from '../controllers/authController.js';

const router = express.Router();

router.post('/login', login);
router.get('/me', authenticateJWT, me);


export default router;
