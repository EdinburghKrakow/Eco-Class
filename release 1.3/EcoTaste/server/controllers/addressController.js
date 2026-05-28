import * as addressService from '../services/addressService.js';

export const getAddresses = async (req, res) => {
  try {
    const { login } = req.params;
    if (!login) return res.status(400).json({ error: 'Не указан логин пользователя.' });
    const addresses = await addressService.getAddressesByLogin(login);
    res.json(addresses);
  } catch (err) {
    console.error('Ошибка получения адресов:', err);
    res.status(500).json({ error: 'Ошибка сервера при получении адресов.' });
  }
};

export const addAddress = async (req, res) => {
  try {
    const { login, full_address, label } = req.body;
    if (!login || !full_address) return res.status(400).json({ error: 'Не указан логин или адрес.' });
    const newAddr = await addressService.addAddress(login, full_address, label);
    res.status(201).json(newAddr);
  } catch (err) {
    console.error('Ошибка добавления адреса:', err);
    res.status(500).json({ error: 'Ошибка сервера при добавлении адреса.' });
  }
};

export const updateAddress = async (req, res) => {
  try {
    const { addressId } = req.params;
    const { login, full_address, label } = req.body;
    if (!login || !full_address) return res.status(400).json({ error: 'Не указан логин или адрес.' });
    const updated = await addressService.updateAddress(addressId, login, full_address, label);
    if (!updated) return res.status(404).json({ error: 'Адрес не найден.' });
    res.json(updated);
  } catch (err) {
    console.error('Ошибка обновления адреса:', err);
    res.status(500).json({ error: 'Ошибка сервера при обновлении адреса.' });
  }
};

export const deleteAddress = async (req, res) => {
  try {
    const { addressId } = req.params;
    const { login } = req.body; // login можно брать из токена, но для простоты передадим
    if (!login) return res.status(400).json({ error: 'Не указан логин.' });
    await addressService.deleteAddress(addressId, login);
    res.json({ message: 'Адрес удалён.' });
  } catch (err) {
    console.error('Ошибка удаления адреса:', err);
    res.status(500).json({ error: 'Ошибка сервера при удалении адреса.' });
  }
};
