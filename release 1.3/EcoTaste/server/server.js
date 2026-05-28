import express from 'express';
import cors from 'cors';
import path from 'path';
import { fileURLToPath } from 'url';

import goodsRoutes from './routes/goodsRoutes.js';
import authRoutes from './routes/authRoutes.js';
import cartRoutes from './routes/cartRoutes.js';
import orderRoutes from './routes/orderRoutes.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = 3001;

app.use(cors());
app.use(express.json());


app.use('/public', express.static(path.join(__dirname, '../public')));

// Роутеры
app.use('/api', goodsRoutes);          // /api/goods...
app.use('/api/auth', authRoutes);      // /api/auth/...
app.use('/api/cart', cartRoutes);      // /api/cart/...
app.use('/api/orders', orderRoutes);   // /api/orders/...

app.listen(PORT, () => {
  console.log(`Сервер запущен на http://localhost:${PORT}`);
});
