function LoginForm({
  loginValue,
  setLoginValue,
  loginPassword,
  setLoginPassword,
  loginError,
  loginSuccess,
  isLoginLoading,
  onSubmit,
  onBack,
}) {
  return (
    <div className="profile-buttons register-form-container">
      <h2>Вход</h2>

      <label htmlFor="login-login" className="form-label">
        Логин (номер телефона)
      </label>
      <input
        id="login-login"
        type="text"
        maxLength={12}
        value={loginValue}
        onChange={(e) => setLoginValue(e.target.value)}
        className="form-input"
        placeholder="Введите номер телефона"
      />

      <label htmlFor="login-password" className="form-label">
        Пароль
      </label>
      <input
        id="login-password"
        type="password"
        maxLength={255}
        value={loginPassword}
        onChange={(e) => setLoginPassword(e.target.value)}
        className="form-input"
        placeholder="Введите пароль"
      />

      {loginError && <div className="form-message error-message">{loginError}</div>}
      {loginSuccess && <div className="form-message success-message">{loginSuccess}</div>}

      <button
        className="menu-btn"
        onClick={onSubmit}
        disabled={isLoginLoading}
      >
        {isLoginLoading ? 'Вход...' : 'Войти'}
      </button>
      <button className="menu-btn" onClick={onBack}>Назад</button>
    </div>
  );
}

export default LoginForm;