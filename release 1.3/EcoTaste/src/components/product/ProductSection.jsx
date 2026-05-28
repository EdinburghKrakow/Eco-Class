import ProductCard from './ProductCard';

function ProductSection({
  sectionClassName,
  titleImage,
  titleAlt,
  products,
  onProductClick,
  formatPrice,
  getGoodPrice,
  search = '',
  category = '',
}) {
  const filteredProducts = products.filter((item) => {
    const matchesSearch = item.name?.toLowerCase().includes(search.toLowerCase());
    const matchesCategory = !category || item.category === category;
    return matchesSearch && matchesCategory;
  });

  return (
    <section className={`section ${sectionClassName}`}>
      <img src={titleImage} alt={titleAlt} className="section-title-img" />

      <div className="products-section">
        {filteredProducts.length > 0 ? (
          filteredProducts.map((item, idx) => (
            <ProductCard
              key={`${sectionClassName}-${idx}`}
              product={item}
              onProductClick={onProductClick}
              formatPrice={formatPrice}
              getGoodPrice={getGoodPrice}
            />
          ))
        ) : (
          <p style={{ padding: '20px' }}>Ничего не найдено</p>
        )}
      </div>
    </section>
  );
}

export default ProductSection;
