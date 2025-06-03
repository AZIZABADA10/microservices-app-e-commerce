import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Modal } from 'react-bootstrap';
import { jsPDF } from 'jspdf';
import 'jspdf-autotable';

const CheckoutPage = () => {
    const [orderInfo, setOrderInfo] = useState({
        customer: JSON.parse(localStorage.getItem('user')) || {},
        items: [],
        total: 0
    });
    const [showPaymentModal, setShowPaymentModal] = useState(false);
    const [paymentInfo, setPaymentInfo] = useState({
        cardNumber: '',
        expiryDate: '',
        cvv: ''
    });
    const navigate = useNavigate();

    useEffect(() => {
        const cartData = JSON.parse(localStorage.getItem('cart')) || {};
        setOrderInfo(prev => ({
            ...prev,
            items: cartData.items || [],
            total: cartData.total || 0
        }));
    }, []);

    const generatePDF = () => {
        const doc = new jsPDF();
        const logoImg = new Image();
        logoImg.src = '../../public/logoSysteme.png';

        // En-tête
        doc.addImage(logoImg, 'PNG', 10, 10, 50, 20);
        doc.setFontSize(20);
        doc.text('Facture', 105, 20, 'center');

        // Informations client
        doc.setFontSize(12);
        doc.text(`Client: ${orderInfo.customer.firstName} ${orderInfo.customer.lastName}`, 10, 50);
        doc.text(`Email: ${orderInfo.customer.email}`, 10, 60);
        doc.text(`Téléphone: ${orderInfo.customer.phone}`, 10, 70);

        // Tableau des produits
        const tableColumn = ["Produit", "Quantité", "Prix unitaire", "Total"];
        const tableRows = orderInfo.items.map(item => [
            item.name,
            item.quantity,
            `${item.price} DH`,
            `${item.price * item.quantity} DH`
        ]);

        doc.autoTable({
            head: [tableColumn],
            body: tableRows,
            startY: 80,
            theme: 'striped'
        });

        // Total
        const finalY = doc.previousAutoTable.finalY + 10;
        doc.text(`Total: ${orderInfo.total} DH`, 150, finalY);

        // Sauvegarder le PDF
        doc.save('facture.pdf');
    };

    const handleConfirmPayment = async () => {
        try {
            // Appeler l'API pour créer la commande
            const response = await fetch('http://localhost:5003/api/orders', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${localStorage.getItem('token')}`
                },
                body: JSON.stringify({
                    items: orderInfo.items,
                    total: orderInfo.total,
                    payment: paymentInfo,
                    status: 'completed'
                })
            });

            if (response.ok) {
                generatePDF();
                // Vider le panier
                localStorage.removeItem('cart');
                navigate('/orders');
            }
        } catch (error) {
            console.error('Erreur lors du paiement:', error);
        }
    };

    return (
        <div className="container py-5">
            <h2 className="mb-4">Confirmation de commande</h2>

            {/* Informations client */}
            <div className="card mb-4">
                <div className="card-body">
                    <h5 className="card-title">Informations client</h5>
                    <p>Nom: {orderInfo.customer.firstName} {orderInfo.customer.lastName}</p>
                    <p>Email: {orderInfo.customer.email}</p>
                    <p>Téléphone: {orderInfo.customer.phone}</p>
                </div>
            </div>

            {/* Résumé de la commande */}
            <div className="card mb-4">
                <div className="card-body">
                    <h5 className="card-title">Produits commandés</h5>
                    <table className="table">
                        <thead>
                            <tr>
                                <th>Produit</th>
                                <th>Quantité</th>
                                <th>Prix unitaire</th>
                                <th>Total</th>
                            </tr>
                        </thead>
                        <tbody>
                            {orderInfo.items.map(item => (
                                <tr key={item.productId}>
                                    <td>{item.name}</td>
                                    <td>{item.quantity}</td>
                                    <td>{item.price} DH</td>
                                    <td>{item.price * item.quantity} DH</td>
                                </tr>
                            ))}
                            <tr className="table-active">
                                <td colSpan="3" className="text-end fw-bold">Total</td>
                                <td className="fw-bold">{orderInfo.total} DH</td>
                            </tr>
                        </tbody>
                    </table>
                </div>
            </div>

            <div className="d-grid gap-2 col-md-6 mx-auto">
                <button 
                    className="btn btn-primary btn-lg"
                    onClick={() => setShowPaymentModal(true)}
                >
                    Procéder au paiement
                </button>
            </div>

            {/* Modal de paiement */}
            <Modal show={showPaymentModal} onHide={() => setShowPaymentModal(false)}>
                <Modal.Header closeButton>
                    <Modal.Title>Paiement</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <form onSubmit={e => e.preventDefault()}>
                        <div className="mb-3">
                            <label className="form-label">Numéro de carte</label>
                            <input
                                type="text"
                                className="form-control"
                                value={paymentInfo.cardNumber}
                                onChange={e => setPaymentInfo({...paymentInfo, cardNumber: e.target.value})}
                            />
                        </div>
                        <div className="row mb-3">
                            <div className="col">
                                <label className="form-label">Date d'expiration</label>
                                <input
                                    type="text"
                                    className="form-control"
                                    placeholder="MM/YY"
                                    value={paymentInfo.expiryDate}
                                    onChange={e => setPaymentInfo({...paymentInfo, expiryDate: e.target.value})}
                                />
                            </div>
                            <div className="col">
                                <label className="form-label">CVV</label>
                                <input
                                    type="text"
                                    className="form-control"
                                    value={paymentInfo.cvv}
                                    onChange={e => setPaymentInfo({...paymentInfo, cvv: e.target.value})}
                                />
                            </div>
                        </div>
                        <button 
                            className="btn btn-primary w-100"
                            onClick={handleConfirmPayment}
                        >
                            Confirmer le paiement
                        </button>
                    </form>
                </Modal.Body>
            </Modal>
        </div>
    );
};

export default CheckoutPage;