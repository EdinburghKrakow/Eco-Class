import QuantityControl from './QuantityControl.jsx';

function ProductModal({
  modalData,
  modalCartQuantity,
  modalStockQuantity,
  isModalCartLoading,
  isAtStockLimit,
  formatPrice,
  getGoodPrice,
  onClose,
  onDecrease,
  onIncrease,
  onAddToCart,
}) {
  if (!modalData) return null;

  return (
    <div
      className="modal-overlay"
      onClick={(e) => {
        if (e.target === e.currentTarget) {
          onClose();
        }
      }}
    >
      <div className="modal-content">
        <div className="modal-image-container">
          <img
            src={`/images/${modalData.photo}`}
            alt={modalData.name}
            className="modal-image"
          />
        </div>

        <div className="modal-info-container">
          <h2 className="modal-title">{modalData.name}</h2>

          <p className="modal-description" style={{ whiteSpace: 'pre-line' }}>
            {modalData.description}
          </p>

          <div className="modal-price-quantity">
            <p>
              Количество: <span>{modalData.quantity}</span>
            </p>
            <p>
              Цена: <span>{formatPrice(getGoodPrice(modalData))} ₽</span>
            </p>
          </div>

          <div className="modal-cart-controls">
            {modalCartQuantity > 0 ? (
              <div className="cart-quantity-wrapper">
                <button className="menu-btn cart-main-btn" disabled>
                  В корзине
                </button>

                <div className="cart-mini-controls">
                  <QuantityControl
                    quantity={modalCartQuantity}
                    onDecrease={onDecrease}
                    onIncrease={onIncrease}
                    min={0}
                    max={modalStockQuantity}
                    disabled={isModalCartLoading}
                  />
                </div>
              </div>
            ) : (
              <button
                className="menu-btn cart-main-btn"
                onClick={onAddToCart}
                disabled={isModalCartLoading || modalStockQuantity <= 0}
              >
                {modalStockQuantity <= 0
                  ? 'Нет в наличии'
                  : isModalCartLoading
                    ? 'Добавление...'
                    : 'Добавить в корзину'}
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default ProductModal;