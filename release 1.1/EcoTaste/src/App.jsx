import { useState, useEffect } from 'react';
import {
  fetchGoods,
  fetchDescription,
  registerUser,
  loginUser,
  getUserProfile,
  updateUserProfile,
  getUserCart,
  addToCart,
  updateCartItem,
  checkoutOrder,
  getOrderHistory,
  createGood,
  updateGood,
  deleteGood,
  getAdminOrders,
  updateOrderStatus,
  getSalesAnalytics,
} from './api';
import ShopPage from './pages/ShopPage.jsx';
import AdminPage from './pages/AdminPage.jsx';
import './App.css';

function App() {
  const [showProfile, setShowProfile] = useState(false);
  const [showHistory, setShowHistory] = useState(false);
  const [showCart, setShowCart] = useState(false);
  const [showRegister, setShowRegister] = useState(false);
  const [showLogin, setShowLogin] = useState(false);
  const [showMenuButtons, setShowMenuButtons] = useState(true);
  const [menuOpen, setMenuOpen] = useState(false);
  const [modalData, setModalData] = useState(null);
  const [goods, setGoods] = useState([]);
  const [novelties, setNovelties] = useState([]);
  const [recommendations, setRecommendations] = useState([]);
  const [currentUser, setCurrentUser] = useState(null);
  const [cartItems, setCartItems] = useState({});
  const [cartLoadingId, setCartLoadingId] = useState('');
  const [isAdminPanel, setIsAdminPanel] = useState(false);
  const [adminSection, setAdminSection] = useState('warehouse');

  const [showCheckoutChoice, setShowCheckoutChoice] = useState(false);
  const [orderError, setOrderError] = useState('');
  const [orderSuccess, setOrderSuccess] = useState('');
  const [isOrderLoading, setIsOrderLoading] = useState(false);
  const [ordersHistory, setOrdersHistory] = useState([]);
  const [historyError, setHistoryError] = useState('');
  const [isHistoryLoading, setIsHistoryLoading] = useState(false);

  const [adminOrders, setAdminOrders] = useState([]);
  const [adminOrdersError, setAdminOrdersError] = useState('');
  const [isAdminOrdersLoading, setIsAdminOrdersLoading] = useState(false);
  const [adminOrderStatusLoading, setAdminOrderStatusLoading] = useState('');

  const [salesAnalytics, setSalesAnalytics] = useState(null);
  const [salesAnalyticsError, setSalesAnalyticsError] = useState('');
  const [isSalesAnalyticsLoading, setIsSalesAnalyticsLoading] = useState(false);

  const [registerUserName, setRegisterUserName] = useState('');
  const [registerLogin, setRegisterLogin] = useState('');
  const [registerPassword, setRegisterPassword] = useState('');
  const [registerError, setRegisterError] = useState('');
  const [registerSuccess, setRegisterSuccess] = useState('');
  const [isRegisterLoading, setIsRegisterLoading] = useState(false);

  const [loginValue, setLoginValue] = useState('');
  const [loginPassword, setLoginPassword] = useState('');
  const [loginError, setLoginError] = useState('');
  const [loginSuccess, setLoginSuccess] = useState('');
  const [isLoginLoading, setIsLoginLoading] = useState(false);

  const [deliveryAddress, setDeliveryAddress] = useState('');
  const [house, setHouse] = useState('');
  const [floor, setFloor] = useState('');
  const [apartment, setApartment] = useState('');
  const [intercom, setIntercom] = useState('');
  const [orderComment, setOrderComment] = useState('');
  const [pickupAddress, setPickupAddress] = useState('');
  const [profileError, setProfileError] = useState('');
  const [profileSuccess, setProfileSuccess] = useState('');
  const [isProfileLoading, setIsProfileLoading] = useState(false);

  const [adminMode, setAdminMode] = useState('');
  const [adminError, setAdminError] = useState('');
  const [adminSuccess, setAdminSuccess] = useState('');
  const [isAdminSaving, setIsAdminSaving] = useState(false);
  const [deleteId, setDeleteId] = useState('');
  const [editSearchId, setEditSearchId] = useState('');
  const [adminForm, setAdminForm] = useState({
    id: '',
    name: '',
    price: '',
    quantity: '',
    isnew: true,
  });

  const pickupOptions = [
    '',
    'ул. Центральная, 1',
    'ул. Лесная, 12',
    'пр. Мира, 25',
    'ул. Садовая, 8',
  ];

  const orderStatusOptions = [
    'Собираем',
    'Ищем курьера',
    'В пути',
    'Ожидает выдачи',
    'Завершен',
  ];

  const loadGoods = async () => {
    try {
      const data = await fetchGoods();
      setGoods(data);
      setNovelties(data.filter((good) => good.isnew));
      setRecommendations(data);
    } catch (error) {
      alert('Не удалось загрузить товары. Проверьте подключение к серверу.');
    }
  };

  // JWT: Восстановление сессии при загрузке приложения
  useEffect(() => {
    const token = localStorage.getItem('ecotaste_jwt_token');
    if (!token) return;

    const restoreSession = async () => {
      try {
        // Декодируем токен, чтобы получить login (без проверки подписи, т.к. она на сервере)
        const payload = JSON.parse(atob(token.split('.')[1]));
        const login = payload.login;
        if (!login) throw new Error('Нет login в токене');

        // Загружаем профиль пользователя
        const profile = await getUserProfile(login);
        setCurrentUser({
          login: profile.login,
          user_name: profile.user_name,
          isAdmin: profile.isAdmin === true,
        });

        // Заполняем поля профиля
        const parsedAddress = parseAddressDelivery(profile.address_delivery);
        setDeliveryAddress(parsedAddress.deliveryAddress);
        setHouse(parsedAddress.house);
        setFloor(parsedAddress.floor);
        setApartment(parsedAddress.apartment);
        setIntercom(parsedAddress.intercom);
        setOrderComment(profile.comm || '');
        setPickupAddress(profile.address_shop || '');
      } catch (error) {
        console.error('Ошибка восстановления сессии:', error);
        localStorage.removeItem('ecotaste_jwt_token');
      }
    };

    restoreSession();
  }, []);

  useEffect(() => {
    loadGoods();
  }, []);

  useEffect(() => {
    const loadCart = async () => {
      if (!currentUser?.login || isAdminPanel) {
        setCartItems({});
        return;
      }

      try {
        const result = await getUserCart(currentUser.login);
        setCartItems(result.items || {});
      } catch (error) {
        setCartItems({});
      }
    };

    loadCart();
  }, [currentUser, isAdminPanel]);

  useEffect(() => {
    const loadAdminOrdersData = async () => {
      if (!isAdminPanel || adminSection !== 'orders') {
        return;
      }

      try {
        setIsAdminOrdersLoading(true);
        setAdminOrdersError('');
        const result = await getAdminOrders();
        setAdminOrders(result.orders || []);
      } catch (error) {
        setAdminOrders([]);
        setAdminOrdersError(error.message || 'Не удалось загрузить заказы.');
      } finally {
        setIsAdminOrdersLoading(false);
      }
    };

    loadAdminOrdersData();
  }, [isAdminPanel, adminSection]);

  useEffect(() => {
    const loadSalesAnalyticsData = async () => {
      if (!isAdminPanel || adminSection !== 'analytics') {
        return;
      }

      try {
        setIsSalesAnalyticsLoading(true);
        setSalesAnalyticsError('');
        const result = await getSalesAnalytics();
        setSalesAnalytics(result);
      } catch (error) {
        setSalesAnalytics(null);
        setSalesAnalyticsError(error.message || 'Не удалось загрузить аналитику продаж.');
      } finally {
        setIsSalesAnalyticsLoading(false);
      }
    };

    loadSalesAnalyticsData();
  }, [isAdminPanel, adminSection]);

  const getGoodId = (good) => {
    const id = good?.id ?? good?.id_goods ?? good?.goods_id ?? good?.good_id;
    return id !== undefined && id !== null ? String(id) : '';
  };

  const getGoodStock = (good) => {
    const quantity = Number(good?.quantity ?? 0);
    return Number.isFinite(quantity) ? quantity : 0;
  };

  const getGoodPrice = (good) => {
    const price = Number(good?.price ?? 0);
    return Number.isFinite(price) ? price : 0;
  };

  const formatPrice = (value) => Number(value || 0).toFixed(2);

  const parseSemicolonValues = (value) => {
    if (!value && value !== 0) {
      return [];
    }

    return String(value)
      .split(';')
      .map((item) => item.trim())
      .filter((item) => item !== '');
  };

  const formatOrderDate = (dateValue) => {
    if (!dateValue) {
      return '';
    }

    const months = [
      'января',
      'февраля',
      'марта',
      'апреля',
      'мая',
      'июня',
      'июля',
      'августа',
      'сентября',
      'октября',
      'ноября',
      'декабря',
    ];

    const dateString = String(dateValue).trim();
    const parts = dateString.split('-');

    if (parts.length === 3) {
      const year = parts[0];
      const monthIndex = Number(parts[1]) - 1;
      const day = Number(parts[2]);

      if (!Number.isNaN(day) && monthIndex >= 0 && monthIndex < 12) {
        return `${day} ${months[monthIndex]} ${year} год`;
      }
    }

    const parsedDate = new Date(dateString);

    if (Number.isNaN(parsedDate.getTime())) {
      return dateString;
    }

    return `${parsedDate.getDate()} ${months[parsedDate.getMonth()]} ${parsedDate.getFullYear()} год`;
  };

  const formatOrderAddress = (addressValue) => {
    if (!addressValue) {
      return '';
    }

    const parts = String(addressValue)
      .split(';')
      .map((item) => item.trim());

    if (parts.length >= 4 && parts[1] && parts[2] && parts[3]) {
      const baseAddress = parts[0] || '';
      return `${baseAddress}, дом ${parts[1]}, подъезд ${parts[2]}, квартира ${parts[3]}`;
    }

    return String(addressValue);
  };

  const buildOrderItems = (order) => {
    const orderIds = parseSemicolonValues(order.order_list);
    const orderQuantities = parseSemicolonValues(order.quantity).map((item) => Number(item) || 0);

    return orderIds
      .map((id, index) => {
        const good = goods.find((item) => getGoodId(item) === String(id));
        const quantity = orderQuantities[index] || 0;

        if (!good || quantity <= 0) {
          return null;
        }

        return {
          ...good,
          orderQuantity: quantity,
          totalPrice: getGoodPrice(good) * quantity,
        };
      })
      .filter(Boolean);
  };

  const getOrderTotalPrice = (order) => {
    const items = buildOrderItems(order);
    return items.reduce((sum, item) => sum + item.totalPrice, 0);
  };

  const resetAdminForms = () => {
    setAdminMode('');
    setAdminError('');
    setAdminSuccess('');
    setDeleteId('');
    setEditSearchId('');
    setAdminForm({
      id: '',
      name: '',
      price: '',
      quantity: '',
      isnew: true,
    });
  };

  const toggleMenu = () => setMenuOpen(!menuOpen);

  const closeMenu = () => setMenuOpen(false);

  const resetRegistrationForm = () => {
    setRegisterUserName('');
    setRegisterLogin('');
    setRegisterPassword('');
    setRegisterError('');
    setRegisterSuccess('');
  };

  const resetLoginForm = () => {
    setLoginValue('');
    setLoginPassword('');
    setLoginError('');
    setLoginSuccess('');
  };

  const resetOrderState = () => {
    setShowCheckoutChoice(false);
    setOrderError('');
    setOrderSuccess('');
  };

  const parseAddressDelivery = (value) => {
    if (!value) {
      return {
        deliveryAddress: '',
        house: '',
        floor: '',
        apartment: '',
        intercom: '',
      };
    }

    const parts = value.split(';');
    return {
      deliveryAddress: parts[0] || '',
      house: parts[1] || '',
      floor: parts[2] || '',
      apartment: parts[3] || '',
      intercom: parts[4] || '',
    };
  };

  const loadProfileData = async (login) => {
    try {
      setProfileError('');
      const profile = await getUserProfile(login);
      const parsedAddress = parseAddressDelivery(profile.address_delivery);

      setDeliveryAddress(parsedAddress.deliveryAddress);
      setHouse(parsedAddress.house);
      setFloor(parsedAddress.floor);
      setApartment(parsedAddress.apartment);
      setIntercom(parsedAddress.intercom);
      setOrderComment(profile.comm || '');
      setPickupAddress(profile.address_shop || '');

      setCurrentUser((prev) => ({
        ...(prev || {}),
        login: profile.login || login,
        user_name: profile.user_name || '',
        isAdmin: profile.isAdmin === true,
      }));
    } catch (error) {
      setProfileError(error.message || 'Не удалось загрузить данные профиля.');
    }
  };

  const loadHistoryData = async (login) => {
    try {
      setIsHistoryLoading(true);
      setHistoryError('');
      const result = await getOrderHistory(login);
      setOrdersHistory(result.orders || []);
    } catch (error) {
      setOrdersHistory([]);
      setHistoryError(error.message || 'Не удалось загрузить историю заказов.');
    } finally {
      setIsHistoryLoading(false);
    }
  };

  const handleProfileClick = async () => {
    setShowMenuButtons(false);
    setShowProfile(true);
    setShowHistory(false);
    setShowCart(false);
    setShowRegister(false);
    setShowLogin(false);
    resetRegistrationForm();
    resetLoginForm();
    resetOrderState();
    setProfileError('');
    setProfileSuccess('');

    if (currentUser?.login) {
      await loadProfileData(currentUser.login);
    }
  };

  const handleHistoryClick = async () => {
    setShowMenuButtons(true);
    setShowProfile(false);
    setShowHistory(true);
    setShowCart(false);
    setShowRegister(false);
    setShowLogin(false);
    resetRegistrationForm();
    resetLoginForm();
    resetOrderState();
    setProfileError('');
    setProfileSuccess('');
    setOrderError('');
    setOrderSuccess('');
    closeMenu();

    if (!currentUser?.login) {
      setOrdersHistory([]);
      setHistoryError('Для просмотра истории покупок нужно войти в аккаунт.');
      return;
    }

    await loadHistoryData(currentUser.login);
  };

  const handleCartClick = () => {
    setShowMenuButtons(true);
    setShowProfile(false);
    setShowHistory(false);
    setShowCart(true);
    setShowRegister(false);
    setShowLogin(false);
    resetRegistrationForm();
    resetLoginForm();
    resetOrderState();
    setProfileError('');
    setProfileSuccess('');
    closeMenu();
  };

  const handleBack = () => {
    setShowProfile(false);
    setShowHistory(false);
    setShowCart(false);
    setShowRegister(false);
    setShowLogin(false);
    setShowMenuButtons(true);
    resetRegistrationForm();
    resetLoginForm();
    resetOrderState();
    setProfileError('');
    setProfileSuccess('');
    setHistoryError('');
    setOrdersHistory([]);
    setMenuOpen(true);
  };

  const handleGoToMainMenu = () => {
    setShowProfile(false);
    setShowHistory(false);
    setShowCart(false);
    setShowRegister(false);
    setShowLogin(false);
    setShowMenuButtons(true);
    resetRegistrationForm();
    resetLoginForm();
    resetOrderState();
    setProfileError('');
    setProfileSuccess('');
    setHistoryError('');
    setOrdersHistory([]);
    setMenuOpen(false);
  };

  const handleBackToProfile = async () => {
    setShowRegister(false);
    setShowLogin(false);
    setShowProfile(true);
    resetRegistrationForm();
    resetLoginForm();
    resetOrderState();
    setProfileError('');
    setProfileSuccess('');

    if (currentUser?.login) {
      await loadProfileData(currentUser.login);
    }
  };

  const handleLoginClick = () => {
    setShowProfile(false);
    setShowRegister(false);
    setShowLogin(true);
    resetRegistrationForm();
    resetLoginForm();
    resetOrderState();
    setProfileError('');
    setProfileSuccess('');
  };

  const handleRegisterClick = () => {
    setShowProfile(false);
    setShowLogin(false);
    setShowRegister(true);
    resetRegistrationForm();
    resetLoginForm();
    resetOrderState();
    setProfileError('');
    setProfileSuccess('');
  };

  // JWT: Функция выхода из аккаунта
  const handleLogout = () => {
    localStorage.removeItem('ecotaste_jwt_token');
    setCurrentUser(null);
    setIsAdminPanel(false);
    setCartItems({});
    setShowProfile(false);
    setShowHistory(false);
    setShowCart(false);
    setShowRegister(false);
    setShowLogin(false);
    setShowMenuButtons(true);
    setMenuOpen(false);
    resetRegistrationForm();
    resetLoginForm();
    resetOrderState();
    setProfileError('');
    setProfileSuccess('');
    setHistoryError('');
    setOrdersHistory([]);
  };

  const validateRegistration = () => {
    const trimmedUserName = registerUserName.trim();
    const trimmedLogin = registerLogin.trim();
    const trimmedPassword = registerPassword.trim();

    if (!trimmedUserName || !trimmedLogin || !trimmedPassword) {
      return 'Заполните все поля.';
    }

    if (trimmedUserName.length > 255) {
      return 'Имя не должно превышать 255 символов.';
    }

    if (trimmedLogin.length < 11) {
      return 'Логин (номер телефона) не должен быть короче 11 символов.';
    }

    if (trimmedLogin.length > 12) {
      return 'Логин (номер телефона) не должен превышать 12 символов.';
    }

    if (!/^\d+$/.test(trimmedLogin)) {
      return 'Логин должен содержать только цифры.';
    }

    if (trimmedPassword.length > 255) {
      return 'Пароль не должен превышать 255 символов.';
    }

    return '';
  };

  const validateLogin = () => {
    const trimmedLogin = loginValue.trim();
    const trimmedPassword = loginPassword.trim();

    if (!trimmedLogin || !trimmedPassword) {
      return 'Заполните все поля.';
    }

    if (trimmedLogin.length > 12) {
      return 'Логин (номер телефона) не должен превышать 12 символов.';
    }

    if (!/^\d+$/.test(trimmedLogin)) {
      return 'Логин должен содержать только цифры.';
    }

    if (trimmedPassword.length > 255) {
      return 'Пароль не должен превышать 255 символов.';
    }

    return '';
  };

  const validateAdminForm = () => {
    const trimmedId = adminForm.id.trim();
    const trimmedName = adminForm.name.trim();
    const trimmedPrice = adminForm.price.trim();
    const trimmedQuantity = adminForm.quantity.trim();

    if (!trimmedId || !trimmedName || !trimmedPrice || !trimmedQuantity) {
      return 'Заполните все поля.';
    }

    if (!/^\d+$/.test(trimmedId)) {
      return 'Код должен содержать только цифры.';
    }

    if (Number(trimmedPrice) < 0 || Number.isNaN(Number(trimmedPrice))) {
      return 'Цена должна быть корректным числом.';
    }

    if (!/^\d+$/.test(trimmedQuantity)) {
      return 'Количество должно быть целым числом.';
    }

    return '';
  };

  const handleRegisterSubmit = async () => {
    setRegisterError('');
    setRegisterSuccess('');

    const validationError = validateRegistration();
    if (validationError) {
      setRegisterError(validationError);
      return;
    }

    try {
      setIsRegisterLoading(true);

      const result = await registerUser({
        user_name: registerUserName.trim(),
        login: registerLogin.trim(),
        passwd: registerPassword.trim(),
      });

      setRegisterSuccess(result.message || 'Пользователь успешно зарегистрирован.');

      setTimeout(() => {
        setShowRegister(false);
        setShowProfile(true);
        resetRegistrationForm();
      }, 3000);
    } catch (error) {
      setRegisterError(error.message || 'Ошибка регистрации.');
    } finally {
      setIsRegisterLoading(false);
    }
  };

  const handleLoginSubmit = async () => {
    setLoginError('');
    setLoginSuccess('');

    const validationError = validateLogin();
    if (validationError) {
      setLoginError(validationError);
      return;
    }

    try {
      setIsLoginLoading(true);

      const result = await loginUser({
        login: loginValue.trim(),
        passwd: loginPassword.trim(),
      });

      const userData = {
        login: result.login || loginValue.trim(),
        user_name: result.user_name || '',
        isAdmin: result.isAdmin === true,
      };

      setCurrentUser(userData);

      if (result.isAdmin === true) {
        setIsAdminPanel(true);
        setAdminSection('warehouse');
        resetAdminForms();
        setShowProfile(false);
        setShowHistory(false);
        setShowCart(false);
        setShowRegister(false);
        setShowLogin(false);
        setShowMenuButtons(false);
        setMenuOpen(false);
        setLoginValue('');
        setLoginPassword('');
        setLoginError('');
        setLoginSuccess('');
        return;
      }

      setIsAdminPanel(false);
      setLoginSuccess(result.message || 'Вход выполнен успешно.');
      await loadProfileData(result.login || loginValue.trim());

      setTimeout(() => {
        setShowLogin(false);
        setShowProfile(true);
        setLoginValue('');
        setLoginPassword('');
        setLoginError('');
        setLoginSuccess('');
      }, 3000);
    } catch (error) {
      setLoginError(error.message || 'Ошибка входа.');
    } finally {
      setIsLoginLoading(false);
    }
  };

  const handleSaveProfile = async () => {
    if (!currentUser?.login) {
      setProfileError('Пользователь не авторизован.');
      return;
    }

    try {
      setIsProfileLoading(true);
      setProfileError('');
      setProfileSuccess('');

      const addressDeliveryValue = [
        deliveryAddress.trim(),
        house.trim(),
        floor.trim(),
        apartment.trim(),
        intercom.trim(),
      ].join(';');

      const result = await updateUserProfile({
        login: currentUser.login,
        address_delivery: addressDeliveryValue,
        comm: orderComment.trim(),
        address_shop: pickupAddress.trim(),
      });

      setProfileSuccess(result.message || 'Данные профиля сохранены.');
      await loadProfileData(currentUser.login);
    } catch (error) {
      setProfileError(error.message || 'Ошибка сохранения профиля.');
    } finally {
      setIsProfileLoading(false);
    }
  };

  const handleAddToCart = async (good) => {
    if (!currentUser?.login) {
      alert('Для добавления товара в корзину нужно войти в аккаунт.');
      return;
    }

    const goodsId = getGoodId(good);

    if (!goodsId) {
      alert('Не удалось определить id товара.');
      return;
    }

    try {
      setCartLoadingId(goodsId);
      const result = await addToCart({
        login: currentUser.login,
        goodsId,
      });
      setCartItems(result.items || {});
    } catch (error) {
      alert(error.message || 'Не удалось добавить товар в корзину.');
    } finally {
      setCartLoadingId('');
    }
  };

  const handleCartQuantityChange = async (good, delta) => {
    if (!currentUser?.login) {
      alert('Для изменения корзины нужно войти в аккаунт.');
      return;
    }

    const goodsId = getGoodId(good);

    if (!goodsId) {
      alert('Не удалось определить id товара.');
      return;
    }

    try {
      setCartLoadingId(goodsId);
      const result = await updateCartItem({
        login: currentUser.login,
        goodsId,
        delta,
      });
      setCartItems(result.items || {});
    } catch (error) {
      alert(error.message || 'Не удалось изменить количество товара.');
    } finally {
      setCartLoadingId('');
    }
  };

  const handleCheckoutOrder = async (deliveryType) => {
    if (!currentUser?.login) {
      setOrderError('Для оформления заказа нужно войти в аккаунт.');
      return;
    }

    if (cartGoods.length === 0) {
      setOrderError('Корзина пуста.');
      return;
    }

    try {
      setIsOrderLoading(true);
      setOrderError('');
      setOrderSuccess('');

      const result = await checkoutOrder({
        login: currentUser.login,
        deliveryType,
      });

      setOrderSuccess(result.message || 'Заказ успешно оформлен.');
      setCartItems({});
      setShowCheckoutChoice(false);
      await loadGoods();
    } catch (error) {
      setOrderError(error.message || 'Не удалось оформить заказ.');
    } finally {
      setIsOrderLoading(false);
    }
  };

  const handleStartAddGood = () => {
    setAdminMode('add');
    setAdminError('');
    setAdminSuccess('');
    setDeleteId('');
    setEditSearchId('');
    setAdminForm({
      id: '',
      name: '',
      price: '',
      quantity: '',
      isnew: true,
    });
  };

  const handleStartDeleteGood = () => {
    setAdminMode('delete');
    setAdminError('');
    setAdminSuccess('');
    setDeleteId('');
    setEditSearchId('');
  };

  const handleStartEditGood = () => {
    setAdminMode('edit-search');
    setAdminError('');
    setAdminSuccess('');
    setDeleteId('');
    setEditSearchId('');
  };

  const handleAdminFormChange = (field, value) => {
    setAdminForm((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleCreateGood = async () => {
    setAdminError('');
    setAdminSuccess('');

    const validationError = validateAdminForm();
    if (validationError) {
      setAdminError(validationError);
      return;
    }

    try {
      setIsAdminSaving(true);

      const result = await createGood({
        id: adminForm.id.trim(),
        name: adminForm.name.trim(),
        price: adminForm.price.trim(),
        quantity: adminForm.quantity.trim(),
        isnew: adminForm.isnew,
      });

      setAdminSuccess(result.message || 'Товар добавлен.');
      await loadGoods();
      handleStartAddGood();
      setAdminSuccess(result.message || 'Товар добавлен.');
    } catch (error) {
      setAdminError(error.message || 'Ошибка добавления товара.');
    } finally {
      setIsAdminSaving(false);
    }
  };

  const handleFindGoodForEdit = () => {
    setAdminError('');
    setAdminSuccess('');

    const trimmedId = editSearchId.trim();

    if (!trimmedId) {
      setAdminError('Введите id товара для редактирования.');
      return;
    }

    const good = goods.find((item) => getGoodId(item) === trimmedId);

    if (!good) {
      setAdminError('Товар с таким id не найден.');
      return;
    }

    setAdminMode('edit-form');
    setAdminForm({
      id: trimmedId,
      name: good.name || '',
      price: String(getGoodPrice(good)),
      quantity: String(getGoodStock(good)),
      isnew: good.isnew === true,
    });
  };

  const handleUpdateGood = async () => {
    setAdminError('');
    setAdminSuccess('');

    const validationError = validateAdminForm();
    if (validationError) {
      setAdminError(validationError);
      return;
    }

    try {
      setIsAdminSaving(true);

      const result = await updateGood({
        id: adminForm.id.trim(),
        name: adminForm.name.trim(),
        price: adminForm.price.trim(),
        quantity: adminForm.quantity.trim(),
        isnew: adminForm.isnew,
      });

      setAdminSuccess(result.message || 'Товар обновлен.');
      await loadGoods();
      setAdminMode('');
      setEditSearchId('');
    } catch (error) {
      setAdminError(error.message || 'Ошибка редактирования товара.');
    } finally {
      setIsAdminSaving(false);
    }
  };

  const handleDeleteGood = async () => {
    setAdminError('');
    setAdminSuccess('');

    const trimmedId = deleteId.trim();

    if (!trimmedId) {
      setAdminError('Введите id товара для удаления.');
      return;
    }

    try {
      setIsAdminSaving(true);

      const result = await deleteGood(trimmedId);

      setAdminSuccess(result.message || 'Товар удален.');
      setDeleteId('');
      await loadGoods();
    } catch (error) {
      setAdminError(error.message || 'Ошибка удаления товара.');
    } finally {
      setIsAdminSaving(false);
    }
  };

  const handleAdminStatusChange = async (orderNum, nextStatus) => {
    try {
      setAdminOrderStatusLoading(String(orderNum));
      setAdminOrdersError('');

      const result = await updateOrderStatus(orderNum, nextStatus);

      if (nextStatus === 'Завершен') {
        setAdminOrders((prev) => prev.filter((item) => String(item.order_num) !== String(orderNum)));
      } else {
        setAdminOrders((prev) =>
          prev.map((item) =>
            String(item.order_num) === String(orderNum)
              ? { ...item, status: nextStatus }
              : item
          )
        );
      }

      setAdminSuccess(result.message || 'Статус заказа обновлен.');
    } catch (error) {
      setAdminOrdersError(error.message || 'Не удалось обновить статус заказа.');
    } finally {
      setAdminOrderStatusLoading('');
    }
  };

  const handleProductClick = async (good) => {
    try {
      const descriptionText = await fetchDescription(good.description);
      setModalData({
        id: getGoodId(good),
        photo: good.photo,
        name: good.name,
        description: descriptionText,
        quantity: getGoodStock(good),
        price: good.price,
      });
    } catch (error) {
      setModalData({
        id: getGoodId(good),
        photo: good.photo,
        name: good.name,
        description: 'Описание недоступно',
        quantity: getGoodStock(good),
        price: good.price,
      });
    }
  };

  const closeModal = () => setModalData(null);

  const pickupSelectOptions = pickupAddress && !pickupOptions.includes(pickupAddress)
    ? ['', pickupAddress, ...pickupOptions.filter((item) => item !== '')]
    : pickupOptions;

  const modalCartQuantity = modalData?.id ? cartItems[String(modalData.id)] || 0 : 0;
  const modalStockQuantity = modalData ? getGoodStock(modalData) : 0;
  const isModalCartLoading = modalData?.id ? cartLoadingId === String(modalData.id) : false;
  const isAtStockLimit = modalCartQuantity >= modalStockQuantity && modalStockQuantity > 0;

  const cartGoods = goods.filter((item) => {
    const id = getGoodId(item);
    return id && (cartItems[id] || 0) > 0;
  });

  const cartTotalPrice = cartGoods.reduce((sum, item) => {
    const itemId = getGoodId(item);
    const itemQuantity = cartItems[itemId] || 0;
    return sum + getGoodPrice(item) * itemQuantity;
  }, 0);

  if (isAdminPanel) {
    return (
      <AdminPage
        adminSection={adminSection}
        setAdminSection={setAdminSection}
        resetAdminForms={resetAdminForms}
        setAdminOrdersError={setAdminOrdersError}
        setAdminSuccess={setAdminSuccess}
        setAdminError={setAdminError}
        goods={goods}
        getGoodId={getGoodId}
        getGoodPrice={getGoodPrice}
        getGoodStock={getGoodStock}
        formatPrice={formatPrice}
        adminError={adminError}
        adminSuccess={adminSuccess}
        adminMode={adminMode}
        adminForm={adminForm}
        handleAdminFormChange={handleAdminFormChange}
        isAdminSaving={isAdminSaving}
        handleCreateGood={handleCreateGood}
        deleteId={deleteId}
        setDeleteId={setDeleteId}
        handleDeleteGood={handleDeleteGood}
        editSearchId={editSearchId}
        setEditSearchId={setEditSearchId}
        handleFindGoodForEdit={handleFindGoodForEdit}
        handleUpdateGood={handleUpdateGood}
        handleStartAddGood={handleStartAddGood}
        handleStartEditGood={handleStartEditGood}
        handleStartDeleteGood={handleStartDeleteGood}
        adminOrdersError={adminOrdersError}
        isAdminOrdersLoading={isAdminOrdersLoading}
        adminOrders={adminOrders}
        buildOrderItems={buildOrderItems}
        getOrderTotalPrice={getOrderTotalPrice}
        adminOrderStatusLoading={adminOrderStatusLoading}
        formatOrderDate={formatOrderDate}
        formatOrderAddress={formatOrderAddress}
        orderStatusOptions={orderStatusOptions}
        handleAdminStatusChange={handleAdminStatusChange}
        handleProductClick={handleProductClick}
        salesAnalyticsError={salesAnalyticsError}
        isSalesAnalyticsLoading={isSalesAnalyticsLoading}
        salesAnalytics={salesAnalytics}
      />
    );
  }

  return (
    <ShopPage
      toggleMenu={toggleMenu}
      menuOpen={menuOpen}
      closeMenu={closeMenu}
      showMenuButtons={showMenuButtons}
      showProfile={showProfile}
      showRegister={showRegister}
      showLogin={showLogin}
      showHistory={showHistory}
      showCart={showCart}
      handleProfileClick={handleProfileClick}
      handleHistoryClick={handleHistoryClick}
      handleCartClick={handleCartClick}
      handleGoToMainMenu={handleGoToMainMenu}
      currentUser={currentUser}
      deliveryAddress={deliveryAddress}
      setDeliveryAddress={setDeliveryAddress}
      house={house}
      setHouse={setHouse}
      floor={floor}
      setFloor={setFloor}
      apartment={apartment}
      setApartment={setApartment}
      intercom={intercom}
      setIntercom={setIntercom}
      orderComment={orderComment}
      setOrderComment={setOrderComment}
      pickupAddress={pickupAddress}
      setPickupAddress={setPickupAddress}
      pickupSelectOptions={pickupSelectOptions}
      profileError={profileError}
      profileSuccess={profileSuccess}
      isProfileLoading={isProfileLoading}
      handleSaveProfile={handleSaveProfile}
      handleBack={handleBack}
      handleLoginClick={handleLoginClick}
      handleRegisterClick={handleRegisterClick}
      registerUserName={registerUserName}
      setRegisterUserName={setRegisterUserName}
      registerLogin={registerLogin}
      setRegisterLogin={setRegisterLogin}
      registerPassword={registerPassword}
      setRegisterPassword={setRegisterPassword}
      registerError={registerError}
      registerSuccess={registerSuccess}
      isRegisterLoading={isRegisterLoading}
      handleRegisterSubmit={handleRegisterSubmit}
      handleBackToProfile={handleBackToProfile}
      loginValue={loginValue}
      setLoginValue={setLoginValue}
      loginPassword={loginPassword}
      setLoginPassword={setLoginPassword}
      loginError={loginError}
      loginSuccess={loginSuccess}
      isLoginLoading={isLoginLoading}
      handleLoginSubmit={handleLoginSubmit}
      isHistoryLoading={isHistoryLoading}
      historyError={historyError}
      ordersHistory={ordersHistory}
      buildOrderItems={buildOrderItems}
      getOrderTotalPrice={getOrderTotalPrice}
      formatOrderDate={formatOrderDate}
      formatOrderAddress={formatOrderAddress}
      formatPrice={formatPrice}
      getGoodId={getGoodId}
      handleProductClick={handleProductClick}
      cartGoods={cartGoods}
      cartItems={cartItems}
      cartLoadingId={cartLoadingId}
      getGoodStock={getGoodStock}
      getGoodPrice={getGoodPrice}
      handleCartQuantityChange={handleCartQuantityChange}
      cartTotalPrice={cartTotalPrice}
      orderError={orderError}
      orderSuccess={orderSuccess}
      showCheckoutChoice={showCheckoutChoice}
      isOrderLoading={isOrderLoading}
      handleCheckoutOrder={handleCheckoutOrder}
      setShowCheckoutChoice={setShowCheckoutChoice}
      setOrderError={setOrderError}
      setOrderSuccess={setOrderSuccess}
      novelties={novelties}
      recommendations={recommendations}
      modalData={modalData}
      modalCartQuantity={modalCartQuantity}
      modalStockQuantity={modalStockQuantity}
      isModalCartLoading={isModalCartLoading}
      isAtStockLimit={isAtStockLimit}
      closeModal={closeModal}
      handleAddToCart={handleAddToCart}
      // JWT: Передаём функцию выхода в ShopPage
      onLogout={handleLogout}
    />
  );
}

export default App;
