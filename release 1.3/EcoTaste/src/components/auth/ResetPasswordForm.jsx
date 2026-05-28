function ResetPasswordForm({
  resetLogin,
  setResetLogin,
  resetPasswordValue,
  setResetPasswordValue,
  resetError,
  resetSuccess,
  isResetLoading,
  onSubmit,
  onBack,
}) {
  return (
    <div className="login-form-container">
      <h2>Восстановление пароля</h2>

      <div className="form-group">
        <label htmlFor="reset-login" className="form-label">
          Логин
        </label>

        <input
          id="reset-login"
          type="text"
          maxLength={12}
          value={resetLogin}
          onChange={(e) => setResetLogin(e.target.value)}
          className="form-input compact-input"
          placeholder="Введите логин"
        />
      </div>

      <div className="form-group">
        <label htmlFor="reset-password" className="form-label">
          Новый пароль
        </label>

        <input
          id="reset-password"
          type="password"
          maxLength={255}
          value={resetPasswordValue}
          onChange={(e) => setResetPasswordValue(e.target.value)}
          className="form-input compact-input"
          placeholder="Введите новый пароль"
        />
      </div>

      {resetError && (
        <div className="form-message error-message">
          {resetError}
        </div>
      )}

      {resetSuccess && (
        <div className="form-message success-message">
          {resetSuccess}
        </div>
      )}

      <div className="form-actions">
        <button
          className="menu-btn compact-btn"
          onClick={onSubmit}
          disabled={isResetLoading}
        >
          {isResetLoading ? 'Сохранение...' : 'Изменить пароль'}
        </button>

        <button
          className="menu-btn compact-btn"
          onClick={onBack}
        >
          Назад
        </button>
      </div>
    </div>
  );
}

export default ResetPasswordForm;