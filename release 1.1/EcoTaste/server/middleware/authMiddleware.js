import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET || 'твой-супер-секретный-ключ';

export const authenticateToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1]; // Bearer TOKEN

  if (!token) {
    return res.status(401).json({ error: 'Требуется авторизация' });
  }

  jwt.verify(token, JWT_SECRET, (err, user) => {
    if (err) {
      return res.status(403).json({ error: 'Недействительный или истекший токен' });
    }
    req.user = user; // добавляем расшифрованные данные пользователя в запрос
    next();
  });
};
