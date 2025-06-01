import axios from 'axios';

export const login = (data) =>
  axios.post('http://localhost:5001/api/auth/login', data);

export const register = (data) =>
  axios.post('http://localhost:5001/api/auth/register', data);

export const getProducts = () =>
  axios.get('http://localhost:5002/api/products'); // URL correcte pour récupérer les produits

export const createProduct = (formData) => {
  return axios.post('http://localhost:5002/api/products', formData);
};

export const updateProduct = (id, data, isFormData = false) =>
  axios.put(`http://localhost:5002/api/products/${id}`, data, {
    headers: isFormData ? { 'Content-Type': 'multipart/form-data' } : {}
  });

export const deleteProduct = (id) =>
  axios.delete(`http://localhost:5002/api/products/${id}`);

export const getOrders = () =>
  axios.get('http://localhost:5003/api/orders');

export const createOrder = (data, token) =>
  axios.post('http://localhost:5003/api/orders', data, {
    headers: { Authorization: `Bearer ${token}` }
  });

export const updateOrder = (id, data) =>
  axios.put(`http://localhost:5003/api/orders/${id}`, data);

export const deleteOrder = (id) =>
  axios.delete(`http://localhost:5003/api/orders/${id}`);

export const getUserProfile = () => {
  const token = localStorage.getItem('token');
  return axios.get('http://localhost:5001/api/users/profile', {
    headers: { Authorization: `Bearer ${token}` }
  });
};

export const updateUserProfile = (data) => {
  const token = localStorage.getItem('token');
  return axios.put('http://localhost:5001/api/users/profile', data, {
    headers: { Authorization: `Bearer ${token}` }
  });
};

export const getAllUsers = () => {
  const token = localStorage.getItem('token');
  return axios.get('http://localhost:5001/api/users/admin/users', {
    headers: { Authorization: `Bearer ${token}` }
  });
};

export const updateUserRole = (userId, data) => {
  const token = localStorage.getItem('token');
  return axios.put(`http://localhost:5001/api/users/admin/users/${userId}/role`, data, {
    headers: { Authorization: `Bearer ${token}` }
  });
};

export const deleteUser = (userId) => {
  const token = localStorage.getItem('token');
  return axios.delete(`http://localhost:5001/api/users/admin/users/${userId}`, {
    headers: { Authorization: `Bearer ${token}` }
  });
};
