import pool from '../db.js';

export const getDailySalesBySeller = async (seller) => {
  const result = await pool.query(
    `SELECT o.order_date, o.order_list, o.quantity, g.price, g.id AS goods_id
     FROM orders o
     JOIN goods g ON o.order_list LIKE '%' || g.id || '%'
     WHERE g.seller = $1 AND o.status = 'Завершен'`,
    [seller]
  );

  const dailyMap = new Map();
  for (const row of result.rows) {
    const ids = row.order_list.split(';');
    const qties = row.quantity.split(';');
    const idx = ids.indexOf(row.goods_id);
    if (idx === -1) continue;
    const qty = parseInt(qties[idx], 10) || 0;
    const amount = parseFloat(row.price) * qty;
    const date = new Date(row.order_date).toISOString().slice(0, 10);
    dailyMap.set(date, (dailyMap.get(date) || 0) + amount);
  }

  return Array.from(dailyMap.entries()).map(([date, total]) => ({ date, total }));
};

export const getTopProductsBySeller = async (seller) => {
  const result = await pool.query(
    `SELECT o.order_list, o.quantity, g.name, g.id AS goods_id
     FROM orders o
     JOIN goods g ON o.order_list LIKE '%' || g.id || '%'
     WHERE g.seller = $1 AND o.status = 'Завершен'`,
    [seller]
  );

  const productMap = new Map();
  for (const row of result.rows) {
    const ids = row.order_list.split(';');
    const qties = row.quantity.split(';');
    const idx = ids.indexOf(row.goods_id);
    if (idx === -1) continue;
    const qty = parseInt(qties[idx], 10) || 0;
    productMap.set(row.name, (productMap.get(row.name) || 0) + qty);
  }

  return Array.from(productMap.entries())
    .map(([name, total_qty]) => ({ name, total_qty }))
    .sort((a, b) => b.total_qty - a.total_qty)
    .slice(0, 5);
};

export const getTotalRevenueBySeller = async (seller) => {
  const result = await pool.query(
    `SELECT o.order_list, o.quantity, g.price, g.id AS goods_id
     FROM orders o
     JOIN goods g ON o.order_list LIKE '%' || g.id || '%'
     WHERE g.seller = $1 AND o.status = 'Завершен'`,
    [seller]
  );

  let revenue = 0;
  for (const row of result.rows) {
    const ids = row.order_list.split(';');
    const qties = row.quantity.split(';');
    const idx = ids.indexOf(row.goods_id);
    if (idx === -1) continue;
    const qty = parseInt(qties[idx], 10) || 0;
    revenue += parseFloat(row.price) * qty;
  }

  return revenue;
};
