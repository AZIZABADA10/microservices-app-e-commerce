import { Link, useNavigate, useLocation } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
import '../pages/HomePage.css'; 

function Navbar() {
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = () => {
    localStorage.removeItem('token');
    navigate('/login');
  };

  const isLoggedIn = !!localStorage.getItem('token');
  const userRole = localStorage.getItem('userRole');

  const isActive = (path) => location.pathname === path;

  return (
    <>
      <nav className="navbar navbar-expand-lg navbar-light modern-navbar shadow-sm mb-4 fixed-top">
        <div className="container">
          <Link className="navbar-brand fw-bold text-primary fs-3" to="/">
            <i className="bi bi-cart3 me-2"></i>E-commerce
          </Link>
          <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNav">
            <span className="navbar-toggler-icon"></span>
          </button>
          <div className="collapse navbar-collapse" id="navbarNav">
            <ul className="navbar-nav ms-auto mb-2 mb-lg-0">
              <li className="nav-item">
                <Link className={`nav-link${isActive('/') ? ' active' : ''}`} to="/">
                  <i className="bi bi-house-door me-1"></i>Accueil
                </Link>
              </li>
              <li className="nav-item">
                <Link className={`nav-link${isActive('/Products') ? ' active' : ''}`} to="/Products">
                  <i className="bi bi-bag me-1"></i>Produits
                </Link>
              </li>
              <li className="nav-item">
                <Link className={`nav-link${isActive('/orders') ? ' active' : ''}`} to="/orders">
                  <i className="bi bi-card-checklist me-1"></i>Commandes
                </Link>
              </li>
              <li className="nav-item">
                <Link className={`nav-link${isActive('/manage-products') ? ' active' : ''}`} to="/manage-products">
                  <i className="bi bi-gear me-1"></i>Gérer les Produits
                </Link>
              </li>
              {isLoggedIn && (
                <>
                  <li className="nav-item">
                    <Link className="nav-link" to="/profile">
                      <i className="bi bi-person"></i> Profil
                    </Link>
                  </li>
                  {userRole === 'ADMIN' && (
                    <li className="nav-item">
                      <Link className="nav-link" to="/admin/users">
                        <i className="bi bi-people"></i> Gestion Utilisateurs
                      </Link>
                    </li>
                  )}
                </>
              )}
            </ul>
            <div className="d-flex ms-lg-3 mt-3 mt-lg-0">
              {!isLoggedIn ? (
                <>
                  <Link to="/login" className="btn btn-outline-primary me-2">Connexion</Link>
                  <Link to="/register" className="btn btn-primary">Inscription</Link>
                </>
              ) : (
                <button onClick={handleLogout} className="btn btn-outline-danger">Déconnexion</button>
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
