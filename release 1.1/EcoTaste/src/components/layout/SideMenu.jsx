function SideMenu({ menuOpen, onClose, children }) {
  return (
    <div className={`menu-container ${menuOpen ? 'active' : ''}`}>
      <div className="header">
        <img
          src="/src/etc_img/menu_banner.png"
          alt="Меню"
          className="menu-banner"
        />

        <button className="close-menu-button" onClick={onClose}>
          <img
            src="/src/etc_img/menu_icon.png"
            alt="Закрыть"
            className="close-menu-icon"
          />
        </button>
      </div>

      <div className="menu-buttons">
        {children}
      </div>
    </div>
  );
}

export default SideMenu;