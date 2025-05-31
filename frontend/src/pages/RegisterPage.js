import { useState } from 'react';
import { register } from '../api/api';
import { useNavigate } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';

function RegisterPage() {
  const [form, setForm] = useState({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    dateOfBirth: '',
    phone: ''
  });
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
        <div className="col-md-6">
          <div className="card shadow-sm border-0">
            <div className="card-body p-4">
              <h2 className="card-title text-center text-primary mb-4">Inscription</h2>
              <form>
                <div className="row mb-3">
                  <div className="col-md-6">
                    <label className="form-label">Prénom:</label>
                    <input
                      type="text"
                      className="form-control"
                      placeholder="Prénom"
                      value={form.firstName}
                      onChange={(e) => setForm({ ...form, firstName: e.target.value })}
                    />
                  </div>
                  <div className="col-md-6">
                    <label className="form-label">Nom:</label>
                    <input
                      type="text"
                      className="form-control"
                      placeholder="Nom"
                      value={form.lastName}
                      onChange={(e) => setForm({ ...form, lastName: e.target.value })}
                    />
                  </div>
                </div>
                <div className="mb-3">
                  <label className="form-label">Email:</label>
                  <input
                    type="email"
                    className="form-control"
                    placeholder="Email"
                    value={form.email}
                    onChange={(e) => setForm({ ...form, email: e.target.value })}
                  />
                </div>
                <div className="mb-3">
                  <label className="form-label">Date de naissance:</label>
                  <input
                    type="date"
                    className="form-control"
                    value={form.dateOfBirth}
                    onChange={(e) => setForm({ ...form, dateOfBirth: e.target.value })}
                  />
                </div>
                <div className="mb-3">
                  <label className="form-label">Téléphone:</label>
                  <input
                    type="tel"
                    className="form-control"
                    placeholder="Téléphone"
                    value={form.phone}
                    onChange={(e) => setForm({ ...form, phone: e.target.value })}
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
                  <button type="button" className="btn btn-primary" onClick={handleRegister}>
                    S'inscrire
                  </button>
                  <button type="button" className="btn btn-outline-secondary" onClick={() => navigate('/login')}>
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