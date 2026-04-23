function AdminOrdersSection({
  adminOrdersError,
  adminSuccess,
  isAdminOrdersLoading,
  adminOrders,
  buildOrderItems,
  getOrderTotalPrice,
  adminOrderStatusLoading,
  formatOrderDate,
  formatOrderAddress,
  formatPrice,
  orderStatusOptions,
  handleAdminStatusChange,
  getGoodId,
  handleProductClick,
}) {
  return (
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
    </>
  );
}

export default AdminOrdersSection;