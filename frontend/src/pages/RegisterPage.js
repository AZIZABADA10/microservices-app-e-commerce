import { useState } from 'react';
import { register } from '../api/api';
import { useNavigate } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';

function RegisterPage() {
  const [form, setForm] = useState({ email: '', password: '' });
  const navigate = useNavigate();

  const handleRegister = async () => {
    try {
      await register(form);
      alert('Inscription réussie ! Vous pouvez maintenant vous connecter.');
      navigate('/login');
    } catch (err) {
      alert('Erreur : ' + (err.response?.data?.message || err.message));
    }
  };

  return (
    <div className="container py-5">
      <div className="row justify-content-center">
        <div className="col-md-6 col-lg-4">
          <div className="card shadow-sm border-0">
            <div className="card-body p-4">
              <h2 className="card-title text-center text-primary mb-4">Inscription</h2>
              <form>
                <div className="mb-3">
                  <label className="form-label">Adresse Email:</label>
                  <input
                    type="email"
                    className="form-control"
                    placeholder="Adresse Email"
                    value={form.email}
                    onChange={(e) => setForm({ ...form, email: e.target.value })}
                  />
                </div>
                <div className="mb-3">
                  <label className="form-label">Mot de passe:</label>
                  <input
                    type="password"
                    className="form-control"
                    placeholder="Mot de passe"
                    value={form.password}
                    onChange={(e) => setForm({ ...form, password: e.target.value })}
                  />
                </div>
                <div className="d-grid gap-2">
                  <button className="btn btn-primary" type="button" onClick={handleRegister}>
                    S'inscrire
                  </button>
                  <button className="btn btn-outline-secondary" type="button" onClick={() => navigate('/login')}>
                    Déjà inscrit ? Se connecter
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default RegisterPage;