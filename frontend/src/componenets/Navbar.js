import { Link, useNavigate, useLocation } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
import './Navbar.css';
import { Nav } from 'react-bootstrap';
import { useRef, useEffect } from 'react';
import Collapse from 'bootstrap/js/dist/collapse';

function Navbar() {
  const navigate = useNavigate();
  const location = useLocation();
  const collapseRef = useRef(null);

  const handleLogout = () => {
    localStorage.removeItem('token');
    navigate('/login');
  };

  const isLoggedIn = !!localStorage.getItem('token');
  const user = JSON.parse(localStorage.getItem('user'));
  const isAdmin = user?.role === 'ADMIN';

  const isActive = (path) => location.pathname === path;

  // Fermer le menu après clic
  const handleNavLinkClick = () => {
    if (collapseRef.current && window.innerWidth <= 991) {
      const bsCollapse = Collapse.getInstance(collapseRef.current) || new Collapse(collapseRef.current, { toggle: false });
      bsCollapse.hide();
    }
  };

  return (
    <>
      <nav className="navbar navbar-expand-lg navbar-light modern-navbar shadow-sm mb-4 fixed-top">
        <div className="container">
          <Link className="navbar-brand fw-bold text-primary fs-3" to="/" onClick={handleNavLinkClick}>
            <i className="bi bi-cart3 me-2"></i>E-co-maroc
          </Link>
          <button
            className="navbar-toggler"
            type="button"
            data-bs-toggle="collapse"
            data-bs-target="#navbarNav"
            aria-controls="navbarNav"
            aria-expanded="false"
            aria-label="Toggle navigation"
          >
            <span className="navbar-toggler-icon"></span>
          </button>
          <div className="collapse navbar-collapse" id="navbarNav" ref={collapseRef}>
            <ul className="navbar-nav ms-auto mb-2 mb-lg-0">
              <li className="nav-item">
                <Link className={`nav-link${isActive('/') ? ' active' : ''}`} to="/" onClick={handleNavLinkClick}>
                  <i className="bi bi-house-door me-1"></i>Accueil
                </Link>
              </li>
              <li className="nav-item">
                <Link className={`nav-link${isActive('/Products') ? ' active' : ''}`} to="/Products" onClick={handleNavLinkClick}>
                  <i className="bi bi-bag me-1"></i>Produits
                </Link>
              </li>
              {isLoggedIn && (
                <>
                  <li className="nav-item">
                    <Link className={`nav-link${isActive('/orders') ? ' active' : ''}`} to="/orders" onClick={handleNavLinkClick}>
                      <i className="bi bi-card-checklist me-1"></i>Commandes
                    </Link>
                  </li>
                  <li className="nav-item">
                    <Link className={`nav-link${isActive('/profile') ? ' active' : ''}`} to="/profile" onClick={handleNavLinkClick}>
                      <i className="bi bi-person me-1"></i>Profil
                    </Link>
                  </li>
                  {isAdmin && (
                    <>
                      <li className="nav-item">
                        <Link className="nav-link" to="/admin/users" onClick={handleNavLinkClick}>
                          <i className="bi bi-people"></i> Gestion Utilisateurs
                        </Link>
                      </li>
                      <li className="nav-item">
                        <Link className="nav-link" to="/manage-products" onClick={handleNavLinkClick}>
                          <i className="bi bi-box"></i> Gestion des Produits
                        </Link>
                      </li>
                    </>
                  )}
                </>
              )}
              <li className="nav-item">
                <Link 
                  className={`nav-link${isActive('/cart') ? ' active' : ''}`} 
                  to="/cart" 
                  onClick={handleNavLinkClick}
                >
                  <i className="bi bi-cart3 me-2"></i>
                  Panier
                  {/* Vous pouvez ajouter un badge pour le nombre d'articles */}
                  <span className="badge bg-primary ms-2">0</span>
                </Link>
              </li>
            </ul>
            <div className="nav-btns">
              {isLoggedIn ? (
                <button 
                  className="btn btn-outline-danger" 
                  onClick={handleLogout}
                >
                  <i className="bi bi-box-arrow-right me-2"></i>
                  Déconnexion
                </button>
              ) : (
                <Link 
                  to="/login" 
                  className="btn btn-primary"
                  onClick={handleNavLinkClick}
                >
                  <i className="bi bi-box-arrow-in-right me-2"></i>
                  Se connecter
                </Link>
              )}
            </div>
          </div>
        </div>
      </nav>
      <div style={{ height: '70px' }}></div>
    </>
  );
}

export default Navbar;
