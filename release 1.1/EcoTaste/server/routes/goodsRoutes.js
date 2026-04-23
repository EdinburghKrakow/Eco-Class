import express from 'express';
import * as goodsController from '../controllers/goodsController.js';

const router = express.Router();

router.get('/goods', goodsController.getGoods);
router.post('/goods', goodsController.createGood);
router.put('/goods/:id', goodsController.updateGood);
router.delete('/goods/:id', goodsController.deleteGood);

export default router;
