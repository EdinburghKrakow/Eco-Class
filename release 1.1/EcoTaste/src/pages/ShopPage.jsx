import { useState } from 'react';
import Header from '../components/layout/Header.jsx';
import SideMenu from '../components/layout/SideMenu.jsx';
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
}) {
  // 🔍 состояние поиска
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState(''); // пока заглушка

  return (
    <div className="App">
      <Header onMenuClick={toggleMenu} />

      <SideMenu menuOpen={menuOpen} onClose={closeMenu}>
        {showMenuButtons && (
          <>
            <button className="menu-btn" onClick={handleProfileClick}>Профиль</button>
            <button className="menu-btn" onClick={handleHistoryClick}>История покупок</button>
            <button className="menu-btn" onClick={handleCartClick}>Корзина</button>
            {(showHistory || showCart) && (
              <button className="menu-btn" onClick={handleGoToMainMenu}>Главное меню</button>
            )}
          </>
        )}

        {showProfile && !showMenuButtons && !showRegister && !showLogin && (
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
      </SideMenu>

      <div className="content">
        {/* 🔍 Поиск */}
        {!showHistory && !showCart && (
          <div style={{ margin: '20px' }}>
            <input
              type="text"
              placeholder="Поиск по названию..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              style={{
                padding: '10px',
                width: '100%',
                maxWidth: '400px',
                borderRadius: '8px',
                border: '1px solid #ccc',
              }}
            />
          </div>
        )}

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
          </>
        )}
      </div>

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