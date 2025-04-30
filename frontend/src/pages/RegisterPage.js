import { useState } from 'react';
import { register } from '../api/api';
import { useNavigate } from 'react-router-dom';

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
    <div>
      <h2>Inscription</h2>
      <label>Adresse Email:</label>
      <input
        type="email"
        placeholder="Adresse Email"
        value={form.email}
        onChange={(e) => setForm({ ...form, email: e.target.value })}
      />
      <br />
      <label>Mot de passe:</label>
      <input
        type="password"
        placeholder="Mot de passe"
        value={form.password}
        onChange={(e) => setForm({ ...form, password: e.target.value })}
      />
      <br />
      <button onClick={handleRegister}>S'inscrire</button>
      <button onClick={() => navigate('/login')}>Déjà inscrit ? Se connecter</button>
    </div>
  );
}

export default RegisterPage;
