import { StrictMode, useState, useEffect } from 'react';
import { createRoot } from 'react-dom/client';
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
      <div className="App admin-panel-page">
        <div className="admin-top-banner">
          <img src="/src/etc_img/header_banner.png" alt="Эко-Вкус" className="admin-top-banner-img" />
        </div>

        <div className="admin-layout">
          <div className="admin-sidebar-panel">
            <button
              className="admin-nav-btn"
              onClick={() => {
                setAdminSection('warehouse');
                resetAdminForms();
                setAdminOrdersError('');
              }}
            >
              Склад
            </button>
            <button
              className="admin-nav-btn"
              onClick={() => {
                setAdminSection('orders');
                resetAdminForms();
                setAdminSuccess('');
                setAdminError('');
              }}
            >
              Заказы
            </button>
            <button
              className="admin-nav-btn"
              onClick={() => {
                setAdminSection('analytics');
                resetAdminForms();
                setAdminOrdersError('');
              }}
            >
              Аналитика продаж
            </button>
          </div>

          <div className="admin-main-panel">
            {adminSection === 'warehouse' && (
              <>
                <h2 className="admin-section-title">Склад</h2>

                <table className="admin-goods-table">
                  <thead>
                    <tr>
                      <th>Код</th>
                      <th>Наименование</th>
                      <th>Цена</th>
                      <th>Количество</th>
                      <th>Новинка</th>
                    </tr>
                  </thead>
                  <tbody>
                    {goods.map((item, index) => (
                      <tr key={`${getGoodId(item)}-${index}`}>
                        <td>{getGoodId(item)}</td>
                        <td>{item.name}</td>
                        <td>{formatPrice(getGoodPrice(item))}</td>
                        <td>{getGoodStock(item)}</td>
                        <td>{item.isnew ? 'Да' : 'Нет'}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>

                {adminError && <div className="admin-message admin-error">{adminError}</div>}
                {adminSuccess && <div className="admin-message admin-success">{adminSuccess}</div>}

                {adminMode === 'add' && (
                  <div className="admin-form-box">
                    <div className="admin-form-grid">
                      <label className="admin-form-label">
                        Код
                        <input
                          type="text"
                          value={adminForm.id}
                          onChange={(e) => handleAdminFormChange('id', e.target.value)}
                          className="admin-form-input"
                        />
                      </label>

                      <label className="admin-form-label">
                        Наименование
                        <input
                          type="text"
                          value={adminForm.name}
                          onChange={(e) => handleAdminFormChange('name', e.target.value)}
                          className="admin-form-input"
                        />
                      </label>

                      <label className="admin-form-label">
                        Цена
                        <input
                          type="text"
                          value={adminForm.price}
                          onChange={(e) => handleAdminFormChange('price', e.target.value)}
                          className="admin-form-input"
                        />
                      </label>

                      <label className="admin-form-label">
                        Количество
                        <input
                          type="text"
                          value={adminForm.quantity}
                          onChange={(e) => handleAdminFormChange('quantity', e.target.value)}
                          className="admin-form-input"
                        />
                      </label>

                      <label className="admin-checkbox-label">
                        <input
                          type="checkbox"
                          checked={adminForm.isnew}
                          onChange={(e) => handleAdminFormChange('isnew', e.target.checked)}
                        />
                        Новинка
                      </label>
                    </div>

                    <div className="admin-inline-buttons">
                      <button
                        className="admin-small-btn"
                        onClick={handleCreateGood}
                        disabled={isAdminSaving}
                      >
                        {isAdminSaving ? 'Сохранение...' : 'Сохранить'}
                      </button>
                      <button
                        className="admin-small-btn admin-cancel-btn"
                        onClick={resetAdminForms}
                        disabled={isAdminSaving}
                      >
                        Отмена
                      </button>
                    </div>
                  </div>
                )}

                {adminMode === 'delete' && (
                  <div className="admin-form-box">
                    <label className="admin-form-label">
                      Введите id товара для удаления
                      <input
                        type="text"
                        value={deleteId}
                        onChange={(e) => setDeleteId(e.target.value)}
                        className="admin-form-input"
                      />
                    </label>

                    <div className="admin-inline-buttons">
                      <button
                        className="admin-small-btn"
                        onClick={handleDeleteGood}
                        disabled={isAdminSaving}
                      >
                        {isAdminSaving ? 'Удаление...' : 'Удалить'}
                      </button>
                      <button
                        className="admin-small-btn admin-cancel-btn"
                        onClick={resetAdminForms}
                        disabled={isAdminSaving}
                      >
                        Отмена
                      </button>
                    </div>
                  </div>
                )}

                {adminMode === 'edit-search' && (
                  <div className="admin-form-box">
                    <label className="admin-form-label">
                      Введите id товара для редактирования
                      <input
                        type="text"
                        value={editSearchId}
                        onChange={(e) => setEditSearchId(e.target.value)}
                        className="admin-form-input"
                      />
                    </label>

                    <div className="admin-inline-buttons">
                      <button
                        className="admin-small-btn"
                        onClick={handleFindGoodForEdit}
                      >
                        Найти
                      </button>
                      <button
                        className="admin-small-btn admin-cancel-btn"
                        onClick={resetAdminForms}
                      >
                        Отмена
                      </button>
                    </div>
                  </div>
                )}

                {adminMode === 'edit-form' && (
                  <div className="admin-form-box">
                    <div className="admin-form-grid">
                      <label className="admin-form-label">
                        Код
                        <input
                          type="text"
                          value={adminForm.id}
                          onChange={(e) => handleAdminFormChange('id', e.target.value)}
                          className="admin-form-input"
                        />
                      </label>

                      <label className="admin-form-label">
                        Наименование
                        <input
                          type="text"
                          value={adminForm.name}
                          onChange={(e) => handleAdminFormChange('name', e.target.value)}
                          className="admin-form-input"
                        />
                      </label>

                      <label className="admin-form-label">
                        Цена
                        <input
                          type="text"
                          value={adminForm.price}
                          onChange={(e) => handleAdminFormChange('price', e.target.value)}
                          className="admin-form-input"
                        />
                      </label>

                      <label className="admin-form-label">
                        Количество
                        <input
                          type="text"
                          value={adminForm.quantity}
                          onChange={(e) => handleAdminFormChange('quantity', e.target.value)}
                          className="admin-form-input"
                        />
                      </label>

                      <label className="admin-checkbox-label">
                        <input
                          type="checkbox"
                          checked={adminForm.isnew}
                          onChange={(e) => handleAdminFormChange('isnew', e.target.checked)}
                        />
                        Новинка
                      </label>
                    </div>

                    <div className="admin-inline-buttons">
                      <button
                        className="admin-small-btn"
                        onClick={handleUpdateGood}
                        disabled={isAdminSaving}
                      >
                        {isAdminSaving ? 'Сохранение...' : 'Сохранить'}
                      </button>
                      <button
                        className="admin-small-btn admin-cancel-btn"
                        onClick={resetAdminForms}
                        disabled={isAdminSaving}
                      >
                        Отмена
                      </button>
                    </div>
                  </div>
                )}

                <div className="admin-action-buttons">
                  <button className="admin-wide-btn" onClick={handleStartAddGood}>Добавить</button>
                  <button className="admin-wide-btn" onClick={handleStartEditGood}>Редактировать</button>
                  <button className="admin-wide-btn" onClick={handleStartDeleteGood}>Удалить</button>
                </div>
              </>
            )}

            {adminSection === 'orders' && (
              <>
                <h2 className="admin-section-title">Заказы</h2>

                {adminOrdersError && <div className="admin-message admin-error">{adminOrdersError}</div>}
                {adminSuccess && <div className="admin-message admin-success">{adminSuccess}</div>}

                {isAdminOrdersLoading && (
                  <div className="admin-placeholder-box">Загрузка заказов...</div>
                )}

                {!isAdminOrdersLoading && adminOrders.length === 0 && !adminOrdersError && (
                  <div className="admin-placeholder-box">Нет активных заказов</div>
                )}

                {!isAdminOrdersLoading && adminOrders.length > 0 && (
                  <div className="orders-history-list admin-orders-list">
                    {adminOrders.map((order, index) => {
                      const orderItems = buildOrderItems(order);
                      const orderTotalPrice = getOrderTotalPrice(order);
                      const isStatusSaving = adminOrderStatusLoading === String(order.order_num);

                      return (
                        <div
                          key={`${order.order_num}-${index}`}
                          className={`order-history-block ${index < adminOrders.length - 1 ? 'with-divider' : ''}`}
                        >
                          <div className="order-history-layout">
                            <div className="order-info-card admin-order-info-card">
                              <p>Заказ: {order.order_num}</p>
                              <p>Дата оформления: {formatOrderDate(order.order_date)}</p>
                              <p>Логин: {order.login}</p>
                              <p>Имя: {order.user_name || 'Не указано'}</p>
                              <p>Адрес: {formatOrderAddress(order.address)}</p>
                              <p>Общая стоимость заказа: {formatPrice(orderTotalPrice)} ₽</p>
                              <div className="admin-status-row">
                                <span>Статус:</span>
                                <select
                                  className="admin-status-select"
                                  value={order.status}
                                  onChange={(e) => handleAdminStatusChange(order.order_num, e.target.value)}
                                  disabled={isStatusSaving}
                                >
                                  {orderStatusOptions.map((status) => (
                                    <option key={status} value={status}>
                                      {status}
                                    </option>
                                  ))}
                                </select>
                              </div>
                            </div>

                            <div className="order-items-row">
                              {orderItems.map((item, itemIndex) => (
                                <div key={`${order.order_num}-${getGoodId(item)}-${itemIndex}`} className="product-card order-product-card">
                                  <img
                                    src={`/public/images/${item.photo}`}
                                    alt={item.name}
                                    className="product-img"
                                    onClick={(e) => {
                                      e.preventDefault();
                                      handleProductClick(item);
                                    }}
                                  />
                                  <a
                                    href="#"
                                    onClick={(e) => {
                                      e.preventDefault();
                                      handleProductClick(item);
                                    }}
                                  >
                                    <h4>{item.name}</h4>
                                    <p>Количество: {item.orderQuantity}</p>
                                    <p>{formatPrice(item.totalPrice)} ₽</p>
                                  </a>
                                </div>
                              ))}
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
              </>
            )}

                        {adminSection === 'analytics' && (
              <>
                <h2 className="admin-section-title">Аналитика продаж</h2>

                {salesAnalyticsError && <div className="admin-message admin-error">{salesAnalyticsError}</div>}

                {isSalesAnalyticsLoading && (
                  <div className="admin-placeholder-box">Загрузка аналитики продаж...</div>
                )}

                {!isSalesAnalyticsLoading && !salesAnalyticsError && salesAnalytics && (
                  <div className="analytics-section">
                    <div className="analytics-summary-grid">
                      <div className="analytics-card">
                        <h3>Общая стоимость проданных товаров</h3>
                        <p>{formatPrice(salesAnalytics.totalRevenue)} ₽</p>
                      </div>

                      <div className="analytics-card">
                        <h3>День наиболее высоких продаж</h3>
                        <p>{salesAnalytics.bestSalesDay?.date ? formatOrderDate(salesAnalytics.bestSalesDay.date) : 'Нет данных'}</p>
                        <p>{salesAnalytics.bestSalesDay?.amount !== undefined ? `${formatPrice(salesAnalytics.bestSalesDay.amount)} ₽` : ''}</p>
                      </div>

                      <div className="analytics-card">
                        <h3>Самовывоз</h3>
                        <p>По количеству заказов: {formatPrice(salesAnalytics.pickupStats?.countPercent || 0)}%</p>
                        <p>По сумме заказов: {formatPrice(salesAnalytics.pickupStats?.amountPercent || 0)}%</p>
                      </div>

                      <div className="analytics-card">
                        <h3>Доставка</h3>
                        <p>По количеству заказов: {formatPrice(salesAnalytics.deliveryStats?.countPercent || 0)}%</p>
                        <p>По сумме заказов: {formatPrice(salesAnalytics.deliveryStats?.amountPercent || 0)}%</p>
                      </div>
                    </div>

                    <h3 className="analytics-table-title">10 наиболее продаваемых товаров</h3>

                    <table className="admin-goods-table">
                      <thead>
                        <tr>
                          <th>Код</th>
                          <th>Наименование</th>
                          <th>Цена</th>
                          <th>Количество</th>
                        </tr>
                      </thead>
                      <tbody>
                        {salesAnalytics.topProducts && salesAnalytics.topProducts.length > 0 ? (
                          salesAnalytics.topProducts.map((item, index) => (
                            <tr key={`${item.id}-${index}`}>
                              <td>{item.id}</td>
                              <td>{item.name}</td>
                              <td>{formatPrice(item.price)} ₽</td>
                              <td>{item.quantity}</td>
                            </tr>
                          ))
                        ) : (
                          <tr>
                            <td colSpan="4">Нет данных</td>
                          </tr>
                        )}
                      </tbody>
                    </table>
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="App">
      <div className="header">
        <img src="/src/etc_img/header_banner.png" alt="Эко-Вкус" className="header-banner" />
        <button className="menu-button" onClick={toggleMenu}>
          <img src="/src/etc_img/menu_icon.png" alt="Меню" className="menu-icon" />
        </button>
      </div>

      <div className={`menu-container ${menuOpen ? 'active' : ''}`}>
        <div className="header">
          <img src="/src/etc_img/menu_banner.png" alt="Меню" className="menu-banner" />
          <button className="close-menu-button" onClick={closeMenu}>
            <img src="/src/etc_img/menu_icon.png" alt="Закрыть" className="close-menu-icon" />
          </button>
        </div>

        <div className="menu-buttons">
          {showMenuButtons && (
            <>
  	      <button className="menu-btn" onClick={handleProfileClick}>Профиль</button>
       	      <button className="menu-btn" onClick={handleHistoryClick}>История покупок</button>
  	      <button className="menu-btn" onClick={handleCartClick}>Корзина</button>
  	      {(showHistory || showCart) && (
    		<button className="menu-btn" onClick={handleGoToMainMenu}>Главное меню</button>
  	      )}
	    </>
          )}

          {showProfile && !showMenuButtons && !showRegister && !showLogin && (
            <div className="profile-buttons register-form-container">
              <h2>Профиль</h2>

              {currentUser?.login ? (
                <>
                  <h4>Здравствуйте, {currentUser.user_name}!</h4>

                  <label htmlFor="delivery-address" className="form-label">
                    Адрес доставки
                  </label>
                  <input
                    id="delivery-address"
                    type="text"
                    value={deliveryAddress}
                    onChange={(e) => setDeliveryAddress(e.target.value)}
                    className="form-input"
                    placeholder="Введите адрес доставки"
                  />

                  <label htmlFor="delivery-house" className="form-label">
                    Дом
                  </label>
                  <input
                    id="delivery-house"
                    type="text"
                    value={house}
                    onChange={(e) => setHouse(e.target.value)}
                    className="form-input"
                    placeholder="Введите номер дома"
                  />

                  <label htmlFor="delivery-floor" className="form-label">
                    Подъезд
                  </label>
                  <input
                    id="delivery-floor"
                    type="text"
                    value={floor}
                    onChange={(e) => setFloor(e.target.value)}
                    className="form-input"
                    placeholder="Введите номер подъезда"
                  />

                  <label htmlFor="delivery-apartment" className="form-label">
                    Квартира
                  </label>
                  <input
                    id="delivery-apartment"
                    type="text"
                    value={apartment}
                    onChange={(e) => setApartment(e.target.value)}
                    className="form-input"
                    placeholder="Введите номер квартиры"
                  />

                  <label htmlFor="delivery-intercom" className="form-label">
                    Домофон
                  </label>
                  <input
                    id="delivery-intercom"
                    type="text"
                    value={intercom}
                    onChange={(e) => setIntercom(e.target.value)}
                    className="form-input"
                    placeholder="Введите код домофона"
                  />

                  <label htmlFor="order-comment" className="form-label">
                    Комментарий к заказу
                  </label>
                  <textarea
                    id="order-comment"
                    value={orderComment}
                    onChange={(e) => setOrderComment(e.target.value)}
                    className="form-input"
                    placeholder="Введите комментарий к заказу"
                    rows={4}
                  />

                  <label htmlFor="pickup-address" className="form-label">
                    Адрес магазина для самовывоза
                  </label>
                  <select
                    id="pickup-address"
                    value={pickupAddress}
                    onChange={(e) => setPickupAddress(e.target.value)}
                    className="form-input"
                  >
                    {pickupSelectOptions.map((item, index) => (
                      <option key={`${item}-${index}`} value={item}>
                        {item || 'Выберите адрес магазина'}
                      </option>
                    ))}
                  </select>

                  {profileError && <div className="form-message error-message">{profileError}</div>}
                  {profileSuccess && <div className="form-message success-message">{profileSuccess}</div>}

                  <button
                    className="menu-btn"
                    onClick={handleSaveProfile}
                    disabled={isProfileLoading}
                  >
                    {isProfileLoading ? 'Сохранение...' : 'Сохранить'}
                  </button>
                  <button className="menu-btn" onClick={handleBack}>Назад</button>
                </>
              ) : (
                <>
                  <button className="menu-btn" onClick={handleLoginClick}>Войти</button>
                  <button className="menu-btn" onClick={handleRegisterClick}>Регистрация</button>
                  <button className="menu-btn" onClick={handleBack}>Назад</button>
                </>
              )}
            </div>
          )}

          {showRegister && (
            <div className="profile-buttons register-form-container">
              <h2>Регистрация</h2>

              <label htmlFor="register-user-name" className="form-label">
                Имя
              </label>
              <input
                id="register-user-name"
                type="text"
                maxLength={255}
                value={registerUserName}
                onChange={(e) => setRegisterUserName(e.target.value)}
                className="form-input"
                placeholder="Введите имя"
              />

              <label htmlFor="register-login" className="form-label">
                Логин (номер телефона)
              </label>
              <input
                id="register-login"
                type="text"
                maxLength={12}
                value={registerLogin}
                onChange={(e) => setRegisterLogin(e.target.value)}
                className="form-input"
                placeholder="Введите номер телефона"
              />

              <label htmlFor="register-password" className="form-label">
                Пароль
              </label>
              <input
                id="register-password"
                type="password"
                maxLength={255}
                value={registerPassword}
                onChange={(e) => setRegisterPassword(e.target.value)}
                className="form-input"
                placeholder="Введите пароль"
              />

              {registerError && <div className="form-message error-message">{registerError}</div>}
              {registerSuccess && <div className="form-message success-message">{registerSuccess}</div>}

              <button
                className="menu-btn"
                onClick={handleRegisterSubmit}
                disabled={isRegisterLoading}
              >
                {isRegisterLoading ? 'Сохранение...' : 'Зарегистрироваться'}
              </button>
              <button className="menu-btn" onClick={handleBackToProfile}>Назад</button>
            </div>
          )}

          {showLogin && (
            <div className="profile-buttons register-form-container">
              <h2>Вход</h2>

              <label htmlFor="login-login" className="form-label">
                Логин (номер телефона)
              </label>
              <input
                id="login-login"
                type="text"
                maxLength={12}
                value={loginValue}
                onChange={(e) => setLoginValue(e.target.value)}
                className="form-input"
                placeholder="Введите номер телефона"
              />

              <label htmlFor="login-password" className="form-label">
                Пароль
              </label>
              <input
                id="login-password"
                type="password"
                maxLength={255}
                value={loginPassword}
                onChange={(e) => setLoginPassword(e.target.value)}
                className="form-input"
                placeholder="Введите пароль"
              />

              {loginError && <div className="form-message error-message">{loginError}</div>}
              {loginSuccess && <div className="form-message success-message">{loginSuccess}</div>}

              <button
                className="menu-btn"
                onClick={handleLoginSubmit}
                disabled={isLoginLoading}
              >
                {isLoginLoading ? 'Вход...' : 'Войти'}
              </button>
              <button className="menu-btn" onClick={handleBackToProfile}>Назад</button>
            </div>
          )}
        </div>
      </div>

      <div className="content">
        {showHistory && (
          <div className="history-section">
            <h2>История покупок</h2>

            {isHistoryLoading && <div className="form-message">Загрузка истории заказов...</div>}
            {historyError && <div className="form-message error-message">{historyError}</div>}

            {!isHistoryLoading && !historyError && ordersHistory.length === 0 && (
              <div className="form-message">История покупок пуста.</div>
            )}

            {!isHistoryLoading && !historyError && ordersHistory.length > 0 && (
              <div className="orders-history-list">
                {ordersHistory.map((order, index) => {
                  const orderItems = buildOrderItems(order);
                  const orderTotalPrice = getOrderTotalPrice(order);

                  return (
                    <div
                      key={`${order.order_num}-${index}`}
                      className={`order-history-block ${index < ordersHistory.length - 1 ? 'with-divider' : ''}`}
                    >
                      <div className="order-history-layout">
                        <div className="order-info-card">
                          <p>Заказ: {order.order_num}</p>
                          <p>Дата оформления: {formatOrderDate(order.order_date)}</p>
                          <p>Адрес: {formatOrderAddress(order.address)}</p>
                          <p>Общая стоимость заказа: {formatPrice(orderTotalPrice)} ₽</p>
                          <p>Статус заказа: {order.status}</p>
                        </div>

                        <div className="order-items-row">
                          {orderItems.map((item, itemIndex) => (
                            <div key={`${order.order_num}-${getGoodId(item)}-${itemIndex}`} className="product-card order-product-card">
                              <img
                                src={`/public/images/${item.photo}`}
                                alt={item.name}
                                className="product-img"
                                onClick={(e) => {
                                  e.preventDefault();
                                  handleProductClick(item);
                                }}
                              />
                              <a
                                href="#"
                                onClick={(e) => {
                                  e.preventDefault();
                                  handleProductClick(item);
                                }}
                              >
                                <h4>{item.name}</h4>
                                <p>Количество: {item.orderQuantity}</p>
                                <p>{formatPrice(item.totalPrice)} ₽</p>
                              </a>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}

            <button className="menu-btn" onClick={handleBack}>Назад</button>
          </div>
        )}

        {showCart && (
          <div className="cart-section">
            <h2>Корзина</h2>

            {!currentUser?.login && (
              <div className="form-message error-message">
                Для просмотра корзины нужно войти в аккаунт.
              </div>
            )}

            {currentUser?.login && cartGoods.length === 0 && (
              <div className="form-message">Корзина пуста.</div>
            )}

            {currentUser?.login && cartGoods.length > 0 && (
              <>
                <div className="products-section">
                  {cartGoods.map((item, idx) => {
                    const itemId = getGoodId(item);
                    const itemQuantity = cartItems[itemId] || 0;
                    const itemStock = getGoodStock(item);
                    const isItemLoading = cartLoadingId === itemId;
                    const isItemAtStockLimit = itemQuantity >= itemStock && itemStock > 0;
                    const itemTotalPrice = getGoodPrice(item) * itemQuantity;

                    return (
                      <div key={`${itemId}-${idx}`} className="product-card">
                        <img
                          src={`/public/images/${item.photo}`}
                          alt={item.name}
                          className="product-img"
                          onClick={(e) => {
                            e.preventDefault();
                            handleProductClick(item);
                          }}
                        />
                        <a
                          href="#"
                          onClick={(e) => {
                            e.preventDefault();
                            handleProductClick(item);
                          }}
                        >
                          <h4>{item.name}</h4>
                          <p>{formatPrice(itemTotalPrice)} ₽</p>
                        </a>

                        <div className="cart-card-controls">
                          <button
                            className="cart-mini-btn"
                            onClick={() => handleCartQuantityChange(item, -1)}
                            disabled={isItemLoading}
                          >
                            -
                          </button>
                          <span className="cart-quantity-value">{itemQuantity}</span>
                          <button
                            className="cart-mini-btn"
                            onClick={() => handleCartQuantityChange(item, 1)}
                            disabled={isItemLoading || isItemAtStockLimit}
                          >
                            +
                          </button>
                        </div>
                      </div>
                    );
                  })}
                </div>

                <h2>Итого: {formatPrice(cartTotalPrice)} ₽</h2>

                {orderError && <div className="form-message error-message">{orderError}</div>}
                {orderSuccess && <div className="form-message success-message">{orderSuccess}</div>}

                {showCheckoutChoice && (
                  <div className="checkout-choice">
                    <h3>Выберите способ получения</h3>
                    <div className="checkout-choice-buttons">
                      <button
                        className="menu-btn"
                        onClick={() => handleCheckoutOrder('delivery')}
                        disabled={isOrderLoading}
                      >
                        {isOrderLoading ? 'Оформление...' : 'Доставка'}
                      </button>
                      <button
                        className="menu-btn"
                        onClick={() => handleCheckoutOrder('pickup')}
                        disabled={isOrderLoading}
                      >
                        {isOrderLoading ? 'Оформление...' : 'Самовывоз'}
                      </button>
                    </div>
                  </div>
                )}
              </>
            )}

            <div className="cart-actions">
              {currentUser?.login && cartGoods.length > 0 && (
                <button
                  className="menu-btn"
                  onClick={() => {
                    setShowCheckoutChoice(!showCheckoutChoice);
                    setOrderError('');
                    setOrderSuccess('');
                  }}
                  disabled={isOrderLoading}
                >
                  Оформить заказ
                </button>
              )}
              <button className="menu-btn" onClick={handleBack}>Назад</button>
            </div>
          </div>
        )}

        {!showHistory && !showCart && (
          <>
            <section className="section novelties">
              <img src="/src/etc_img/new_products_title.png" alt="НОВИНКИ" className="section-title-img" />
              <div className="products-section">
                {novelties.map((item, idx) => (
                  <div key={idx} className="product-card">
                    <img
                      src={`/public/images/${item.photo}`}
                      alt={item.name}
                      className="product-img"
                      onClick={(e) => {
                        e.preventDefault();
                        handleProductClick(item);
                      }}
                    />
                    <a
                      href="#"
                      onClick={(e) => {
                        e.preventDefault();
                        handleProductClick(item);
                      }}
                    >
                      <h4>{item.name}</h4>
                      <h3>{formatPrice(getGoodPrice(item))} ₽</h3>
                    </a>
                  </div>
                ))}
              </div>
            </section>

            <section className="section recommendations">
              <img src="/src/etc_img/recommended_products_title.png" alt="РЕКОМЕНДАЦИИ" className="section-title-img" />
              <div className="products-section">
                {recommendations.map((item, idx) => (
                  <div key={idx} className="product-card">
                    <img
                      src={`/public/images/${item.photo}`}
                      alt={item.name}
                      className="product-img"
                      onClick={(e) => {
                        e.preventDefault();
                        handleProductClick(item);
                      }}
                    />
                    <a
                      href="#"
                      onClick={(e) => {
                        e.preventDefault();
                        handleProductClick(item);
                      }}
                    >
                      <h4>{item.name}</h4>
                      <h3>{formatPrice(getGoodPrice(item))} ₽</h3>
                    </a>
                  </div>
                ))}
              </div>
            </section>
          </>
        )}
      </div>

      {modalData && (
        <div className="modal-overlay" onClick={(e) => e.target === e.currentTarget && closeModal()}>
          <div className="modal-content">
            <div className="modal-image-container">
              <img src={`/public/images/${modalData.photo}`} alt={modalData.name} className="modal-image" />
            </div>
            <div className="modal-info-container">
              <h2 className="modal-title">{modalData.name}</h2>
              <p className="modal-description" style={{ whiteSpace: 'pre-line' }}>{modalData.description}</p>
              <div className="modal-price-quantity">
                <p>Количество: <span>{modalData.quantity}</span></p>
                <p>Цена: <span>{formatPrice(getGoodPrice(modalData))} ₽</span></p>
              </div>

              <div className="modal-cart-controls">
                {modalCartQuantity > 0 ? (
                  <div className="cart-quantity-wrapper">
                    <button className="menu-btn cart-main-btn" disabled>
                      В корзине
                    </button>
                    <div className="cart-mini-controls">
                      <button
                        className="cart-mini-btn"
                        onClick={() => handleCartQuantityChange(modalData, -1)}
                        disabled={isModalCartLoading}
                      >
                        -
                      </button>
                      <span className="cart-quantity-value">{modalCartQuantity}</span>
                      <button
                        className="cart-mini-btn"
                        onClick={() => handleCartQuantityChange(modalData, 1)}
                        disabled={isModalCartLoading || isAtStockLimit}
                      >
                        +
                      </button>
                    </div>
                  </div>
                ) : (
                  <button
                    className="menu-btn cart-main-btn"
                    onClick={() => handleAddToCart(modalData)}
                    disabled={isModalCartLoading || modalStockQuantity <= 0}
                  >
                    {modalStockQuantity <= 0
                      ? 'Нет в наличии'
                      : isModalCartLoading
                        ? 'Добавление...'
                        : 'Добавить в корзину'}
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <App />
  </StrictMode>
);

export default App;