import { useState } from 'react';
import { login } from '../api/api';
import { useNavigate } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';

function LoginPage() {
  const [form, setForm] = useState({ email: '', password: '' });
  const navigate = useNavigate();

  const handleLogin = async () => {
    try {
      const res = await login(form);
      localStorage.setItem('token', res.data.token);
      alert('Connexion réussie');
      navigate('/');
    } catch (err) {
      alert('Erreur : ' + (err.response?.data?.message || err.message));
    }
  };

  return (
    <div className="container py-4">
    <div className="container py-5">
      <div className="row justify-content-center">
        <div className="col-md-6 col-lg-4">
          <div className="card shadow-sm border-0">
            <div className="card-body p-4">
              <h2 className="card-title text-center text-primary mb-4">Connexion</h2>
              <form>
                <div className="mb-3">
                  <label className="form-label">Adresse Email :</label>
                  <input
                    type="email"
                    className="form-control"
                    placeholder="Email"
                    onChange={(e) => setForm({ ...form, email: e.target.value })}
                  />
                </div>
                <div className="mb-3">
                  <label className="form-label">Mot de passe :</label>
                  <input
                    type="password"
                    className="form-control"
                    placeholder="Mot de passe"
                    onChange={(e) => setForm({ ...form, password: e.target.value })}
                  />
                </div>
                <div className="d-grid gap-2">
                  <button type="button" className="btn btn-primary" onClick={handleLogin}>
                    Se connecter
                  </button>
                  <button type="button" className="btn btn-outline-secondary" onClick={() => navigate('/register')}>
                    S'inscrire
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
    </div>
  );
}

export default LoginPage;