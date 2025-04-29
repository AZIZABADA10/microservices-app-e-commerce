const axios = require('axios');

const PRODUCT_SERVICE_URL = process.env.PRODUCT_SERVICE_URL || 'http://localhost:5002/api/products';

exports.checkProductExists = async (productId) => {
  try {
    const response = await axios.get(`${PRODUCT_SERVICE_URL}/${productId}`);
    return response.data;
  } catch (err) {
    return null;
  }
};
