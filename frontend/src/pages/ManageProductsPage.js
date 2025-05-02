import React, { useEffect, useState } from 'react';
import { getProducts, createProduct, updateProduct, deleteProduct } from '../api/api';

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
  };

  const handleEdit = (product) => {
    setForm(product);
    setEditingProductId(product._id);
  };

  const handleDelete = async (id) => {
    await deleteProduct(id);
    alert('Produit supprimé avec succès');
    fetchProducts();
  };

  return (
    <div>
      <h1>Gestion des Produits</h1>
      <div>
        <input
          placeholder="Nom"
          value={form.name}
          onChange={(e) => setForm({ ...form, name: e.target.value })}
        />
        <input
          placeholder="Prix"
          type="number"
          value={form.price}
          onChange={(e) => setForm({ ...form, price: e.target.value })}
        />
        <input
          placeholder="Description"
          value={form.description}
          onChange={(e) => setForm({ ...form, description: e.target.value })}
        />
        <input
          placeholder="Quantité en stock"
          type="number"
          value={form.stockQuantity}
          onChange={(e) => setForm({ ...form, stockQuantity: e.target.value })}
        />
        <button onClick={handleCreateOrUpdate}>
          {editingProductId ? 'Mettre à jour' : 'Créer'}
        </button>
      </div>
      <ul>
        {products.map((product) => (
          <li key={product._id}>
            <strong>{product.name}</strong> - {product.price} € - {product.stockQuantity} en stock
            <button onClick={() => handleEdit(product)}>Modifier</button>
            <button onClick={() => handleDelete(product._id)}>Supprimer</button>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default ManageProductsPage;