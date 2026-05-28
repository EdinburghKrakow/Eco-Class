import * as goodsService from '../services/goodsService.js';
import * as authService from '../services/authService.js';

// GET /goods
export const getGoods = async (req, res) => {
  try {
    const goods = await goodsService.getAllGoods();
    res.json(goods);
  } catch (err) {
    console.error('Ошибка выполнения запроса товаров:', err);
    res.status(500).json({ error: 'Ошибка сервера' });
  }
};

// POST /goods
export const createGood = async (req, res) => {
  try {
    const { id, name, price, quantity, isnew, category } = req.body;
    const seller = req.user?.userName || 'неизвестный';

    if (id === undefined || !name || price === undefined || quantity === undefined) {
      return res.status(400).json({ error: 'Необходимо заполнить все поля.' });
    }

    const trimmedId = String(id).trim();
    const trimmedName = String(name).trim();
    const numericPrice = Number(price);
    const numericQuantity = Number(quantity);

    if (!trimmedId || !trimmedName) {
      return res.status(400).json({ error: 'Необходимо заполнить все поля.' });
    }

    if (!/^\d+$/.test(trimmedId)) {
      return res.status(400).json({ error: 'Код должен содержать только цифры.' });
    }

    if (Number.isNaN(numericPrice) || numericPrice < 0) {
      return res.status(400).json({ error: 'Цена должна быть корректным числом.' });
    }

    if (!Number.isInteger(numericQuantity) || numericQuantity < 0) {
      return res.status(400).json({ error: 'Количество должно быть целым числом.' });
    }

    const willBeNew = isnew === false ? false : true;
    if (willBeNew && seller && seller !== 'неизвестный') {
      const currentNewCount = await goodsService.countNewGoodsBySeller(seller);
      if (currentNewCount >= 5) {
        return res.status(400).json({
          error: 'У продавца уже есть 5 новинок. Снимите отметку "Новинка" с одного из товаров.',
        });
      }
    }

    const existing = await goodsService.getGoodById(trimmedId);
    if (existing) {
      return res.status(400).json({ error: 'Товар с таким id уже существует.' });
    }

    await goodsService.createGood({
      id: trimmedId,
      name: trimmedName,
      price: numericPrice,
      quantity: numericQuantity,
      isnew: willBeNew,
      seller,
      category: category || '',
    });

    res.status(201).json({ message: 'Товар успешно добавлен.' });
  } catch (err) {
    console.error('Ошибка добавления товара:', err);
    res.status(500).json({ error: 'Ошибка сервера при добавлении товара.' });
  }
};

// PUT /goods/:id
export const updateGood = async (req, res) => {
  try {
    const routeId = String(req.params.id || '').trim();
    const { name, price, quantity, isnew, category } = req.body;

    if (!routeId || !name || price === undefined || quantity === undefined) {
      return res.status(400).json({ error: 'Необходимо заполнить все поля.' });
    }

    const trimmedName = String(name).trim();
    const numericPrice = Number(price);
    const numericQuantity = Number(quantity);

    if (!/^\d+$/.test(routeId)) {
      return res.status(400).json({ error: 'Код должен содержать только цифры.' });
    }

    if (!trimmedName) {
      return res.status(400).json({ error: 'Необходимо заполнить все поля.' });
    }

    if (Number.isNaN(numericPrice) || numericPrice < 0) {
      return res.status(400).json({ error: 'Цена должна быть корректным числом.' });
    }

    if (!Number.isInteger(numericQuantity) || numericQuantity < 0) {
      return res.status(400).json({ error: 'Количество должно быть целым числом.' });
    }

    const willBeNew = isnew === true || isnew === 'true' || isnew === 1 || isnew === '1';

    if (willBeNew) {
      const existingGood = await goodsService.getGoodById(routeId);
      const seller = existingGood?.seller;

      if (seller && seller !== 'неизвестный') {
        const currentNewCount = await goodsService.countNewGoodsBySeller(seller);
        const wasNew = existingGood?.isnew === true || existingGood?.isnew === 'true';

        if (!wasNew && currentNewCount >= 5) {
          return res.status(400).json({
            error: `У продавца "${seller}" уже есть 5 новинок. Снимите отметку с другого товара.`,
          });
        }
      }
    }

    const rowCount = await goodsService.updateGood(routeId, {
      name: trimmedName,
      price: numericPrice,
      quantity: numericQuantity,
      isnew: willBeNew,
      category: category || '',
    });

    if (rowCount === 0) {
      return res.status(404).json({ error: 'Товар с таким id не найден.' });
    }

    res.status(200).json({ message: 'Товар успешно обновлен.' });
  } catch (err) {
    console.error('Ошибка редактирования товара:', err);
    res.status(500).json({ error: 'Ошибка сервера при редактировании товара.' });
  }
};

// DELETE /goods/:id
export const deleteGood = async (req, res) => {
  try {
    const routeId = String(req.params.id || '').trim();

    if (!routeId) {
      return res.status(400).json({ error: 'Не указан id товара.' });
    }

    const rowCount = await goodsService.deleteGood(routeId);

    if (rowCount === 0) {
      return res.status(404).json({ error: 'Товар с таким id не найден.' });
    }

    res.status(200).json({ message: 'Товар успешно удален.' });
  } catch (err) {
    console.error('Ошибка удаления товара:', err);
    res.status(500).json({ error: 'Ошибка сервера при удалении товара.' });
  }
};
