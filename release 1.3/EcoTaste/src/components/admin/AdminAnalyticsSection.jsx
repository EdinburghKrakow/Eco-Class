import SellerCharts from '../admin/SellerCharts';
import AdminCharts from '../admin/AdminCharts';

function AdminAnalyticsSection({
  currentUser,
  salesAnalyticsError,
  isSalesAnalyticsLoading,
  salesAnalytics,
  formatPrice,
  formatOrderDate,
  sellerAnalytics,
  isSellerAnalyticsLoading,
}) {
  const isAdmin = currentUser?.user_name === 'Admin';

  // Продавец: его графики
  if (!isAdmin) {
    if (isSellerAnalyticsLoading) return <div>Загрузка аналитики...</div>;
    if (!sellerAnalytics) return <div>Нет данных для отображения</div>;
    return (
      <SellerCharts
        dailySales={sellerAnalytics.dailySales || []}
        topProducts={sellerAnalytics.topProducts || []}
        totalRevenue={sellerAnalytics.totalRevenue || 0}
      />
    );
  }

  // Админ: новые графики + сводка
  if (isSalesAnalyticsLoading) return <div>Загрузка аналитики...</div>;
  if (salesAnalyticsError) return <div className="admin-message admin-error">{salesAnalyticsError}</div>;
  if (!salesAnalytics) return <div>Нет данных для отображения</div>;

  return (
    <>
      <AdminCharts
        dailySales={salesAnalytics.dailySales || []}
        topProducts={salesAnalytics.topProducts || []}
        totalRevenue={salesAnalytics.totalRevenue || 0}
        deliveryStats={salesAnalytics.deliveryStats || {}}
        pickupStats={salesAnalytics.pickupStats || {}}
      />
      {/* При желании можно добавить старую таблицу топ-10 */}
    </>
  );
}

export default AdminAnalyticsSection;
