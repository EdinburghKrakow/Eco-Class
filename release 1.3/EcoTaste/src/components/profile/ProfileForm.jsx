import { useState } from 'react';

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
  userAddresses,
  selectedAddressId,
  onSelectAddress,
  onAddAddress,
  onEditAddress,
  onDeleteAddress,
  onStartAddAddress,
  onStartEditAddress,
}) {
  const [isAddingAddress, setIsAddingAddress] = useState(false);
  const [editingAddressId, setEditingAddressId] = useState(null);

  return (
    <div className="profile-form-container">
      <h2>Профиль</h2>

      {currentUser?.login ? (
        <>
          <h4>Здравствуйте, {currentUser.user_name}!</h4>

          {/* Управление адресами */}
          <div className="addresses-section">
            <h4>Мои адреса доставки</h4>

            {userAddresses.length > 0 ? (
              <div className="form-group">
                <select
                  className="form-input compact-input"
                  value={selectedAddressId || ''}
                  onChange={(e) => onSelectAddress(Number(e.target.value))}
                >
                  <option value="">-- выберите сохранённый адрес --</option>
                  {userAddresses.map((addr) => (
                    <option key={addr.address_id} value={addr.address_id}>
                      {addr.label || addr.full_address}
                    </option>
                  ))}
                </select>

                {selectedAddressId && (
                  <div style={{ marginTop: '0.5rem', display: 'flex', gap: '0.5rem' }}>
                    <button className="menu-btn compact-btn" onClick={() => {
                      onStartEditAddress(selectedAddressId);
                      setEditingAddressId(selectedAddressId);
                      setIsAddingAddress(true);
                    }}>
                      Изменить
                    </button>
                    <button className="menu-btn compact-btn" onClick={() => onDeleteAddress(selectedAddressId)}>
                      Удалить
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <p>Нет сохранённых адресов</p>
            )}

            {!isAddingAddress && (
              <button className="menu-btn compact-btn" onClick={() => {
                onStartAddAddress();
                setIsAddingAddress(true);
                setEditingAddressId(null);
              }}>
                + Добавить новый адрес
              </button>
            )}
          </div>

          {/* Форма добавления/редактирования */}
          {isAddingAddress && (
            <>
              <h4>{editingAddressId ? 'Редактирование адреса' : 'Новый адрес доставки'}</h4>
              <div className="form-group">
                <label htmlFor="delivery-address" className="form-label">Адрес</label>
                <input
                  id="delivery-address"
                  type="text"
                  value={deliveryAddress}
                  onChange={(e) => setDeliveryAddress(e.target.value)}
                  className="form-input compact-input"
                  placeholder="Улица, проспект, микрорайон"
                />
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label htmlFor="delivery-house" className="form-label">Дом</label>
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
                  <label htmlFor="delivery-floor" className="form-label">Подъезд</label>
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
                  <label htmlFor="delivery-apartment" className="form-label">Квартира</label>
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
                  <label htmlFor="delivery-intercom" className="form-label">Домофон</label>
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

              <div className="form-actions">
                <button
                  className="menu-btn compact-btn"
                  onClick={() => {
                    if (editingAddressId) {
                      onEditAddress();
                      setEditingAddressId(null);
                    } else {
                      onAddAddress();
                    }
                    setIsAddingAddress(false);
                  }}
                >
                  {editingAddressId ? 'Сохранить изменения' : 'Сохранить адрес'}
                </button>
                <button
                  className="menu-btn compact-btn"
                  onClick={() => {
                    setIsAddingAddress(false);
                    setEditingAddressId(null);
                  }}
                >
                  Отмена
                </button>
              </div>
            </>
          )}

          {/* Комментарий и самовывоз */}
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
            <button className="menu-btn compact-btn" onClick={onSave} disabled={isProfileLoading}>
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
