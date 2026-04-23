function CartView({
  currentUser,
  cartGoods,
  cartItems,
  cartLoadingId,
  getGoodId,
  getGoodStock,
  getGoodPrice,
  formatPrice,
  handleProductClick,
  handleCartQuantityChange,
  cartTotalPrice,
  orderError,
  orderSuccess,
  showCheckoutChoice,
  isOrderLoading,
  handleCheckoutOrder,
  setShowCheckoutChoice,
  setOrderError,
  setOrderSuccess,
  onBack,
}) {
  return (
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
                    src={`/images/${item.photo}`}
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
        <button className="menu-btn" onClick={onBack}>Назад</button>
      </div>
    </div>
  );
}

export default CartView;