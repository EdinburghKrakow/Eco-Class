import AdminWarehouseSection from '../components/admin/AdminWarehouseSection.jsx';
import AdminOrdersSection from '../components/admin/AdminOrdersSection.jsx';
import AdminAnalyticsSection from '../components/admin/AdminAnalyticsSection.jsx';

function AdminPage({
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
}) {
  return (
    <div className="App admin-panel-page">
      <div className="admin-top-banner">
        <img src="/src/etc_img/header_banner.png" alt="Эко-Вкус" className="admin-top-banner-img" />
      </div>

      <div className="admin-layout">
        <div className="admin-sidebar-panel">
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
              salesAnalyticsError={salesAnalyticsError}
              isSalesAnalyticsLoading={isSalesAnalyticsLoading}
              salesAnalytics={salesAnalytics}
              formatPrice={formatPrice}
              formatOrderDate={formatOrderDate}
            />
          )}
        </div>
      </div>
    </div>
  );
}

export default AdminPage;