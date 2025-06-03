import React, { useState, useEffect } from 'react';
import { Modal } from 'react-bootstrap';
import { getProducts } from '../api/api';
import { ToastContainer, toast } from 'react-toastify';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'react-toastify/dist/ReactToastify.css';

const ProductsPage = () => {
  const [products, setProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [showModal, setShowModal] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);

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

  const handleShowDetails = (product) => {
    setSelectedProduct(product);
    setShowModal(true);
  };

  const handleAddToCart = (product) => {
    // À implémenter plus tard avec le service de panier
    toast.info("Fonctionnalité panier à venir !");
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
      <div className="row g-4">
        {filteredProducts.map((product) => (
          <div className="col-md-4" key={product._id}>
            <div className="card h-100 product-card">
              <div className="position-relative">
                <img
                  src={product.images?.[0] ? `http://localhost:5002${product.images[0]}` : '/placeholder.jpg'}
                  className="card-img-top"
                  alt={product.name}
                  style={{ height: '200px', objectFit: 'cover' }}
                />
                <div className="position-absolute top-0 end-0 p-2">
                  <span className="badge bg-primary">{product.category}</span>
                </div>
              </div>
              
              <div className="card-body">
                <h5 className="card-title">{product.name}</h5>
                <p className="card-text text-truncate">{product.description}</p>
                <div className="d-flex justify-content-between align-items-center">
                  <span className="fw-bold text-primary">{product.price} DH</span>
                  <span className="badge bg-secondary">Stock: {product.stockQuantity}</span>
                </div>
              </div>
              
              <div className="card-footer bg-transparent border-top-0">
                <div className="d-grid gap-2">
                  <button 
                    className="btn btn-outline-primary"
                    onClick={() => handleShowDetails(product)}
                  >
                    <i className="bi bi-eye me-2"></i>Détails
                  </button>
                  <button 
                    className="btn btn-primary"
                    onClick={() => handleAddToCart(product)}
                    disabled={product.stockQuantity <= 0}
                  >
                    <i className="bi bi-cart-plus me-2"></i>
                    {product.stockQuantity > 0 ? 'Ajouter au panier' : 'Rupture de stock'}
                  </button>
                </div>
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

      {/* Modal de détails */}
      <Modal show={showModal} onHide={() => setShowModal(false)} size="lg">
        <Modal.Header closeButton>
          <Modal.Title>{selectedProduct?.name}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {selectedProduct && (
            <div className="row">
              <div className="col-md-6">
                <img
                  src={selectedProduct.images?.[0] ? `http://localhost:5002${selectedProduct.images[0]}` : '/placeholder.jpg'}
                  className="img-fluid rounded"
                  alt={selectedProduct.name}
                />
              </div>
              <div className="col-md-6">
                <h4 className="mb-3">{selectedProduct.name}</h4>
                <p className="text-muted mb-3">{selectedProduct.description}</p>
                <div className="mb-3">
                  <span className="badge bg-primary me-2">{selectedProduct.category}</span>
                  <span className="badge bg-secondary">Stock: {selectedProduct.stockQuantity}</span>
                </div>
                <h5 className="text-primary mb-4">{selectedProduct.price} DH</h5>
                <button
                  className="btn btn-primary w-100"
                  onClick={() => handleAddToCart(selectedProduct)}
                  disabled={selectedProduct.stockQuantity <= 0}
                >
                  <i className="bi bi-cart-plus me-2"></i>
                  {selectedProduct.stockQuantity > 0 ? 'Ajouter au panier' : 'Rupture de stock'}
                </button>
              </div>
            </div>
          )}
        </Modal.Body>
      </Modal>
    </div>
  );
};

export default ProductsPage;
