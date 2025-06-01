export const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5001/api';

export const CONFIG = {
  AUTH_TOKEN_KEY: 'token',
  USER_INFO_KEY: 'user',
  API_TIMEOUT: 5000,
  ROUTES: {
    AUTH: {
      LOGIN: '/auth/login',
      REGISTER: '/auth/register',
      PROFILE: '/auth/profile',
      USERS: '/auth/users'
    }
  }
};