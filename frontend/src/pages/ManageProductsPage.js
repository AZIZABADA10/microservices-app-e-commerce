import React, { useEffect, useState } from 'react';
import { getProducts, createProduct, updateProduct, deleteProduct } from '../api/api';
import 'bootstrap/dist/css/bootstrap.min.css';

const ManageProductsPage = () => {
  const [products, setProducts] = useState([]);
  const [form, setForm] = useState({ name: '', price: '', description: '', stockQuantity: '' });
  const [editingProductId, setEditingProductId] = useState(null);

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    const response = await getProducts();
    setProducts(response.data);
  };

  const handleCreateOrUpdate = async () => {
    try {
      if (editingProductId) {
        await updateProduct(editingProductId, form);
        alert('Produit mis à jour avec succès');
      } else {
        await createProduct(form);
        alert('Produit créé avec succès');
      }
      setForm({ name: '', price: '', description: '', stockQuantity: '' });
      setEditingProductId(null);
      fetchProducts();
    } catch (error) {
      alert('Une erreur s\'est produite');
    }
  };

  const handleEdit = (product) => {
    setForm(product);
    setEditingProductId(product._id);
  };

  const handleDelete = async (id) => {
    if (window.confirm('Êtes-vous sûr de vouloir supprimer ce produit?')) {
      await deleteProduct(id);
      alert('Produit supprimé avec succès');
      fetchProducts();
    }
  };

  return (
    <div className="container py-4">
      <h1 className="text-center text-primary mb-4">Gestion des Produits</h1>
      
      <div className="card shadow-sm mb-4">
        <div className="card-body">
          <h5 className="card-title mb-3">
            {editingProductId ? 'Modifier le produit' : 'Ajouter un nouveau produit'}
          </h5>
          
          <div className="row g-3">
            <div className="col-md-6">
              <input
                className="form-control"
                placeholder="Nom"
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
              />
            </div>
            <div className="col-md-6">
              <input
                className="form-control"
                placeholder="Prix"
                type="number"
                value={form.price}
                onChange={(e) => setForm({ ...form, price: e.target.value })}
              />
            </div>
            <div className="col-md-6">
              <input
                className="form-control"
                placeholder="Description"
                value={form.description}
                onChange={(e) => setForm({ ...form, description: e.target.value })}
              />
            </div>
            <div className="col-md-6">
              <input
                className="form-control"
                placeholder="Quantité en stock"
                type="number"
                value={form.stockQuantity}
                onChange={(e) => setForm({ ...form, stockQuantity: e.target.value })}
              />
            </div>
            <div className="col-12">
              <button 
                className={`btn ${editingProductId ? 'btn-warning' : 'btn-success'}`}
                onClick={handleCreateOrUpdate}
              >
                {editingProductId ? 'Mettre à jour' : 'Créer'}
              </button>
              {editingProductId && (
                <button 
                  className="btn btn-outline-secondary ms-2"
                  onClick={() => {
                    setForm({ name: '', price: '', description: '', stockQuantity: '' });
                    setEditingProductId(null);
                  }}
                >
                  Annuler
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
      
      <div className="table-responsive">
        <table className="table table-striped table-hover">
          <thead className="table-light">
            <tr>
              <th>Nom</th>
              <th>Prix</th>
              <th>Stock</th>
              <th>Description</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {products.map((product) => (
              <tr key={product._id}>
                <td>{product.name}</td>
                <td>{product.price} €</td>
                <td>{product.stockQuantity}</td>
                <td>{product.description}</td>
                <td>
                  <button 
                    className="btn btn-sm btn-outline-primary me-2"
                    onClick={() => handleEdit(product)}
                  >
                    Modifier
                  </button>
                  <button 
                    className="btn btn-sm btn-outline-danger"
                    onClick={() => handleDelete(product._id)}
                  >
                    Supprimer
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default ManageProductsPage;