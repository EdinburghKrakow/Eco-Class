function OrderHistoryView({
  isHistoryLoading,
  historyError,
  ordersHistory,
  buildOrderItems,
  getOrderTotalPrice,
  formatOrderDate,
  formatOrderAddress,
  formatPrice,
  getGoodId,
  handleProductClick,
  onBack,
}) {
  return (
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
                      <div
                        key={`${order.order_num}-${getGoodId(item)}-${itemIndex}`}
                        className="product-card order-product-card"
                      >
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

      <button className="menu-btn" onClick={onBack}>Назад</button>
    </div>
  );
}

export default OrderHistoryView;