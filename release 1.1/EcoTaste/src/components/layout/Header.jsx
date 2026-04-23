function Header({ onMenuClick }) {
  return (
    <div className="header">
      <img
        src="/src/etc_img/header_banner.png"
        alt="Эко-Вкус"
        className="header-banner"
      />

      <button className="menu-button" onClick={onMenuClick}>
        <img
          src="/src/etc_img/menu_icon.png"
          alt="Меню"
          className="menu-icon"
        />
      </button>
    </div>
  );
}

export default Header;