import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { getProducts } from '../api/api';
import './HomePage.css'; 

const initialReviews = [
  { name: "Mohamed", comment: "Super service et livraison rapide !", date: "2025-05-15", rating: 5 },
  { name: "Younes", comment: "Produits de qualité, je recommande.", date: "2025-05-14", rating: 4 },
  { name: "Ismail", comment: "Bon rapport qualité/prix.", date: "2025-05-13", rating: 4 },

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

    {/* Section Présentation de l'entreprise */}
<section className="container py-5">
  <div className="row align-items-center">
    {/* Logo ou image illustrative */}
    <div className="col-md-6 mb-4 mb-md-0 text-center">
      <img
        src="/logoSysteme.png" // placé dans le dossier public
        alt="Présentation entreprise"
        className="img-fluid rounded-4 shadow"
        style={{ maxWidth: '350px' }}
      />
    </div>

    {/* Texte de présentation */}
    <div className="col-md-6">
      <h2 className="fw-bold text-primary mb-3">Bienvenue chez Le meilleur Site E-commerce</h2>
      <p className="lead text-dark">
        E-CO est votre plateforme e-commerce de confiance dédiée à tous vos besoins du quotidien. Que ce soit pour votre bien-être, votre maison ou votre famille, nous vous proposons des produits de qualité à portée de clic.
      </p>
      <p className="text-muted">
        Notre mission est de simplifier votre expérience d'achat en ligne avec une navigation intuitive, un paiement sécurisé et une variété de produits soigneusement sélectionnés.
      </p>
      <p className="fw-semibold">Faites vos achats en toute confiance, où que vous soyez au Maroc.</p>
    </div>
  </div>
</section>


      {/* Section Nouveaux Produits */}
<section className="container py-5">
  <h2 className="text-center mb-4 fw-bold">Nouveaux Produits</h2>

  {Object.entries(
    products.reduce((acc, product) => {
      if (!acc[product.category]) {
        acc[product.category] = [];
      }
      // Limiter à 3 produits par catégorie
      if (acc[product.category].length < 3) {
        acc[product.category].push(product);
      }
      return acc;
    }, {})
  ).map(([category, productsByCategory]) => (
    <div key={category} className="mb-5">
      <h4 className="mb-3 text-capitalize text-info">{category}</h4>
      <div className="row row-cols-1 row-cols-md-3 g-4">
        {productsByCategory.map(product => (
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
      </div>
    </div>
  ))}

  {products.length === 0 && (
    <div className="text-center text-muted py-5">Aucun produit récent.</div>
  )}
</section>


   {/* Section Nos Services */}
<section className="container py-5">
  <h2 className="text-center mb-5 fw-bold">Nos Services</h2>
  <div className="row g-4">
    {/* Livraison rapide */}
    <div className="col-md-4">
      <div className="text-center p-4 border rounded-4 shadow-sm h-100 bg-white hover-shadow">
        <div className="mb-3">
          <i className="bi bi-truck fs-1 text-primary"></i>
        </div>
        <h5 className="fw-semibold">Livraison rapide</h5>
        <p className="text-muted">Recevez vos commandes en 24/48h partout au Maroc.</p>
      </div>
    </div>

    {/* Produits certifiés */}
    <div className="col-md-4">
      <div className="text-center p-4 border rounded-4 shadow-sm h-100 bg-white hover-shadow">
        <div className="mb-3">
          <i className="bi bi-shield-check fs-1 text-success"></i>
        </div>
        <h5 className="fw-semibold">Produits certifiés</h5>
        <p className="text-muted">Des produits de qualité, testés et approuvés par nos experts.</p>
      </div>
    </div>

    {/* Support client */}
    <div className="col-md-4">
      <div className="text-center p-4 border rounded-4 shadow-sm h-100 bg-white hover-shadow">
        <div className="mb-3">
          <i className="bi bi-headset fs-1 text-info"></i>
        </div>
        <h5 className="fw-semibold">Support 7j/7</h5>
        <p className="text-muted">Notre équipe est à votre écoute pour toute question ou conseil.</p>
      </div>
    </div>
  </div>
</section>


     {/* Section Avis Clients */}
<section className="container py-5">
  <h2 className="text-center mb-5 fw-bold">Avis des Clients</h2>

  {/* Témoignages */}
  <div className="row g-4 mb-5">
    {reviews.slice(0, 3).map((r, idx) => (
      <div className="col-md-4" key={idx}>
        <div className="card border-0 shadow-lg h-100 rounded-4 p-3">
          <div className="card-body d-flex flex-column">
            <div className="mb-3">
              {[...Array(5)].map((_, i) => (
                <i
                  key={i}
                  className={`bi ${i < r.rating ? 'bi-star-fill text-warning' : 'bi-star text-muted'}`}
                  style={{ fontSize: '1.2rem' }}
                ></i>
              ))}
            </div>
            <p className="card-text fst-italic flex-grow-1">"{r.comment}"</p>
            <div className="d-flex justify-content-between align-items-center mt-3">
              <span className="fw-bold">{r.name}</span>
              <span className="text-muted small">{r.date}</span>
            </div>
          </div>
        </div>
      </div>
    ))}
    {reviews.length === 0 && (
      <div className="text-center text-muted">Aucun avis pour le moment.</div>
    )}
  </div>

  {/* Formulaire d'ajout d’avis */}
  <div className="card mx-auto shadow border-0 rounded-4" style={{ maxWidth: 500 }}>
    <div className="card-body">
      <h5 className="card-title fw-bold mb-3 text-center">Laissez votre avis</h5>
      <form onSubmit={handleReviewSubmit}>
        <div className="mb-3">
          <input
            type="text"
            className="form-control"
            placeholder="Votre nom"
            value={reviewForm.name}
            onChange={e => setReviewForm({ ...reviewForm, name: e.target.value })}
            required
          />
        </div>
        <div className="mb-3">
          <textarea
            className="form-control"
            placeholder="Votre avis"
            rows="3"
            value={reviewForm.comment}
            onChange={e => setReviewForm({ ...reviewForm, comment: e.target.value })}
            required
          />
        </div>
        <div className="mb-3 d-flex align-items-center">
          <span className="me-2">Évaluation :</span>
          {[1, 2, 3, 4, 5].map(star => (
            <i
              key={star}
              className={`bi ${reviewForm.rating >= star ? 'bi-star-fill text-warning' : 'bi-star text-muted'}`}
              style={{ cursor: 'pointer', fontSize: '1.5rem' }}
              onClick={() => setReviewForm({ ...reviewForm, rating: star })}
            ></i>
          ))}
        </div>
        <div className="text-center">
          <button className="btn btn-primary px-4 rounded-pill" type="submit">
            Envoyer l'avis
          </button>
        </div>
      </form>
    </div>
  </div>
</section>


      {/* Footer Moderne */}
<footer className="bg-dark text-light pt-5 pb-3 mt-auto">
  <div className="container">
    <div className="row">
      {/* Logo / Nom du site */}
      <div className="col-md-3 mb-4">
        <h5 className="text-uppercase fw-bold">E-commerce</h5>
        <p>Votre bien-être, notre priorité.</p>
      </div>

      {/* Liens rapides */}
      <div className="col-md-3 mb-4">
        <h6 className="text-uppercase fw-bold mb-3">Navigation</h6>
        <ul className="list-unstyled">
          <li><a href="/" className="text-light text-decoration-none">Accueil</a></li>
          <li><a href="/Products" className="text-light text-decoration-none">Produits</a></li>
          <li><a href="/about" className="text-light text-decoration-none">À propos</a></li>
          <li><a href="/contact" className="text-light text-decoration-none">Contact</a></li>
        </ul>
      </div>

      {/* Informations */}
      <div className="col-md-3 mb-4">
        <h6 className="text-uppercase fw-bold mb-3">Informations</h6>
        <ul className="list-unstyled">
          <li><a href="/privacy" className="text-light text-decoration-none">Politique de confidentialité</a></li>
          <li><a href="/terms" className="text-light text-decoration-none">Conditions générales</a></li>
          <li><a href="/faq" className="text-light text-decoration-none">FAQ</a></li>
        </ul>
      </div>

      {/* Réseaux sociaux */}
      <div className="col-md-3 mb-4">
        <h6 className="text-uppercase fw-bold mb-3">Suivez-nous</h6>
        <div>
          <a href="https://facebook.com" target="_blank" rel="noreferrer" className="text-light me-3 fs-5">
            <i className="fab fa-facebook-f"></i>
          </a>
          <a href="https://instagram.com" target="_blank" rel="noreferrer" className="text-light me-3 fs-5">
            <i className="fab fa-instagram"></i>
          </a>
          <a href="https://twitter.com" target="_blank" rel="noreferrer" className="text-light fs-5">
            <i className="fab fa-twitter"></i>
          </a>
        </div>
      </div>
    </div>

    <hr className="border-secondary" />
    <div className="text-center">
      <small className="text-muted">&copy; {new Date().getFullYear()} ParaPharma. Tous droits réservés.</small>
    </div>
  </div>
</footer>

    </div>
  );
};

export default HomePage;