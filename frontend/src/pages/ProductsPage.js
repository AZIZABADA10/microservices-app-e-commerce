import React, { useEffect, useState } from 'react';
import { getProducts, createOrder } from '../api/api'; // Importer createOrder

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

  const handleBuy = async (productId) => {
    try {
      const token = localStorage.getItem('token'); // Récupérer le token utilisateur
      await createOrder({ productId, quantity: 1 }, token); // Créer une commande
      alert('Commande créée avec succès !');
    } catch (err) {
      console.error('Erreur lors de la création de la commande:', err);
      alert('Impossible de créer la commande.');
    }
  };

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
              <button onClick={() => handleBuy(product._id)}>Acheter</button> {/* Bouton Acheter */}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default ProductsPage;

