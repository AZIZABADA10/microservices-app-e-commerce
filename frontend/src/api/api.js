import axios from 'axios';

export const login = (data) =>
  axios.post('http://localhost:5001/api/auth/login', data);

export const register = (data) =>
  axios.post('http://localhost:5001/api/auth/register', data);

export const getProducts = () =>
  axios.get('http://localhost:5002/api/products');

export const createProduct = (data, token) =>
  axios.post('http://localhost:5002/api/products', data, {
    headers: { Authorization: `Bearer ${token}` }
  });

export const getOrders = () =>
  axios.get('http://localhost:5003/api/orders');

export const createOrder = (data, token) =>
  axios.post('http://localhost:5003/api/orders', data, {
    headers: { Authorization: `Bearer ${token}` }
  });
