import React, { useEffect, useState } from 'react';
import { getProducts, createProduct, updateProduct, deleteProduct } from '../api/api';
import 'bootstrap/dist/css/bootstrap.min.css';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const ManageProductsPage = () => {
  const [products, setProducts] = useState([]);
  const [form, setForm] = useState({ name: '', price: '', description: '', stockQuantity: '', category: '' });
  const [images, setImages] = useState([]);
  const [editingProductId, setEditingProductId] = useState(null);
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      const response = await getProducts();
      setProducts(response.data);
    } catch (error) {
      toast.error("Erreur lors du chargement des produits");
    }
  };

  const handleCreateOrUpdate = async () => {
    if (!form.name || !form.price || !form.description || !form.stockQuantity || !form.category) {
      toast.error('Veuillez remplir tous les champs');
      return;
    }
    try {
      const formData = new FormData();
      Object.entries(form).forEach(([key, value]) => formData.append(key, value));
      images.forEach(img => formData.append('images', img));

      if (editingProductId) {
        await updateProduct(editingProductId, formData, true);
        toast.success('Produit mis à jour avec succès');
      } else {
        await createProduct(formData, true);
        toast.success('Produit créé avec succès');
      }

      resetForm();
      fetchProducts();
      setShowModal(false);
    } catch (error) {
      console.log(error); // Ajoute ceci pour voir l'erreur dans la console
      toast.error('Une erreur s\'est produite');
    }
  };

  const handleEdit = (product) => {
    setForm({
      name: product.name || '',
      price: product.price || '',
      description: product.description || '',
      stockQuantity: product.stockQuantity || '',
      category: product.category || ''
    });
    setEditingProductId(product._id);
    setImages([]);
    setShowModal(true);
  };

  const handleDelete = async (id) => {
    if (window.confirm('Êtes-vous sûr de vouloir supprimer ce produit ?')) {
      try {
        await deleteProduct(id);
        toast.info('Produit supprimé avec succès');
        fetchProducts();
      } catch {
        toast.error('Erreur lors de la suppression');
      }
    }
  };

  const resetForm = () => {
    setForm({ name: '', price: '', description: '', stockQuantity: '', category: '' });
    setImages([]);
    setEditingProductId(null);
  };

  return (
    <div className="container py-4">
      <h1 className="text-center text-primary mb-5 fw-bold">Gestion des Produits</h1>

      {/* === Ajouter Produit Card === */}
      <div className="card shadow border-0 mb-4">
        <div className="card-body">
          <h4 className="mb-3">Ajouter un nouveau produit</h4>
          <div className="row g-3">
            {['name', 'price', 'description', 'stockQuantity', 'category'].map((field, idx) => (
              <div className="col-md-6" key={idx}>
                <input
                  className="form-control"
                  placeholder={field.charAt(0).toUpperCase() + field.slice(1)}
                  type={['price', 'stockQuantity'].includes(field) ? 'number' : 'text'}
                  value={form[field]}
                  onChange={(e) => setForm({ ...form, [field]: e.target.value })}
                />
              </div>
            ))}
            <div className="col-md-6">
              <input
                className="form-control"
                type="file"
                multiple
                onChange={e => setImages(Array.from(e.target.files))}
              />
            </div>
            <div className="col-12">
              <button className="btn btn-success" onClick={handleCreateOrUpdate}>
                Créer
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* === Table Produits === */}
      <div className="table-responsive shadow-sm">
        <table className="table table-hover align-middle shadow rounded-4 overflow-hidden" style={{ background: "#fff" }}>
          <thead className="table-primary">
            <tr>
              <th>Nom</th>
              <th>Prix</th>
              <th>Stock</th>
              <th>Catégorie</th>
              <th>Description</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {products.length === 0 ? (
              <tr><td colSpan="6" className="text-center">Aucun produit trouvé.</td></tr>
            ) : (
              products.map((product) => (
                <tr key={product._id}>
                  <td className="fw-bold">{product.name}</td>
                  <td>{product.price} DH</td>
                  <td><span className="badge bg-light text-dark">{product.stockQuantity}</span></td>
                  <td><span className="badge bg-info text-dark">{product.category}</span></td>
                  <td>{product.description}</td>
                  <td>
                    <button className="btn btn-sm btn-outline-primary me-2" onClick={() => handleEdit(product)}>
                      Modifier
                    </button>
                    <button className="btn btn-sm btn-outline-danger" onClick={() => handleDelete(product._id)}>
                      Supprimer
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* === Modal de modification === */}
      {showModal && (
        <div className="modal fade show" tabIndex="-1" style={{ display: 'block' }}>
          <div className="modal-dialog modal-lg">
            <div className="modal-content shadow">
              <div className="modal-header">
                <h5 className="modal-title">Modifier le produit</h5>
                <button type="button" className="btn-close" onClick={() => { resetForm(); setShowModal(false); }}></button>
              </div>
              <div className="modal-body">
                <div className="row g-3">
                  {['name', 'price', 'description', 'stockQuantity', 'category'].map((field, idx) => (
                    <div className="col-md-6" key={idx}>
                      <input
                        className="form-control"
                        placeholder={field.charAt(0).toUpperCase() + field.slice(1)}
                        type={['price', 'stockQuantity'].includes(field) ? 'number' : 'text'}
                        value={form[field]}
                        onChange={(e) => setForm({ ...form, [field]: e.target.value })}
                      />
                    </div>
                  ))}
                  <div className="col-md-6">
                    <input
                      className="form-control"
                      type="file"
                      multiple
                      onChange={e => setImages(Array.from(e.target.files))}
                    />
                  </div>
                </div>
              </div>
              <div className="modal-footer">
                <button className="btn btn-secondary" onClick={() => { resetForm(); setShowModal(false); }}>Annuler</button>
                <button className="btn btn-warning" onClick={handleCreateOrUpdate}>Mettre à jour</button>
              </div>
            </div>
          </div>
        </div>
      )}

      <ToastContainer position="top-right" autoClose={3000} />
    </div>
  );
};

export default ManageProductsPage;
