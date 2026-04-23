import express from 'express';
import * as cartController from '../controllers/cartController.js';
import { authenticateToken } from '../middleware/authMiddleware.js';

const router = express.Router();

router.get('/cart/:login', authenticateToken, cartController.getCart);
router.post('/cart/add', authenticateToken, cartController.addToCart);
router.patch('/cart/update', authenticateToken, cartController.updateCartItem);

export default router;
