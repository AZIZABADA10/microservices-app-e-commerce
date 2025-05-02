import { Link, useNavigate } from 'react-router-dom';

function Navbar() {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem('token'); 
    navigate('/login');               
  };

  const isLoggedIn = !!localStorage.getItem('token');

  return (
    <nav style={{ marginBottom: '20px' }}>
      <Link to="/" style={{ marginRight: '10px' }}>Produits</Link>
      <Link to="/orders" style={{ marginRight: '10px' }}>Commandes</Link>
      <Link to="/manage-products" style={{ marginRight: '10px' }}>Gérer les Produits</Link>
      {!isLoggedIn ? (
        <>
          <Link to="/login" style={{ marginRight: '10px' }}>Connexion</Link>
          <Link to="/register">Inscription</Link>
        </>
      ) : (
        <button onClick={handleLogout}>Déconnexion</button>
      )}
    </nav>
  );
}

export default Navbar;
