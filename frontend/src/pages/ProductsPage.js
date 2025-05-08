import React, { useEffect, useState } from 'react';
import { getProducts, createOrder } from '../api/api';
import 'bootstrap/dist/css/bootstrap.min.css';

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
      const token = localStorage.getItem('token');
      await createOrder({ productId, quantity: 1 }, token);
      alert('Commande créée avec succès !');
    } catch (err) {
      console.error('Erreur lors de la création de la commande:', err);
      alert('Impossible de créer la commande.');
    }
  };

  return (
    <div className="container py-4">
      <h1 className="text-center text-primary mb-4">Produits de Parapharmacie</h1>
      {error && <div className="alert alert-danger" role="alert">{error}</div>}
      
      <div className="row row-cols-1 row-cols-md-3 g-4">
        {products.map((product) => (
          <div className="col" key={product._id}>
            <div className="card h-100 shadow-sm hover-shadow">
              <div className="card-body">
                <h5 className="card-title text-primary">{product.name}</h5>
                <p className="card-text">{product.description}</p>
                <div className="d-flex justify-content-between align-items-center">
                  <span className="fs-5 fw-bold text-success">{product.price} €</span>
                  <span className="badge bg-light text-dark">Stock: {product.stockQuantity}</span>
                </div>
              </div>
              <div className="card-footer bg-transparent border-top-0">
                <button 
                  className="btn btn-primary w-100" 
                  onClick={() => handleBuy(product._id)}
                  disabled={product.stockQuantity <= 0}
                >
                  {product.stockQuantity > 0 ? 'Acheter' : 'Rupture de stock'}
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ProductsPage;