import express from 'express';
import { Pool } from 'pg';
import cors from 'cors';
import path from 'path';
import crypto from 'crypto';
import { promisify } from 'util';
import { fileURLToPath } from 'url';

const scryptAsync = promisify(crypto.scrypt);

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const FRONTEND_ORIGIN = 'http://localhost:5173';

const pool = new Pool({
  user: 'postgres',
  host: 'localhost',
  database: 'EcoTaste',
  password: '123126',
  port: 5432,
});

pool.on('error', (err) => {
  console.error('Ошибка подключения к базе данных:', err);
});

const hashPassword = async (password) => {
  const salt = crypto.randomBytes(16).toString('hex');
  const derivedKey = await scryptAsync(password, salt, 64);
  return `scrypt$${salt}$${derivedKey.toString('hex')}`;
};

const verifyPassword = async (password, storedValue) => {
  if (!storedValue || typeof storedValue !== 'string') {
    return false;
  }

  const parts = storedValue.split('$');

  if (parts.length !== 3) {
    return false;
  }

  const [algorithm, salt, storedHash] = parts;

  if (algorithm !== 'scrypt' || !salt || !storedHash) {
    return false;
  }

  const derivedKey = await scryptAsync(password, salt, 64);
  const derivedHashHex = derivedKey.toString('hex');

  const storedBuffer = Buffer.from(storedHash, 'hex');
  const derivedBuffer = Buffer.from(derivedHashHex, 'hex');

  if (storedBuffer.length !== derivedBuffer.length) {
    return false;
  }

  return crypto.timingSafeEqual(storedBuffer, derivedBuffer);
};

const parseCartData = (goodsCartValue, quantityValue) => {
  const goodsCartString =
    goodsCartValue === null || goodsCartValue === undefined
      ? ''
      : String(goodsCartValue);

  const quantityString =
    quantityValue === null || quantityValue === undefined
      ? ''
      : String(quantityValue);

  const ids = goodsCartString.length > 0
    ? goodsCartString.split(';').filter((item) => item !== '')
    : [];

  const quantities = quantityString.length > 0
    ? quantityString.split(';').filter((item) => item !== '')
    : [];

  const items = {};

  ids.forEach((id, index) => {
    const quantity = Number(quantities[index] || 0);
    if (id && quantity > 0) {
      items[String(id)] = quantity;
    }
  });

  return items;
};

const serializeCartData = (items) => {
  const ids = Object.keys(items).filter((id) => Number(items[id]) > 0);
  const quantities = ids.map((id) => String(items[id]));

  return {
    goods_cart: ids.length > 0 ? ids.join(';') : null,
    quantity: quantities.length > 0 ? quantities.join(';') : null,
  };
};

const findGoodByIdWithClient = async (client, goodsId) => {
  const normalizedGoodsId = String(goodsId).trim();

  const attempts = [
    {
      query: 'SELECT id, quantity, price FROM goods WHERE id = $1',
      value: normalizedGoodsId,
    },
    {
      query: 'SELECT id_goods AS id, quantity, price FROM goods WHERE id_goods = $1',
      value: normalizedGoodsId,
    },
  ];

  for (const attempt of attempts) {
    try {
      const result = await client.query(attempt.query, [attempt.value]);
      if (result.rows.length > 0) {
        return result.rows[0];
      }
    } catch (error) {
      continue;
    }
  }

  return null;
};

const findGoodById = async (goodsId) => {
  const client = await pool.connect();
  try {
    return await findGoodByIdWithClient(client, goodsId);
  } finally {
    client.release();
  }
};

const updateGoodQuantityWithClient = async (client, goodsId, newQuantity) => {
  const normalizedGoodsId = String(goodsId).trim();

  const attempts = [
    {
      query: 'UPDATE goods SET quantity = $1 WHERE id = $2',
      values: [newQuantity, normalizedGoodsId],
    },
    {
      query: 'UPDATE goods SET quantity = $1 WHERE id_goods = $2',
      values: [newQuantity, normalizedGoodsId],
    },
  ];

  for (const attempt of attempts) {
    try {
      const result = await client.query(attempt.query, attempt.values);
      if (result.rowCount > 0) {
        return true;
      }
    } catch (error) {
      continue;
    }
  }

  return false;
};

const goodsApp = express();

goodsApp.use(cors({ origin: FRONTEND_ORIGIN }));
goodsApp.use(express.json());
goodsApp.use('/public', express.static(path.join(__dirname, 'public')));

goodsApp.get('/goods', async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM goods ORDER BY id');
    res.json(result.rows);
  } catch (err) {
    console.error('Ошибка выполнения запроса товаров:', err);
    res.status(500).json({ error: 'Ошибка сервера' });
  }
});

goodsApp.post('/goods', async (req, res) => {
  try {
    const { id, name, price, quantity, isnew } = req.body;

    if (
      id === undefined ||
      !name ||
      price === undefined ||
      quantity === undefined
    ) {
      return res.status(400).json({ error: 'Необходимо заполнить все поля.' });
    }

    const trimmedId = String(id).trim();
    const trimmedName = String(name).trim();
    const numericPrice = Number(price);
    const numericQuantity = Number(quantity);

    if (!trimmedId || !trimmedName) {
      return res.status(400).json({ error: 'Необходимо заполнить все поля.' });
    }

    if (!/^\d+$/.test(trimmedId)) {
      return res.status(400).json({ error: 'Код должен содержать только цифры.' });
    }

    if (Number.isNaN(numericPrice) || numericPrice < 0) {
      return res.status(400).json({ error: 'Цена должна быть корректным числом.' });
    }

    if (!Number.isInteger(numericQuantity) || numericQuantity < 0) {
      return res.status(400).json({ error: 'Количество должно быть целым числом.' });
    }

    const existing = await findGoodById(trimmedId);

    if (existing) {
      return res.status(400).json({ error: 'Товар с таким id уже существует.' });
    }

    await pool.query(
      `
      INSERT INTO goods (id, name, photo, description, price, quantity, isnew)
      VALUES ($1, $2, $3, $4, $5, $6, $7)
      `,
      [
        trimmedId,
        trimmedName,
        `${trimmedId}.png`,
        `${trimmedId}.txt`,
        numericPrice,
        numericQuantity,
        isnew === false ? false : true,
      ]
    );

    res.status(201).json({ message: 'Товар успешно добавлен.' });
  } catch (err) {
    console.error('Ошибка добавления товара:', err);
    res.status(500).json({ error: 'Ошибка сервера при добавлении товара.' });
  }
});

goodsApp.put('/goods/:id', async (req, res) => {
  try {
    const routeId = String(req.params.id || '').trim();
    const { name, price, quantity, isnew } = req.body;

    if (!routeId || !name || price === undefined || quantity === undefined) {
      return res.status(400).json({ error: 'Необходимо заполнить все поля.' });
    }

    const trimmedName = String(name).trim();
    const numericPrice = Number(price);
    const numericQuantity = Number(quantity);

    if (!/^\d+$/.test(routeId)) {
      return res.status(400).json({ error: 'Код должен содержать только цифры.' });
    }

    if (!trimmedName) {
      return res.status(400).json({ error: 'Необходимо заполнить все поля.' });
    }

    if (Number.isNaN(numericPrice) || numericPrice < 0) {
      return res.status(400).json({ error: 'Цена должна быть корректным числом.' });
    }

    if (!Number.isInteger(numericQuantity) || numericQuantity < 0) {
      return res.status(400).json({ error: 'Количество должно быть целым числом.' });
    }

    const result = await pool.query(
      `
      UPDATE goods
      SET name = $1,
          photo = $2,
          description = $3,
          price = $4,
          quantity = $5,
          isnew = $6
      WHERE id = $7
      `,
      [
        trimmedName,
        `${routeId}.png`,
        `${routeId}.txt`,
        numericPrice,
        numericQuantity,
        isnew === true,
        routeId,
      ]
    );

    if (result.rowCount === 0) {
      return res.status(404).json({ error: 'Товар с таким id не найден.' });
    }

    res.status(200).json({ message: 'Товар успешно обновлен.' });
  } catch (err) {
    console.error('Ошибка редактирования товара:', err);
    res.status(500).json({ error: 'Ошибка сервера при редактировании товара.' });
  }
});

goodsApp.delete('/goods/:id', async (req, res) => {
  try {
    const routeId = String(req.params.id || '').trim();

    if (!routeId) {
      return res.status(400).json({ error: 'Не указан id товара.' });
    }

    const result = await pool.query('DELETE FROM goods WHERE id = $1', [routeId]);

    if (result.rowCount === 0) {
      return res.status(404).json({ error: 'Товар с таким id не найден.' });
    }

    res.status(200).json({ message: 'Товар успешно удален.' });
  } catch (err) {
    console.error('Ошибка удаления товара:', err);
    res.status(500).json({ error: 'Ошибка сервера при удалении товара.' });
  }
});

goodsApp.listen(3001, () => {
  console.log('Goods server started on port 3001');
});

const authApp = express();

authApp.use(cors({ origin: FRONTEND_ORIGIN }));
authApp.use(express.json());

authApp.post('/register', async (req, res) => {
  try {
    const { user_name, login, passwd } = req.body;

    if (!user_name || !login || !passwd) {
      return res.status(400).json({ error: 'Необходимо заполнить все поля.' });
    }

    if (
      typeof user_name !== 'string' ||
      typeof login !== 'string' ||
      typeof passwd !== 'string'
    ) {
      return res.status(400).json({ error: 'Некорректный формат данных.' });
    }

    const trimmedUserName = user_name.trim();
    const trimmedLogin = login.trim();
    const trimmedPasswd = passwd.trim();

    if (
      trimmedUserName.length === 0 ||
      trimmedLogin.length === 0 ||
      trimmedPasswd.length === 0
    ) {
      return res.status(400).json({ error: 'Необходимо заполнить все поля.' });
    }

    if (trimmedUserName.length > 255) {
      return res.status(400).json({ error: 'Имя не должно превышать 255 символов.' });
    }

    if (trimmedLogin.length < 11) {
      return res.status(400).json({ error: 'Логин (номер телефона) не должен быть короче 11 символов.' });
    }

    if (trimmedLogin.length > 12) {
      return res.status(400).json({ error: 'Логин (номер телефона) не должен превышать 12 символов.' });
    }

    if (!/^\d+$/.test(trimmedLogin)) {
      return res.status(400).json({ error: 'Логин должен содержать только цифры.' });
    }

    if (trimmedPasswd.length > 255) {
      return res.status(400).json({ error: 'Пароль не должен превышать 255 символов.' });
    }

    const existingUser = await pool.query(
      'SELECT login FROM users WHERE login = $1',
      [trimmedLogin]
    );

    if (existingUser.rows.length > 0) {
      return res.status(400).json({ error: 'Пользователь с таким логином уже существует.' });
    }

    const hashedPassword = await hashPassword(trimmedPasswd);

    await pool.query(
      'INSERT INTO users (user_name, login, passwd) VALUES ($1, $2, $3)',
      [trimmedUserName, trimmedLogin, hashedPassword]
    );

    res.status(201).json({ message: 'Пользователь успешно зарегистрирован.' });
  } catch (err) {
    console.error('Ошибка регистрации:', err);
    res.status(500).json({ error: 'Ошибка сервера при регистрации.' });
  }
});

authApp.post('/login', async (req, res) => {
  try {
    const { login, passwd } = req.body;

    if (!login || !passwd) {
      return res.status(400).json({ error: 'Необходимо заполнить все поля.' });
    }

    if (typeof login !== 'string' || typeof passwd !== 'string') {
      return res.status(400).json({ error: 'Некорректный формат данных.' });
    }

    const trimmedLogin = login.trim();
    const trimmedPasswd = passwd.trim();

    if (trimmedLogin.length === 0 || trimmedPasswd.length === 0) {
      return res.status(400).json({ error: 'Необходимо заполнить все поля.' });
    }

    if (trimmedLogin.length > 12) {
      return res.status(400).json({ error: 'Логин (номер телефона) не должен превышать 12 символов.' });
    }

    if (!/^\d+$/.test(trimmedLogin)) {
      return res.status(400).json({ error: 'Логин должен содержать только цифры.' });
    }

    if (trimmedPasswd.length > 255) {
      return res.status(400).json({ error: 'Пароль не должен превышать 255 символов.' });
    }

    const result = await pool.query(
      'SELECT login, passwd, user_name, isAdmin FROM users WHERE login = $1',
      [trimmedLogin]
    );

    if (result.rows.length === 0) {
      return res.status(400).json({ error: 'Пользователь не найден.' });
    }

    const user = result.rows[0];
    const isPasswordValid = await verifyPassword(trimmedPasswd, user.passwd);

    if (!isPasswordValid) {
      return res.status(400).json({ error: 'Неверный пароль.' });
    }

    res.status(200).json({
      message: 'Вход выполнен успешно.',
      login: user.login,
      user_name: user.user_name || '',
      isAdmin: user.isadmin === true,
    });
  } catch (err) {
    console.error('Ошибка входа:', err);
    res.status(500).json({ error: 'Ошибка сервера при входе.' });
  }
});

authApp.get('/profile/:login', async (req, res) => {
  try {
    const { login } = req.params;

    if (!login) {
      return res.status(400).json({ error: 'Не указан логин пользователя.' });
    }

    const result = await pool.query(
      'SELECT login, user_name, address_delivery, comm, address_shop, isAdmin FROM users WHERE login = $1',
      [login]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Пользователь не найден.' });
    }

    res.status(200).json({
      ...result.rows[0],
      isAdmin: result.rows[0].isadmin === true,
    });
  } catch (err) {
    console.error('Ошибка получения профиля:', err);
    res.status(500).json({ error: 'Ошибка сервера при получении профиля.' });
  }
});

authApp.put('/profile', async (req, res) => {
  try {
    const { login, address_delivery, comm, address_shop } = req.body;

    if (!login || typeof login !== 'string') {
      return res.status(400).json({ error: 'Не указан логин пользователя.' });
    }

    const trimmedLogin = login.trim();

    if (!trimmedLogin) {
      return res.status(400).json({ error: 'Не указан логин пользователя.' });
    }

    const result = await pool.query(
      `
      UPDATE users
      SET address_delivery = $1,
          comm = $2,
          address_shop = $3
      WHERE login = $4
      RETURNING login
      `,
      [
        typeof address_delivery === 'string' ? address_delivery : '',
        typeof comm === 'string' ? comm : '',
        typeof address_shop === 'string' ? address_shop : '',
        trimmedLogin,
      ]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Пользователь не найден.' });
    }

    res.status(200).json({ message: 'Данные профиля сохранены.' });
  } catch (err) {
    console.error('Ошибка сохранения профиля:', err);
    res.status(500).json({ error: 'Ошибка сервера при сохранении профиля.' });
  }
});

authApp.listen(3002, () => {
  console.log('Auth server started on port 3002');
});

const orderApp = express();

orderApp.use(cors({ origin: FRONTEND_ORIGIN }));
orderApp.use(express.json());

orderApp.get('/orders/:login', async (req, res) => {
  try {
    const { login } = req.params;

    if (!login) {
      return res.status(400).json({ error: 'Не указан логин пользователя.' });
    }

    const trimmedLogin = String(login).trim();

    const result = await pool.query(
      `
      SELECT order_num, login, order_list, quantity, address, status, order_date
      FROM orders
      WHERE login = $1
      ORDER BY order_date DESC, order_num DESC
      `,
      [trimmedLogin]
    );

    res.status(200).json({ orders: result.rows });
  } catch (err) {
    console.error('Ошибка загрузки истории заказов:', err);
    res.status(500).json({ error: 'Ошибка сервера при загрузке истории заказов.' });
  }
});

orderApp.get('/admin/orders', async (req, res) => {
  try {
    const result = await pool.query(
      `
      SELECT
        o.order_num,
        o.login,
        o.order_list,
        o.quantity,
        o.address,
        o.status,
        o.order_date,
        u.user_name
      FROM orders o
      LEFT JOIN users u ON u.login = o.login
      WHERE o.status IS DISTINCT FROM 'Завершен'
      ORDER BY o.order_date DESC, o.order_num DESC
      `
    );

    res.status(200).json({ orders: result.rows });
  } catch (err) {
    console.error('Ошибка загрузки заказов для админ-панели:', err);
    res.status(500).json({ error: 'Ошибка сервера при загрузке заказов.' });
  }
});

orderApp.get('/admin/analytics', async (req, res) => {
  try {
    const ordersResult = await pool.query(
      `
      SELECT order_num, login, order_list, quantity, address, status, order_date
      FROM orders
      WHERE status = 'Завершен'
      ORDER BY order_date ASC, order_num ASC
      `
    );

    const orders = ordersResult.rows;

    if (orders.length === 0) {
      return res.status(200).json({
        topProducts: [],
        totalRevenue: 0,
        bestSalesDay: null,
        pickupStats: {
          countPercent: 0,
          amountPercent: 0,
        },
        deliveryStats: {
          countPercent: 0,
          amountPercent: 0,
        },
      });
    }

    const goodsResult = await pool.query(
      'SELECT id, name, price FROM goods'
    );

    const goodsMap = new Map();
    goodsResult.rows.forEach((good) => {
      goodsMap.set(String(good.id), {
        id: String(good.id),
        name: good.name,
        price: Number(good.price || 0),
      });
    });

    const productStats = new Map();
    const dayStats = new Map();

    let totalRevenue = 0;
    let pickupCount = 0;
    let deliveryCount = 0;
    let pickupAmount = 0;
    let deliveryAmount = 0;

    for (const order of orders) {
      const ids = String(order.order_list || '')
        .split(';')
        .map((item) => item.trim())
        .filter((item) => item !== '');

      const quantities = String(order.quantity || '')
        .split(';')
        .map((item) => Number(item.trim()) || 0);

      let orderAmount = 0;

      ids.forEach((id, index) => {
        const qty = quantities[index] || 0;
        const good = goodsMap.get(String(id));

        if (!good || qty <= 0) {
          return;
        }

        const itemAmount = good.price * qty;
        orderAmount += itemAmount;

        const existing = productStats.get(String(id)) || {
          id: String(id),
          name: good.name,
          price: good.price,
          quantity: 0,
        };

        existing.quantity += qty;
        productStats.set(String(id), existing);
      });

      totalRevenue += orderAmount;

      const orderDate = String(order.order_date);
      const currentDayAmount = dayStats.get(orderDate) || 0;
      dayStats.set(orderDate, currentDayAmount + orderAmount);

      const addressValue = String(order.address || '').toLowerCase();
      const isDeliveryAddress = addressValue.includes(';');

      if (isDeliveryAddress) {
        deliveryCount += 1;
        deliveryAmount += orderAmount;
      } else {
        pickupCount += 1;
        pickupAmount += orderAmount;
      }
    }

    const topProducts = Array.from(productStats.values())
      .sort((a, b) => {
        if (b.quantity !== a.quantity) {
          return b.quantity - a.quantity;
        }
        return Number(a.id) - Number(b.id);
      })
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
        countPercent: totalOrdersCount > 0 ? (pickupCount / totalOrdersCount) * 100 : 0,
        amountPercent: totalRevenue > 0 ? (pickupAmount / totalRevenue) * 100 : 0,
      },
      deliveryStats: {
        countPercent: totalOrdersCount > 0 ? (deliveryCount / totalOrdersCount) * 100 : 0,
        amountPercent: totalRevenue > 0 ? (deliveryAmount / totalRevenue) * 100 : 0,
      },
    });
  } catch (err) {
    console.error('Ошибка загрузки аналитики продаж:', err);
    res.status(500).json({ error: 'Ошибка сервера при загрузке аналитики продаж.' });
  }
});

orderApp.patch('/admin/orders/:orderNum/status', async (req, res) => {
  try {
    const orderNum = Number(req.params.orderNum);
    const { status } = req.body;

    const allowedStatuses = [
      'Собираем',
      'Ищем курьера',
      'В пути',
      'Ожидает выдачи',
      'Завершен',
    ];

    if (!Number.isInteger(orderNum)) {
      return res.status(400).json({ error: 'Некорректный номер заказа.' });
    }

    if (!status || !allowedStatuses.includes(status)) {
      return res.status(400).json({ error: 'Некорректный статус заказа.' });
    }

    const result = await pool.query(
      `
      UPDATE orders
      SET status = $1
      WHERE order_num = $2
      RETURNING order_num, status
      `,
      [status, orderNum]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Заказ не найден.' });
    }

    res.status(200).json({
      message: 'Статус заказа успешно обновлен.',
      order: result.rows[0],
    });
  } catch (err) {
    console.error('Ошибка обновления статуса заказа:', err);
    res.status(500).json({ error: 'Ошибка сервера при обновлении статуса заказа.' });
  }
});

orderApp.post('/orders/checkout', async (req, res) => {
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

    const userResult = await client.query(
      'SELECT login, address_delivery, address_shop FROM users WHERE login = $1',
      [trimmedLogin]
    );

    if (userResult.rows.length === 0) {
      await client.query('ROLLBACK');
      return res.status(404).json({ error: 'Пользователь не найден.' });
    }

    const user = userResult.rows[0];
    const address = trimmedDeliveryType === 'pickup' ? user.address_shop : user.address_delivery;

    if (!address || !String(address).trim()) {
      await client.query('ROLLBACK');
      return res.status(400).json({
        error: trimmedDeliveryType === 'pickup'
          ? 'Не указан адрес магазина для самовывоза.'
          : 'Не указан адрес доставки.',
      });
    }

    const cartResult = await client.query(
      'SELECT login, goods_cart, quantity FROM user_cart WHERE login = $1',
      [trimmedLogin]
    );

    if (cartResult.rows.length === 0) {
      await client.query('ROLLBACK');
      return res.status(400).json({ error: 'Корзина пуста.' });
    }

    const cartRow = cartResult.rows[0];
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

      const currentStock = Number(good.quantity || 0);
      const neededQuantity = Number(items[goodsId] || 0);

      if (neededQuantity > currentStock) {
        await client.query('ROLLBACK');
        return res.status(400).json({
          error: `Недостаточно товара с id ${goodsId} на складе.`,
        });
      }
    }

    for (const goodsId of goodsIds) {
      const good = await findGoodByIdWithClient(client, goodsId);
      const currentStock = Number(good.quantity || 0);
      const neededQuantity = Number(items[goodsId] || 0);
      const newQuantity = currentStock - neededQuantity;

      const updated = await updateGoodQuantityWithClient(client, goodsId, newQuantity);

      if (!updated) {
        await client.query('ROLLBACK');
        return res.status(500).json({ error: `Не удалось обновить остаток товара с id ${goodsId}.` });
      }
    }

    const insertOrderResult = await client.query(
      `
      INSERT INTO orders (login, order_list, quantity, address, status, order_date)
      VALUES ($1, $2, $3, $4, $5, CURRENT_DATE)
      RETURNING order_num
      `,
      [
        trimmedLogin,
        cartRow.goods_cart,
        cartRow.quantity === null || cartRow.quantity === undefined ? '' : String(cartRow.quantity),
        String(address),
        'Собираем',
      ]
    );

    await client.query(
      'UPDATE user_cart SET goods_cart = NULL, quantity = NULL WHERE login = $1',
      [trimmedLogin]
    );

    await client.query('COMMIT');

    res.status(201).json({
      message: `Заказ №${insertOrderResult.rows[0].order_num} успешно оформлен.`,
      order_num: insertOrderResult.rows[0].order_num,
    });
  } catch (err) {
    await client.query('ROLLBACK');
    console.error('Ошибка оформления заказа:', err);
    res.status(500).json({ error: 'Ошибка сервера при оформлении заказа.' });
  } finally {
    client.release();
  }
});

orderApp.listen(3003, () => {
  console.log('Order server started on port 3003');
});

const cartApp = express();

cartApp.use(cors({ origin: FRONTEND_ORIGIN }));
cartApp.use(express.json());

cartApp.get('/cart/:login', async (req, res) => {
  try {
    const { login } = req.params;

    if (!login) {
      return res.status(400).json({ error: 'Не указан логин пользователя.' });
    }

    const trimmedLogin = String(login).trim();

    const result = await pool.query(
      'SELECT login, goods_cart, quantity FROM user_cart WHERE login = $1',
      [trimmedLogin]
    );

    if (result.rows.length === 0) {
      return res.status(200).json({
        login: trimmedLogin,
        goods_cart: '',
        quantity: '',
        items: {},
      });
    }

    const row = result.rows[0];
    const items = parseCartData(row.goods_cart, row.quantity);

    res.status(200).json({
      login: row.login,
      goods_cart: row.goods_cart || '',
      quantity: row.quantity === null || row.quantity === undefined ? '' : String(row.quantity),
      items,
    });
  } catch (err) {
    console.error('Ошибка получения корзины:', err);
    res.status(500).json({ error: 'Ошибка сервера при получении корзины.' });
  }
});

cartApp.post('/cart/add', async (req, res) => {
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

    const good = await findGoodById(trimmedGoodsId);

    if (!good) {
      return res.status(404).json({ error: 'Товар не найден.' });
    }

    const stockQuantity = Number(good.quantity || 0);

    if (stockQuantity <= 0) {
      return res.status(400).json({ error: 'Товара нет в наличии.' });
    }

    const existingCart = await pool.query(
      'SELECT login, goods_cart, quantity FROM user_cart WHERE login = $1',
      [trimmedLogin]
    );

    let items = {};

    if (existingCart.rows.length > 0) {
      items = parseCartData(existingCart.rows[0].goods_cart, existingCart.rows[0].quantity);
    }

    const currentQuantity = items[trimmedGoodsId] || 0;

    if (currentQuantity >= stockQuantity) {
      return res.status(400).json({ error: 'Нельзя добавить больше, чем есть в наличии.' });
    }

    items[trimmedGoodsId] = currentQuantity + 1;

    const serialized = serializeCartData(items);

    if (existingCart.rows.length === 0) {
      await pool.query(
        'INSERT INTO user_cart (login, goods_cart, quantity) VALUES ($1, $2, $3)',
        [trimmedLogin, serialized.goods_cart, serialized.quantity]
      );
    } else {
      await pool.query(
        'UPDATE user_cart SET goods_cart = $1, quantity = $2 WHERE login = $3',
        [serialized.goods_cart, serialized.quantity, trimmedLogin]
      );
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
});

cartApp.patch('/cart/update', async (req, res) => {
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

    const good = await findGoodById(trimmedGoodsId);

    if (!good) {
      return res.status(404).json({ error: 'Товар не найден.' });
    }

    const stockQuantity = Number(good.quantity || 0);

    const existingCart = await pool.query(
      'SELECT login, goods_cart, quantity FROM user_cart WHERE login = $1',
      [trimmedLogin]
    );

    if (existingCart.rows.length === 0) {
      return res.status(404).json({ error: 'Корзина пользователя не найдена.' });
    }

    const items = parseCartData(existingCart.rows[0].goods_cart, existingCart.rows[0].quantity);
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

    const serialized = serializeCartData(items);

    await pool.query(
      'UPDATE user_cart SET goods_cart = $1, quantity = $2 WHERE login = $3',
      [serialized.goods_cart, serialized.quantity, trimmedLogin]
    );

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
});

cartApp.listen(3004, () => {
  console.log('Cart server started on port 3004');
});

export { hashPassword, verifyPassword };