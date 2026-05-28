import { useEffect, useRef, useState } from 'react';

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
  // Состояние для отслеживания, нужны ли стрелочки для каждого заказа
  const [hasScroll, setHasScroll] = useState({});
  // Рефы для контейнеров товаров каждого заказа
  const orderItemsRefs = useRef({});
  // Хранилище для ResizeObserver каждого контейнера
  const resizeObservers = useRef({});
  // Состояние для текущей ширины окна
  const [windowWidth, setWindowWidth] = useState(window.innerWidth);

  // Функция для проверки, выходит ли контент за пределы контейнера
  const checkScroll = (orderNum) => {
    const container = orderItemsRefs.current[orderNum];
    if (container) {
      const needsScroll = container.scrollWidth > container.clientWidth;
      setHasScroll((prev) => ({ ...prev, [orderNum]: needsScroll }));
    }
  };

  // Наблюдаем за изменениями ширины контейнеров
  useEffect(() => {
    ordersHistory.forEach((order) => {
      const container = orderItemsRefs.current[order.order_num];
      if (container) {
        const observer = new ResizeObserver(() => {
          checkScroll(order.order_num);
        });
        observer.observe(container);
        resizeObservers.current[order.order_num] = observer;
        checkScroll(order.order_num);
      }
    });

    return () => {
      Object.values(resizeObservers.current).forEach((observer) => {
        if (observer) observer.disconnect();
      });
    };
  }, [ordersHistory]);

  // Отслеживаем изменение ширины окна
  useEffect(() => {
    const handleResize = () => {
      setWindowWidth(window.innerWidth);
      ordersHistory.forEach((order) => {
        checkScroll(order.order_num);
      });
    };

    window.addEventListener('resize', handleResize);
    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, [ordersHistory]);

  // Функция для прокрутки контейнера товаров
  const scrollOrderItems = (containerId, direction) => {
    const container = document.getElementById(containerId);
    if (container) {
      const scrollAmount = 220; // Ширина карточки + отступ
      if (direction === 'prev') {
        container.scrollLeft -= scrollAmount;
      } else {
        container.scrollLeft += scrollAmount;
      }
    }
  };

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
            const containerId = `order-items-${order.order_num}`;
            const itemCount = orderItems.length;

            return (
              <div
                key={`${order.order_num}-${index}`}
                className={`order-history-block ${index < ordersHistory.length - 1 ? 'with-divider' : ''}`}
                style={{
                  backgroundColor:
                    order.status === 'Отменен'
                      ? 'rgba(255, 0, 0, 0.1)'
                      : order.status !== 'Завершен'
                      ? 'rgba(0, 255, 0, 0.1)'
                      : 'transparent',
                }}
              >
                <div className="order-history-layout">
                  <div className="order-info-card">
                    <p>Заказ: {order.order_num}</p>
                    <p>Дата оформления: {formatOrderDate(order.order_date)}</p>
                    <p>Адрес: {formatOrderAddress(order.address)}</p>
                    <p>Общая стоимость заказа: {formatPrice(orderTotalPrice)} ₽</p>
                    <p>Статус заказа: {order.status}</p>
                  </div>

                  <div
                    className={`order-items-container ${hasScroll[order.order_num] ? 'has-scroll' : ''} items-${itemCount}`}
                  >
                    <button
                      className="order-slider-btn prev"
                      onClick={() => scrollOrderItems(containerId, 'prev')}
                      aria-label="Прокрутить влево"
                    >
                      &lt;
                    </button>

                    <div
                      id={containerId}
                      ref={(el) => (orderItemsRefs.current[order.order_num] = el)}
                      className="order-items-row"
                    >
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

                    <button
                      className="order-slider-btn next"
                      onClick={() => scrollOrderItems(containerId, 'next')}
                      aria-label="Прокрутить вправо"
                    >
                      &gt;
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      <button className="menu-btn" onClick={onBack}>
        Назад
      </button>
    </div>
  );
}

export default OrderHistoryView;