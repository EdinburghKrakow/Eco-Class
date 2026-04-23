import pool from '../db.js';

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

export {
  parseCartData,
  serializeCartData,
  findGoodByIdWithClient,
  findGoodById,
  updateGoodQuantityWithClient,
};