import { useEffect, useState } from 'react';
import { getOrders, getProducts, updateOrder, deleteOrder } from '../api/api';

function OrdersPage() {
  const [orders, setOrders] = useState([]);
  const [products, setProducts] = useState([]);

  useEffect(() => {
    // Charger les commandes et les produits
    getOrders().then(res => setOrders(res.data));
    getProducts().then(res => setProducts(res.data));
  }, []);

  const getProductName = (id) => {
    const product = products.find(p => p._id === id);
    return product ? product.name : 'Produit inconnu';
  };

  const handleCancel = async (id) => {
    try {
      await deleteOrder(id);
      alert('Commande annulée avec succès.');
      setOrders(orders.filter(order => order._id !== id));
    } catch (err) {
      console.error('Erreur lors de l\'annulation de la commande:', err);
    }
  };

  const handleUpdate = async (id) => {
    const newQuantity = prompt('Entrez la nouvelle quantité :');
    if (!newQuantity) return;

    try {
      const updatedOrder = await updateOrder(id, { quantity: newQuantity });
      setOrders(orders.map(order => (order._id === id ? updatedOrder.data : order)));
      alert('Commande mise à jour avec succès.');
    } catch (err) {
      console.error('Erreur lors de la mise à jour de la commande:', err);
    }
  };

  return (
    <div>
      <h2>Commandes</h2>
      <ul>
        {orders.map(o => (
          <li key={o._id}>
            <strong>Nom du produit :</strong> {getProductName(o.productId)}<br />
            <strong>Quantité :</strong> {o.quantity}<br />
            <strong>Statut :</strong> {o.status}<br />
            <button onClick={() => handleUpdate(o._id)}>Modifier</button>
            <button onClick={() => handleCancel(o._id)}>Annuler</button>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default OrdersPage;
