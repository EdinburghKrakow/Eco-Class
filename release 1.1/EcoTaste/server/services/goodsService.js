import pool from '../db.js';
import { findGoodById } from '../utils/cart.js';

export const getAllGoods = async () => {
  const result = await pool.query('SELECT * FROM goods ORDER BY id');
  return result.rows;
};

export const getGoodById = async (id) => {
  return await findGoodById(id);
};

export const createGood = async (goodData) => {
  const { id, name, price, quantity, isnew } = goodData;
  await pool.query(
    `INSERT INTO goods (id, name, photo, description, price, quantity, isnew)
     VALUES ($1, $2, $3, $4, $5, $6, $7)`,
    [id, name, `${id}.png`, `${id}.txt`, price, quantity, isnew]
  );
  return { id, name, price, quantity, isnew };
};

export const updateGood = async (id, goodData) => {
  const { name, price, quantity, isnew } = goodData;
  const result = await pool.query(
    `UPDATE goods
     SET name = $1, photo = $2, description = $3, price = $4, quantity = $5, isnew = $6
     WHERE id = $7`,
    [name, `${id}.png`, `${id}.txt`, price, quantity, isnew, id]
  );
  return result.rowCount;
};

export const deleteGood = async (id) => {
  const result = await pool.query('DELETE FROM goods WHERE id = $1', [id]);
  return result.rowCount;
};
