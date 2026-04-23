import pool from '../db.js';
import {
  parseCartData,
  serializeCartData,
  findGoodById,
} from '../utils/cart.js';

export const getCartByLogin = async (login) => {
  const result = await pool.query(
    'SELECT login, goods_cart, quantity FROM user_cart WHERE login = $1',
    [login]
  );
  if (result.rows.length === 0) {
    return { login, goods_cart: '', quantity: '', items: {} };
  }
  const row = result.rows[0];
  const items = parseCartData(row.goods_cart, row.quantity);
  return {
    login: row.login,
    goods_cart: row.goods_cart || '',
    quantity: row.quantity === null ? '' : String(row.quantity),
    items,
  };
};

export const createCart = async (login, items) => {
  const serialized = serializeCartData(items);
  await pool.query(
    'INSERT INTO user_cart (login, goods_cart, quantity) VALUES ($1, $2, $3)',
    [login, serialized.goods_cart, serialized.quantity]
  );
  return serialized;
};

export const updateCart = async (login, items) => {
  const serialized = serializeCartData(items);
  await pool.query(
    'UPDATE user_cart SET goods_cart = $1, quantity = $2 WHERE login = $3',
    [serialized.goods_cart, serialized.quantity, login]
  );
  return serialized;
};

export const getGoodWithStock = async (goodsId) => {
  return await findGoodById(goodsId);
};
