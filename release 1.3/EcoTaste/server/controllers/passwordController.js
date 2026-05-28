import * as authService from '../services/authService.js';

export const resetPassword = async (req, res) => {
  try {
    const { login, newPassword } = req.body;

    // Валидация
    if (!login || !newPassword) {
      return res.status(400).json({ error: 'Необходимо заполнить все поля.' });
    }

    const trimmedLogin = login.trim();
    const trimmedNewPassword = newPassword.trim();

    if (!trimmedLogin || !trimmedNewPassword) {
      return res.status(400).json({ error: 'Необходимо заполнить все поля.' });
    }

    // Проверяем, существует ли пользователь
    const user = await authService.findUserByLogin(trimmedLogin);
    if (!user) {
      return res.status(404).json({ error: 'Пользователь не найден.' });
    }

    // Обновляем пароль в базе (хеширование происходит внутри updateUserPassword)
    const success = await authService.updateUserPassword(trimmedLogin, trimmedNewPassword);
    if (!success) {
      return res.status(500).json({ error: 'Не удалось обновить пароль.' });
    }

    res.status(200).json({ message: 'Пароль успешно изменён.' });
  } catch (err) {
    console.error('Ошибка сброса пароля:', err);
    res.status(500).json({ error: 'Ошибка сервера при сбросе пароля.' });
  }
};