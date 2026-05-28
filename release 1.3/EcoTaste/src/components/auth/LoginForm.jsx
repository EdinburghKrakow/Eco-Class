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
  onForgotPassword,   // ← новый пропс
}) {
  return (
    <div className="login-form-container">
      <h2>Вход</h2>

      <div className="form-group">
        <label htmlFor="login-login" className="form-label">
          Логин (номер телефона)
        </label>
        <input
          id="login-login"
          type="text"
          maxLength={12}
          value={loginValue}
          onChange={(e) => setLoginValue(e.target.value)}
          className="form-input compact-input"
          placeholder="Введите номер телефона"
        />
      </div>

      <div className="form-group">
        <label htmlFor="login-password" className="form-label">
          Пароль
        </label>
        <input
          id="login-password"
          type="password"
          maxLength={255}
          value={loginPassword}
          onChange={(e) => setLoginPassword(e.target.value)}
          className="form-input compact-input"
          placeholder="Введите пароль"
        />
      </div>

      {loginError && <div className="form-message error-message">{loginError}</div>}
      {loginSuccess && <div className="form-message success-message">{loginSuccess}</div>}

      <div className="form-actions">
        <button
          className="menu-btn compact-btn"
          onClick={onSubmit}
          disabled={isLoginLoading}
        >
          {isLoginLoading ? 'Вход...' : 'Войти'}
        </button>
        <button className="menu-btn compact-btn" onClick={onBack}>
          Назад
        </button>
      </div>

      {/* Кнопка "Забыли пароль?" */}
      <div style={{ marginTop: '10px', textAlign: 'center' }}>
        <button
          type="button"
          className="menu-btn compact-btn"
          onClick={onForgotPassword}
          style={{
            background: 'transparent',
            border: 'none',
            color: '#555',
            textDecoration: 'underline',
            cursor: 'pointer',
            fontSize: '14px',
          }}
        >
          Забыли пароль?
        </button>
      </div>
    </div>
  );
}

export default LoginForm;
