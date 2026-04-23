function ProfileForm({
  currentUser,
  deliveryAddress,
  setDeliveryAddress,
  house,
  setHouse,
  floor,
  setFloor,
  apartment,
  setApartment,
  intercom,
  setIntercom,
  orderComment,
  setOrderComment,
  pickupAddress,
  setPickupAddress,
  pickupSelectOptions,
  profileError,
  profileSuccess,
  isProfileLoading,
  onSave,
  onBack,
  onLoginClick,
  onRegisterClick,
}) {
  return (
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
            onClick={onSave}
            disabled={isProfileLoading}
          >
            {isProfileLoading ? 'Сохранение...' : 'Сохранить'}
          </button>
          <button className="menu-btn" onClick={onBack}>Назад</button>
        </>
      ) : (
        <>
          <button className="menu-btn" onClick={onLoginClick}>Войти</button>
          <button className="menu-btn" onClick={onRegisterClick}>Регистрация</button>
          <button className="menu-btn" onClick={onBack}>Назад</button>
        </>
      )}
    </div>
  );
}

export default ProfileForm;