function ProductCard({ product, onProductClick, formatPrice, getGoodPrice }) {
  return (
    <div className="product-card">
      <img
        src={`/images/${product.photo}`}
        alt={product.name}
        className="product-img"
        onClick={(e) => {
          e.preventDefault();
          onProductClick(product);
        }}
      />

      <a
        href="#"
        onClick={(e) => {
          e.preventDefault();
          onProductClick(product);
        }}
      >
        <h4>{product.name}</h4>
        <h3>{formatPrice(getGoodPrice(product))} ₽</h3>
      </a>
    </div>
  );
}

export default ProductCard;