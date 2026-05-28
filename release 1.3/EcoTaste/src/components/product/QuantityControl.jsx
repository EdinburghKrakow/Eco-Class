function QuantityControl({
  quantity,
  onDecrease,
  onIncrease,
  min = 0,
  max = Infinity,
  disabled = false,
}) {
  const decreaseDisabled = disabled || quantity <= min;
  const increaseDisabled = disabled || quantity >= max;

  return (
    <>
      <button
        className="cart-mini-btn"
        type="button"
        onClick={onDecrease}
        disabled={decreaseDisabled}
      >
        -
      </button>

      <span className="cart-quantity-value">{quantity}</span>

      <button
        className="cart-mini-btn"
        type="button"
        onClick={onIncrease}
        disabled={increaseDisabled}
      >
        +
      </button>
    </>
  );
}

export default QuantityControl;