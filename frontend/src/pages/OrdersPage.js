import { useEffect, useState } from 'react';
import { getOrders, createOrder, getProducts } from '../api/api';

function OrdersPage() {
  const [orders, setOrders] = useState([]);
  const [products, setProducts] = useState([]);
  const [productId, setProductId] = useState('');

  const token = localStorage.getItem('token');

  useEffect(() => {
    // Charger les commandes et les produits
    getOrders().then(res => setOrders(res.data));
    getProducts().then(res => setProducts(res.data));
  }, []);

  const handleOrder = () => {
    createOrder({ productId, quantity: 1 }, token).then(() => {
      alert('Commande passée');
      // Recharger la liste après commande
      getOrders().then(res => setOrders(res.data));
    });
  };

  const getProductName = (id) => {
    const product = products.find(p => p._id === id);
    return product ? product.name : 'Produit inconnu';
  };

  return (
    <div>
      <h2>Commandes</h2>

      <input
        placeholder="ID produit"
        value={productId}
        onChange={(e) => setProductId(e.target.value)}
      />
      <button onClick={handleOrder}>Acheter</button>

      <ul>
        {orders.map(o => (
          <li key={o._id}>
            <strong>Nom du produit :</strong> {getProductName(o.productId)}<br />
            <strong>Quantité :</strong> {o.quantity}
          </li>
        ))}
      </ul>
    </div>
  );
}

export default OrdersPage;
