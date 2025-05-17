import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { getProducts } from '../api/api';
import './HomePage.css'; // Crée ce fichier pour le style custom

const initialReviews = [
  { name: "Sami", comment: "Super service et livraison rapide !", date: "2025-05-15", rating: 5 },
  { name: "Nadia", comment: "Produits de qualité, je recommande.", date: "2025-05-14", rating: 4 },
  { name: "Youssef", comment: "Bon rapport qualité/prix.", date: "2025-05-13", rating: 4 }
];

const HomePage = () => {
  const [products, setProducts] = useState([]);
  const [reviews, setReviews] = useState(initialReviews);
  const [reviewForm, setReviewForm] = useState({ name: '', comment: '', rating: 5 });
  const navigate = useNavigate();

  useEffect(() => {
    // Récupère les produits pour la section "nouveaux produits"
    getProducts().then(res => {
      setProducts(res.data.slice(-3).reverse()); // Les 3 derniers produits
    });
  }, []);


  const handleReviewSubmit = (e) => {
    e.preventDefault();
    if (!reviewForm.name || !reviewForm.comment) return;
    setReviews([
      { ...reviewForm, date: new Date().toISOString().slice(0, 10) },
      ...reviews
    ]);
    setReviewForm({ name: '', comment: '', rating: 5 });
  };

  return (
    <div>
      {/* Hero Section */}
      <header className="hero-section d-flex align-items-center">
        <div className="container text-center">
          <h1 className="display-4 fw-bold mb-3">Bienvenue sur mon site web</h1>
          <p className="lead mb-4">Découvrez nos produits  au meilleur prix, livraison rapide et service client à votre écoute.</p>
          <Link to="/products" className="btn btn-primary btn-lg shadow">Voir les produits</Link>
        </div>
      </header>

      {/* Section Description Entreprise */}
      <section className="container py-5">
        <div className="row align-items-center">
          <div className="col-md-6 mb-4 mb-md-0">
            <img src="/logo512.png" alt="ParaPharma" className="img-fluid rounded-4 shadow" style={{maxWidth: 320}} />
          </div>
          <div className="col-md-6">
            <h1 className="fw-bold text-primary mb-3">Bienvenue chez ParaPharma</h1>
            <p className="lead">
              ParaPharma est votre partenaire de confiance pour tous vos besoins en parapharmacie. Nous proposons une large gamme de produits certifiés, une livraison rapide partout au Maroc et un service client à votre écoute 7j/7.
            </p>
            <p>
              Notre mission : vous offrir le meilleur de la santé et du bien-être, au meilleur prix.
            </p>
          </div>
        </div>
      </section>

      {/* Section Nouveaux Produits */}
      <section className="container py-5">
        <h2 className="text-center mb-4 fw-bold">Nouveaux Produits</h2>
        <div className="row row-cols-1 row-cols-md-3 g-4">
          {products.map(product => (
            <div className="col" key={product._id}>
              <div
                className="card h-100 product-card"
                style={{ cursor: 'pointer' }}
                onClick={() => navigate('/Products')}
              >
                {product.images?.[0] && (
                  <img
                    src={`http://localhost:5002${product.images[0]}`}
                    className="card-img-top"
                    alt={product.name}
                    style={{ objectFit: 'cover', height: '180px' }}
                  />
                )}
                <div className="card-body">
                  <h5 className="card-title text-primary">{product.name}</h5>
                  <p className="card-text">{product.description}</p>
                  <span className="badge bg-info text-dark">{product.category}</span>
                </div>
                <div className="card-footer d-flex justify-content-between align-items-center bg-white border-0">
                  <span className="fw-bold text-success">{product.price} DH</span>
                  <span className="badge bg-secondary">Stock: {product.stockQuantity}</span>
                </div>
              </div>
            </div>
          ))}
          {products.length === 0 && (
            <div className="text-center text-muted py-5">Aucun produit récent.</div>
          )}
        </div>
      </section>

            {/* Catégories ou avantages */}
                    <h2 className="text-center mb-4 fw-bold">Nos service</h2>
      <section className="container py-5">
        <div className="row g-4">
          <div className="col-md-4">
            <div className="feature-card text-center p-4 h-100">
              <i className="bi bi-truck fs-1 text-primary mb-3"></i>
              <h5>Livraison rapide</h5>
              <p>Recevez vos commandes en 24/48h partout au Maroc.</p>
            </div>
          </div>
          <div className="col-md-4">
            <div className="feature-card text-center p-4 h-100">
              <i className="bi bi-shield-check fs-1 text-primary mb-3"></i>
              <h5>Produits certifiés</h5>
              <p>Des produits de qualité, testés et approuvés par nos experts.</p>
            </div>
          </div>
          <div className="col-md-4">
            <div className="feature-card text-center p-4 h-100">
              <i className="bi bi-headset fs-1 text-primary mb-3"></i>
              <h5>Support 7j/7</h5>
              <p>Notre équipe est à votre écoute pour toute question ou conseil.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Section Avis Clients */}
      <section className="container py-5">
        <h2 className="text-center mb-4 fw-bold">Avis des Clients</h2>
        <div className="row g-4 mb-4">
          {reviews.slice(0, 3).map((r, idx) => (
            <div className="col-md-4" key={idx}>
              <div className="card shadow-sm border-0 h-100">
                <div className="card-body">
                  <div className="mb-2">
                    {[...Array(5)].map((_, i) => (
                      <i key={i} className={`bi ${i < r.rating ? 'bi-star-fill text-warning' : 'bi-star text-muted'}`}></i>
                    ))}
                  </div>
                  <p className="card-text fst-italic">"{r.comment}"</p>
                  <div className="d-flex justify-content-between align-items-center">
                    <span className="fw-bold">{r.name}</span>
                    <span className="text-muted small">{r.date}</span>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Formulaire d'ajout d'avis */}
        <div className="card mx-auto" style={{maxWidth: 500}}>
          <div className="card-body">
            <h5 className="card-title mb-3">Laisser un avis</h5>
            <form onSubmit={handleReviewSubmit}>
              <div className="mb-2">
                <input
                  type="text"
                  className="form-control"
                  placeholder="Votre nom"
                  value={reviewForm.name}
                  onChange={e => setReviewForm({ ...reviewForm, name: e.target.value })}
                  required
                />
              </div>
              <div className="mb-2">
                <textarea
                  className="form-control"
                  placeholder="Votre avis"
                  value={reviewForm.comment}
                  onChange={e => setReviewForm({ ...reviewForm, comment: e.target.value })}
                  required
                />
              </div>
              <div className="mb-2 d-flex align-items-center">
                <span className="me-2">Évaluation :</span>
                {[1,2,3,4,5].map(star => (
                  <i
                    key={star}
                    className={`bi ${reviewForm.rating >= star ? 'bi-star-fill text-warning' : 'bi-star text-muted'}`}
                    style={{cursor: 'pointer', fontSize: '1.3rem'}}
                    onClick={() => setReviewForm({ ...reviewForm, rating: star })}
                  ></i>
                ))}
              </div>
              <button className="btn btn-primary mt-2" type="submit">Envoyer l'avis</button>
            </form>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="footer mt-auto py-3 bg-light text-center">
        <div className="container">
          <span className="text-muted">&copy; {new Date().getFullYear()} ParaPharma. Tous droits réservés.</span>
        </div>
      </footer>
    </div>
  );
};

export default HomePage;