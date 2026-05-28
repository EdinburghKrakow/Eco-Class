import express from 'express';
import * as goodsController from '../controllers/goodsController.js';
import { authenticateToken } from '../middleware/authMiddleware.js';

const router = express.Router();

router.get('/goods', goodsController.getGoods);
router.post('/goods', authenticateToken, goodsController.createGood);
router.put('/goods/:id', goodsController.updateGood);
router.delete('/goods/:id', goodsController.deleteGood);

export default router;
