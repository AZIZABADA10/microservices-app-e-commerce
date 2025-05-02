import axios from 'axios';

export const login = (data) =>
  axios.post('http://localhost:5001/api/auth/login', data);

export const register = (data) =>
  axios.post('http://localhost:5001/api/auth/register', data);

export const getProducts = () =>
  axios.get('http://localhost:5002/api/products'); // URL correcte pour récupérer les produits

export const createProduct = (data, token) =>
  axios.post('http://localhost:5002/api/products', data, {
    headers: { Authorization: `Bearer ${token}` }
  });

export const updateProduct = (id, data) =>
  axios.put(`http://localhost:5002/api/products/${id}`, data);

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
