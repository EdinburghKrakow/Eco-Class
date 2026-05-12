import { useState } from 'react';
import Header from '../components/layout/Header.jsx';
import ProductSection from '../components/product/ProductSection.jsx';
import ProductModal from '../components/product/ProductModal.jsx';
import ProfileForm from '../components/profile/ProfileForm.jsx';
import RegisterForm from '../components/auth/RegisterForm.jsx';
import LoginForm from '../components/auth/LoginForm.jsx';
import OrderHistoryView from '../components/orders/OrderHistoryView.jsx';
import CartView from '../components/cart/CartView.jsx';

function ShopPage({
  toggleMenu,
  menuOpen,
  closeMenu,
  showMenuButtons,
  showProfile,
  showRegister,
  showLogin,
  showHistory,
  showCart,
  handleProfileClick,
  handleHistoryClick,
  handleCartClick,
  handleGoToMainMenu,
  currentUser,
  deliveryAddress,
  setDeliveryAddress,
  house,
  setHouse,
  floor,
  setFloor,
  apartment,
  setApartment,
  intercom,
  setIntercom,
  orderComment,
  setOrderComment,
  pickupAddress,
  setPickupAddress,
  pickupSelectOptions,
  profileError,
  profileSuccess,
  isProfileLoading,
  handleSaveProfile,
  handleBack,
  handleLoginClick,
  handleRegisterClick,
  registerUserName,
  setRegisterUserName,
  registerLogin,
  setRegisterLogin,
  registerPassword,
  setRegisterPassword,
  registerError,
  registerSuccess,
  isRegisterLoading,
  handleRegisterSubmit,
  handleBackToProfile,
  loginValue,
  setLoginValue,
  loginPassword,
  setLoginPassword,
  loginError,
  loginSuccess,
  isLoginLoading,
  handleLoginSubmit,
  isHistoryLoading,
  historyError,
  ordersHistory,
  buildOrderItems,
  getOrderTotalPrice,
  formatOrderDate,
  formatOrderAddress,
  formatPrice,
  getGoodId,
  handleProductClick,
  cartGoods,
  cartItems,
  cartLoadingId,
  getGoodStock,
  getGoodPrice,
  handleCartQuantityChange,
  cartTotalPrice,
  orderError,
  orderSuccess,
  showCheckoutChoice,
  isOrderLoading,
  handleCheckoutOrder,
  setShowCheckoutChoice,
  setOrderError,
  setOrderSuccess,
  novelties,
  recommendations,
  modalData,
  modalCartQuantity,
  modalStockQuantity,
  isModalCartLoading,
  isAtStockLimit,
  closeModal,
  handleAddToCart,
  onLogout,
}) {
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('');

  const isAuthScreen = showProfile || showRegister || showLogin;

  // Функция для рендеринга секции категорий
  const renderCategories = () => (
    <div className="categories-section">
      <div className="categories-grid">
        <div className="product-card">
          <img src="/src/etc_img/vegetables.png" alt="Овощи и зелень" className="category-img" />
        </div>
        <div className="product-card">
          <img src="/src/etc_img/fruits.png" alt="Фрукты и ягоды" className="category-img" />
        </div>
        <div className="product-card">
          <img src="/src/etc_img/dairy.png" alt="Молочные продукты" className="category-img" />
        </div>
        <div className="product-card">
          <img src="/src/etc_img/meat.png" alt="Мясо и птица" className="category-img" />
        </div>
        <div className="product-card">
          <img src="/src/etc_img/eggs.png" alt="Яйца" className="category-img" />
        </div>
        <div className="product-card">
          <img src="/src/etc_img/groceries.png" alt="Бакалея" className="category-img" />
        </div>
      </div>
    </div>
  );

  // Функция для рендеринга информационных блоков (слева направо)
  const renderInfoBlocks = () => (
    <div className="info-blocks-section">
      <div className="info-block">
        <div className="product-card">
          <div className="info-block-image">
            <img src="/src/etc_img/farm_sign.png" alt="Ферма Эко-Вкус" className="info-img" />
          </div>
        </div>
      </div>
      <div className="info-block">
        <div className="product-card">
          <div className="info-block-image">
            <img src="/src/etc_img/brand_info.png" alt="О бренде Эко-Вкус" className="info-img" />
          </div>
        </div>
      </div>
    </div>
  );

  // Функция для рендеринга футера
  const renderFooter = () => (
    <footer className="footer">
      <div className="footer-content">
        <div className="footer-section">
          <div className="footer-logo">
            <img src="/src/etc_img/logo.png" alt="Эко-Вкус" />
            <p>фермерские продукты</p>
          </div>
        </div>
        <div className="footer-section">
          <h4>Мы принимаем</h4>
          <div className="payment-icons">
            <img src="/src/etc_img/mir.png" alt="Мир" />
            <img src="/src/etc_img/visa.png" alt="Visa" />
            <img src="/src/etc_img/mastercard.png" alt="Mastercard" />
          </div>
          <div className="footer-section">
            <h4>Контакты</h4>
            <p>📞 +7 (963) 123-45-67</p>
            <p>📧 info@eko-vkus.ru</p>
            <p>📍 г. Барнаул, пр-т Строителей, д. 18к1</p>
            <p>© 2026 Эко-Вкус. Все права защищены.</p>
          </div>
        </div>
      </div>
    </footer>
  );

  return (
    <div className="App">
      <Header />

      {/* МЕНЮ ПОД БАННЕРОМ (только если НЕ форма профиля/авторизации) */}
      {!isAuthScreen && (
        <div className="main-menu-container">
          {showMenuButtons && (
            <div className="menu-buttons-container">
              <div className="search-container">
                <input
                  type="text"
                  placeholder="Поиск по названию..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="search-input"
                />
              </div>
              <div className="menu-buttons-row">
                <button className="menu-btn compact-btn" onClick={handleProfileClick}>
                  Профиль
                </button>
                <button className="menu-btn compact-btn" onClick={handleHistoryClick}>
                  История покупок
                </button>
                <button className="menu-btn compact-btn" onClick={handleCartClick}>
                  Корзина
                </button>
                {(showHistory || showCart) && (
                  <button className="menu-btn compact-btn" onClick={handleGoToMainMenu}>
                    Главное меню
                  </button>
                )}
              </div>
            </div>
          )}

          {!showHistory && !showCart && (
            <div className="home-banners-container">
              <img
                src="/src/etc_img/under_home.png"
                alt="Баннер под главным"
                className="under-home-banner"
              />
            </div>
          )}
        </div>
      )}

      {/* Секция категорий (только в главном меню) */}
      {!isAuthScreen && !showHistory && !showCart && renderCategories()}

      {/* ЭКРАН ПРОФИЛЯ/АВТОРИЗАЦИИ (если показываем формы) */}
      {isAuthScreen && (
        <div className="auth-screen-container">
          {showProfile && (
            <ProfileForm
              currentUser={currentUser}
              deliveryAddress={deliveryAddress}
              setDeliveryAddress={setDeliveryAddress}
              house={house}
              setHouse={setHouse}
              floor={floor}
              setFloor={setFloor}
              apartment={apartment}
              setApartment={setApartment}
              intercom={intercom}
              setIntercom={setIntercom}
              orderComment={orderComment}
              setOrderComment={setOrderComment}
              pickupAddress={pickupAddress}
              setPickupAddress={setPickupAddress}
              pickupSelectOptions={pickupSelectOptions}
              profileError={profileError}
              profileSuccess={profileSuccess}
              isProfileLoading={isProfileLoading}
              onSave={handleSaveProfile}
              onBack={handleBack}
              onLoginClick={handleLoginClick}
              onRegisterClick={handleRegisterClick}
            />
          )}

          {showRegister && (
            <RegisterForm
              registerUserName={registerUserName}
              setRegisterUserName={setRegisterUserName}
              registerLogin={registerLogin}
              setRegisterLogin={setRegisterLogin}
              registerPassword={registerPassword}
              setRegisterPassword={setRegisterPassword}
              registerError={registerError}
              registerSuccess={registerSuccess}
              isRegisterLoading={isRegisterLoading}
              onSubmit={handleRegisterSubmit}
              onBack={handleBackToProfile}
            />
          )}

          {showLogin && (
            <LoginForm
              loginValue={loginValue}
              setLoginValue={setLoginValue}
              loginPassword={loginPassword}
              setLoginPassword={setLoginPassword}
              loginError={loginError}
              loginSuccess={loginSuccess}
              isLoginLoading={isLoginLoading}
              onSubmit={handleLoginSubmit}
              onBack={handleBackToProfile}
            />
          )}
        </div>
      )}

      {/* ОСНОВНОЙ КОНТЕНТ (только если НЕ форма профиля/авторизации) */}
      {!isAuthScreen && (
        <div className="content">
          {showHistory && (
            <OrderHistoryView
              isHistoryLoading={isHistoryLoading}
              historyError={historyError}
              ordersHistory={ordersHistory}
              buildOrderItems={buildOrderItems}
              getOrderTotalPrice={getOrderTotalPrice}
              formatOrderDate={formatOrderDate}
              formatOrderAddress={formatOrderAddress}
              formatPrice={formatPrice}
              getGoodId={getGoodId}
              handleProductClick={handleProductClick}
              onBack={handleBack}
            />
          )}

          {showCart && (
            <CartView
              currentUser={currentUser}
              cartGoods={cartGoods}
              cartItems={cartItems}
              cartLoadingId={cartLoadingId}
              getGoodId={getGoodId}
              getGoodStock={getGoodStock}
              getGoodPrice={getGoodPrice}
              formatPrice={formatPrice}
              handleProductClick={handleProductClick}
              handleCartQuantityChange={handleCartQuantityChange}
              cartTotalPrice={cartTotalPrice}
              orderError={orderError}
              orderSuccess={orderSuccess}
              showCheckoutChoice={showCheckoutChoice}
              isOrderLoading={isOrderLoading}
              handleCheckoutOrder={handleCheckoutOrder}
              setShowCheckoutChoice={setShowCheckoutChoice}
              setOrderError={setOrderError}
              setOrderSuccess={setOrderSuccess}
              onBack={handleBack}
            />
          )}

          {/* Секция товаров (только в главном меню) */}
          {!showHistory && !showCart && (
            <>
              <ProductSection
                sectionClassName="novelties"
                titleImage="/src/etc_img/new_products_title.png"
                titleAlt="НОВИНКИ"
                products={novelties}
                onProductClick={handleProductClick}
                formatPrice={formatPrice}
                getGoodPrice={getGoodPrice}
                search={search}
                category={category}
              />
              <div className="home-banners-container">
                <img
                  src="/src/etc_img/home_banner.png"
                  alt="Баннер под главным"
                  className="under-home-banner"
                />
              </div>
              <ProductSection
                sectionClassName="recommendations"
                titleImage="/src/etc_img/recommended_products_title.png"
                titleAlt="РЕКОМЕНДАЦИИ"
                products={recommendations}
                onProductClick={handleProductClick}
                formatPrice={formatPrice}
                getGoodPrice={getGoodPrice}
                search={search}
                category={category}
              />

              {/* Информационные блоки (только в главном меню) */}
              {renderInfoBlocks()}

              {/* Футер (только в главном меню) */}
              {renderFooter()}
            </>
          )}
        </div>
      )}

      {modalData && (
        <ProductModal
          modalData={modalData}
          modalCartQuantity={modalCartQuantity}
          modalStockQuantity={modalStockQuantity}
          isModalCartLoading={isModalCartLoading}
          isAtStockLimit={isAtStockLimit}
          formatPrice={formatPrice}
          getGoodPrice={getGoodPrice}
          onClose={closeModal}
          onDecrease={() => handleCartQuantityChange(modalData, -1)}
          onIncrease={() => handleCartQuantityChange(modalData, 1)}
          onAddToCart={() => handleAddToCart(modalData)}
        />
      )}
    </div>
  );
}

export default ShopPage;