import { useEffect, useState } from 'react';
import { getOrders, getProducts, updateOrder, deleteOrder } from '../api/api';
import 'bootstrap/dist/css/bootstrap.min.css';

function OrdersPage() {
  const [orders, setOrders] = useState([]);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const [ordersRes, productsRes] = await Promise.all([
          getOrders(),
          getProducts()
        ]);
        setOrders(ordersRes.data);
        setProducts(productsRes.data);
      } catch (error) {
        console.error('Erreur lors du chargement des données:', error);
      } finally {
        setLoading(false);
      }
    };
    
    fetchData();
  }, []);

  const getProductName = (id) => {
    const product = products.find(p => p._id === id);
    return product ? product.name : 'Produit inconnu';
  };

  const handleCancel = async (id) => {
    if (window.confirm('Êtes-vous sûr de vouloir annuler cette commande?')) {
      try {
        await deleteOrder(id);
        alert('Commande annulée avec succès.');
        setOrders(orders.filter(order => order._id !== id));
      } catch (err) {
        console.error('Erreur lors de l\'annulation de la commande:', err);
        alert('Erreur lors de l\'annulation de la commande');
      }
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
      alert('Erreur lors de la mise à jour de la commande');
    }
  };

  const getStatusBadge = (status) => {
    const statusClasses = {
      'pending': 'bg-warning',
      'completed': 'bg-success',
      'cancelled': 'bg-danger',
      'processing': 'bg-info'
    };
    
    return statusClasses[status?.toLowerCase()] || 'bg-secondary';
  };

  if (loading) {
    return (
      <div className="container py-4">
      <div className="container py-4 text-center">
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">Chargement...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="container py-4">
      <h2 className="text-center text-primary mb-4">Gestion des Commandes</h2>
      
      {orders.length === 0 ? (
        <div className="alert alert-info" role="alert">
          Aucune commande disponible pour le moment.
        </div>
      ) : (
        <div className="row">
          {orders.map(o => (
            <div key={o._id} className="col-md-6 col-lg-4 mb-4">
              <div className="card shadow-sm h-100">
                <div className="card-header d-flex justify-content-between align-items-center">
                  <h5 className="card-title mb-0">Commande #{o._id.slice(-5)}</h5>
                  <span className={`badge ${getStatusBadge(o.status)}`}>{o.status}</span>
                </div>
                <div className="card-body">
                  <p className="card-text"><strong>Produit :</strong> {getProductName(o.productId)}</p>
                  <p className="card-text"><strong>Quantité :</strong> {o.quantity}</p>
                </div>
                <div className="card-footer bg-transparent d-flex justify-content-between">
                  <button onClick={() => handleUpdate(o._id)} className="btn btn-outline-primary">
                    Modifier
                  </button>
                  <button onClick={() => handleCancel(o._id)} className="btn btn-outline-danger">
                    Annuler
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
    </div>
  );
}
}

export default OrdersPage;