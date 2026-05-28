import express from 'express';
import * as authController from '../controllers/authController.js';
import * as passwordController from '../controllers/passwordController.js';
import { authenticateToken } from '../middleware/authMiddleware.js';

const router = express.Router();

router.post('/register', authController.register);
router.post('/login', authController.login);
router.get('/profile/:login', authenticateToken, authController.getProfile);
router.put('/profile', authenticateToken, authController.updateProfile);
router.post('/reset-password', passwordController.resetPassword);

import * as addressController from '../controllers/addressController.js';

router.get('/addresses/:login', authenticateToken, addressController.getAddresses);
router.post('/addresses', authenticateToken, addressController.addAddress);
router.put('/addresses/:addressId', authenticateToken, addressController.updateAddress);
router.delete('/addresses/:addressId', authenticateToken, addressController.deleteAddress);
router.put('/select-address', authenticateToken, authController.selectAddress);

export default router;
