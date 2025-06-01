import axios from 'axios';
import { API_URL, CONFIG } from '../config';

// Configuration d'Axios
axios.defaults.baseURL = API_URL;
axios.defaults.timeout = CONFIG.API_TIMEOUT;

const setAuthToken = (token) => {
  if (token) {
    axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
    localStorage.setItem(CONFIG.AUTH_TOKEN_KEY, token);
  } else {
    delete axios.defaults.headers.common['Authorization'];
    localStorage.removeItem(CONFIG.AUTH_TOKEN_KEY);
  }
};

const getCurrentUser = () => {
  const token = localStorage.getItem(CONFIG.AUTH_TOKEN_KEY);
  if (!token) return null;
  
  try {
    const payload = JSON.parse(atob(token.split('.')[1]));
    return payload;
  } catch (error) {
    console.error('Erreur de décodage du token:', error);
    return null;
  }
};

export const getUserProfile = async () => {
  try {
    const token = localStorage.getItem(CONFIG.AUTH_TOKEN_KEY);
    const response = await axios.get(`${API_URL}/auth/profile`, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    });
    return response;
  } catch (error) {
    console.error('Erreur lors de la récupération du profil:', error);
    throw error;
  }
};

export const login = async (credentials) => {
  try {
    const response = await axios.post(CONFIG.ROUTES.AUTH.LOGIN, credentials);
    if (response.data.token) {
      setAuthToken(response.data.token);
      localStorage.setItem(CONFIG.USER_INFO_KEY, JSON.stringify(response.data.user));
    }
    return response.data;
  } catch (error) {
    console.error('Erreur de connexion:', error);
    throw error;
  }
};

export const logout = () => {
  setAuthToken(null);
  localStorage.removeItem(CONFIG.USER_INFO_KEY);
  localStorage.removeItem(CONFIG.AUTH_TOKEN_KEY);
};

export const isAdmin = () => {
  const user = getCurrentUser();
  return user && user.role === 'ADMIN';
};

export const updateUserProfile = async (profileData) => {
  try {
    const token = localStorage.getItem(CONFIG.AUTH_TOKEN_KEY);
    const response = await axios.put(`${API_URL}/auth/profile`, profileData, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    });
    return response.data;
  } catch (error) {
    console.error('Erreur de mise à jour du profil:', error);
    throw error;
  }
};

// Initialisation du token au démarrage
const token = localStorage.getItem(CONFIG.AUTH_TOKEN_KEY);
if (token) {
  setAuthToken(token);
}