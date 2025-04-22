import { useState } from 'react';
import { register } from '../api/api';
import { useNavigate } from 'react-router-dom';

function RegisterPage() {
  const [form, setForm] = useState({ username: '', password: '' });
  const navigate = useNavigate();

  const handleRegister = async () => {
    try {
      await register(form);
      alert('Inscription réussie ! Vous pouvez maintenant vous connecter.');
      navigate('/login'); // Redirection vers la page de connexion
    } catch (err) {
      alert('Erreur : ' + (err.response?.data?.message || err.message));
    }
  };

  return (
    <div>
      <h2>Inscription</h2>
      <input
        placeholder="Nom d'utilisateur"
        onChange={(e) => setForm({ ...form, username: e.target.value })}
      />
      <input
        type="password"
        placeholder="Mot de passe"
        onChange={(e) => setForm({ ...form, password: e.target.value })}
      />
      <button onClick={handleRegister}>S'inscrire</button>
      <button onClick={() => navigate('/login')}>Déjà inscrit ? Se connecter</button>
    </div>
  );
}

export default RegisterPage;
