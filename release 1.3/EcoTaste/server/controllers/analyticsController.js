import * as analyticsService from '../services/analyticsService.js';
import { findUserByLogin } from '../services/authService.js';

export const getSellerAnalytics = async (req, res) => {
  try {
    // Получаем логин из токена (он всегда латиницей)
    const login = req.user?.login;
    if (!login) {
      return res.status(403).json({ error: 'Продавец не определён' });
    }

    // По логину находим реального пользователя
    const user = await findUserByLogin(login);
    if (!user || !user.user_name) {
      return res.status(403).json({ error: 'Продавец не найден' });
    }

    const seller = user.user_name; // ← вот нормальное имя "Продавец"

    const [dailySales, topProducts, totalRevenue] = await Promise.all([
      analyticsService.getDailySalesBySeller(seller),
      analyticsService.getTopProductsBySeller(seller),
      analyticsService.getTotalRevenueBySeller(seller),
    ]);

    res.json({ dailySales, topProducts, totalRevenue });
  } catch (err) {
    console.error('Ошибка получения аналитики продавца:', err);
    res.status(500).json({ error: 'Ошибка сервера' });
  }
};
