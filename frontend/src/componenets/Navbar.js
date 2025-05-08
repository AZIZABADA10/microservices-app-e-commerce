import { Link, useNavigate } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';

function Navbar() {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem('token');
    navigate('/login');
  };

  const isLoggedIn = !!localStorage.getItem('token');

  return (
    <nav className="navbar navbar-expand-lg navbar-light bg-light shadow-sm mb-4">
      <div className="container">
        <Link className="navbar-brand fw-bold text-primary" to="/">ParaPharma</Link>
        <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNav">
          <span className="navbar-toggler-icon"></span>
        </button>
        <div className="collapse navbar-collapse" id="navbarNav">
          <ul className="navbar-nav me-auto">
            <li className="nav-item">
              <Link className="nav-link" to="/">Produits</Link>
            </li>
            <li className="nav-item">
              <Link className="nav-link" to="/orders">Commandes</Link>
            </li>
            <li className="nav-item">
              <Link className="nav-link" to="/manage-products">Gérer les Produits</Link>
            </li>
          </ul>
          <div className="d-flex">
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
  );
}

export default Navbar;