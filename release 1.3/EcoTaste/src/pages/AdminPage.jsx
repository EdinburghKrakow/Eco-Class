import AdminWarehouseSection from '../components/admin/AdminWarehouseSection.jsx';
import AdminOrdersSection from '../components/admin/AdminOrdersSection.jsx';
import AdminAnalyticsSection from '../components/admin/AdminAnalyticsSection.jsx';

function AdminPage({
  currentUser,
  adminSection,
  setAdminSection,
  resetAdminForms,
  setAdminOrdersError,
  setAdminSuccess,
  setAdminError,

  goods,
  getGoodId,
  getGoodPrice,
  getGoodStock,
  formatPrice,

  adminError,
  adminSuccess,
  adminMode,
  adminForm,
  handleAdminFormChange,
  isAdminSaving,
  handleCreateGood,
  deleteId,
  setDeleteId,
  handleDeleteGood,
  editSearchId,
  setEditSearchId,
  handleFindGoodForEdit,
  handleUpdateGood,
  handleStartAddGood,
  handleStartEditGood,
  handleStartDeleteGood,

  adminOrdersError,
  isAdminOrdersLoading,
  adminOrders,
  buildOrderItems,
  getOrderTotalPrice,
  adminOrderStatusLoading,
  formatOrderDate,
  formatOrderAddress,
  orderStatusOptions,
  handleAdminStatusChange,
  handleProductClick,

  salesAnalyticsError,
  isSalesAnalyticsLoading,
  salesAnalytics,

  // ↓ НОВЫЕ ПРОПСЫ (уже приходят из App.jsx, просто добавляем их сюда)
  sellerAnalytics,
  isSellerAnalyticsLoading,
}) {
  return (
    <div className="App admin-panel-page">
      <div className="header">
        <img src="/src/etc_img/header_banner.png" alt="Эко-Вкус" className="header-banner" />
      </div>

      <div className="admin-layout">
        <div className="admin-sidebar-panel">
          <h3>{currentUser?.user_name}</h3>
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
            <AdminWarehouseSection
              currentUser={currentUser}
              goods={goods}
              getGoodId={getGoodId}
              getGoodPrice={getGoodPrice}
              getGoodStock={getGoodStock}
              formatPrice={formatPrice}
              adminError={adminError}
              adminSuccess={adminSuccess}
              adminMode={adminMode}
              adminForm={adminForm}
              handleAdminFormChange={handleAdminFormChange}
              isAdminSaving={isAdminSaving}
              handleCreateGood={handleCreateGood}
              resetAdminForms={resetAdminForms}
              deleteId={deleteId}
              setDeleteId={setDeleteId}
              handleDeleteGood={handleDeleteGood}
              editSearchId={editSearchId}
              setEditSearchId={setEditSearchId}
              handleFindGoodForEdit={handleFindGoodForEdit}
              handleUpdateGood={handleUpdateGood}
              handleStartAddGood={handleStartAddGood}
              handleStartEditGood={handleStartEditGood}
              handleStartDeleteGood={handleStartDeleteGood}
            />
          )}

          {adminSection === 'orders' && (
            <AdminOrdersSection
              currentUser={currentUser}
              adminOrdersError={adminOrdersError}
              adminSuccess={adminSuccess}
              isAdminOrdersLoading={isAdminOrdersLoading}
              adminOrders={adminOrders}
              buildOrderItems={buildOrderItems}
              getOrderTotalPrice={getOrderTotalPrice}
              adminOrderStatusLoading={adminOrderStatusLoading}
              formatOrderDate={formatOrderDate}
              formatOrderAddress={formatOrderAddress}
              formatPrice={formatPrice}
              orderStatusOptions={orderStatusOptions}
              handleAdminStatusChange={handleAdminStatusChange}
              getGoodId={getGoodId}
              handleProductClick={handleProductClick}
            />
          )}

          {adminSection === 'analytics' && (
            <AdminAnalyticsSection
              currentUser={currentUser}
              salesAnalyticsError={salesAnalyticsError}
              isSalesAnalyticsLoading={isSalesAnalyticsLoading}
              salesAnalytics={salesAnalytics}
              formatPrice={formatPrice}
              formatOrderDate={formatOrderDate}
              // ↓ ВОТ ТО, ЧЕГО НЕ ХВАТАЛО
              sellerAnalytics={sellerAnalytics}
              isSellerAnalyticsLoading={isSellerAnalyticsLoading}
            />
          )}
        </div>
      </div>
    </div>
  );
}

export default AdminPage;
