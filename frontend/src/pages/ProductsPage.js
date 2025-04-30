import React, { useEffect, useState } from 'react';
import { getProducts } from '../api/api';

const ProductsPage = () => {
  const [products, setProducts] = useState([]);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await getProducts();
        setProducts(response.data);
      } catch (err) {
        console.error('Erreur lors de la récupération des produits:', err);
        setError('Impossible de récupérer les produits.');
      }
    };

    fetchProducts();
  }, []);

  return (
    <div>
      <h1>Liste des produits</h1>
      {error && <p style={{ color: 'red' }}>{error}</p>}
      {products.length === 0 ? (
        <p>Aucun produit disponible.</p>
      ) : (
        <ul>
          {products.map((product) => (
            <li key={product._id}>
              <h2>{product.name}</h2>
              <p>{product.description}</p>
              <p>Prix : {product.price} €</p>
              <p>Quantité en stock : {product.stockQuantity}</p>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default ProductsPage;

