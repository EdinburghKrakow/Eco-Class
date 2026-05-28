import pool from '../db.js';

export const getAddressesByLogin = async (login) => {
  const result = await pool.query(
    'SELECT address_id, login, full_address, label, is_default FROM user_addresses WHERE login = $1 ORDER BY address_id',
    [login]
  );
  return result.rows;
};

export const addAddress = async (login, fullAddress, label = '') => {
  const result = await pool.query(
    'INSERT INTO user_addresses (login, full_address, label) VALUES ($1, $2, $3) RETURNING *',
    [login, fullAddress, label]
  );
  return result.rows[0];
};

export const updateAddress = async (addressId, login, fullAddress, label) => {
  const result = await pool.query(
    'UPDATE user_addresses SET full_address = $1, label = $2 WHERE address_id = $3 AND login = $4 RETURNING *',
    [fullAddress, label, addressId, login]
  );
  return result.rows[0] || null;
};

export const deleteAddress = async (addressId, login) => {
  await pool.query(
    'DELETE FROM user_addresses WHERE address_id = $1 AND login = $2',
    [addressId, login]
  );
};

export const setDefaultAddress = async (addressId, login) => {
  await pool.query('UPDATE user_addresses SET is_default = false WHERE login = $1', [login]);
  await pool.query('UPDATE user_addresses SET is_default = true WHERE address_id = $1 AND login = $2', [addressId, login]);
};
