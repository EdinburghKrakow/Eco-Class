function AdminAnalyticsSection({
  salesAnalyticsError,
  isSalesAnalyticsLoading,
  salesAnalytics,
  formatPrice,
  formatOrderDate,
}) {
  return (
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
              <p>
                {salesAnalytics.bestSalesDay?.date
                  ? formatOrderDate(salesAnalytics.bestSalesDay.date)
                  : 'Нет данных'}
              </p>
              <p>
                {salesAnalytics.bestSalesDay?.amount !== undefined
                  ? `${formatPrice(salesAnalytics.bestSalesDay.amount)} ₽`
                  : ''}
              </p>
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
  );
}

export default AdminAnalyticsSection;