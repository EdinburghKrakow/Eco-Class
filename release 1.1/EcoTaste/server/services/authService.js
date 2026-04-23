import pool from '../db.js';
import { hashPassword, verifyPassword } from '../utils/security.js';
import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET || 'твой-супер-секретный-ключ';

export const findUserByLogin = async (login) => {
  const result = await pool.query(
    'SELECT login, user_name, passwd, isAdmin, address_delivery, comm, address_shop FROM users WHERE login = $1',
    [login]
  );
  return result.rows[0] || null;
};

export const createUser = async (userData) => {
  const { user_name, login, passwd } = userData;
  const hashedPassword = await hashPassword(passwd);
  await pool.query(
    'INSERT INTO users (user_name, login, passwd) VALUES ($1, $2, $3)',
    [user_name, login, hashedPassword]
  );
  return { user_name, login };
};

export const verifyUserPassword = async (plainPassword, hashedPassword) => {
  return await verifyPassword(plainPassword, hashedPassword);
};

export const updateUserProfile = async (login, profileData) => {
  const { address_delivery, comm, address_shop } = profileData;
  const result = await pool.query(
    `UPDATE users
     SET address_delivery = $1,
         comm = $2,
         address_shop = $3
     WHERE login = $4
     RETURNING login`,
    [
      typeof address_delivery === 'string' ? address_delivery : '',
      typeof comm === 'string' ? comm : '',
      typeof address_shop === 'string' ? address_shop : '',
      login,
    ]
  );
  return result.rowCount > 0;
};

// ========== НОВЫЕ ФУНКЦИИ ДЛЯ JWT ==========

/**
 * Генерирует JWT-токен для пользователя.
 * @param {Object} user - объект пользователя (должен содержать login и isadmin)
 * @returns {string} - подписанный JWT
 */
export const generateToken = (user) => {
  const payload = {
    login: user.login,
    isAdmin: user.isadmin === true,
  };
  return jwt.sign(payload, JWT_SECRET, { expiresIn: '7d' });
};

/**
 * Проверяет и декодирует JWT-токен.
 * @param {string} token - токен из заголовка Authorization
 * @returns {Object|null} - расшифрованные данные или null в случае ошибки
 */
export const verifyToken = (token) => {
  try {
    return jwt.verify(token, JWT_SECRET);
  } catch (err) {
    return null;
  }
};
