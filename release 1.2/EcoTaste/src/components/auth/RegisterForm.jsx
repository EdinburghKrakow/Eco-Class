function RegisterForm({
  registerUserName,
  setRegisterUserName,
  registerLogin,
  setRegisterLogin,
  registerPassword,
  setRegisterPassword,
  registerError,
  registerSuccess,
  isRegisterLoading,
  onSubmit,
  onBack,
}) {
  return (
    <div className="register-form-container">
      <h2>Регистрация</h2>

      <div className="form-group">
        <label htmlFor="register-user-name" className="form-label">
          Имя
        </label>
        <input
          id="register-user-name"
          type="text"
          maxLength={255}
          value={registerUserName}
          onChange={(e) => setRegisterUserName(e.target.value)}
          className="form-input compact-input"
          placeholder="Введите имя"
        />
      </div>

      <div className="form-group">
        <label htmlFor="register-login" className="form-label">
          Логин (номер телефона)
        </label>
        <input
          id="register-login"
          type="text"
          maxLength={12}
          value={registerLogin}
          onChange={(e) => setRegisterLogin(e.target.value)}
          className="form-input compact-input"
          placeholder="Введите номер телефона"
        />
      </div>

      <div className="form-group">
        <label htmlFor="register-password" className="form-label">
          Пароль
        </label>
        <input
          id="register-password"
          type="password"
          maxLength={255}
          value={registerPassword}
          onChange={(e) => setRegisterPassword(e.target.value)}
          className="form-input compact-input"
          placeholder="Введите пароль"
        />
      </div>

      {registerError && <div className="form-message error-message">{registerError}</div>}
      {registerSuccess && <div className="form-message success-message">{registerSuccess}</div>}

      <div className="form-actions">
        <button
          className="menu-btn compact-btn"
          onClick={onSubmit}
          disabled={isRegisterLoading}
        >
          {isRegisterLoading ? 'Сохранение...' : 'Зарегистрироваться'}
        </button>
        <button className="menu-btn compact-btn" onClick={onBack}>
          Назад
        </button>
      </div>
    </div>
  );
}

export default RegisterForm;