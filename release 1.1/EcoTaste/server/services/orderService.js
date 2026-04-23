import pool from '../db.js';
import {
  parseCartData,
  findGoodByIdWithClient,
  updateGoodQuantityWithClient,
} from '../utils/cart.js';

export const getOrdersByLogin = async (login) => {
  const result = await pool.query(
    `SELECT order_num, login, order_list, quantity, address, status, order_date
     FROM orders
     WHERE login = $1
     ORDER BY order_date DESC, order_num DESC`,
    [login]
  );
  return result.rows;
};

export const getActiveOrders = async () => {
  const result = await pool.query(
    `SELECT
       o.order_num, o.login, o.order_list, o.quantity, o.address, o.status, o.order_date,
       u.user_name
     FROM orders o
     LEFT JOIN users u ON u.login = o.login
     WHERE o.status IS DISTINCT FROM 'Завершен'
     ORDER BY o.order_date DESC, o.order_num DESC`
  );
  return result.rows;
};

export const getCompletedOrders = async () => {
  const result = await pool.query(
    `SELECT order_num, login, order_list, quantity, address, status, order_date
     FROM orders
     WHERE status = 'Завершен'
     ORDER BY order_date ASC, order_num ASC`
  );
  return result.rows;
};

export const getAllGoods = async () => {
  const result = await pool.query('SELECT id, name, price FROM goods');
  return result.rows;
};

export const updateOrderStatus = async (orderNum, status) => {
  const result = await pool.query(
    `UPDATE orders SET status = $1 WHERE order_num = $2 RETURNING order_num, status`,
    [status, orderNum]
  );
  return result.rows[0] || null;
};

export const getUserByLogin = async (login, client = pool) => {
  const result = await client.query(
    'SELECT login, address_delivery, address_shop FROM users WHERE login = $1',
    [login]
  );
  return result.rows[0] || null;
};

export const getCartForCheckout = async (login, client = pool) => {
  const result = await client.query(
    'SELECT login, goods_cart, quantity FROM user_cart WHERE login = $1',
    [login]
  );
  return result.rows[0] || null;
};

export const clearCart = async (login, client = pool) => {
  await client.query(
    'UPDATE user_cart SET goods_cart = NULL, quantity = NULL WHERE login = $1',
    [login]
  );
};

export const createOrder = async (orderData, client = pool) => {
  const { login, goods_cart, quantity, address, status } = orderData;
  const result = await client.query(
    `INSERT INTO orders (login, order_list, quantity, address, status, order_date)
     VALUES ($1, $2, $3, $4, $5, CURRENT_DATE)
     RETURNING order_num`,
    [login, goods_cart, quantity, address, status]
  );
  return result.rows[0].order_num;
};
