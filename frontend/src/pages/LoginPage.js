import { useState } from 'react';
import { login } from '../api/api';
import { useNavigate } from 'react-router-dom';

function LoginPage() {
  const [form, setForm] = useState({ username: '', password: '' });
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
    <div>
      <h2>Connexion</h2>
      <label>Nom d'utilisateur : </label>

      <input
        placeholder="Username"
        onChange={(e) => setForm({ ...form, username: e.target.value })}
      /><br />
            <label>Mot de passe : </label>
      <input
        type="password"
        placeholder="Password"
        onChange={(e) => setForm({ ...form, password: e.target.value })}
      /><br />
      <br/>
      <button onClick={handleLogin}>Se connecter</button>
      <button onClick={() => navigate('/register')}>S'inscrire</button>
    </div>
  );
}

export default LoginPage;
