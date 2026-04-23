import express from 'express';
import * as authController from '../controllers/authController.js';
import { authenticateToken } from '../middleware/authMiddleware.js';

const router = express.Router();

router.post('/register', authController.register);
router.post('/login', authController.login);
router.get('/profile/:login', authenticateToken, authController.getProfile);
router.put('/profile', authenticateToken, authController.updateProfile);

export default router;
