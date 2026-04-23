function AdminWarehouseSection({
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
  resetAdminForms,
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
}) {
  return (
    <>
      <h2 className="admin-section-title">Склад</h2>

      <table className="admin-goods-table">
        <thead>
          <tr>
            <th>Код</th>
            <th>Наименование</th>
            <th>Цена</th>
            <th>Количество</th>
            <th>Новинка</th>
          </tr>
        </thead>
        <tbody>
          {goods.map((item, index) => (
            <tr key={`${getGoodId(item)}-${index}`}>
              <td>{getGoodId(item)}</td>
              <td>{item.name}</td>
              <td>{formatPrice(getGoodPrice(item))}</td>
              <td>{getGoodStock(item)}</td>
              <td>{item.isnew ? 'Да' : 'Нет'}</td>
            </tr>
          ))}
        </tbody>
      </table>

      {adminError && <div className="admin-message admin-error">{adminError}</div>}
      {adminSuccess && <div className="admin-message admin-success">{adminSuccess}</div>}

      {adminMode === 'add' && (
        <div className="admin-form-box">
          <div className="admin-form-grid">
            <label className="admin-form-label">
              Код
              <input
                type="text"
                value={adminForm.id}
                onChange={(e) => handleAdminFormChange('id', e.target.value)}
                className="admin-form-input"
              />
            </label>

            <label className="admin-form-label">
              Наименование
              <input
                type="text"
                value={adminForm.name}
                onChange={(e) => handleAdminFormChange('name', e.target.value)}
                className="admin-form-input"
              />
            </label>

            <label className="admin-form-label">
              Цена
              <input
                type="text"
                value={adminForm.price}
                onChange={(e) => handleAdminFormChange('price', e.target.value)}
                className="admin-form-input"
              />
            </label>

            <label className="admin-form-label">
              Количество
              <input
                type="text"
                value={adminForm.quantity}
                onChange={(e) => handleAdminFormChange('quantity', e.target.value)}
                className="admin-form-input"
              />
            </label>

            <label className="admin-checkbox-label">
              <input
                type="checkbox"
                checked={adminForm.isnew}
                onChange={(e) => handleAdminFormChange('isnew', e.target.checked)}
              />
              Новинка
            </label>
          </div>

          <div className="admin-inline-buttons">
            <button
              className="admin-small-btn"
              onClick={handleCreateGood}
              disabled={isAdminSaving}
            >
              {isAdminSaving ? 'Сохранение...' : 'Сохранить'}
            </button>
            <button
              className="admin-small-btn admin-cancel-btn"
              onClick={resetAdminForms}
              disabled={isAdminSaving}
            >
              Отмена
            </button>
          </div>
        </div>
      )}

      {adminMode === 'delete' && (
        <div className="admin-form-box">
          <label className="admin-form-label">
            Введите id товара для удаления
            <input
              type="text"
              value={deleteId}
              onChange={(e) => setDeleteId(e.target.value)}
              className="admin-form-input"
            />
          </label>

          <div className="admin-inline-buttons">
            <button
              className="admin-small-btn"
              onClick={handleDeleteGood}
              disabled={isAdminSaving}
            >
              {isAdminSaving ? 'Удаление...' : 'Удалить'}
            </button>
            <button
              className="admin-small-btn admin-cancel-btn"
              onClick={resetAdminForms}
              disabled={isAdminSaving}
            >
              Отмена
            </button>
          </div>
        </div>
      )}

      {adminMode === 'edit-search' && (
        <div className="admin-form-box">
          <label className="admin-form-label">
            Введите id товара для редактирования
            <input
              type="text"
              value={editSearchId}
              onChange={(e) => setEditSearchId(e.target.value)}
              className="admin-form-input"
            />
          </label>

          <div className="admin-inline-buttons">
            <button
              className="admin-small-btn"
              onClick={handleFindGoodForEdit}
            >
              Найти
            </button>
            <button
              className="admin-small-btn admin-cancel-btn"
              onClick={resetAdminForms}
            >
              Отмена
            </button>
          </div>
        </div>
      )}

      {adminMode === 'edit-form' && (
        <div className="admin-form-box">
          <div className="admin-form-grid">
            <label className="admin-form-label">
              Код
              <input
                type="text"
                value={adminForm.id}
                onChange={(e) => handleAdminFormChange('id', e.target.value)}
                className="admin-form-input"
              />
            </label>

            <label className="admin-form-label">
              Наименование
              <input
                type="text"
                value={adminForm.name}
                onChange={(e) => handleAdminFormChange('name', e.target.value)}
                className="admin-form-input"
              />
            </label>

            <label className="admin-form-label">
              Цена
              <input
                type="text"
                value={adminForm.price}
                onChange={(e) => handleAdminFormChange('price', e.target.value)}
                className="admin-form-input"
              />
            </label>

            <label className="admin-form-label">
              Количество
              <input
                type="text"
                value={adminForm.quantity}
                onChange={(e) => handleAdminFormChange('quantity', e.target.value)}
                className="admin-form-input"
              />
            </label>

            <label className="admin-checkbox-label">
              <input
                type="checkbox"
                checked={adminForm.isnew}
                onChange={(e) => handleAdminFormChange('isnew', e.target.checked)}
              />
              Новинка
            </label>
          </div>

          <div className="admin-inline-buttons">
            <button
              className="admin-small-btn"
              onClick={handleUpdateGood}
              disabled={isAdminSaving}
            >
              {isAdminSaving ? 'Сохранение...' : 'Сохранить'}
            </button>
            <button
              className="admin-small-btn admin-cancel-btn"
              onClick={resetAdminForms}
              disabled={isAdminSaving}
            >
              Отмена
            </button>
          </div>
        </div>
      )}

      <div className="admin-action-buttons">
        <button className="admin-wide-btn" onClick={handleStartAddGood}>Добавить</button>
        <button className="admin-wide-btn" onClick={handleStartEditGood}>Редактировать</button>
        <button className="admin-wide-btn" onClick={handleStartDeleteGood}>Удалить</button>
      </div>
    </>
  );
}

export default AdminWarehouseSection;