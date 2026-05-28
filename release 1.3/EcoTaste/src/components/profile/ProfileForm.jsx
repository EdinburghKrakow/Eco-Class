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
    <div className="profile-form-container">
      <h2>Профиль</h2>

      {currentUser?.login ? (
        <>
          <h4>Здравствуйте, {currentUser.user_name}!</h4>

	  {/*Сюда засунуть выпадающий список, который будет состоять из сохраненных адресов пользователя.*/}

	  <h4>Новый адрес доставки: </h4>

          <div className="form-group">
            <label htmlFor="delivery-address" className="form-label">
              Адрес доставки
            </label>
            <input
              id="delivery-address"
              type="text"
              value={deliveryAddress}
              onChange={(e) => setDeliveryAddress(e.target.value)}
              className="form-input compact-input"
              placeholder="Введите адрес доставки"
            />
          </div>

          <div className="form-row">
            <div className="form-group">
              <label htmlFor="delivery-house" className="form-label">
                Дом
              </label>
              <input
                id="delivery-house"
                type="text"
                value={house}
                onChange={(e) => setHouse(e.target.value)}
                className="form-input compact-input"
                placeholder="Номер дома"
              />
            </div>

            <div className="form-group">
              <label htmlFor="delivery-floor" className="form-label">
                Подъезд
              </label>
              <input
                id="delivery-floor"
                type="text"
                value={floor}
                onChange={(e) => setFloor(e.target.value)}
                className="form-input compact-input"
                placeholder="Номер подъезда"
              />
            </div>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label htmlFor="delivery-apartment" className="form-label">
                Квартира
              </label>
              <input
                id="delivery-apartment"
                type="text"
                value={apartment}
                onChange={(e) => setApartment(e.target.value)}
                className="form-input compact-input"
                placeholder="Номер квартиры"
              />
            </div>

            <div className="form-group">
              <label htmlFor="delivery-intercom" className="form-label">
                Домофон
              </label>
              <input
                id="delivery-intercom"
                type="text"
                value={intercom}
                onChange={(e) => setIntercom(e.target.value)}
                className="form-input compact-input"
                placeholder="Код домофона"
              />
            </div>
          </div>

          <div className="form-group">
            <label htmlFor="order-comment" className="form-label">
              Комментарий к заказу
            </label>
            <textarea
              id="order-comment"
              value={orderComment}
              onChange={(e) => setOrderComment(e.target.value)}
              className="form-input compact-input"
              placeholder="Комментарий к заказу"
              rows={3}
            />
          </div>

          <div className="form-group">
            <label htmlFor="pickup-address" className="form-label">
              Адрес магазина для самовывоза
            </label>
            <select
              id="pickup-address"
              value={pickupAddress}
              onChange={(e) => setPickupAddress(e.target.value)}
              className="form-input compact-input"
            >
              {pickupSelectOptions.map((item, index) => (
                <option key={`${item}-${index}`} value={item}>
                  {item || 'Выберите адрес магазина'}
                </option>
              ))}
            </select>
          </div>

          {profileError && <div className="form-message error-message">{profileError}</div>}
          {profileSuccess && <div className="form-message success-message">{profileSuccess}</div>}

          <div className="form-actions">
            <button
              className="menu-btn compact-btn"
              onClick={onSave}
              disabled={isProfileLoading}
            >
              {isProfileLoading ? 'Сохранение...' : 'Сохранить'}
            </button>
            <button className="menu-btn compact-btn" onClick={onBack}>Назад</button>
          </div>
        </>
      ) : (
        <div className="form-actions">
          <button className="menu-btn compact-btn" onClick={onLoginClick}>Войти</button>
          <button className="menu-btn compact-btn" onClick={onRegisterClick}>Регистрация</button>
          <button className="menu-btn compact-btn" onClick={onBack}>Назад</button>
        </div>
      )}
    </div>
  );
}

export default ProfileForm;