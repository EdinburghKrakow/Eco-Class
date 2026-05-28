import express from 'express';
import * as orderController from '../controllers/orderController.js';
import { authenticateToken } from '../middleware/authMiddleware.js';
import * as analyticsController from '../controllers/analyticsController.js';

const router = express.Router();

router.get('/orders/:login', authenticateToken, orderController.getOrderHistory);
router.get('/admin/orders', authenticateToken, orderController.getAdminOrders); // админские тоже через токен
router.get('/admin/analytics', authenticateToken, orderController.getSalesAnalytics);
router.patch('/admin/orders/:orderNum/status', authenticateToken, orderController.updateOrderStatus);
router.post('/orders/checkout', authenticateToken, orderController.checkout);
router.get('/seller/analytics', authenticateToken, analyticsController.getSellerAnalytics);

export default router;
