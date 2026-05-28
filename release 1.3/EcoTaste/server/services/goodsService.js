import pool from '../db.js';

export const getAllGoods = async () => {
  const result = await pool.query('SELECT * FROM goods ORDER BY id');
  return result.rows;
};

export const getGoodById = async (id) => {
  const result = await pool.query('SELECT * FROM goods WHERE id = $1', [id]);
  return result.rows[0] || null;
};

export const createGood = async (goodData) => {
  const { id, name, price, quantity, isnew, seller, category } = goodData;
  await pool.query(
    `INSERT INTO goods (id, name, photo, description, price, quantity, isnew, seller, category)
     VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)`,
    [id, name, `${id}.png`, `${id}.txt`, price, quantity, isnew, seller, category]
  );
  return { id, name, price, quantity, isnew, seller, category };
};

export const updateGood = async (id, goodData) => {
  const { name, price, quantity, isnew, category } = goodData;
  const result = await pool.query(
    `UPDATE goods
     SET name = $1, photo = $2, description = $3, price = $4, quantity = $5, isnew = $6, category = $7
     WHERE id = $8`,
    [name, `${id}.png`, `${id}.txt`, price, quantity, isnew, category || null, id]
  );
  return result.rowCount;
};

export const deleteGood = async (id) => {
  const result = await pool.query('DELETE FROM goods WHERE id = $1', [id]);
  return result.rowCount;
};

export const countNewGoodsBySeller = async (seller) => {
  const result = await pool.query(
    'SELECT COUNT(*)::int AS count FROM goods WHERE seller = $1 AND isnew IS TRUE',
    [seller]
  );
  return result.rows[0].count;
};
