const GOODS_URL = 'http://localhost:3001';
const AUTH_URL = 'http://localhost:3002';
const ORDER_URL = 'http://localhost:3003';
const CART_URL = 'http://localhost:3004';

export const fetchGoods = async () => {
  try {
    const response = await fetch(`${GOODS_URL}/goods`);

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    return await response.json();
  } catch (error) {
    console.error('Ошибка загрузки товаров:', error);
    throw error;
  }
};

export const fetchDescription = async (descriptionPath) => {
  try {
    const response = await fetch(`${GOODS_URL}/public/descriptions/${descriptionPath}`);

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    return await response.text();
  } catch (error) {
    console.error('Ошибка загрузки описания:', error);
    throw error;
  }
};

export const createGood = async ({ id, name, price, quantity, isnew }) => {
  try {
    const response = await fetch(`${GOODS_URL}/goods`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ id, name, price, quantity, isnew }),
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.error || 'Ошибка добавления товара');
    }

    return data;
  } catch (error) {
    console.error('Ошибка добавления товара:', error);
    throw error;
  }
};

export const updateGood = async ({ id, name, price, quantity, isnew }) => {
  try {
    const response = await fetch(`${GOODS_URL}/goods/${encodeURIComponent(id)}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ name, price, quantity, isnew }),
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.error || 'Ошибка редактирования товара');
    }

    return data;
  } catch (error) {
    console.error('Ошибка редактирования товара:', error);
    throw error;
  }
};

export const deleteGood = async (id) => {
  try {
    const response = await fetch(`${GOODS_URL}/goods/${encodeURIComponent(id)}`, {
      method: 'DELETE',
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.error || 'Ошибка удаления товара');
    }

    return data;
  } catch (error) {
    console.error('Ошибка удаления товара:', error);
    throw error;
  }
};

export const registerUser = async ({ user_name, login, passwd }) => {
  try {
    const response = await fetch(`${AUTH_URL}/register`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ user_name, login, passwd }),
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.error || 'Ошибка регистрации');
    }

    return data;
  } catch (error) {
    console.error('Ошибка регистрации:', error);
    throw error;
  }
};

export const loginUser = async ({ login, passwd }) => {
  try {
    const response = await fetch(`${AUTH_URL}/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ login, passwd }),
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.error || 'Ошибка входа');
    }

    return data;
  } catch (error) {
    console.error('Ошибка входа:', error);
    throw error;
  }
};

export const getUserProfile = async (login) => {
  try {
    const response = await fetch(`${AUTH_URL}/profile/${encodeURIComponent(login)}`);

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.error || 'Ошибка загрузки профиля');
    }

    return data;
  } catch (error) {
    console.error('Ошибка загрузки профиля:', error);
    throw error;
  }
};

export const updateUserProfile = async ({ login, address_delivery, comm, address_shop }) => {
  try {
    const response = await fetch(`${AUTH_URL}/profile`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        login,
        address_delivery,
        comm,
        address_shop,
      }),
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.error || 'Ошибка сохранения профиля');
    }

    return data;
  } catch (error) {
    console.error('Ошибка сохранения профиля:', error);
    throw error;
  }
};

export const getUserCart = async (login) => {
  try {
    const response = await fetch(`${CART_URL}/cart/${encodeURIComponent(login)}`);
    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.error || 'Ошибка загрузки корзины');
    }

    return data;
  } catch (error) {
    console.error('Ошибка загрузки корзины:', error);
    throw error;
  }
};

export const addToCart = async ({ login, goodsId }) => {
  try {
    const response = await fetch(`${CART_URL}/cart/add`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ login, goodsId }),
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.error || 'Ошибка добавления в корзину');
    }

    return data;
  } catch (error) {
    console.error('Ошибка добавления в корзину:', error);
    throw error;
  }
};

export const updateCartItem = async ({ login, goodsId, delta }) => {
  try {
    const response = await fetch(`${CART_URL}/cart/update`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ login, goodsId, delta }),
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.error || 'Ошибка обновления корзины');
    }

    return data;
  } catch (error) {
    console.error('Ошибка обновления корзины:', error);
    throw error;
  }
};

export const checkoutOrder = async ({ login, deliveryType }) => {
  try {
    const response = await fetch(`${ORDER_URL}/orders/checkout`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ login, deliveryType }),
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.error || 'Ошибка оформления заказа');
    }

    return data;
  } catch (error) {
    console.error('Ошибка оформления заказа:', error);
    throw error;
  }
};

export const getOrderHistory = async (login) => {
  try {
    const response = await fetch(`${ORDER_URL}/orders/${encodeURIComponent(login)}`);
    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.error || 'Ошибка загрузки истории заказов');
    }

    return data;
  } catch (error) {
    console.error('Ошибка загрузки истории заказов:', error);
    throw error;
  }
};

export const getAdminOrders = async () => {
  try {
    const response = await fetch(`${ORDER_URL}/admin/orders`);
    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.error || 'Ошибка загрузки заказов');
    }

    return data;
  } catch (error) {
    console.error('Ошибка загрузки заказов для админ-панели:', error);
    throw error;
  }
};

export const updateOrderStatus = async (orderNum, status) => {
  try {
    const response = await fetch(`${ORDER_URL}/admin/orders/${encodeURIComponent(orderNum)}/status`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ status }),
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.error || 'Ошибка обновления статуса заказа');
    }

    return data;
  } catch (error) {
    console.error('Ошибка обновления статуса заказа:', error);
    throw error;
  }
};

export const getSalesAnalytics = async () => {
  try {
    const response = await fetch(`${ORDER_URL}/admin/analytics`);
    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.error || 'Ошибка загрузки аналитики продаж');
    }

    return data;
  } catch (error) {
    console.error('Ошибка загрузки аналитики продаж:', error);
    throw error;
  }
};