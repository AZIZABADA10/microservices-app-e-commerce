import React, { useState, useEffect } from 'react';
import { getCart, updateCartItem, removeFromCart } from '../api/api';
import { ToastContainer, toast } from 'react-toastify';
import { Modal } from 'react-bootstrap';

const CartPage = () => {
  const [cart, setCart] = useState({ items: [], total: 0 });
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [paymentForm, setPaymentForm] = useState({
    cardNumber: '',
    expiryDate: '',
    cvv: ''
  });

  useEffect(() => {
    fetchCart();
  }, []);

  const fetchCart = async () => {
    try {
      const user = JSON.parse(localStorage.getItem('user'));
      if (!user) {
        toast.error("Veuillez vous connecter");
        return;
      }
      const response = await getCart(user._id);
      setCart(response.data || { items: [], total: 0 });
    } catch (error) {
      toast.error("Erreur lors du chargement du panier");
    }
  };

  const handleUpdateQuantity = async (productId, quantity) => {
    try {
      await updateCartItem("user123", productId, quantity);
      fetchCart();
    } catch (error) {
      toast.error("Erreur lors de la mise à jour");
    }
  };

  const handleRemoveItem = async (productId) => {
    try {
      await removeFromCart("user123", productId);
      fetchCart();
      toast.success("Produit retiré du panier");
    } catch (error) {
      toast.error("Erreur lors de la suppression");
    }
  };

  const handlePayment = async (e) => {
    e.preventDefault();
    try {
      // Créer la commande
      const orderData = {
        items: cart.items,
        total: cart.total,
        payment: paymentForm,
        status: 'pending'
      };

      // Appeler le service de commande
      const response = await fetch('http://localhost:5003/api/orders', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(orderData)
      });

      if (response.ok) {
        toast.success("Commande créée avec succès!");
        setShowPaymentModal(false);
        // Vider le panier après la commande
        setCart({ items: [], total: 0 });
      }
    } catch (error) {
      toast.error("Erreur lors de la création de la commande");
    }
  };

  return (
    <div className="container py-4">
      <ToastContainer />
      <h1 className="text-center mb-4">Mon Panier</h1>
      
      {cart.items.length === 0 ? (
        <div className="text-center py-5">
          <h3>Votre panier est vide</h3>
          <p>Ajoutez des produits pour commencer vos achats</p>
        </div>
      ) : (
        <>
          <div className="card shadow-sm">
            {cart.items.map((item) => (
              <div key={item.productId} className="card-body border-bottom">
                <div className="row align-items-center">
                  <div className="col-md-2">
                    <img
                      src={item.image ? `http://localhost:5002${item.image}` : '/placeholder.jpg'}
                      alt={item.name}
                      className="img-fluid rounded"
                    />
                  </div>
                  <div className="col-md-4">
                    <h5 className="mb-0">{item.name}</h5>
                    <p className="text-muted mb-0">{item.price} DH</p>
                  </div>
                  <div className="col-md-3">
                    <div className="input-group">
                      <button
                        className="btn btn-outline-secondary"
                        type="button"
                        onClick={() => handleUpdateQuantity(item.productId, Math.max(1, item.quantity - 1))}
                      >
                        -
                      </button>
                      <input
                        type="number"
                        className="form-control text-center"
                        value={item.quantity}
                        readOnly
                      />
                      <button
                        className="btn btn-outline-secondary"
                        type="button"
                        onClick={() => handleUpdateQuantity(item.productId, item.quantity + 1)}
                      >
                        +
                      </button>
                    </div>
                  </div>
                  <div className="col-md-2 text-end">
                    <p className="fw-bold mb-0">{(item.price * item.quantity).toFixed(2)} DH</p>
                  </div>
                  <div className="col-md-1">
                    <button
                      className="btn btn-outline-danger btn-sm"
                      onClick={() => handleRemoveItem(item.productId)}
                    >
                      <i className="bi bi-trash"></i>
                    </button>
                  </div>
                </div>
              </div>
            ))}
            <div className="card-footer">
              <div className="d-flex justify-content-between align-items-center">
                <h4 className="mb-0">Total</h4>
                <h4 className="mb-0">{cart.total.toFixed(2)} DH</h4>
              </div>
            </div>
          </div>
          <div className="d-grid gap-2 col-md-4 mx-auto mt-4">
            <button className="btn btn-primary btn-lg" onClick={() => setShowPaymentModal(true)}>
              Procéder au paiement
            </button>
          </div>
        </>
      )}

      <Modal show={showPaymentModal} onHide={() => setShowPaymentModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Paiement</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <form onSubmit={handlePayment}>
            <div className="mb-3">
              <label className="form-label">Numéro de carte</label>
              <input
                type="text"
                className="form-control"
                value={paymentForm.cardNumber}
                onChange={(e) => setPaymentForm({
                  ...paymentForm,
                  cardNumber: e.target.value
                })}
                required
              />
            </div>
            <div className="row mb-3">
              <div className="col">
                <label className="form-label">Date d'expiration</label>
                <input
                  type="text"
                  className="form-control"
                  placeholder="MM/YY"
                  value={paymentForm.expiryDate}
                  onChange={(e) => setPaymentForm({
                    ...paymentForm,
                    expiryDate: e.target.value
                  })}
                  required
                />
              </div>
              <div className="col">
                <label className="form-label">CVV</label>
                <input
                  type="text"
                  className="form-control"
                  value={paymentForm.cvv}
                  onChange={(e) => setPaymentForm({
                    ...paymentForm,
                    cvv: e.target.value
                  })}
                  required
                />
              </div>
            </div>
            <button type="submit" className="btn btn-primary w-100">
              Payer {cart.total.toFixed(2)} DH
            </button>
          </form>
        </Modal.Body>
      </Modal>
    </div>
  );
};

export default CartPage;