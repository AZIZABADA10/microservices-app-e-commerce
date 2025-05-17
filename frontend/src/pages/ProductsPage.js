import React, { useEffect, useState } from 'react';
import { getProducts, createOrder } from '../api/api';
import { ToastContainer, toast } from 'react-toastify';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'react-toastify/dist/ReactToastify.css';

const ProductsPage = () => {
  const [products, setProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await getProducts();
        const allProducts = response.data;
        setProducts(allProducts);
        setFilteredProducts(allProducts);

        // Extraire les catégories uniques
        const uniqueCategories = [...new Set(allProducts.map(p => p.category))];
        setCategories(uniqueCategories);
      } catch (err) {
        toast.error("Impossible de récupérer les produits.");
      }
    };

    fetchProducts();
  }, []);

  useEffect(() => {
    let result = products;

    if (selectedCategory !== 'all') {
      result = result.filter(p => p.category === selectedCategory);
    }

    if (searchTerm.trim()) {
      const term = searchTerm.toLowerCase();
      result = result.filter(
        p =>
          p.name.toLowerCase().includes(term) ||
          p.description.toLowerCase().includes(term)
      );
    }

    setFilteredProducts(result);
  }, [searchTerm, selectedCategory, products]);

  const handleBuy = async (productId) => {
    try {
      const token = localStorage.getItem('token');
      await createOrder({ productId, quantity: 1 }, token);
      toast.success("Commande créée avec succès !");
    } catch (err) {
      toast.error("Impossible de créer la commande.");
    }
  };

  return (
    <div className="container py-4">
      <ToastContainer />
      <h1 className="text-center text-primary mb-4">Mes Produits </h1>

      {/* Barre de recherche et filtre */}
      <div className="row mb-4">
        <div className="col-md-6">
          <input
            type="text"
            className="form-control"
            placeholder="Rechercher par nom ou description..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <div className="col-md-6">
          <select
            className="form-select"
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
          >
            <option value="all">Toutes les catégories</option>
            {categories.map((cat, idx) => (
              <option key={idx} value={cat}>
                {cat}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Affichage des produits */}
      <div className="row row-cols-1 row-cols-md-3 g-4">
        {filteredProducts.map((product) => (
          <div className="col" key={product._id}>
            <div className="card h-100 product-card">
              {console.log(product.images)}
              {product.images?.[0] && (
                <img
                  src={`http://localhost:5002${product.images[0]}`}
                  className="card-img-top"
                  alt={product.name}
                  style={{ objectFit: 'cover', height: '200px' }}
                />
              )}
              <div className="card-body">
                <h5 className="card-title text-primary">{product.name}</h5>
                <p className="card-text">{product.description}</p>
                <p className="text-muted mb-1">Catégorie : <strong>{product.category}</strong></p>
                <div className="d-flex justify-content-between align-items-center">
                  <span className="fs-5 fw-bold text-success">{product.price} DH </span>
                  <span className="badge bg-secondary">Stock: {product.stockQuantity}</span>
                </div>
              </div>
              <div className="card-footer bg-white border-0">
                <button
                  className="btn btn-outline-primary w-100"
                  onClick={() => handleBuy(product._id)}
                  disabled={product.stockQuantity <= 0}
                >
                  {product.stockQuantity > 0 ? 'Acheter' : 'Rupture de stock'}
                </button>
              </div>
            </div>
          </div>
        ))}
        {filteredProducts.length === 0 && (
          <div className="text-center text-muted py-5">
            Aucun produit trouvé.
          </div>
        )}
      </div>
    </div>
  );
};

export default ProductsPage;
