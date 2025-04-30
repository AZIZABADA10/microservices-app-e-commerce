import React, { useEffect, useState } from 'react';
import { getProducts } from '../api/api';

const ProductsPage = () => {
  const [products, setProducts] = useState([]);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await getProducts();
        setProducts(response.data);
      } catch (err) {
        console.error('Erreur lors de la récupération des produits:', err);
      }
    };

    fetchProducts();
  }, []);

  return (
    <div>
      <h1>Liste des produits</h1>
      {products.length === 0 ? (
        <p>Aucun produit disponible.</p>
      ) : (
        <ul>
          {products.map((product) => (
            <li key={product._id}>
              <p>ID : {product._id}</p>
              <p>NOM : {product.name}</p>
              <p>DESCRIPTION : {product.description}</p>
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