import * as orderService from '../services/orderService.js';
import {
  parseCartData,
  findGoodByIdWithClient,
  updateGoodQuantityWithClient,
} from '../utils/cart.js';
import pool from '../db.js';

export const getOrderHistory = async (req, res) => {
  try {
    const { login } = req.params;
    if (!login) {
      return res.status(400).json({ error: 'Не указан логин пользователя.' });
    }
    const trimmedLogin = String(login).trim();
    const orders = await orderService.getOrdersByLogin(trimmedLogin);
    res.status(200).json({ orders });
  } catch (err) {
    console.error('Ошибка загрузки истории заказов:', err);
    res.status(500).json({ error: 'Ошибка сервера при загрузке истории заказов.' });
  }
};

export const getAdminOrders = async (req, res) => {
  try {
    const orders = await orderService.getActiveOrders();
    res.status(200).json({ orders });
  } catch (err) {
    console.error('Ошибка загрузки заказов для админ-панели:', err);
    res.status(500).json({ error: 'Ошибка сервера при загрузке заказов.' });
  }
};

export const getSalesAnalytics = async (req, res) => {
  try {
    const orders = await orderService.getCompletedOrders();
    if (orders.length === 0) {
      return res.status(200).json({
        topProducts: [],
        totalRevenue: 0,
        bestSalesDay: null,
        pickupStats: { countPercent: 0, amountPercent: 0 },
        deliveryStats: { countPercent: 0, amountPercent: 0 },
      });
    }

    const goods = await orderService.getAllGoods();
    const goodsMap = new Map();
    goods.forEach((g) => goodsMap.set(String(g.id), {
      id: String(g.id),
      name: g.name,
      price: Number(g.price || 0),
    }));

    const productStats = new Map();
    const dayStats = new Map();
    let totalRevenue = 0;
    let pickupCount = 0, deliveryCount = 0;
    let pickupAmount = 0, deliveryAmount = 0;

    for (const order of orders) {
      const ids = String(order.order_list || '').split(';').map(s => s.trim()).filter(Boolean);
      const quantities = String(order.quantity || '').split(';').map(s => Number(s.trim()) || 0);
      let orderAmount = 0;

      ids.forEach((id, idx) => {
        const qty = quantities[idx] || 0;
        const good = goodsMap.get(String(id));
        if (!good || qty <= 0) return;
        const itemAmount = good.price * qty;
        orderAmount += itemAmount;

        const existing = productStats.get(String(id)) || {
          id: String(id), name: good.name, price: good.price, quantity: 0
        };
        existing.quantity += qty;
        productStats.set(String(id), existing);
      });

      totalRevenue += orderAmount;
      const day = String(order.order_date);
      dayStats.set(day, (dayStats.get(day) || 0) + orderAmount);

      const isDelivery = String(order.address || '').toLowerCase().includes(';');
      if (isDelivery) {
        deliveryCount++;
        deliveryAmount += orderAmount;
      } else {
        pickupCount++;
        pickupAmount += orderAmount;
      }
    }

    const topProducts = Array.from(productStats.values())
      .sort((a, b) => b.quantity - a.quantity || Number(a.id) - Number(b.id))
      .slice(0, 10);

    let bestSalesDay = null;
    for (const [date, amount] of dayStats.entries()) {
      if (!bestSalesDay || amount > bestSalesDay.amount) {
        bestSalesDay = { date, amount };
      }
    }

    const totalOrdersCount = pickupCount + deliveryCount;
    res.status(200).json({
      topProducts,
      totalRevenue,
      bestSalesDay,
      pickupStats: {
        countPercent: totalOrdersCount ? (pickupCount / totalOrdersCount) * 100 : 0,
        amountPercent: totalRevenue ? (pickupAmount / totalRevenue) * 100 : 0,
      },
      deliveryStats: {
        countPercent: totalOrdersCount ? (deliveryCount / totalOrdersCount) * 100 : 0,
        amountPercent: totalRevenue ? (deliveryAmount / totalRevenue) * 100 : 0,
      },
    });
  } catch (err) {
    console.error('Ошибка загрузки аналитики продаж:', err);
    res.status(500).json({ error: 'Ошибка сервера при загрузке аналитики продаж.' });
  }
};

export const updateOrderStatus = async (req, res) => {
  try {
    const orderNum = Number(req.params.orderNum);
    const { status } = req.body;
    const allowed = ['Собираем', 'Ищем курьера', 'В пути', 'Ожидает выдачи', 'Завершен'];

    if (!Number.isInteger(orderNum)) {
      return res.status(400).json({ error: 'Некорректный номер заказа.' });
    }
    if (!status || !allowed.includes(status)) {
      return res.status(400).json({ error: 'Некорректный статус заказа.' });
    }

    const updated = await orderService.updateOrderStatus(orderNum, status);
    if (!updated) {
      return res.status(404).json({ error: 'Заказ не найден.' });
    }
    res.status(200).json({ message: 'Статус заказа успешно обновлен.', order: updated });
  } catch (err) {
    console.error('Ошибка обновления статуса заказа:', err);
    res.status(500).json({ error: 'Ошибка сервера при обновлении статуса заказа.' });
  }
};

export const checkout = async (req, res) => {
  const client = await pool.connect();
  try {
    const { login, deliveryType } = req.body;
    if (!login || !deliveryType) {
      return res.status(400).json({ error: 'Не указаны данные для оформления заказа.' });
    }
    if (typeof login !== 'string' || typeof deliveryType !== 'string') {
      return res.status(400).json({ error: 'Некорректный формат данных.' });
    }

    const trimmedLogin = login.trim();
    const trimmedDeliveryType = deliveryType.trim();
    if (!trimmedLogin || !trimmedDeliveryType) {
      return res.status(400).json({ error: 'Не указаны данные для оформления заказа.' });
    }
    if (trimmedDeliveryType !== 'delivery' && trimmedDeliveryType !== 'pickup') {
      return res.status(400).json({ error: 'Некорректный способ получения заказа.' });
    }

    await client.query('BEGIN');

    const user = await orderService.getUserByLogin(trimmedLogin, client);
    if (!user) {
      await client.query('ROLLBACK');
      return res.status(404).json({ error: 'Пользователь не найден.' });
    }

    const address = trimmedDeliveryType === 'pickup' ? user.address_shop : user.address_delivery;
    if (!address || !String(address).trim()) {
      await client.query('ROLLBACK');
      return res.status(400).json({
        error: trimmedDeliveryType === 'pickup'
          ? 'Не указан адрес магазина для самовывоза.'
          : 'Не указан адрес доставки.',
      });
    }

    const cartRow = await orderService.getCartForCheckout(trimmedLogin, client);
    if (!cartRow) {
      await client.query('ROLLBACK');
      return res.status(400).json({ error: 'Корзина пуста.' });
    }

    const items = parseCartData(cartRow.goods_cart, cartRow.quantity);
    const goodsIds = Object.keys(items);
    if (goodsIds.length === 0) {
      await client.query('ROLLBACK');
      return res.status(400).json({ error: 'Корзина пуста.' });
    }

    for (const goodsId of goodsIds) {
      const good = await findGoodByIdWithClient(client, goodsId);
      if (!good) {
        await client.query('ROLLBACK');
        return res.status(404).json({ error: `Товар с id ${goodsId} не найден.` });
      }
      const stock = Number(good.quantity || 0);
      const needed = Number(items[goodsId] || 0);
      if (needed > stock) {
        await client.query('ROLLBACK');
        return res.status(400).json({ error: `Недостаточно товара с id ${goodsId} на складе.` });
      }
    }

    for (const goodsId of goodsIds) {
      const good = await findGoodByIdWithClient(client, goodsId);
      const newQty = Number(good.quantity) - Number(items[goodsId]);
      const updated = await updateGoodQuantityWithClient(client, goodsId, newQty);
      if (!updated) {
        await client.query('ROLLBACK');
        return res.status(500).json({ error: `Не удалось обновить остаток товара с id ${goodsId}.` });
      }
    }

    const orderNum = await orderService.createOrder({
      login: trimmedLogin,
      goods_cart: cartRow.goods_cart,
      quantity: cartRow.quantity === null ? '' : String(cartRow.quantity),
      address: String(address),
      status: 'Собираем',
    }, client);

    await orderService.clearCart(trimmedLogin, client);
    await client.query('COMMIT');

    res.status(201).json({
      message: `Заказ №${orderNum} успешно оформлен.`,
      order_num: orderNum,
    });
  } catch (err) {
    await client.query('ROLLBACK');
    console.error('Ошибка оформления заказа:', err);
    res.status(500).json({ error: 'Ошибка сервера при оформлении заказа.' });
  } finally {
    client.release();
  }
};
