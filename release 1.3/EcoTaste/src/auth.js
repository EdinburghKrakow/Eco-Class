// Ключ для localStorage
const TOKEN_KEY = 'ecotaste_jwt_token';

export const getToken = () => {
  return localStorage.getItem(TOKEN_KEY);
};

export const saveToken = (token) => {
  localStorage.setItem(TOKEN_KEY, token);
};

export const removeToken = () => {
  localStorage.removeItem(TOKEN_KEY);
};

export const isAuthenticated = () => {
  return !!getToken();
};
