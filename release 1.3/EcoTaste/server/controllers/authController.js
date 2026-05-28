import * as authService from '../services/authService.js';

export const register = async (req, res) => {
  try {
    const { user_name, login, passwd } = req.body;

    // Валидация
    if (!user_name || !login || !passwd) {
      return res.status(400).json({ error: 'Необходимо заполнить все поля.' });
    }
    if (
      typeof user_name !== 'string' ||
      typeof login !== 'string' ||
      typeof passwd !== 'string'
    ) {
      return res.status(400).json({ error: 'Некорректный формат данных.' });
    }

    const trimmedUserName = user_name.trim();
    const trimmedLogin = login.trim();
    const trimmedPasswd = passwd.trim();

    if (!trimmedUserName || !trimmedLogin || !trimmedPasswd) {
      return res.status(400).json({ error: 'Необходимо заполнить все поля.' });
    }
    if (trimmedUserName.length > 255) {
      return res.status(400).json({ error: 'Имя не должно превышать 255 символов.' });
    }
    if (trimmedLogin.length < 11) {
      return res.status(400).json({ error: 'Логин (номер телефона) не должен быть короче 11 символов.' });
    }
    if (trimmedLogin.length > 12) {
      return res.status(400).json({ error: 'Логин (номер телефона) не должен превышать 12 символов.' });
    }
    if (!/^\d+$/.test(trimmedLogin)) {
      return res.status(400).json({ error: 'Логин должен содержать только цифры.' });
    }
    if (trimmedPasswd.length > 255) {
      return res.status(400).json({ error: 'Пароль не должен превышать 255 символов.' });
    }

    const existing = await authService.findUserByLogin(trimmedLogin);
    if (existing) {
      return res.status(400).json({ error: 'Пользователь с таким логином уже существует.' });
    }

    await authService.createUser({
      user_name: trimmedUserName,
      login: trimmedLogin,
      passwd: trimmedPasswd,
    });

    res.status(201).json({ message: 'Пользователь успешно зарегистрирован.' });
  } catch (err) {
    console.error('Ошибка регистрации:', err);
    res.status(500).json({ error: 'Ошибка сервера при регистрации.' });
  }
};

export const login = async (req, res) => {
  try {
    const { login, passwd } = req.body;

    if (!login || !passwd) {
      return res.status(400).json({ error: 'Необходимо заполнить все поля.' });
    }
    if (typeof login !== 'string' || typeof passwd !== 'string') {
      return res.status(400).json({ error: 'Некорректный формат данных.' });
    }

    const trimmedLogin = login.trim();
    const trimmedPasswd = passwd.trim();

    if (!trimmedLogin || !trimmedPasswd) {
      return res.status(400).json({ error: 'Необходимо заполнить все поля.' });
    }
    if (trimmedLogin.length > 12) {
      return res.status(400).json({ error: 'Логин (номер телефона) не должен превышать 12 символов.' });
    }
    if (!/^\d+$/.test(trimmedLogin)) {
      return res.status(400).json({ error: 'Логин должен содержать только цифры.' });
    }
    if (trimmedPasswd.length > 255) {
      return res.status(400).json({ error: 'Пароль не должен превышать 255 символов.' });
    }

    const user = await authService.findUserByLogin(trimmedLogin);
    if (!user) {
      return res.status(400).json({ error: 'Пользователь не найден.' });
    }

    const isValid = await authService.verifyUserPassword(trimmedPasswd, user.passwd);
    if (!isValid) {
      return res.status(400).json({ error: 'Неверный пароль.' });
    }

    // ГЕНЕРИРУЕМ JWT-ТОКЕН
    const token = authService.generateToken(user);

    res.status(200).json({
      message: 'Вход выполнен успешно.',
      token,                                    // <-- ТОКЕН
      login: user.login,
      user_name: user.user_name || '',
      isAdmin: user.isadmin === true,
    });
  } catch (err) {
    console.error('Ошибка входа:', err);
    res.status(500).json({ error: 'Ошибка сервера при входе.' });
  }
};

export const getProfile = async (req, res) => {
  try {
    const { login } = req.params;
    if (!login) {
      return res.status(400).json({ error: 'Не указан логин пользователя.' });
    }

    const user = await authService.findUserByLogin(login);
    if (!user) {
      return res.status(404).json({ error: 'Пользователь не найден.' });
    }

    res.status(200).json({
      login: user.login,
      user_name: user.user_name,
      address_delivery: user.address_delivery,
      comm: user.comm,
      address_shop: user.address_shop,
      isAdmin: user.isadmin === true,
    });
  } catch (err) {
    console.error('Ошибка получения профиля:', err);
    res.status(500).json({ error: 'Ошибка сервера при получении профиля.' });
  }
};

export const updateProfile = async (req, res) => {
  try {
    const { login, address_delivery, comm, address_shop } = req.body;

    if (!login || typeof login !== 'string') {
      return res.status(400).json({ error: 'Не указан логин пользователя.' });
    }

    const trimmedLogin = login.trim();
    if (!trimmedLogin) {
      return res.status(400).json({ error: 'Не указан логин пользователя.' });
    }

    const updated = await authService.updateUserProfile(trimmedLogin, {
      address_delivery,
      comm,
      address_shop,
    });

    if (!updated) {
      return res.status(404).json({ error: 'Пользователь не найден.' });
    }

    res.status(200).json({ message: 'Данные профиля сохранены.' });
  } catch (err) {
    console.error('Ошибка сохранения профиля:', err);
    res.status(500).json({ error: 'Ошибка сервера при сохранении профиля.' });
  }
};
