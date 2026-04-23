import * as cartService from '../services/cartService.js';

export const getCart = async (req, res) => {
  try {
    const { login } = req.params;
    if (!login) {
      return res.status(400).json({ error: 'Не указан логин пользователя.' });
    }
    const trimmedLogin = String(login).trim();
    const cart = await cartService.getCartByLogin(trimmedLogin);
    res.status(200).json(cart);
  } catch (err) {
    console.error('Ошибка получения корзины:', err);
    res.status(500).json({ error: 'Ошибка сервера при получении корзины.' });
  }
};

export const addToCart = async (req, res) => {
  try {
    const { login, goodsId } = req.body;
    if (!login || !goodsId) {
      return res.status(400).json({ error: 'Не указаны данные для корзины.' });
    }
    if (typeof login !== 'string' || (typeof goodsId !== 'string' && typeof goodsId !== 'number')) {
      return res.status(400).json({ error: 'Некорректный формат данных.' });
    }

    const trimmedLogin = login.trim();
    const trimmedGoodsId = String(goodsId).trim();

    if (!trimmedLogin || !trimmedGoodsId) {
      return res.status(400).json({ error: 'Не указаны данные для корзины.' });
    }

    const good = await cartService.getGoodWithStock(trimmedGoodsId);
    if (!good) {
      return res.status(404).json({ error: 'Товар не найден.' });
    }

    const stockQuantity = Number(good.quantity || 0);
    if (stockQuantity <= 0) {
      return res.status(400).json({ error: 'Товара нет в наличии.' });
    }

    const cart = await cartService.getCartByLogin(trimmedLogin);
    const items = cart.items;
    const currentQuantity = items[trimmedGoodsId] || 0;

    if (currentQuantity >= stockQuantity) {
      return res.status(400).json({ error: 'Нельзя добавить больше, чем есть в наличии.' });
    }

    items[trimmedGoodsId] = currentQuantity + 1;

    let serialized;
    if (cart.goods_cart === '' && cart.quantity === '') {
      serialized = await cartService.createCart(trimmedLogin, items);
    } else {
      serialized = await cartService.updateCart(trimmedLogin, items);
    }

    res.status(200).json({
      message: 'Товар добавлен в корзину.',
      login: trimmedLogin,
      goods_cart: serialized.goods_cart || '',
      quantity: serialized.quantity || '',
      items,
    });
  } catch (err) {
    console.error('Ошибка добавления в корзину:', err);
    res.status(500).json({ error: 'Ошибка сервера при добавлении в корзину.' });
  }
};

export const updateCartItem = async (req, res) => {
  try {
    const { login, goodsId, delta } = req.body;

    if (!login || !goodsId || delta === undefined || delta === null) {
      return res.status(400).json({ error: 'Не указаны данные для обновления корзины.' });
    }
    if (
      typeof login !== 'string' ||
      (typeof goodsId !== 'string' && typeof goodsId !== 'number') ||
      typeof delta !== 'number'
    ) {
      return res.status(400).json({ error: 'Некорректный формат данных.' });
    }

    const trimmedLogin = login.trim();
    const trimmedGoodsId = String(goodsId).trim();

    if (!trimmedLogin || !trimmedGoodsId) {
      return res.status(400).json({ error: 'Не указаны данные для обновления корзины.' });
    }

    const good = await cartService.getGoodWithStock(trimmedGoodsId);
    if (!good) {
      return res.status(404).json({ error: 'Товар не найден.' });
    }

    const stockQuantity = Number(good.quantity || 0);
    const cart = await cartService.getCartByLogin(trimmedLogin);
    if (!cart || Object.keys(cart.items).length === 0) {
      return res.status(404).json({ error: 'Корзина пользователя не найдена.' });
    }

    const items = cart.items;
    const currentQuantity = items[trimmedGoodsId] || 0;
    const nextQuantity = currentQuantity + delta;

    if (delta > 0 && nextQuantity > stockQuantity) {
      return res.status(400).json({ error: 'Нельзя добавить больше, чем есть в наличии.' });
    }

    if (nextQuantity > 0) {
      items[trimmedGoodsId] = nextQuantity;
    } else {
      delete items[trimmedGoodsId];
    }

    const serialized = await cartService.updateCart(trimmedLogin, items);

    res.status(200).json({
      message: 'Корзина обновлена.',
      login: trimmedLogin,
      goods_cart: serialized.goods_cart || '',
      quantity: serialized.quantity || '',
      items,
    });
  } catch (err) {
    console.error('Ошибка обновления корзины:', err);
    res.status(500).json({ error: 'Ошибка сервера при обновлении корзины.' });
  }
};
