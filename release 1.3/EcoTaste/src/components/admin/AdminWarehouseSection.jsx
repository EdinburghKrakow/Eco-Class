import { useState } from 'react';

function AdminWarehouseSection({
  currentUser,
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
  handleUpdateGood,
  handleStartAddGood,
}) {
  const [editingId, setEditingId] = useState(null);
  const [editForm, setEditForm] = useState({
    id: '',
    name: '',
    price: '',
    quantity: '',
    isnew: false
  });

  const handleStartInlineEdit = (item) => {
    setEditingId(getGoodId(item));
    setEditForm({
      id: String(getGoodId(item)),
      name: item.name,
      price: String(getGoodPrice(item)),
      quantity: String(getGoodStock(item)),
      isnew: Boolean(item.isnew)
    });
  };

  const handleCancelInlineEdit = () => {
    setEditingId(null);
  };

  const handleSaveInlineEdit = () => {
    handleUpdateGood({
      id: String(editForm.id),
      name: String(editForm.name),
      price: String(editForm.price),
      quantity: String(editForm.quantity),
      isnew: Boolean(editForm.isnew)
    });
    setEditingId(null);
  };

  const handleInlineFormChange = (field, value) => {
    setEditForm(prev => ({ ...prev, [field]: value }));
  };

  const handleInlineDelete = (id) => {
    if (window.confirm('Удалить этот товар?')) {
      handleDeleteGood(id);
    }
  };

  return (
    <>
      <h2 className="admin-section-title">Склад</h2>

      <table className="admin-goods-table">
        <thead>
          <tr>
            <th>Наименование</th>
            <th>Цена</th>
            <th>Количество</th>
            <th>Новинка</th>
            <th>Действия</th>
          </tr>
        </thead>
        <tbody>
          {goods.filter((item) => (item.seller === currentUser?.user_name || currentUser?.user_name === 'Admin')).map((item, index) => {
            const itemId = getGoodId(item);
            const isEditing = editingId === itemId;

            return (
              <tr key={`${itemId}-${index}`}>
                <td>
                  {isEditing ? (
                    <input
                      type="text"
                      value={editForm.name}
                      onChange={(e) => handleInlineFormChange('name', e.target.value)}
                      className="admin-inline-input"
                    />
                  ) : (
                    item.name
                  )}
                </td>
                <td>
                  {isEditing ? (
                    <input
                      type="text"
                      value={editForm.price}
                      onChange={(e) => handleInlineFormChange('price', e.target.value)}
                      className="admin-inline-input"
                    />
                  ) : (
                    formatPrice(getGoodPrice(item))
                  )}
                </td>
                <td>
                  {isEditing ? (
                    <input
                      type="text"
                      value={editForm.quantity}
                      onChange={(e) => handleInlineFormChange('quantity', e.target.value)}
                      className="admin-inline-input"
                    />
                  ) : (
                    getGoodStock(item)
                  )}
                </td>
                <td>
                  {isEditing ? (
                    <input
                      type="checkbox"
                      checked={editForm.isnew}
                      onChange={(e) => handleInlineFormChange('isnew', e.target.checked)}
                    />
                  ) : (
                    item.isnew ? 'Да' : 'Нет'
                  )}
                </td>
                <td className="admin-actions-cell">
                  {isEditing ? (
                    <>
                      <button
                        className="admin-icon-btn"
                        onClick={handleSaveInlineEdit}
                        disabled={isAdminSaving}
                        title="Сохранить"
                      >
                        ✓
                      </button>
                      <button
                        className="admin-icon-btn"
                        onClick={handleCancelInlineEdit}
                        disabled={isAdminSaving}
                        title="Отмена"
                      >
                        ✕
                      </button>
                    </>
                  ) : (
                    <>
                      <button
                        className="admin-icon-btn"
                        onClick={() => handleStartInlineEdit(item)}
                        title="Редактировать"
                      >
                        ✏️
                      </button>
                      <button
                        className="admin-icon-btn"
                        onClick={() => handleInlineDelete(itemId)}
                        disabled={isAdminSaving}
                        title="Удалить"
                      >
                        🗑️
                      </button>
                    </>
                  )}
                </td>
              </tr>
            );
          })}
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

      <div className="admin-action-buttons">
        <button className="admin-wide-btn" onClick={handleStartAddGood}>Добавить</button>
      </div>
    </>
  );
}

export default AdminWarehouseSection;